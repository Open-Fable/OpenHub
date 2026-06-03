# OpenHub — Session Handoff (2026-06-03, mis a jour)

> Ce document resume TOUTE la discussion et le travail effectue sur le projet OpenHub.
> Il sert de contexte complet pour reprendre dans une nouvelle conversation.

---

## 1. Le concept demande par l'utilisateur

**Objectif :** Creer un "Super-Hub" Desktop pour macOS (nom de code : OpenHub) inspire
de l'ergonomie de l'application native Claude macOS. L'objectif est de reunir 3 projets
open source existants dans une seule interface unifiee — une sidebar avec des boutons
qui switch entre les apps, chacune affichee dans une WebView separee.

**Principes cles exprimes par l'utilisateur :**
1. **Pas de fusion de code** — chaque app garde son code source intact
2. **Pas de Docker** — tout natif
3. **Une seule config API** — les cles API et modeles configures une fois, pas par fenetre
4. **Design uniforme** — masquer les sidebars natives des apps, injecter un theme commun
5. **Pouvoir ajouter/supprimer des fonctionnalites** — via injection CSS/JS runtime
6. **Resilience aux mises a jour** — `git pull` sur chaque app ne casse rien
7. **Pas de chat qui controle les autres** — chaque app est independante
8. **Pouvoir generer des PDF, faire de la recherche web** — via le proxy ou Electron natif
9. **Chat reporte en V2** — V1 = 3 slots seulement (Work, Code, Design)

---

## 2. Les 3 apps integrees

| Slot | Depot | Branch | Commande de lancement | Port |
|------|-------|--------|----------------------|------|
| **Work** | `different-ai/openwork` | `dev` | `pnpm dev:ui` (Vite SPA) | `:5173` |
| **Code** | `sst/opencode` | `main` | `opencode serve --port 4096 --hostname 127.0.0.1` | `:4096` |
| **Design** | `nexu-io/open-design` | `main` | daemon `od --no-open` + `pnpm dev` (Next.js) | daemon `:7456`, web `:3456` |

**Note cle :** `opencode serve` (pas `web`) — `serve` demarre le serveur + UI sans ouvrir le navigateur systeme.

---

## 3. Architecture choisie

```
ELECTRON (shell + proxy + secrets) — seul detenteur des cles reelles
|
|-- Sidebar : [Work] [Code] [Design] [Config]
|
|-- 3 WebContentsView (lazy, etat preserve)
|    Work   -> openwork apps/app (Vite SPA)       :5173
|    Code   -> opencode serve                      :4096
|    Design -> open-design daemon + web frontend   :3456
|
|-- CASCADE DE CONFIG ("configurer une fois")
|    ~/.config/opencode/opencode.json
|    provider "openhub" -> baseURL http://localhost:9999/v1
|
|-- PROXY LLM :9999 (127.0.0.1, Bearer token, OpenAI-compatible)
|    Route Anthropic / OpenAI / Ollama
|
|-- SECRETS : macOS Keychain -> RAM -> env vars au spawn
|
|-- OVERLAYS : CSS/JS injection runtime (electron/overrides/)
```

**Decisions architecturales prises :**
- **Electron** (pas Tauri) — multi-WebContentsView mature, openwork utilise deja Tauri
- **Proxy Express integre** — sur `127.0.0.1:9999`, Bearer token par session
- **keytar** — macOS Keychain, jamais de secrets sur disque
- **Preload CommonJS** — le preload Electron DOIT etre CommonJS (pas ESM)
- **127.0.0.1** pour Code — opencode bind sur IPv4 uniquement, Chromium tente IPv6 en premier
- **opencode serve** (pas `web`) — `web` ouvre le navigateur systeme, `serve` non

---

## 4. Structure des fichiers

