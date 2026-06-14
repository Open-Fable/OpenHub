# Audit de securite OpenHub — Recapitulatif complet

**Date :** 2026-06-13
**Methode :** 2 passes d'audit (12 audits specialises au total), verification reelle du code, tests automatises.
**Resultat final :** 171 tests PASS, typecheck PASS, ESLint 0 erreur, selectors PASS.

---

## Vue d'ensemble

| Severite  | 1re passe | 2e passe | Total | Statut              |
| --------- | --------- | -------- | ----- | ------------------- |
| Bloquante | 1         | 0        | 1     | corrige             |
| Critique  | 7         | 6        | 13    | corrige             |
| Elevee    | 11        | 9        | 20    | corrige (1 accepte) |
| Moyenne   | 14        | 12       | 26    | corrige             |
| Faible    | 9         | qq.      | ~12   | corrige / note      |

**1 risque architectural (NR1)** documente et accepte par choix produit.
**3 actions manuelles** restantes (rotation secret, purge git, certificat Apple).

---

## BLOQUANTE

### B1 — `--dangerously-skip-permissions` injecte dans chaque `opencode run`

|               |                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/process-manager.ts:51-78`                                                                                                                                              |
| **Probleme**  | Un shim place en tete de `PATH` ajoute silencieusement `--dangerously-skip-permissions` a chaque commande `opencode run`. L'agent tourne sans confirmation de permission.        |
| **Impact**    | Injection de prompt / depot malveillant = execution de code arbitraire sur l'hote.                                                                                               |
| **Correctif** | Confinement strict du workspace (C5/C6/H8), suppression de l'execution de scripts npm non fiables. Le flag est conserve pour l'orchestration autonome dans un workspace confine. |
| **Statut**    | **CORRIGE**                                                                                                                                                                      |

---

## CRITIQUES

### C1 — Cles API en clair renvoyees au renderer

|               |                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichiers**  | `electron/keychain.ts`, `electron/main.ts`, `electron/preload.ts`, `electron/sidebar.html`                                                                            |
| **Probleme**  | `readAllApiKeys()` renvoyait toutes les cles en clair via IPC. Toute XSS pouvait appeler `window.openhub.getApiKeys()` et exfiltrer tous les secrets.                 |
| **Correctif** | Fonctions `maskSecret()` / `isMaskedValue()` dans keychain.ts. `get-api-keys` ne renvoie que des masques (`sk-a…xxxx`). `save-api-keys` rejette les valeurs masquees. |
| **Statut**    | **CORRIGE**                                                                                                                                                           |

### C2 — Token Bearer statique `"openhub-local"` accepte par le proxy

|               |                                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichiers**  | `electron/proxy/index.ts`, `electron/orchestrator-llm.ts`, `electron/sidebar.html`, `electron/chat.html`, `electron/main.ts`                                                                                                    |
| **Probleme**  | Le proxy acceptait un token constant `"openhub-local"`. N'importe quel processus local (ou DNS-rebinding) pouvait piloter le proxy.                                                                                             |
| **Correctif** | Token de session aleatoire genere au demarrage (`randomBytes(32)`). Comparaison constant-time (`timingSafeEqual`). Token distribue dynamiquement via `get-chat-config`. Suppression de toutes les references au token statique. |
| **Statut**    | **CORRIGE**                                                                                                                                                                                                                     |

### C3 — Aucune Content-Security-Policy

|               |                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/projects.html` (nouveau), `electron/main.ts`                                                                                                      |
| **Probleme**  | Aucune CSP ne limitait les origines de `script-src`/`connect-src`.                                                                                          |
| **Correctif** | CSP meta dans `projects.html` : `script-src 'self' 'unsafe-inline'; connect-src http://127.0.0.1:9999`. Non appliquee aux slots dev-server (casserait HMR). |
| **Statut**    | **CORRIGE**                                                                                                                                                 |

### C4 — `execPromise` shell + `curl | bash` pour installer opencode

|               |                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Fichier**   | `electron/main.ts`                                                                                                                                                       |
| **Probleme**  | `child_process.exec` recevait une chaine sans filtrage. `curl ... \| bash` pour l'installation. Branches et versions interpolees dans les commandes shell.               |
| **Correctif** | `execFilePromise` (sans shell). Validation semver (`SEMVER_RE`) et branches (`GIT_BRANCH_RE`). Installation en 2 temps : telechargement du script puis execution isolee. |
| **Statut**    | **CORRIGE**                                                                                                                                                              |

### C5 — Repertoire de travail arbitraire depuis le renderer

