# Audit des permissions macOS — OpenHub

**Date de l'audit :** 2026-06-13
**Périmètre :** code source du shell Electron (`electron/`), configuration de build
(`electron-builder.json`, `package.json`), et processus enfants natifs.
**Apps en aval (`apps/openwork`, `apps/opencode`, `apps/open-design`) :** code jamais
modifié (principe OpenHub) — leurs entitlements ne sont **pas** ceux appliqués au
binaire OpenHub et sont donc hors périmètre des correctifs.

---

## 1. Synthèse

Le shell est déjà solidement durci : toutes les `WebContentsView` et `BrowserWindow`
utilisent `contextIsolation:true`, `sandbox:true`, `nodeIntegration:false` ; le proxy
ne se lie qu'à `127.0.0.1` avec Bearer token ; les handlers de navigation et
`setWindowOpenHandler` sont en place ; les secrets transitent par le Keychain (keytar).

**Un seul écart réel** a été identifié et **corrigé** : l'absence de gestionnaire de
permissions sur les sessions Electron (camera/micro/géoloc auraient pu déclencher une
invite TCC macOS sous l'identité OpenHub). Les autres points sont conformes ou relèvent
d'une vérification manuelle de packaging (signature/notarisation).

---

## 2. Matrice des permissions

| Permission / capacité                        | Nécessaire ?       | État avant audit                        | Recommandé                | Statut                      |
| -------------------------------------------- | ------------------ | --------------------------------------- | ------------------------- | --------------------------- |
| Caméra / micro (`media`) renderer            | Non                | Aucun handler → invite possible         | Refus par défaut          | **CORRIGÉ**                 |
| Géolocalisation renderer                     | Non                | Aucun handler                           | Refus par défaut          | **CORRIGÉ**                 |
| HID / USB / Serial / MIDI / pointerLock      | Non                | Aucun handler                           | Refus par défaut          | **CORRIGÉ**                 |
| Notifications / presse-papiers / plein écran | Oui (UI)           | Autorisé (défaut)                       | Conserver                 | CONFORME                    |
| Accès Keychain (keytar)                      | Oui (secrets)      | `keytar` → service `openhub`            | Conserver                 | CONFORME                    |
| Réseau local 5173 (Work)                     | Oui                | `http://localhost:5173`                 | Conserver                 | CONFORME                    |
| Réseau local 4096 (Code)                     | Oui                | `http://127.0.0.1:4096`                 | Conserver                 | CONFORME                    |
| Réseau local 9999 (Proxy)                    | Oui                | `127.0.0.1` + Bearer                    | Conserver                 | CONFORME                    |
| Port dynamique Design                        | Oui                | capturé au spawn, `127.0.0.1`           | Conserver                 | CONFORME                    |
| Accès fichiers (dialog open/save)            | Oui                | via `dialog.*` côté main                | Conserver                 | CONFORME                    |
| Spawn processus enfants                      | Oui                | `spawn`/`exec` côté main uniquement     | Conserver                 | CONFORME                    |
| Hardened Runtime / entitlements signés       | Selon distribution | non défini dans `electron-builder.json` | À définir si notarisation | **À VÉRIFIER MANUELLEMENT** |

---

## 3. webPreferences par WebContentsView / BrowserWindow

Toutes les surfaces de rendu ont été vérifiées dans `electron/main.ts`.

| Surface (ligne)                   | nodeIntegration | contextIsolation | sandbox | allowRunningInsecureContent | webSecurity   | preload                        | Verdict  |
| --------------------------------- | --------------- | ---------------- | ------- | --------------------------- | ------------- | ------------------------------ | -------- |
| Splash window (~88)               | `false`         | `true`           | `true`  | défaut `false`              | défaut `true` | —                              | CONFORME |
| Main window / sidebar (~111)      | `false`         | `true`           | `true`  | défaut `false`              | défaut `true` | `preload.cjs`                  | CONFORME |
| Slot view Work/Code/Design (~203) | `false`         | `true`           | `true`  | défaut `false`              | défaut `true` | `preload.cjs` (`persist:chat`) | CONFORME |
| Nav popup (~330)                  | `false`         | `true`           | `true`  | défaut `false`              | défaut `true` | —                              | CONFORME |
| Chat view (~375)                  | `false`         | `true`           | `true`  | défaut `false`              | défaut `true` | `preload.cjs`                  | CONFORME |
| Projects view (~409)              | `false`         | `true`           | `true`  | défaut `false`              | défaut `true` | `preload.cjs`                  | CONFORME |
| Fenêtre export PDF (~966)         | `false`         | `true`           | `true`  | défaut `false`              | défaut `true` | —                              | CONFORME |
| Fenêtre PDF (~1271)               | `false`         | `true`           | `true`  | défaut `false`              | défaut `true` | —                              | CONFORME |

**Note sur `webSecurity` et `allowRunningInsecureContent` :** non définis explicitement,
ils reposent sur les valeurs par défaut sécurisées d'Electron (`webSecurity:true`,
`allowRunningInsecureContent:false`). Aucune surface ne les désactive — conforme. Aucune
modification appliquée pour respecter la règle « changements chirurgicaux » (ne pas
toucher au code non cassé).

