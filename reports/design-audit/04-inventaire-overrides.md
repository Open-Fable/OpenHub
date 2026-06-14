# Phase 4 — Inventaire du design RÉEL des apps tierces via les overrides

> Audit design OpenHub. Méthode : lecture intégrale des fichiers d'override
> (`electron/overrides/`), confrontée au CSS NATIF des apps clonées (`apps/*`) et
> aux mockups de marque (`fichier-de-la-marque/`). Aucune valeur n'est inventée :
> toute valeur absente est notée « NON DÉFINI ». Aucun fichier source n'a été modifié.

Référentiel canonique OpenHub (source : `electron/sidebar.html` + `fichier-de-la-marque/brand_colors.json`) :

- Accent teal : `#14b8a6` (dark) / `#0d9488` (light), hover `#2dd4bf` / `#0f766e` — `brand_colors.json:4,97,104`
- Échelle de radius canonique : `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 12px`, `--radius-full: 9999px` — `sidebar.html:63-66`
- Tokens préfixés `--oh-color-*` / `--oh-color-accent-primary: #14b8a6` — `sidebar.html:36-42, 105-111`
- Accent par-outil SUPPRIMÉ en v2 (un seul teal) — `brand_colors.json:328-329`

Total `!important` par fichier (mesuré) :

| Fichier                     | `!important` |
| --------------------------- | ------------ |
| `openwork/theme.css`        | 38           |
| `openwork/projects.css`     | 0            |
| `openwork/projects-hub.css` | 0            |
| `opencode/theme.css`        | 111          |
| `open-design/theme.css`     | 144          |

---

## 1. Par fichier d'override

### 1.1 `electron/overrides/openwork/theme.css` (53 lignes, 38 `!important`)

**Rôle :** remappe la palette native d'OpenWork (échelle Radix `--slate-*` + tokens `--dls-*` + tokens shadcn `--primary/--ring/--sidebar-primary`) vers le neutre OpenHub + accent teal.

**Propriétés overridées / valeurs imposées :**

- Échelle de gris neutre dark `--slate-1..12` : `#0a0a0a` → `#ececec` (`theme.css:7-18`).
- Échelle de gris neutre light `--slate-1..12` : `#ffffff` → `#111111` (`theme.css:31-42`).
- `--dls-border` dark `#2a2a2a` (`theme.css:20`), light `#e0e0e0` (`theme.css:44`).
- `--dls-accent` teal : dark `#14b8a6` (`theme.css:21`), light `#0d9488` (`theme.css:45`) ; hover `#2dd4bf`/`#0f766e` (`theme.css:22,46`).
- Tokens shadcn `--primary`, `--ring`, `--sidebar-primary` forcés en teal (`theme.css:25-27, 49-51`).

**Sélecteurs ciblés :** `[data-theme="dark"]` (`theme.css:6`) et `:root:not(.dark)` (`theme.css:30`). **STABLES** — ce sont des sélecteurs sémantiques alignés sur le `@custom-variant dark` natif (`apps/openwork/apps/app/src/app/index.css:14` cible `.dark, [data-theme="dark"]`). Cible des VARIABLES CSS, pas des classes générées : robuste aux updates.

**Ce qui marche bien :** override par variables (pas par classes utilitaires fragiles). Les couleurs natives (`--slate-*`, `--dls-accent`, `--primary`) sont toutes des points d'entrée nominaux et restent stables d'une version à l'autre.

**Ce qui est fragile / casse :**

