# Rapport pré-release OpenHub

**Date:** 2026-06-13
**Version:** 0.1.0
**Branche:** main

---

## 1. Stabilité

| Point                          | Statut     | Détail                                                                                                              |
| ------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| uncaughtException handler      | ✅ OK      | `main.ts:1874` — handler présent, log vers stderr                                                                   |
| unhandledRejection handler     | ✅ OK      | `main.ts:1878` — handler présent                                                                                    |
| SIGTERM/SIGINT cleanup         | ✅ OK      | appelle `processManager.stopAll()` à l'arrêt                                                                        |
| WebContentsView crash recovery | ⚠️ CORRIGÉ | Ajout d'un handler `render-process-gone` sur les slots — un renderer qui crashait restait un écran blanc silencieux |
| Processus enfants termination  | ✅ OK      | `ProcessManager.stopAll()` tue tous les processus enfants (opencode, open-design, openwork) à l'arrêt               |

## 2. Nettoyage

| Point                       | Statut          | Détail                                                                                                                               |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| console.log / console.debug | ✅ OK           | Aucun trouvé dans le code de production (`electron/**/*.ts` hors tests)                                                              |
| console.warn opérationnels  | 🔍 À VÉRIFIER   | Utilisés comme mécanisme de logging principal du main process. Acceptable pour Electron ; un logger (electron-log) serait préférable |
| Code commenté               | ✅ OK           | Pas de blocs commentés significatifs                                                                                                 |
| TODO/FIXME bloquants        | ⚠️ NON BLOQUANT | 1 TODO dans `proxy/index.ts:2304` (extraction intelligente) — code derrière flag `DEBUG_MAINTENANCE`, non bloquant                   |
| Feature flags expérimentaux | ✅ OK           | Aucun détecté                                                                                                                        |

## 3. Configuration

| Point                     | Statut | Détail                                                            |
| ------------------------- | ------ | ----------------------------------------------------------------- |
| Versioning package.json   | ✅ OK  | `0.1.0`, cohérent avec `extraMetadata.main` dans electron-builder |
| Config prod vs dev        | ✅ OK  | `scripts/dev.sh` vs `electron-builder` pour le build de release   |
| Variables d'environnement | ✅ OK  | Secrets via Keychain, mots de passe générés par session           |

## 4. Intégrité

| Point                        | Statut        | Détail                                                                    |
| ---------------------------- | ------------- | ------------------------------------------------------------------------- |
| Imports cassés               | ✅ OK         | `npm run typecheck` passe sans erreur (imports résolus)                   |
| Overrides non enregistrés    | ✅ OK         | Tous les fichiers `electron/overrides/**` sont dans `index.json`          |
| Sélecteurs CSS               | ✅ OK         | `npm run check:selectors` — aucune erreur automatique                     |
| Erreurs silencieuses (catch) | 🔍 À VÉRIFIER | Quelques `catch {}` vides intentionnels (cleanup best-effort), documentés |

## 5. Sécurité pré-release

| Point                  | Statut | Détail                                                                   |
| ---------------------- | ------ | ------------------------------------------------------------------------ |
| webPreferences durcies | ✅ OK  | `contextIsolation:true`, `sandbox:true`, `nodeIntegration:false` partout |
| Permissions Electron   | ✅ OK  | `setWindowOpenHandler` deny + `will-navigate` bloque protocoles non-http |
| Secrets dans le bundle | ✅ OK  | Aucun secret en clair ; Keychain → RAM → env vars au spawn               |

## 6. Build macOS

| Point                    | Statut          | Détail                                                                                          |
| ------------------------ | --------------- | ----------------------------------------------------------------------------------------------- |
| electron-builder         | ✅ OK           | Configuré, target DMG, catégorie developer-tools                                                |
| Icône                    | ✅ OK           | `build/icon.icns` présent (130 Ko)                                                              |
| Metadata                 | ✅ OK           | appId `com.openhub.app`, productName, description corrects                                      |
| Code signing             | ❌ BLOQUANT     | Pas d'`identity` ni `CSC_LINK`/`CSC_KEY_PASSWORD` — le DMG ne sera pas signé                    |
| Notarization Apple       | ❌ BLOQUANT     | Pas de config `notarize`/`afterSign` — Gatekeeper bloquera l'installation chez les utilisateurs |
| Architecture universelle | ⚠️ NON BLOQUANT | Seul `dmg` configuré, pas d'`arch: [arm64, x64]`. Build par défaut = arch courante uniquement   |

## 7. Texte/Copy

| Point             | Statut | Détail                                                       |
| ----------------- | ------ | ------------------------------------------------------------ |
| Placeholders      | ✅ OK  | Pas de "Lorem ipsum" / texte placeholder dans le code source |
| Labels UI         | ✅ OK  | Messages cohérents en français                               |
| Messages d'erreur | ✅ OK  | Contextuels, préfixés par module                             |

---

## Résultats des vérifications automatiques

| Vérification              | Résultat                                                                     |
| ------------------------- | ---------------------------------------------------------------------------- |
| `npm run typecheck`       | ✅ PASSE — 0 erreur                                                          |
| `npm run lint`            | ✅ PASSE — 0 erreur (246 warnings pré-existants, strict-boolean-expressions) |
| `npm test`                | ✅ PASSE — 151 tests, 8 fichiers, 0 échec                                    |
| `npm run check:selectors` | ✅ PASSE — aucune erreur automatique                                         |

## Commits effectués

1. `f39a5b3` — `fix(release): logguer les crashs de renderer des WebContentsView`
   - Ajout d'un handler `render-process-gone` sur les WebContentsView des slots
   - Comble le dernier écart de stabilité "🔍 À VÉRIFIER" du rapport précédent
2. _(ce rapport)_ — `docs(release): rapport pré-release du 2026-06-13`

---

## Décision

### ❌ BLOCKERS RESTANTS

1. **Code signing macOS — À CORRIGER MANUELLEMENT** — Le DMG ne sera pas signé
   sans identité de signature. Configurer `CSC_LINK` / `CSC_KEY_PASSWORD` (variables
   d'env CI) ou `mac.identity` dans electron-builder.json. Prérequis d'infrastructure,
   pas une correction de code.

2. **Notarization Apple — À CORRIGER MANUELLEMENT** — Sans notarization, Gatekeeper
   bloquera l'installation. Nécessite un compte Apple Developer et la config `afterSign`
   (electron-notarize) avec `APPLE_ID` / `APPLE_APP_SPECIFIC_PASSWORD` / `APPLE_TEAM_ID`.

**Recommandation:** Ces deux blockers sont des prérequis CI/CD. Pour une distribution
publique ils sont **bloquants**. Pour un usage interne uniquement, ils peuvent être
reclassés en non-bloquants (l'utilisateur devra autoriser l'app via Réglages Système).

Hors code signing / notarization, **le code est stable et prêt pour la release.**