**Protections de navigation en place :**

- `will-navigate` bloque tout protocole non `http(s)://` (anti file:// / drag-drop).
- `setWindowOpenHandler` renvoie `action: "deny"` et ouvre les liens externes via
  `shell.openExternal` (pas de popup Electron incontrôlée).

---

## 4. Surface du contextBridge (`electron/preload.ts`)

Deux bridges exposés, tous deux via `contextBridge.exposeInMainWorld` (jamais d'objet
Node brut, jamais `ipcRenderer` exposé directement).

**`window.openhub`** — API du shell, uniquement des `invoke`/`send`/`on` nommés :
gestion des slots, clés API (écriture vers Keychain côté main), projets/dossiers,
workflows et orchestration, mémoire/skills, mises à jour, réglages vision/web-search,
backups chat, gestion Ollama, notifications.

**`window.__od__`** — bridge Open Design : `shell.openExternal/openPath`,
import/replace de projet (déclenche un `dialog` natif **côté main**), impression PDF,
visibilité du pet, updater.

**Évaluation sécurité :**

- ✅ Aucune API ne reçoit de **chemin disque arbitraire** depuis le renderer : la
  sélection de dossier passe par `pickProjectPath` / `pick-and-import` qui ouvrent un
  `dialog` natif côté main (l'utilisateur choisit, le renderer ne dicte pas le chemin).
- ✅ Aucun accès `fs` direct exposé au renderer ; toute I/O fichier reste côté main.
- ✅ Les secrets ne transitent jamais inline : `getApiKeys`/`saveApiKeys` délèguent au
  Keychain via le process main.
- ⚠️ Surface large (≈ 80 canaux) mais cohérente avec les fonctionnalités ; chaque canal
  est typé et borné. Recommandation de suivi (non bloquante) : regrouper par domaine
  pour faciliter l'audit. **NOTE — non corrigé** (refactor hors périmètre sécurité).

---

## 5. Processus enfants spawned (`electron/process-manager.ts`)

| Processus            | Commande                          | Réseau                | Remarque                               |
| -------------------- | --------------------------------- | --------------------- | -------------------------------------- |
| Work (openwork)      | `pnpm dev:ui`                     | localhost:5173        | spawn côté main                        |
| Code (opencode)      | `opencode serve` + `opencode web` | 127.0.0.1:4096        | `OPENCODE_SERVER_PASSWORD` par session |
| Design (open-design) | `od --no-open` (daemon)           | port capturé au spawn | `127.0.0.1`                            |
| Proxy interne        | Express                           | 127.0.0.1:9999        | Bearer token requis                    |

Tous les spawns sont initiés **côté main** uniquement (`spawn`/`exec`), jamais depuis le
renderer. Conforme.

---

## 6. Entitlements / signature macOS

- Aucun fichier `*.entitlements` / `*.plist` propre à OpenHub n'existe dans le dépôt
  (hors `apps/**` et `release/**` générés).
- `electron-builder.json` ne définit ni `hardenedRuntime`, ni `entitlements`,
  ni `entitlementsInherit`, ni `gatekeeperAssess`.

**Statut : À VÉRIFIER MANUELLEMENT.** Pour une distribution notarisée, il faudra ajouter
un `entitlements.mac.plist` minimal (le plus souvent
`com.apple.security.cs.allow-jit` + héritage) et activer `hardenedRuntime`. Ce point
n'a **pas** été corrigé automatiquement car il touche au pipeline de signature/notarisation
géré hors-bande et risquerait de casser le build de packaging.

---

## 7. Correctifs appliqués

| #   | Finding                                                     | Sévérité | Action                                                                                                                  | Commit                                                                                         |
| --- | ----------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Aucun gestionnaire de permissions sur les sessions Electron | MEDIUM   | Handler deny-by-default (media, geolocation, midi, hid, serial, usb, pointerLock) sur `defaultSession` + `persist:chat` | `fix(permissions): durcir les permissions des WebContentsView avec un handler deny-by-default` |

**Findings sans correctif (justifiés) :**

- webPreferences : déjà conformes (défauts sécurisés) → aucune modification.
- Hardened Runtime / entitlements : packaging hors-bande → **À VÉRIFIER MANUELLEMENT**.
- Taille de la surface contextBridge : refactor non sécuritaire → **NOTE** seulement.

---

## 8. Vérifications

- `npx tsc --noEmit` : ✅ aucune erreur.
- `npx eslint electron/main.ts` : ✅ aucune **erreur** (seuls des warnings préexistants
  `strict-boolean-expressions`, hors lignes modifiées).