- **RADIUS NON TRAITÉ (point de casse majeur).** Le fichier ne redéfinit AUCUN radius (vérifié : 0 occurrence de `radius`). Or OpenWork natif est très arrondi : `--dls-radius: 16px`, `--dls-radius-lg: 24px` (`index.css:63-64`), `.ow-soft-shell { border-radius: 2rem }` = 32px (`index.css:166`), `.ow-soft-card { border-radius: 1.5rem }` = 24px (`index.css:172`), `.ow-button-primary { border-radius: 9999px }` = pilule (`index.css:188`). Le canonique OpenHub vise 8/12px (`sidebar.html:64-65`). → les surfaces natives d'OpenWork restent en radius natif (16-32px et boutons pilule) alors que les vues internes OpenHub sont en 8-12px : **incohérence visuelle forte non corrigée**.
- L'override ne touche ni la typo (OpenWork impose `"IBM Plex Sans", Geist` — `index.css:144-145`) ni les ombres natives.

---

### 1.2 `electron/overrides/openwork/projects.css` (218 lignes, 0 `!important`)

**Rôle :** styler le modal de création de projet et les boutons de la sidebar projets — ce sont des éléments INJECTÉS par OpenHub (préfixe `.oh-*` / `#oh-*`), pas natifs d'OpenWork.

**Propriétés / valeurs imposées :**

- `#oh-project-modal` : `border-radius: var(--radius-lg, 12px)`, largeur 480px, `background: var(--bg-panel, #141414)`, bordure `var(--border-default, #2a2a2a)` (`projects.css:51-70`).
- Inputs/textarea : `border-radius: var(--radius-md, 8px)`, focus `border-color: var(--accent-primary, #14b8a6)` (`projects.css:124,133,141,153`).
- Swatches couleur : `border-radius: 50%`, 28×28px (`projects.css:162-169`).
- Boutons : `.oh-btn-primary` fond `var(--accent-primary, #14b8a6)`, `border-radius: var(--radius-lg, 12px)` (`projects.css:186-191`) ; `.oh-btn-ghost` `border-radius: var(--radius-md, 8px)` (`projects.css:208`).

**Sélecteurs ciblés :** `.oh-sidebar-simple-btn`, `#oh-project-modal`, `.oh-modal-*`, `.oh-btn-*` (`projects.css:3,39,51,72,…`). **STABLES** — classes/ids contrôlés par OpenHub lui-même, immunisés contre les updates d'OpenWork.

**Ce qui marche bien :** zéro `!important` (spécificité naturelle suffisante car éléments propres) ; accent et fond teal/neutre alignés sur la marque.

**Ce qui est fragile / casse :**

- **Tokens fantômes + collision de radius.** Le fichier consomme des tokens ad-hoc NON préfixés : `--accent-primary`, `--bg-panel`, `--bg-surface`, `--text-primary`, `--border-default`, `--radius-md/lg/sm`, `--shadow-*`, `--overlay-modal`, `--duration-*`, `--ease-out` (liste extraite). Aucun n'est défini côté OpenWork sauf `--radius-*`. Donc :
  - Couleurs/fonts/ombres → utilisent leurs **fallbacks codés en dur** (ex. `#141414`, `#14b8a6`). Fonctionnel mais **désynchronisé** : si le thème OpenHub évolue (dark↔light dynamique), ces overlays NE suivent PAS (le fallback est figé sur la valeur dark). En mode clair, `var(--bg-panel, #141414)` reste `#141414` (fond sombre dans une app claire) → **point de casse thème**.
  - `--radius-md/lg/sm` SONT définis nativement par OpenWork dans `@theme inline` (`index.css:503-505`) dérivés de `--radius: 0.45rem` : `--radius-lg ≈ 7.2px`, `--radius-md ≈ 5.8px`, `--radius-sm ≈ 4.3px`. → le `var(--radius-lg, 12px)` du modal résout à **~7.2px et non 12px** : les overlays projets rendent **plus serrés que prévu**, sans jamais utiliser le fallback. **Point de casse radius confirmé.**

---

### 1.3 `electron/overrides/openwork/projects-hub.css` (256 lignes, 0 `!important`)

**Rôle :** overlay plein écran « hub des projets » + vue détail — entièrement injecté par OpenHub (`#oh-projects-hub-overlay`, `.oh-project-card`, etc.).

**Propriétés / valeurs imposées :**

