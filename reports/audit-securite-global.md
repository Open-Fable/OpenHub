# Rapport d'audit de securite global — OpenHub

**Date:** 2026-06-12
**Auditeur:** Agent automatise (scheduled task)
**Scope:** electron/, electron/proxy/, electron/overrides/, electron/preload.ts

---

## Resume

- **2 commits de correction** appliques
- **3 findings corriges** automatiquement
- **5 findings a verifier manuellement**
- Score global: **Acceptable avec reserves** — l'isolation Electron est solide, mais des points d'attention subsistent sur les credentials OAuth et le token statique.

---

## Commits effectues

| Commit    | Description                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| `b18320a` | fix(security): ajouter sandbox et validation de chemins dans main.ts                   |
| `7ae1229` | fix(security): externaliser les credentials OAuth Gemini via variables d'environnement |

---

## Findings detailles

### 1. Sandbox manquant sur la fenetre principale

| Champ        | Valeur                   |
| ------------ | ------------------------ |
| **Severite** | Elevee                   |
| **Fichier**  | electron/main.ts:115-119 |
| **Statut**   | CORRIGE                  |

**Description:** La BrowserWindow principale (sidebar) n'avait pas `sandbox: true` dans ses webPreferences. Sans sandbox, un compromis du renderer donne acces aux API Node.js via le preload.

**Correction:** Ajout de `sandbox: true` dans les webPreferences de la fenetre principale.

---

### 2. Traversee de repertoire via **joinPath, **openPath, \_\_revealItemInDir

| Champ        | Valeur                   |
| ------------ | ------------------------ |
| **Severite** | Elevee                   |
| **Fichier**  | electron/main.ts:657-664 |
| **Statut**   | CORRIGE                  |

**Description:** Les handlers IPC `__joinPath`, `__openPath` et `__revealItemInDir` acceptaient des chemins arbitraires du renderer sans aucune validation. Un renderer compromis pouvait:

- Construire des chemins avec `..` pour acceder a des fichiers hors du home directory
- Ouvrir ou reveler n'importe quel fichier systeme via `shell.openPath`

**Correction:**

- `__joinPath`: rejet si un segment contient `..`
- `__openPath` / `__revealItemInDir`: resolution canonique + verification que le chemin est sous `homedir()`

---

### 3. Credentials OAuth Google hardcodes dans le source

| Champ        | Valeur                            |
| ------------ | --------------------------------- |
| **Severite** | Moyenne                           |
| **Fichier**  | electron/proxy/index.ts:1703-1705 |
| **Statut**   | CORRIGE (partiellement)           |

**Description:** Le `GEMINI_CLIENT_ID` et `GEMINI_CLIENT_SECRET` etaient hardcodes. Ce sont des credentials "installed app" publics (identiques au Gemini CLI upstream), donc pas veritablement secrets selon le modele OAuth de Google. Neanmoins, leur presence dans le source facilite l'extraction.

**Correction:** Lecture prioritaire depuis les variables d'environnement `GEMINI_CLIENT_ID` / `GEMINI_CLIENT_SECRET`, avec fallback sur les valeurs upstream pour ne pas casser le flux existant.

---

### 4. Token statique "openhub-local" utilise comme Bearer

| Champ        | Valeur                                               |
| ------------ | ---------------------------------------------------- |
| **Severite** | Moyenne                                              |
| **Fichier**  | electron/proxy/index.ts:98, electron/main.ts:586-600 |
| **Statut**   | A VERIFIER MANUELLEMENT                              |

**Description:** Le token `"openhub-local"` est utilise comme Bearer token accepte par le proxy, en plus du token de session aleatoire. Ce token est identique sur toutes les installations et visible dans le source. Tout processus local peut s'authentifier aupres du proxy.

**Risque:** Un processus malveillant local pourrait envoyer des requetes au proxy (port 9999) avec ce token et acceder aux API keys, envoyer des requetes LLM, etc.