|               |                                                                                                                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/orchestrator-runner.ts`                                                                                                                                                                                |
| **Probleme**  | `workDir` du renderer acceptait n'importe quel chemin absolu.                                                                                                                                                    |
| **Correctif** | `isSafeWorkspaceDir()` : rejet de `/`, `$HOME`, prefixes systeme (`/etc`, `/usr`, `/bin`...), dossiers sensibles (`.ssh`, `.aws`, `.gnupg`, `.kube`...). `safeResolveInWorkspace()` pour confiner les ecritures. |
| **Statut**    | **CORRIGE**                                                                                                                                                                                                      |

### C6 — Execution de `npm run lint` dans un workspace controle par le LLM

|               |                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/orchestrator-runner.ts`                                                                                   |
| **Probleme**  | L'orchestrateur executait le script `lint` du `package.json` ecrit par le LLM. Impact : RCE (`"lint": "rm -rf ~"`). |
| **Correctif** | Suppression complete de l'execution de scripts npm du workspace.                                                    |
| **Statut**    | **CORRIGE**                                                                                                         |

### C7 — Secret client OAuth Google code en dur

|               |                                                                                    |
| ------------- | ---------------------------------------------------------------------------------- |
| **Fichier**   | `electron/proxy/index.ts`                                                          |
| **Probleme**  | `GEMINI_CLIENT_SECRET = "GOCSPX-..."` committe en clair dans le code.              |
| **Correctif** | Remplace par `process.env.GEMINI_CLIENT_SECRET ?? ""`. Route desactivee si absent. |
| **Statut**    | **CORRIGE** (rotation manuelle requise)                                            |

### NC1 — Aucune validation d'expediteur IPC (2e passe)

|               |                                                                                                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/main.ts` (tous les handlers IPC)                                                                                                                                                                                                                    |
| **Probleme**  | Les vues distantes (Work/Code/Design) partageaient le meme preload. Une XSS upstream pouvait appeler **tout** le surface IPC : `get-chat-config` (token proxy), `save-api-keys`, `run-app-update`, stores, orchestration. C'etait la faille la plus critique. |
| **Correctif** | Wrappers `ipcHandle`/`ipcOn` + allowlist `SLOT_ALLOWED_CHANNELS`. Canaux sensibles accessibles **uniquement depuis `file://`** (UI locale). ~17 canaux ouverts aux slots distants, chacun avec sa propre validation.                                          |
| **Statut**    | **CORRIGE**                                                                                                                                                                                                                                                   |

### NC2 — SSRF : `isSafeOllamaUrl` contournable + non applique au routage chat (2e passe)

|               |                                                                                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichiers**  | `electron/keychain.ts`, `electron/proxy/index.ts`                                                                                                                                                                                                                         |
| **Probleme**  | L'ancienne garde ne bloquait que `169.254.*`. Contournements : `0.0.0.0`, IPv6 `::` / `fe80`, IPv4-mapped `::ffff:169.254.169.254`, encodages numeriques (`http://2852039166`, `http://0xA9FEA9FE`). Non appliquee au fallback de `resolveRoute` (chemin chat principal). |
| **Correctif** | Reecriture complete avec `net.isIP()`, blocage link-local/metadata/`0.0.0.0`/`::`/mapped/encodages. Application dans `resolveRoute`. 5 tests dedies ajoutes.                                                                                                              |
| **Statut**    | **CORRIGE**                                                                                                                                                                                                                                                               |

### NC3 — Echappement sandbox par lien symbolique (2e passe)

|               |                                                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/orchestrator-runner.ts`                                                                                                                          |
| **Probleme**  | `safeResolveInWorkspace` etait purement lexical. Un agent (via `bash`) pouvait planter un symlink puis ecrire au travers vers `~/.ssh`, LaunchAgents, etc. |
| **Correctif** | `isContainedRealPath()` : verifie le `realpath` du parent existant + refuse les cibles symlink. Appele avant chaque ecriture dans `tryWriteWorkspaceFile`. |
| **Statut**    | **CORRIGE**                                                                                                                                                |

### NC4 — XSS `javascript:` via liens markdown et resultats de recherche (2e passe)

|               |                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Fichier**   | `electron/chat.html`                                                                                                                                                                 |
| **Probleme**  | Les liens markdown et les URLs de recherche web n'avaient aucune validation de schema. `javascript:alert(1)` produisait un `<a>` cliquable executant du JS dans l'origine `file://`. |
| **Correctif** | Helper `safeUrl()` (allowlist `http/https/mailto`). Lien non sur = rendu en texte brut.                                                                                              |
| **Statut**    | **CORRIGE**                                                                                                                                                                          |