- Overlay : `position: fixed; inset:0; z-index:10000`, `background: var(--bg-deepest, #0a0a0a)` (`projects-hub.css:3-19`).
- `.oh-project-card` : `border-radius: var(--radius-lg, 12px)`, fond `var(--bg-surface, #1e1e1e)`, hover bordure `var(--accent-primary, #14b8a6)` (`projects-hub.css:64-86`).
- `.oh-project-card-icon-wrap` : 44×44px, `border-radius: var(--radius-md, 8px)` (`projects-hub.css:118-128`).
- `.oh-panel` / `.oh-textarea` : `border-radius` `--radius-lg`/`--radius-md` (`projects-hub.css:204-222`).
- Boutons `.oh-btn-primary` hover `var(--accent-hover, #2dd4bf)` (`projects-hub.css:239-241`).

**Sélecteurs ciblés :** ids/classes `#oh-*`, `.oh-*` (`projects-hub.css:3,30,64,…`). **STABLES** (propriété OpenHub).

**Ce qui marche bien :** structure grille responsive propre, accent teal cohérent, animations via `@keyframes fadeIn` local (`projects-hub.css:21-28`).

**Ce qui est fragile / casse :** mêmes deux problèmes que `projects.css` :

- tokens couleur/ombre non définis → fallbacks dark figés → **inversion en mode clair** (`var(--bg-deepest, #0a0a0a)` reste noir).
- `--radius-lg/md` collisionnent avec les natifs `@theme inline` d'OpenWork (~7.2px / ~5.8px) au lieu des 12/8px voulus.
- Incohérence de nommage : ces overlays utilisent `--accent-primary` / `--bg-surface` alors que `theme.css` (même app) pilote `--primary` / `--slate-*`. Deux conventions de tokens coexistent pour une même app → maintenance fragile.

---

### 1.4 `electron/overrides/opencode/theme.css` (323 lignes, 111 `!important`)

**Rôle :** repeindre OpenCode en teal. OpenCode a DEUX systèmes de tokens documentés dans l'en-tête (`theme.css:8-11`) : OC-1 (`--background-*`, `--surface-*`, `--text-*`, `--border-*`) et v2 (`--v2-blue-*`, `--v2-*-accent` dans un `@layer theme`).

**Propriétés / valeurs imposées :**

- Primitives `--v2-blue-100..1200` remappées sur l'échelle teal (`#f0fdfa`→`#021a19`) en clair (`theme.css:24-35`) ET re-déclarées à l'identique en dark (`theme.css:92-103`).
- Surfaces OC-1 clair/dark : `--background-base` `#ffffff`/`#0a0a0a`, `--background-weak` `#f7f7f7`/`#141414`, `--surface-float-base`, `--input-base`, `--text-strong` `#111`/`#ececec`, `--border-weak-base` `#e0e0e0`/`#2a2a2a` (`theme.css:42-130`).
- Tokens accent OC-1 : `--border-selected`, `--text-interactive-base`, `--surface-brand-base`, etc. en teal (`theme.css:70-76, 133-139`).
- Tokens sémantiques v2 : `--v2-background-bg-accent: #14b8a6`, `--v2-text-text-accent`, `--v2-icon-icon-accent`, `--v2-border-border-focus` (`theme.css:79-84, 142-147`).
- `--menu-v2-accent` forcé au scope composant `[data-component="menu-v2-item"]` (`theme.css:314-322`).
- Styles directs : scrollbars 6px (`theme.css:156-177`), `::selection` teal (`theme.css:180-187`), `:focus-visible` outline teal (`theme.css:190-198`), inputs `border-radius: var(--radius-md, 8px)` + focus teal (`theme.css:201-218`), boutons focus teal (`theme.css:230-238`).
- Correctifs LAYOUT (hors couleur) : force l'affichage des sidebars/boutons titlebar masqués sous 1280px (`theme.css:261-308`).