**Correctif recommande:** Generer un token unique par session au demarrage et le transmettre a OpenWork via les variables d'environnement au lieu d'utiliser un token statique. Necessite de modifier la logique d'initialisation d'OpenWork.

---

### 5. CORS accepte l'origine file://

| Champ        | Valeur                     |
| ------------ | -------------------------- |
| **Severite** | Moyenne                    |
| **Fichier**  | electron/proxy/index.ts:77 |
| **Statut**   | A VERIFIER MANUELLEMENT    |

**Description:** La politique CORS accepte toute origine commencant par `file://`. C'est necessaire pour que la sidebar (chargee via `loadFile`) puisse acceder au proxy, mais cela signifie que tout document local ouvert dans une WebContentsView peut aussi y acceder.

**Correctif recommande:** Verifier si la sidebar peut etre servie via HTTP local au lieu de file://, ce qui eliminerait le besoin d'accepter file:// en CORS.

---

### 6. Tokens OAuth stockes en texte clair sur disque

| Champ        | Valeur                                       |
| ------------ | -------------------------------------------- |
| **Severite** | Moyenne                                      |
| **Fichier**  | electron/proxy/index.ts:1706-1710, 1839-1851 |
| **Statut**   | A VERIFIER MANUELLEMENT                      |

**Description:** Les tokens Google OAuth (access + refresh) sont stockes en JSON non chiffre dans `~/.local/share/opencode/auth.json`. Ces fichiers sont lisibles par tout processus tournant sous le meme utilisateur.

**Correctif recommande:** Migrer le stockage des tokens OAuth vers le Keychain macOS via keytar, comme c'est deja fait pour les API keys. Attention: opencode ecrit aussi dans ce fichier, donc la migration doit etre coordonnee avec l'upstream.

---

### 7. Execution de JavaScript dynamique dans les renderers

| Champ        | Valeur                   |
| ------------ | ------------------------ |
| **Severite** | Faible                   |
| **Fichier**  | electron/main.ts:244-247 |
| **Statut**   | A VERIFIER MANUELLEMENT  |

**Description:** Les overrides JS sont charges depuis `electron/overrides/` et executes via `executeJavaScript()`. Si un attaquant modifie ces fichiers, il obtient l'execution de code dans le contexte du renderer.

**Attenuation existante:** Les fichiers d'override sont dans le bundle de l'application (pas ecrits par l'utilisateur), et les renderers ont sandbox + contextIsolation actives.

**Correctif recommande:** Considerer la signature ou le hachage des fichiers d'override pour detecter toute modification.

---

### 8. Messages d'erreur verbeux exposant des details internes

| Champ        | Valeur                              |
| ------------ | ----------------------------------- |
| **Severite** | Faible                              |
| **Fichier**  | electron/proxy/index.ts (multiples) |
| **Statut**   | A VERIFIER MANUELLEMENT             |

**Description:** Certains messages d'erreur dans le proxy exposent des chemins internes, des details de provider, ou des statuts HTTP upstream. En environnement local, le risque est faible.

---

## Points positifs

- **Isolation Electron solide:** contextIsolation:true, sandbox:true, nodeIntegration:false sur tous les WebContentsView
- **contextBridge correctement utilise:** aucune API Node.js exposee directement au renderer
- **Proxy lie a 127.0.0.1:** pas d'exposition reseau
- **Token de session aleatoire:** `randomBytes(32)` pour le token principal du proxy
- **Validation d'URL sur shell.openExternal:** le handler `od-shell:open-external` verifie http/https
- **Navigation bloquee:** `will-navigate` bloque les protocoles non-HTTP dans les slots
- **Headers de securite:** X-Content-Type-Options et X-Frame-Options presents
- **Secrets dans le Keychain:** les API keys sont stockees via keytar, pas sur disque

---

## Recommandations prioritaires

1. **Remplacer le token statique "openhub-local"** par un token genere par session (Moyenne, impact eleve)
2. **Migrer les tokens OAuth vers le Keychain** au lieu de auth.json (Moyenne)
3. **Evaluer le remplacement de file:// par HTTP local** pour la sidebar (Moyenne)