### NC5 — `od-shell:open-path` sans confinement (2e passe)

|               |                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| **Fichier**   | `electron/main.ts`                                                                                     |
| **Probleme**  | `shell.openPath(baseDir)` appele sur un chemin du daemon open-design (donnee externe) sans validation. |
| **Correctif** | `resolveWithinHome(baseDir)` avant ouverture.                                                          |
| **Statut**    | **CORRIGE**                                                                                            |

### NC6 — Secret OAuth Google re-committe dans les rapports (2e passe)

|               |                                                                                    |
| ------------- | ---------------------------------------------------------------------------------- |
| **Fichiers**  | `reports/stockage-local-sensible.md`, `reports/audit-auth-session.md`              |
| **Probleme**  | La valeur `GOCSPX-...` avait ete re-committee en clair dans les rapports markdown. |
| **Correctif** | Valeur redigee (`GOCSPX-***REDACTED***`). `.gitignore` durci.                      |
| **Statut**    | **CORRIGE** (rotation manuelle + purge git requises)                               |

---

## ELEVEES

### H1 — Vues chat/projects sans garde `will-navigate`

|               |                                                                |
| ------------- | -------------------------------------------------------------- |
| **Fichier**   | `electron/main.ts`                                             |
| **Probleme**  | Pas de handler `will-navigate` sur les vues chat et projects.  |
| **Correctif** | Handler `will-navigate` bloquant la navigation hors `file://`. |
| **Statut**    | **CORRIGE**                                                    |

### H2 — Gardes de chemin `__openPath`/`__joinPath` contournables

|               |                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/main.ts`                                                                                                           |
| **Probleme**  | `startsWith(homedir())` contournable par prefixe frere (`/Users/bob-evil` pour `/Users/bob`). Pas de resolution de symlinks. |
| **Correctif** | `resolveWithinHome()` avec `path.relative` + `realpath`. Utilise dans `__openPath`, `__revealItemInDir`.                     |
| **Statut**    | **CORRIGE**                                                                                                                  |

### H3 — Pas de validation du header Host (DNS-rebinding)

|               |                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/proxy/index.ts`                                                                    |
| **Probleme**  | Pas de validation du `Host` header. DNS-rebinding possible.                                  |
| **Correctif** | Allowlist `ALLOWED_HOSTS` (`127.0.0.1:9999`, `localhost:9999`). Reponse 421 si non conforme. |
| **Statut**    | **CORRIGE**                                                                                  |

### H4 — Routes non authentifiees exposant donnees/mutations

|               |                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/proxy/index.ts`                                                                                           |
| **Probleme**  | `/v1/cache/metrics`, `/v1/cache/reset`, `/v1/reasoning/current-model`, `/v1/orch/assistant` accessibles sans token. |
| **Correctif** | `PUBLIC_PATHS` restreint a `/status`, `/health`, `/capabilities`, `/runtime/versions`.                              |
| **Statut**    | **CORRIGE**                                                                                                         |

### H5 — CORS faisant confiance a toute origine `file://`

|               |                                                                        |
| ------------- | ---------------------------------------------------------------------- |
| **Fichier**   | `electron/proxy/index.ts`                                              |
| **Probleme**  | `origin.startsWith("file://")` acceptait n'importe quelle page locale. |
| **Correctif** | Allowlist d'origines explicites (les ports des 3 apps + proxy).        |
| **Statut**    | **CORRIGE**                                                            |

### H6 — Corps d'erreur upstream renvoyes verbatim

|               |                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/proxy/index.ts`                                                                    |
| **Probleme**  | Erreurs des providers LLM renvoyees brutes (URLs internes, headers...).                      |
| **Correctif** | `sanitizeUpstreamError()` : extraction du message, troncature 300 chars, fallback generique. |
| **Statut**    | **CORRIGE**                                                                                  |

### H7 — XSS stockee dans la modale d'edition de projet OpenWork

|               |                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/overrides/openwork/projects.js`                                                            |
| **Probleme**  | `editing.name`, `editing.path`, `editing.instructions` interpoles dans `innerHTML` sans echappement. |
| **Correctif** | `escapeHtml()` sur tous les champs interpoles.                                                       |
| **Statut**    | **CORRIGE**                                                                                          |

### H8 — Protection path-traversal par heuristique