**Sélecteurs ciblés :**

- STABLES : variables OC-1/v2 sur `:root` (`theme.css:23,41,91`) ; `[data-component="sidebar-nav-desktop"]`, `[data-component="menu-v2-item"]`, `[data-component="sidebar-rail"]` (`theme.css:241-247, 314`) — attributs `data-component` sémantiques.
- FRAGILES : sélecteurs sur classes utilitaires Tailwind échappées : `.hidden.xl\:flex:has(button)` (`theme.css:271`), `div.hidden.xl\:flex` (`theme.css:276`), `.xl\:hidden:has(nav[data-component=…])` (`theme.css:298-303`), `.hidden.xl\:block[class*="pointer-events-none"][class*="z-25"]` (`theme.css:306`). Ces sélecteurs dépendent de breakpoints et classes utilitaires générés ; un changement de breakpoint (`xl`), de z-index (`z-25`) ou de structure casse le correctif silencieusement. `[data-component="sidebar-nav-desktop"] ~ div.z-20` (`theme.css:293`) idem.

**Ce qui marche bien :**

- Override des DEUX systèmes de tokens : robuste car même si OpenCode bascule OC-1↔v2, l'accent reste teal. Le `--v2-blue-600: #3b5cf6` natif (`apps/opencode/packages/ui/src/v2/styles/colors.css:135`, dans `@layer theme`) est correctement écrasé par `:root` (priorité `:root` > `@layer`). `--v2-background-bg-accent: var(--v2-blue-600)` (natif `theme.css:14`) hérite donc du teal.
- Le commentaire sur `--menu-v2-accent` est EXACT : natif défini au scope `[data-component="menu-v2-item"]` (`apps/opencode/packages/ui/src/v2/components/menu-v2.css:32`), donc l'override `:root` ne cascade pas → l'override re-cible le scope. Bien diagnostiqué.

**Ce qui est fragile / casse :**

- **Radius NON unifié (point de casse).** Seuls inputs/textarea/select reçoivent `var(--radius-md, 8px)` (`theme.css:204`). OpenCode natif définit une échelle SERRÉE : `--radius-xs: 2px … --radius-xl: 10px` (`apps/opencode/packages/ui/src/styles/theme.css:45-49`) + de nombreux radius codés en dur dans les composants (mesuré : `6px ×8`, `8px ×6`, `4px ×5`, `2px ×5`, `12px ×3`, `999px ×5`). Les cartes/boutons/popovers gardent donc leur radius natif hétérogène (2-12px) ; aucun alignement sur le 8/12px canonique OpenHub. **Boutons/cartes OpenCode plus anguleux que les vues OpenHub.**
- Le sélecteur `var(--main-left)` (`theme.css:295`) référence une variable NON définie dans l'override → A VÉRIFIER côté natif (sinon `left` invalide, ignoré).
- Forte dépendance aux classes Tailwind échappées pour le layout (cf. sélecteurs fragiles) : c'est le principal risque de régression après `npm run update:apps`.

---

### 1.5 `electron/overrides/open-design/theme.css` (313 lignes, 144 `!important`)

**Rôle :** repeindre Open Design (natif terracotta/crème) en neutre + teal, et neutraliser des éléments de chrome.

**Propriétés / valeurs imposées :**