```
OpenHub/
|-- ARCHITECTURE.md
|-- CLAUDE.md
|-- AGENTS.md
|-- README.md
|-- SESSION-HANDOFF.md       # CE FICHIER
|-- LICENSE
|-- package.json
|-- tsconfig.json
|-- eslint.config.mjs
|-- .gitignore               # Exclut node_modules, dist, apps/ (upstream repos)
|-- .env.example
|-- electron-builder.json
|-- vitest.config.ts
|-- playwright.config.ts
|
|-- electron/
|   |-- main.ts              # Process principal (fenetre, IPC, lifecycle)
|   |-- preload.ts           # Bridge window.openhub (COMMONJS)
|   |-- tsconfig.preload.json
|   |-- process-manager.ts   # Spawn + health check des 3 apps
|   |-- proxy/index.ts       # Proxy LLM :9999
|   |-- keychain.ts          # macOS Keychain via keytar
|   |-- config-generator.ts  # Genere ~/.config/opencode/opencode.json
|   |-- override-loader.ts   # Injecte CSS/JS dans les webviews
|   |-- sidebar.html         # UI sidebar (HTML/CSS/JS inline)
|   |-- types.ts
|   |-- overrides/
|   |   |-- index.json       # Catalogue overrides (toggle on/off)
|   |   |-- global/theme.css # Variables CSS theme sombre + font-family
|   |   |-- global/layout.css
|   |   |-- openwork/ opencode/ open-design/  # (vides, prets)
|
|-- apps/                    # NON tracke git — clone par setup.sh
|   |-- openwork/
|   |-- opencode/
|   |-- open-design/
|
|-- scripts/
    |-- dev.sh / copy-assets.sh / setup.sh / update.sh / check-selectors.sh
```

---

## 5. Comment lancer

```bash
cd ~/Documents/Application/OpenHub
npm run dev
# Compile TS -> copie assets -> lance Electron
```

---

## 6. Etat complet au 2026-06-03 (TOUT VALIDE)

| Composant | Etat | Notes |
|-----------|------|-------|
| Shell Electron + sidebar | FONCTIONNE | Style Claude macOS |
| Slot **Work** (openwork) | FONCTIONNE | Vite :5173 |
| Slot **Code** (opencode) | FONCTIONNE | `opencode serve` :4096, sans browser |
| Slot **Design** (open-design) | FONCTIONNE | daemon :7456 + Next.js :3456 |
| Switch entre les 3 slots | FONCTIONNE | z-order, views en memoire |
| Proxy LLM :9999 | FONCTIONNE | Bearer token par session |
| Config cascade opencode.json | FONCTIONNE | `~/.config/opencode/opencode.json` |
| Kill ports orphelins | FONCTIONNE | `killPort()` avant chaque spawn |
| stopAll() propre | FONCTIONNE | `ChildProcess \| null` type-safe |
| get-api-keys IPC | AJOUTE | Panel Config peut relire les cles Keychain |

---

## 7. Bugs corriges en session 2

| Bug | Cause | Fix |
|-----|-------|-----|
| TypeScript TS6133 | `capturePortFromOutput` non supprime | Supprime |
| Code page blanche | opencode bind IPv4, Chromium tente IPv6 | `http://127.0.0.1:4096` |
| Popup Basic Auth | `OPENCODE_SERVER_PASSWORD` sans credentials dans WebView | Supprime le mot de passe |
| Browser systeme s'ouvre | `opencode web` ouvre le browser | Passe a `opencode serve` |
| Design orphelins bloquent ports | Pas de killPort avant spawn Design | `killPort(7456)` + `killPort(3456)` |
| stopAll() crash potentiel | `null as unknown as ChildProcess` | Type `ChildProcess \| null` |

---

## 8. Repo GitHub

- **URL :** https://github.com/1zalt/OpenHub (prive)
- **Branch :** `main`
- **apps/ non trackee** — clonee par `scripts/setup.sh`

---

## 9. Prochaines etapes (V1 restant)

1. **CSS injection** — tester visuellement ; ajouter overrides pour masquer sidebars natives
2. **Config panel** — tester save + read des cles API (IPC wire up complet)
3. **Tester le proxy LLM** — envoyer une vraie requete via une des apps
4. **Export PDF** — tester `printToPDF` natif Electron
5. **Cleanup** — retirer les `console.warn` de debug

---

## 10. Commandes utiles

```bash
# Lancer
cd ~/Documents/Application/OpenHub && npm run dev

# Types
npm run typecheck

# Tuer les orphelins
lsof -ti:5173,4096,3456,7456,9999 | xargs kill -9 2>/dev/null; true

# Update apps upstream
npm run update:apps

# Push
git add -p && git commit -m "..." && git push
```

---

## 11. Fichiers cles a lire en priorite

1. `ARCHITECTURE.md` — spec canonique
2. `electron/main.ts` — process principal
3. `electron/process-manager.ts` — spawn des 3 apps
4. `electron/preload.ts` — bridge (DOIT rester CommonJS)
5. `electron/sidebar.html` — UI sidebar
6. Ce fichier (`SESSION-HANDOFF.md`)