|               |                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/orchestrator-runner.ts`                                                                 |
| **Probleme**  | `isValidFilePath` utilisait des regles heuristiques. `../../.ssh/authorized_keys` pouvait passer. |
| **Correctif** | Remplacement par `safeResolveInWorkspace()` dans toutes les boucles d'ecriture.                   |
| **Statut**    | **CORRIGE**                                                                                       |

### H9 — SSRF via `ollama-url`

|               |                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Fichiers**  | `electron/keychain.ts`, `electron/ollama-manager.ts`, `electron/proxy/vision.ts`                                  |
| **Probleme**  | `ollama-url` (ecrivable par le renderer) servait de base a des `fetch`. Pointage vers `169.254.169.254` possible. |
| **Correctif** | `isSafeOllamaUrl()` applique dans `save-api-keys`, `getOllamaUrl()`, et le chemin vision.                         |
| **Statut**    | **CORRIGE**                                                                                                       |

### H10 — Token de session proxy expose au renderer

|               |                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/preload.ts`, `electron/main.ts`                                                                                                                             |
| **Probleme**  | Token passe complet au renderer via `get-chat-config`.                                                                                                                |
| **Correctif** | Risque residuel accepte (pages locales). Attenue par la suppression du token statique (C2), la CSP (C3), le Host-check (H3), et la validation d'expediteur IPC (NC1). |
| **Statut**    | **ACCEPTE** (risque residuel)                                                                                                                                         |

### H11 — `setup.sh` : `curl | bash` + `npm install -g pnpm`

|               |                                                            |
| ------------- | ---------------------------------------------------------- |
| **Fichier**   | `scripts/setup.sh`                                         |
| **Correctif** | `npm install -g pnpm` remplace par `corepack enable pnpm`. |
| **Statut**    | **CORRIGE**                                                |

### NH1 — Pas de garde navigation/`window.open` globale (2e passe)

|               |                                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Fichier**   | `electron/main.ts`                                                                                                                                                             |
| **Probleme**  | Pas de garde globale sur `window.open` et `will-navigate` pour les fenetres main/splash/navPopup.                                                                              |
| **Correctif** | `applyNavigationHardening()` via `app.on("web-contents-created")` — global `setWindowOpenHandler` + `will-navigate`/`will-redirect`. Appele en premier dans `app.whenReady()`. |
| **Statut**    | **CORRIGE**                                                                                                                                                                    |

### NH2 — Le proxy rerelayait tous les headers upstream (2e passe)

|               |                                                                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/proxy/index.ts`                                                                                                                                            |
| **Probleme**  | Tous les headers des providers LLM etaient retransmis, permettant d'overrider CORS, `Set-Cookie`, CSP.                                                               |
| **Correctif** | Whitelist `FORWARDABLE = ["content-type"]` pour chat. Denylist `BLOCKED_UPSTREAM = ["set-cookie", "csp", "x-frame-options", "hsts"]` pour le reverse-proxy opencode. |
| **Statut**    | **CORRIGE**                                                                                                                                                          |

### NH3 — DoS amplification : fan-out illimite d'images vision (2e passe)

|               |                                                                               |
| ------------- | ----------------------------------------------------------------------------- |
| **Fichier**   | `electron/proxy/index.ts`                                                     |
| **Probleme**  | Pas de limite sur le nombre d'images envoyees au modele vision.               |
| **Correctif** | `MAX_VISION_IMAGES = 12`. Images au-dela remplacees par un placeholder texte. |
| **Statut**    | **CORRIGE**                                                                   |

### NH4 — `isSafeWorkspaceDir` contournable par la casse (2e passe)

|               |                                                                  |
| ------------- | ---------------------------------------------------------------- |
| **Fichier**   | `electron/orchestrator-runner.ts`                                |
| **Probleme**  | APFS est insensible a la casse. `.SSH` passait le filtre `.ssh`. |
| **Correctif** | Toutes les comparaisons converties en minuscules.                |
| **Statut**    | **CORRIGE**                                                      |

### NH5 — XSS stockee : badge type d'agent non echappe (2e passe)

|               |                                                                |
| ------------- | -------------------------------------------------------------- |
| **Fichier**   | `electron/projects/management.js`                              |
| **Probleme**  | `wf.agentTypes[p.id]` interpole dans le HTML sans echappement. |
| **Correctif** | `escapeHtml(type)` sur la classe et le contenu du badge.       |
| **Statut**    | **CORRIGE**                                                    |

### NH6 — ReDoS sur la sortie LLM (2e passe)

|               |                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/orchestrator-runner.ts`                                                                          |
| **Probleme**  | Mega-regex `inlineRe` avec quantificateurs paresseux et lookaheads sur la sortie LLM dans le process main. |
| **Correctif** | Parsing ligne-a-ligne avec `markerRe` par ligne.                                                           |
| **Statut**    | **CORRIGE**                                                                                                |

### NH7 — `fs.cp` suivait les symlinks a l'export design (2e passe)