- Tokens light : `--bg #ffffff`, `--bg-panel #f7f7f7`, `--border #e0e0e0`, `--text #111111`, `--accent #0d9488`, plus tokens propriétaires `--oh-shadow-*`, `--oh-bg-surface`, `--oh-dur-*`, `--oh-ease*` (`theme.css:32-76`).
- Tokens dark : `--bg #0a0a0a`, `--bg-panel #141414`, `--accent #14b8a6`, `--accent-hover #2dd4bf` (`theme.css:79-107`).
- Composants par RÔLE ARIA : boutons `border-radius: var(--radius-md, 8px)` (`theme.css:124`), inputs `var(--radius-sm, 4px)` (`theme.css:145`), `[role="region"]/[role="card"]` `var(--radius-md, 8px)` (`theme.css:184`), `[role="dialog"]` `var(--radius-lg, 12px)` (`theme.css:191`), `[role="tab"][aria-selected="true"]` souligné teal (`theme.css:212-215`), `[role="menu"]`, `[role="tooltip"]`, liens teal (`theme.css:218-249`).
- Typo forcée : `-apple-system, "SF Pro Text"…` sur `html,body` (`theme.css:115-116`) et inputs (`theme.css:147`).
- Neutralisations : `-webkit-app-region: no-drag !important` sur `html, body, *` (`theme.css:301-305`) ; masquage `[data-sidebar="trigger"]` (`theme.css:308-312`) ; unification fonds `.entry-nav-rail`, `.split-chat-slot > .pane`, `.settings-sidebar`, `.drawer-content`, `.entry-main--scroll`, `.app`, `.workspace-shell` (`theme.css:283-295`).
- Blocs commentés (désactivés) : collapse de `.entry-nav-rail` / `.workspace-tabs-chrome` (`theme.css:6-29`) → indique des tentatives ayant cassé le layout grille (commentaire `theme.css:6`).

**Sélecteurs ciblés :**

- STABLES : variables `--bg/--accent/--text/--border` sur `:root`/`html:not(.dark)`/`[data-theme="dark"]` (`theme.css:32,80-82`) ; sélecteurs ARIA `[role="dialog"|"tab"|"menu"|"tooltip"]` et `[data-sidebar="trigger"]`, `[data-slot="sidebar-trigger"]` (`theme.css:308-310`) — sémantiques.
- FRAGILES : classes structurelles spécifiques au produit `.entry-nav-rail`, `.split-chat-slot > .pane`, `.settings-sidebar`, `.drawer-content`, `.entry-main--scroll`, `.workspace-shell`, `.app` (`theme.css:283-295`). Ce ne sont pas des classes générées hashées, mais des classes internes susceptibles d'être renommées en update → unification des fonds casse silencieusement.

**Ce qui marche bien :** override par variables ARIA-driven (robuste) ; le `no-drag` global est pertinent pour un WebContentsView (commentaire `theme.css:297-300` correct).

**Ce qui est fragile / casse :**

- **BUG de cascade dark (point de casse confirmé).** Open Design natif applique le dark via DEUX chemins : `[data-theme="dark"]` (toujours) ET `@media (prefers-color-scheme: dark) html:not([data-theme])` (`apps/open-design/apps/web/src/styles/tokens.css:84,~133`). L'override place SES tokens dark à l'INTÉRIEUR de `@media (prefers-color-scheme: dark)` (`theme.css:79-107`). → Si l'OS est en **clair** mais l'utilisateur/OpenHub force `[data-theme="dark"]`, le bloc dark de l'override ne s'applique JAMAIS ; seuls les tokens light de l'override s'appliquent, mais le natif `[data-theme="dark"]` réactive ses fonds anthracite chaud → **mélange thème (fonds sombres natifs + accents/bordures clairs de l'override)**. La symétrie avec la palette d'OpenWork (`theme.css:6` ciblant `[data-theme="dark"]` HORS media) est rompue.
- **Radius : `--radius-md` inexistant + écrasement de `--radius-sm`.** Open Design natif définit `--radius-sm: 6px`, `--radius: 8px`, `--radius-lg: 12px`, `--radius-pill: 999px` (`apps/open-design/apps/web/src/styles/tokens.css:55-58`) mais PAS de `--radius-md` (vérifié, 0 occurrence). Donc :
  - boutons/cartes/dialogs override `var(--radius-md, 8px)` → fallback **8px** (cohérent par chance avec le natif `--radius`).
  - inputs override `var(--radius-sm, 4px)` mais `--radius-sm` EST défini nativement à **6px** → l'input rend en **6px, pas 4px** : désalignement subtil avec le canonique OpenHub (4px). **Point de casse radius confirmé.**
- `* { -webkit-app-region: no-drag !important }` sur le sélecteur universel : très large, à fort coût de spécificité, peut interférer si Open Design réintroduit du drag voulu.

---

## 2. Design natif de chaque app — synthèse

### OpenWork (slot Work)

- **Couleurs dominantes natives :** accent BLEU `--blue-9: #0090ff` (`apps/openwork/apps/app/src/styles/colors.css:48`), accent marque `--dls-accent: #011627` (bleu nuit, `index.css:54`) ; base gris Radix `--slate-*`. → l'override remplace bien tout par neutre + teal.
- **Border-radius natif (très arrondi, doux) :** `--dls-radius: 16px`, `--dls-radius-lg: 24px` (`index.css:63-64`) ; `.ow-soft-shell` 32px (`index.css:166`), `.ow-soft-card` 24px (`index.css:172`), boutons pilule `9999px` (`index.css:188`) ; échelle shadcn `@theme inline` dérivée de `--radius: 0.45rem` → `--radius-lg ≈ 7.2px`, `--radius-md ≈ 5.8px`, `--radius-sm ≈ 4.3px` (`index.css:503-505`).
- **Typo native :** `"IBM Plex Sans", Geist, "Avenir Next", Inter…` (`index.css:144-145`), taille de base `0.875rem`.
- **Variables exploitables (les plus sûres) :** `--slate-1..12`, `--dls-accent`, `--dls-accent-hover`, `--dls-border`, `--primary`, `--ring`, `--sidebar-primary` (toutes déjà overridées). NON exploitées : `--dls-radius`, `--dls-radius-lg`, `--radius`.
- **Où l'override réussit :** unification colorimétrique (palette neutre + teal) complète.
- **Où il échoue/casse :** radius natif (16-32px, boutons pilule) jamais ramené au 8/12px OpenHub → arrondis natifs très visibles ; typo IBM Plex non alignée sur SF Pro de la marque.

### OpenCode (slot Code)

- **Couleurs dominantes natives :** accent BLEU `--blue-light/dark-9: #0091ff` (`apps/opencode/packages/ui/src/styles/colors.css:564,552`), bordure sélection `--border-selected: rgba(3,76,255,…)` (`apps/opencode/packages/ui/src/styles/theme.css:203`), primitive v2 `--v2-blue-600: #3b5cf6` (`apps/opencode/packages/ui/src/v2/styles/colors.css:135`). Base claire `--background-base: #f8f8f8`, texte `--text-strong: #171717` (`theme.css:94,167`).
- **Border-radius natif (serré) :** `--radius-xs 2px / sm 4px / md 6px / lg 8px / xl 10px` (`apps/opencode/packages/ui/src/styles/theme.css:45-49`) + radius codés en dur composant (6/8/4/2/12px, 999px pilule).
- **Typo native :** `--font-family-sans: ui-sans-serif, system-ui, -apple-system…` ; tailles `--font-size-small 13px / base 14px / large 16px` (`theme.css:2,8-11`).
- **Variables exploitables (les plus sûres) :** DOUBLE système — OC-1 (`--background-base/-weak/-strong`, `--surface-*`, `--text-strong/-base`, `--border-weak-base/-weaker-base`, `--border-selected`, `--text-interactive-base`, `--surface-brand-base`) ET v2 (`--v2-blue-100..1200`, `--v2-background-bg-accent`, `--v2-text-text-accent`, `--v2-icon-icon-accent`, `--v2-border-border-focus`). Token scopé à re-cibler : `--menu-v2-accent` (sur `[data-component="menu-v2-item"]`).
- **Où l'override réussit :** couleurs/accent (les deux systèmes couverts), focus/selection teal.
- **Où il échoue/casse :** radius (échelle native 2-10px + hardcodés jamais unifiés) ; layout via classes Tailwind échappées (`xl:flex`, `z-25`) à haut risque de régression post-update.

### Open Design (slot Design)

- **Couleurs dominantes natives :** accent TERRACOTTA `--accent: #c96442` (light) / `#d97a56` (dark) (`apps/open-design/apps/web/src/styles/tokens.css:28,104`) ; base CRÈME chaude `--bg: #faf9f7` (light) / anthracite chaud `#1a1917` (dark) (`tokens.css:8,85`) ; texte `#1a1916`/`#e8e4dc`. → identité chromatique la plus éloignée du teal/neutre OpenHub ; l'override la remplace intégralement.
- **Border-radius natif :** `--radius-sm: 6px`, `--radius: 8px`, `--radius-lg: 12px`, `--radius-pill: 999px` (`tokens.css:55-58`). PAS de `--radius-md`.
- **Typo native :** `font-family: var(--sans)` (`apps/open-design/apps/web/src/styles/base.css:6`) — valeur de `--sans` NON DÉFINIE dans `tokens.css` (A VÉRIFIER ailleurs). L'override force SF Pro.
- **Variables exploitables (les plus sûres) :** `--bg`, `--bg-app`, `--bg-panel`, `--bg-subtle`, `--bg-muted`, `--bg-elevated`, `--border`, `--border-strong`, `--border-soft`, `--text`, `--text-strong/-muted/-soft/-faint`, `--accent`, `--accent-strong/-soft/-tint/-hover`, `--radius-sm`, `--radius`, `--radius-lg`, `--radius-pill`. Sélecteurs de scope natifs : `:root`, `[data-theme="dark"]`, `@media (prefers-color-scheme: dark) html:not([data-theme])`.
- **Où l'override réussit :** repeinture complète par variables + composants ciblés par rôle ARIA (robuste).
- **Où il échoue/casse :** (1) cascade dark cassée — bloc dark enfermé dans `@media`, ne couvre pas `[data-theme="dark"]` en OS clair (cf. §1.5) ; (2) inputs en 6px natif au lieu du 4px voulu (`--radius-sm` natif écrase le fallback) ; (3) fonds unifiés via classes produit `.entry-*`/`.workspace-shell` renommables.

---

## 3. RETOUR demandé — par app

### OpenWork

- **Variables CSS natives redéfinissables (méthode la plus sûre) :** `--slate-1..12`, `--dls-accent`, `--dls-accent-hover`, `--dls-accent-fg`, `--dls-border`, `--primary`, `--ring`, `--sidebar-primary` — toutes pilotables sur `[data-theme="dark"]` et `:root:not(.dark)`. Pour le radius (NON traité aujourd'hui) : redéfinir `--dls-radius` (16px), `--dls-radius-lg` (24px) et `--radius` (0.45rem) — c'est le levier propre vers le 8/12px OpenHub.
- **Sélecteurs fragiles repérés :** aucun dans `theme.css` (cible des variables). Dans `projects.css`/`projects-hub.css` : aucun sélecteur DOM natif fragile (éléments `.oh-*`/`#oh-*` propres), MAIS dépendance à des tokens non définis (couleurs en fallback figé, radius collisionnant avec le natif `@theme inline`).
- **Points de casse connus (radius surtout) :** radius natif jamais corrigé (`--dls-radius 16px`, cartes 24px, boutons pilule 9999px) → arrondis natifs très visibles. Les overlays projets visent `var(--radius-lg, 12px)` mais reçoivent le natif `--radius-lg ≈ 7.2px` (défini en `@theme inline`, `index.css:505`) → rendu plus serré que voulu, fallback jamais atteint.

### OpenCode

- **Variables CSS natives redéfinissables (méthode la plus sûre) :** double piste, à overrider ensemble — OC-1 : `--background-base/-weak/-strong/-stronger`, `--surface-float-base(-hover)`, `--surface-raised-stronger-non-alpha`, `--input-base/-hover`, `--text-strong/-base`, `--border-weak-base/-weaker-base`, `--border-selected`, `--text-interactive-base`, `--icon-interactive-base`, `--surface-brand-base/-hover`, `--surface-interactive-base/-hover` ; v2 : `--v2-blue-100..1200`, `--v2-background-bg-accent`, `--v2-text-text-accent(-hover)`, `--v2-icon-icon-accent(-hover)`, `--v2-border-border-focus`, plus `--menu-v2-accent` re-ciblé sur `[data-component="menu-v2-item"]`. Pour le radius : redéfinir `--radius-xs/sm/md/lg/xl` (`apps/opencode/packages/ui/src/styles/theme.css:45-49`).
- **Sélecteurs fragiles repérés :** `.hidden.xl\:flex:has(button)` (`theme.css:271`), `div.hidden.xl\:flex` (`:276`), `.xl\:hidden:has(nav[data-component=…])` (`:298-303`), `.hidden.xl\:block[class*="pointer-events-none"][class*="z-25"]` (`:306`), `[data-component="sidebar-nav-desktop"] ~ div.z-20` (`:293`) — tous dépendants de classes utilitaires Tailwind / breakpoints / z-index générés. Variable référencée non définie : `--main-left` (`:295`).
- **Points de casse connus (radius surtout) :** échelle native serrée 2-10px + nombreux radius hardcodés (6/8/4/2/12px, 999px) NON unifiés ; seuls inputs reçoivent `var(--radius-md, 8px)`. → cartes/boutons/popovers anguleux, incohérents avec le 8/12px OpenHub. Risque secondaire : les correctifs layout `xl:` cassent en silence après `update:apps` (le `check-selectors.sh` ne détecte PAS ces classes — son grep ne matche que `[data-*]`, `#id`, `[role=…]`, `[aria-*]`, pas les classes utilitaires échappées).

### Open Design

- **Variables CSS natives redéfinissables (méthode la plus sûre) :** `--bg`, `--bg-app`, `--bg-panel`, `--bg-subtle`, `--bg-muted`, `--bg-elevated`, `--bg-fill(-secondary/-tertiary)`, `--border(-strong/-soft)`, `--text(-strong/-muted/-soft/-faint)`, `--accent(-strong/-soft/-tint/-hover)`, `--radius-sm`, `--radius`, `--radius-lg`, `--radius-pill`. Sur les TROIS scopes natifs pour être complet : `:root`, `[data-theme="dark"]`, et `@media (prefers-color-scheme: dark) html:not([data-theme])`.
- **Sélecteurs fragiles repérés :** classes produit `.entry-nav-rail`, `.split-chat-slot > .pane`, `.settings-sidebar`, `.drawer-content`, `.entry-main--scroll`, `.workspace-shell`, `.app` (`theme.css:283-295`) — internes, renommables ; les blocs commentés `theme.css:6-29` documentent un collapse de rail qui cassait le grid. Token natif `--sans` (typo) NON localisé → A VÉRIFIER.
- **Points de casse connus (radius surtout) :** (1) **radius** — `--radius-md` n'existe PAS nativement, donc `var(--radius-md, 8px)` tombe sur 8px (OK par coïncidence avec `--radius`), MAIS `var(--radius-sm, 4px)` est écrasé par le natif `--radius-sm: 6px` → inputs en 6px au lieu de 4px (correctif : redéfinir explicitement `--radius-sm` à 4px, ou cibler les inputs sans s'appuyer sur le token natif). (2) **dark cassé** — le bloc dark de l'override est dans `@media (prefers-color-scheme: dark)` alors que le natif active aussi le dark via `[data-theme="dark"]` hors media : en OS clair + thème forcé sombre, l'override n'applique pas ses fonds sombres → mélange anthracite natif + accents clairs override (correctif : sortir le bloc dark du `@media` et le cibler sur `[data-theme="dark"]`, à l'image d'`openwork/theme.css:6`).