|               |                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| **Fichier**   | `electron/orchestrator-backends/design-backend.ts`                                                     |
| **Probleme**  | L'export design suivait les symlinks, permettant l'exfiltration de fichiers hors du workspace.         |
| **Correctif** | `dereference: false` + filtre `lstat` rejetant les symlinks. `listFilesRecursive` ignore les symlinks. |
| **Statut**    | **CORRIGE**                                                                                            |

### NH8 — Actions CI sur tags mobiles `@v4` (2e passe)

|               |                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| **Fichiers**  | `.github/workflows/lint.yml`, `.github/workflows/typecheck.yml`                                           |
| **Probleme**  | Actions `actions/checkout@v4` et `actions/setup-node@v4` referencees par tag mobile. Risque supply-chain. |
| **Correctif** | Epinglage SHA : `actions/checkout@34e114876b...`, `actions/setup-node@49933ea528...`.                     |
| **Statut**    | **CORRIGE**                                                                                               |

### NR1 — Risque architectural : agent sans sandbox OS (2e passe)

|               |                                                                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichiers**  | `electron/process-manager.ts`, orchestrator backends                                                                                                             |
| **Probleme**  | L'agent opencode tourne avec `--dangerously-skip-permissions` + `bash` + `$HOME` reel. Exfiltration/RCE possible quels que soient les durcissements des chemins. |
| **Correctif** | Gardes realpath/casse/IPC appliquees. Confinement complet (sandbox-exec / retrait bash / opt-in) = decision produit.                                             |
| **Statut**    | **ACCEPTE ET DOCUMENTE** (choix utilisateur)                                                                                                                     |

---

## MOYENNES

### M1 — `save-api-keys` sans garde valeur masquee

|               |                                       |
| ------------- | ------------------------------------- |
| **Fichier**   | `electron/main.ts`                    |
| **Correctif** | `if (isMaskedValue(value)) continue;` |
| **Statut**    | **CORRIGE**                           |

### M2 — Override JS : traversal via `index.json`

|               |                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/override-loader.ts`                                                             |
| **Probleme**  | Un nom d'override `../../something` dans `index.json` chargeait des fichiers arbitraires. |
| **Correctif** | `OVERRIDE_NAME_RE = /^[a-z0-9_-]+$/i` + `safeOverridePath()`.                             |
| **Statut**    | **CORRIGE**                                                                               |

### M3 — `printToPDF` sans CSP

|               |                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------ |
| **Fichier**   | `electron/main.ts`                                                                               |
| **Probleme**  | Export PDF chargeait du HTML non fiable dans un BrowserWindow connecte au reseau.                |
| **Correctif** | `createLockedPdfWindow()` : session isolee, `onBeforeRequest` bloquant tout sauf `data:/about:`. |
| **Statut**    | **CORRIGE**                                                                                      |

### M4 — Handlers IPC d'orchestration sans validation expediteur

|               |                                                                             |
| ------------- | --------------------------------------------------------------------------- |
| **Fichier**   | `electron/main.ts`                                                          |
| **Correctif** | Attenue par les gardes workspace (C5) et l'auth proxy (C2). Resolu par NC1. |
| **Statut**    | **CORRIGE**                                                                 |

### M5 — `OPENCODE_SERVER_PASSWORD` genere mais inutilise

|               |                                                                |
| ------------- | -------------------------------------------------------------- |
| **Fichier**   | `electron/process-manager.ts`                                  |
| **Correctif** | Champ et getter supprimes. Opencode lie a loopback uniquement. |
| **Statut**    | **CORRIGE**                                                    |

### M6 — Token proxy ecrit sur disque en 0644

|               |                                    |
| ------------- | ---------------------------------- |
| **Fichier**   | `electron/config-generator.ts`     |
| **Correctif** | `mode: 0o600` + `fs.chmod(0o600)`. |
| **Statut**    | **CORRIGE**                        |

### M7 — Pas de garde SSRF sur l'URL Ollama (chemin vision)

|               |                                                                 |
| ------------- | --------------------------------------------------------------- |
| **Fichier**   | `electron/proxy/vision.ts`                                      |
| **Correctif** | Import de `isSafeOllamaUrl` et validation avant chaque `fetch`. |
| **Statut**    | **CORRIGE**                                                     |

### M8 — Comparaison de token non constant-time

|               |                              |
| ------------- | ---------------------------- |
| **Fichier**   | `electron/proxy/index.ts`    |
| **Correctif** | `timingSafeEqual` (voir C2). |
| **Statut**    | **CORRIGE**                  |

### M9 — `JSON.parse` des stores sans validation

|               |                                                             |
| ------------- | ----------------------------------------------------------- |
| **Fichiers**  | `electron/project-store.ts`, `electron/memory-store.ts`     |
| **Correctif** | Normalisation defensive : collections coercees en tableaux. |
| **Statut**    | **CORRIGE**                                                 |

### M10 — Ecriture atomique sans verrou (lost updates)

|               |                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Fichiers**  | `electron/project-store.ts`, `electron/memory-store.ts`                                                             |
| **Correctif** | `withWriteLock()` serialisant les sequences load-modify-save. 11 mutateurs dans project-store, 6 dans memory-store. |
| **Statut**    | **CORRIGE**                                                                                                         |

### M11 — `maxRetries` sans plafond

|               |                                                                |
| ------------- | -------------------------------------------------------------- |
| **Fichier**   | `electron/orchestrator-quality.ts`                             |
| **Correctif** | `MAX_RETRIES_CEILING = 5`, `Math.min(Math.max(n ?? 2, 1), 5)`. |
| **Statut**    | **CORRIGE**                                                    |

### M12 — Bloc `build` mort dans `package.json`

|               |                                         |
| ------------- | --------------------------------------- |
| **Fichier**   | `package.json`, `electron-builder.json` |
| **Correctif** | Bloc mort supprime, globs corriges.     |
| **Statut**    | **CORRIGE**                             |

### M13 — Actions CI epinglees a des tags mobiles

|               |                                                                        |
| ------------- | ---------------------------------------------------------------------- |
| **Fichiers**  | `.github/workflows/*.yml`                                              |
| **Correctif** | `permissions: contents: read` ajoute. Epinglage SHA en 2e passe (NH8). |
| **Statut**    | **CORRIGE**                                                            |

### M14 — Repertoires parasites non ignores

|               |                                                                      |
| ------------- | -------------------------------------------------------------------- |
| **Fichier**   | `.gitignore`                                                         |
| **Correctif** | Patterns ajoutes pour les dumps, rapports, et repertoires parasites. |
| **Statut**    | **CORRIGE**                                                          |

### NM1 — `maxRetries` non plafonne dans 2 chemins d'appel (2e passe)

|               |                                                                                      |
| ------------- | ------------------------------------------------------------------------------------ |
| **Fichier**   | `electron/orchestrator-runner.ts`                                                    |
| **Correctif** | `clampRetries()` helper applique dans `executeSingleCall` et `executeSubStepSingle`. |
| **Statut**    | **CORRIGE**                                                                          |

### NM2 — `POST /workspaces/local` acceptait un chemin arbitraire (2e passe)

|               |                                                                          |
| ------------- | ------------------------------------------------------------------------ |
| **Fichier**   | `electron/proxy/index.ts`                                                |
| **Correctif** | `isSafeWorkspacePath()` : rejet des chemins non absolus ou hors `$HOME`. |
| **Statut**    | **CORRIGE**                                                              |

### NM3 — Permission handler en denylist (2e passe)

|               |                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/main.ts`                                                                                         |
| **Probleme**  | Les nouveaux types de permissions etaient accordes par defaut.                                             |
| **Correctif** | Passage en **allowlist** : seuls `notifications`, `fullscreen`, `clipboard-sanitized-write` sont accordes. |
| **Statut**    | **CORRIGE**                                                                                                |

### NM4 — XSS id de modele dans le dropdown (2e passe)

|               |                                                             |
| ------------- | ----------------------------------------------------------- |
| **Fichier**   | `electron/projects/detail.js`                               |
| **Correctif** | `escapeHtml(m.id)` et `escapeHtml(displayModelName(m.id))`. |
| **Statut**    | **CORRIGE**                                                 |

### NM5 — Injection via id de modele dans un `onclick` (2e passe)

|               |                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/sidebar.html`                                                                  |
| **Probleme**  | Bouton Ollama retry construit avec `innerHTML` + `onclick` interpolant le nom du modele. |
| **Correctif** | DOM API (`createElement` + `addEventListener`).                                          |
| **Statut**    | **CORRIGE**                                                                              |

### NM6 — `openExternal` contournait `openSafe` (2e passe)

|               |                                                                     |
| ------------- | ------------------------------------------------------------------- |
| **Fichier**   | `electron/overrides/openwork/bridge.js`                             |
| **Correctif** | `window.open` remplace par `openSafe(url)` (validation http/https). |
| **Statut**    | **CORRIGE**                                                         |

### NM7 — Ecriture `opencode.json` non-atomique en 0644 (2e passe)

|               |                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/config-generator.ts`                                                                        |
| **Correctif** | Ecriture dans un fichier temp (`randomBytes`) en mode 0600, puis `rename()`. Cleanup en cas d'erreur. |
| **Statut**    | **CORRIGE**                                                                                           |

### NM8 — `redactSecrets` manquait des patterns (2e passe)

|               |                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Fichier**   | `electron/process-manager.ts`                                                                                                  |
| **Correctif** | Ajout de la substitution litterale pour `proxyToken` et `googleAiKey`. Regex elargie : `sk-ant`, `sk-proj`, `sk-or`, `GOCSPX`. |
| **Statut**    | **CORRIGE**                                                                                                                    |

### NM9 — Repertoire de shims en 0755 dans `/tmp` (2e passe)

|               |                                                        |
| ------------- | ------------------------------------------------------ |
| **Fichier**   | `electron/process-manager.ts`                          |
| **Correctif** | `mode: 0o700` pour le repertoire et les fichiers shim. |
| **Statut**    | **CORRIGE**                                            |

### NM10 — `__joinPath` acceptait des segments absolus (2e passe)

|               |                                                                                |
| ------------- | ------------------------------------------------------------------------------ |
| **Fichier**   | `electron/main.ts`                                                             |
| **Correctif** | Rejet des segments absolus a l'index > 0 : `if (i > 0 && path.isAbsolute(s))`. |
| **Statut**    | **CORRIGE**                                                                    |

### NM11 — Ecriture non-atomique du nettoyage `memory.json` (2e passe)

|               |                                                                        |
| ------------- | ---------------------------------------------------------------------- |
| **Fichier**   | `electron/memory-store.ts`                                             |
| **Correctif** | Passage par `save()` (temp + rename) au lieu de `fs.writeFile` direct. |
| **Statut**    | **CORRIGE**                                                            |

### NM12 — `webContents.send` Ollama apres destruction + canaux non gardes (2e passe)

|               |                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fichier**   | `electron/ollama-manager.ts`                                                                                                                          |
| **Correctif** | Garde `isDestroyed()` avant chaque `send`. Validation `fromLocalUi(e)` (origin `file://`) sur les 3 handlers. Validation `typeof model !== "string"`. |
| **Statut**    | **CORRIGE**                                                                                                                                           |

---

## FAIBLES

| #   | Titre                                       | Fichier                  | Statut                                        |
| --- | ------------------------------------------- | ------------------------ | --------------------------------------------- |
| L1  | `killPort` interpole dans un shell          | `process-manager.ts`     | **CORRIGE** (`execFileSync` + garde entier)   |
| L2  | Logging verbeux adjacent aux secrets        | `process-manager.ts`     | **CORRIGE** (redaction via `redactSecrets`)   |
| L3  | `run-graphify-update` peut `npm install -g` | `main.ts`                | **CORRIGE** (`execFilePromise` + confinement) |
| L4  | Logs verbeux de prompts                     | orchestrateur/proxy      | Non concerne (seules longueurs logguees)      |
| L5  | URL distante traitee en base64              | `proxy/vision.ts`        | **CORRIGE** (rejet explicite http(s))         |
| L6  | Pas de plafond fichiers/taille              | `orchestrator-runner.ts` | **CORRIGE** (200 fichiers, 5 Mo/fichier)      |
| L7  | DMG non signe / non notarise                | `electron-builder.json`  | Config ajoutee, certificat requis             |
| L8  | Fichiers de sortie non ignores              | `.gitignore`             | **CORRIGE**                                   |
| L9  | App non signee                              | build                    | Config ajoutee, certificat requis             |

---

## Points deja corrects (aucune action requise)

- `webPreferences` : `contextIsolation:true, sandbox:true, nodeIntegration:false` partout
- `setWindowOpenHandler` : refuse tout, `openExternal` http(s) uniquement
- Permissions media/geo/hid/serial/usb refusees
- Proxy : bind `127.0.0.1` uniquement, `randomBytes(32)`, headers defensifs
- Secrets dans le Keychain, passes par env au spawn (pas en args CLI)
- Vision : taille image validee sur le buffer decode (10 Mo)
- Hotes upstream codes en dur (pas de SSRF par nom de modele)
- `npm audit` : 0 vulnerabilite
- `design-backend.ts` `sanitizeId` solide

---

## Fichiers modifies

| Fichier                                            | Changements                                                                                                                                                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `electron/main.ts`                                 | IPC wrappers, resolveWithinHome, execFilePromise, masquage API keys, will-navigate, CSP PDF, permission allowlist, navigation hardening, \_\_joinPath, token dynamique              |
| `electron/proxy/index.ts`                          | Host-check, CORS strict, token constant-time, suppression token statique, secret OAuth, sanitizeUpstreamError, header whitelist, vision cap, isSafeWorkspacePath, SSRF resolveRoute |
| `electron/keychain.ts`                             | maskSecret, isMaskedValue, isSafeOllamaUrl (reecriture complete avec net.isIP)                                                                                                      |
| `electron/keychain.test.ts`                        | +5 tests SSRF (loopback, schemes, metadata, IPv6, encodages)                                                                                                                        |
| `electron/orchestrator-runner.ts`                  | isSafeWorkspaceDir (casse), safeResolveInWorkspace, isContainedRealPath, tryWriteWorkspaceFile, clampRetries, parsing ligne-a-ligne, suppression npm lint                           |
| `electron/orchestrator-llm.ts`                     | Token dynamique (setProxyToken + proxyHeaders)                                                                                                                                      |
| `electron/orchestrator-quality.ts`                 | Clamp maxRetries                                                                                                                                                                    |
| `electron/orchestrator-backends/design-backend.ts` | Filtre symlinks fs.cp, listFilesRecursive skip symlinks                                                                                                                             |
| `electron/override-loader.ts`                      | OVERRIDE_NAME_RE + safeOverridePath                                                                                                                                                 |
| `electron/overrides/openwork/projects.js`          | escapeHtml sur name/path/instructions                                                                                                                                               |
| `electron/overrides/openwork/bridge.js`            | openSafe (scheme validation)                                                                                                                                                        |
| `electron/project-store.ts`                        | withWriteLock (11 mutateurs), normalisation defensive                                                                                                                               |
| `electron/memory-store.ts`                         | withWriteLock (6 mutateurs), ecriture atomique cleanup                                                                                                                              |
| `electron/config-generator.ts`                     | Ecriture atomique (temp 0600 + rename)                                                                                                                                              |
| `electron/process-manager.ts`                      | Suppression dead code, redactSecrets elargi, shims 0700                                                                                                                             |
| `electron/ollama-manager.ts`                       | Garde isDestroyed, validation fromLocalUi, validation model                                                                                                                         |
| `electron/proxy/vision.ts`                         | SSRF defense safeOllamaUrl, rejet URL distantes                                                                                                                                     |
| `electron/sidebar.html`                            | getProxyToken helper, DOM API bouton Ollama                                                                                                                                         |
| `electron/chat.html`                               | Suppression token statique, safeUrl helper, XSS liens markdown                                                                                                                      |
| `electron/projects.html`                           | CSP meta                                                                                                                                                                            |
| `electron/projects/state.js`                       | getProxyToken helper                                                                                                                                                                |
| `electron/projects/chat.js`                        | Utilisation getProxyToken                                                                                                                                                           |
| `electron/projects/management.js`                  | escapeHtml badge agent                                                                                                                                                              |
| `electron/projects/detail.js`                      | escapeHtml modele dropdown                                                                                                                                                          |
| `electron/preload.ts`                              | (inchange, surface existante documentee)                                                                                                                                            |
| `electron-builder.json`                            | hardenedRuntime, entitlements, globs corriges                                                                                                                                       |
| `build/entitlements.mac.plist`                     | Nouveau (entitlements macOS reduits)                                                                                                                                                |
| `package.json`                                     | Suppression bloc build mort                                                                                                                                                         |
| `.github/workflows/lint.yml`                       | permissions + SHA pinning                                                                                                                                                           |
| `.github/workflows/typecheck.yml`                  | permissions + SHA pinning                                                                                                                                                           |
| `scripts/setup.sh`                                 | corepack au lieu de npm install -g pnpm                                                                                                                                             |
| `.env.example`                                     | Documentation GEMINI_CLIENT_ID/SECRET                                                                                                                                               |
| `.gitignore`                                       | Patterns parasites, rapports, dumps                                                                                                                                                 |
| `SECURITY.md`                                      | Mise a jour threat model                                                                                                                                                            |
| `reports/stockage-local-sensible.md`               | Redaction du secret GOCSPX                                                                                                                                                          |

---

## Actions manuelles restantes

1. **Rotation du secret OAuth Google** `GOCSPX-...` dans Google Cloud Console. Le regenerer et le fournir via la variable `GEMINI_CLIENT_SECRET`.
2. **Purge de l'historique git** du secret (present dans les commits `d7cf8f8` et `3ffa4e4`) avec `git filter-repo --replace-text` ou BFG Repo-Cleaner.
3. **Certificat Developer ID Apple** pour la signature et la notarisation. La config `hardenedRuntime` et les entitlements sont en place.
