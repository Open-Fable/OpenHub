# 03 — Inventaire du code propre (document maître) — PHASE 3 SYNTHÈSE

## Introduction et méthodologie

Ce document maître agrège les inventaires design RÉELS produits par vue lors de la Phase 3 de l'audit design OpenHub (fichiers de travail : `03-inv-projects.md`, `03-inv-chat.md`, `03-inv-sidebar-nav.md`, `03-inv-global.md`). Chaque sous-inventaire a été réalisé par lecture intégrale des fichiers source de la vue concernée, en relevant exhaustivement les tokens CSS définis (`:root`), les couleurs/border-radius/typographies/espacements/ombres/transitions/z-index réellement utilisés (avec distinction systématique entre valeurs tokenisées et valeurs hardcodées), et les incohérences internes. Chaque affirmation reste tracable à la source (colonne `Fichier:ligne` conservée intégralement ci-dessous ; aucune ligne n'a été supprimée ni résumée). Toute valeur absente est notée `NON DÉFINI` ou `A VERIFIER`. Ce document est autonome : il reproduit l'intégralité des tableaux des fichiers de travail et constitue la base directe de la Phase 5 (unification du système de tokens).

---

## Systèmes de tokens détectés par vue

Tableau comparatif synthétique. C'est la base de la Phase 5.

| Vue (fichier)                                                               | Définit ses propres `:root` ?                                                                                                          | Préfixe / nommage tokens                                                                                                                     | Échelle border-radius observée                                                                                          | Accent primaire (dark / light)                                           | Font principale                                                                                                                         | Fond (dark / light)                                                                                    |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Chat** (`electron/chat.html`)                                             | OUI (local)                                                                                                                            | `--*` court (ex `--accent-primary`, `--bg-deepest`) — PAS `--oh-*`                                                                           | `--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 12px, `--radius-full` 9999px + hardcodés `2px`, `50%`               | `#14b8a6` / `#0d9488` (chat.html:33/86)                                  | `--font-sans` = `"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif` (chat.html:53)                                | `#0a0a0a` / `#ffffff` (`--bg-deepest`, chat.html:21/74)                                                |
| **Orchestrateur / Projects** (`electron/projects/projects.css`)             | OUI (local)                                                                                                                            | `--*` court (ex `--accent-primary`, `--bg-deepest`) — PAS `--oh-*`                                                                           | `--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 12px, `--radius-full` 9999px + hardcodés `50%`, `0`                 | `#14b8a6` / `#0d9488` (projects.css:22/79)                               | `--font-sans` = `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` (projects.css:50-52) | `#0a0a0a` / `#ffffff` (`--bg-deepest`, projects.css:10/67)                                             |
| **Sidebar** (`electron/sidebar.html`)                                       | OUI (canonique)                                                                                                                        | `--oh-*` préfixé (ex `--oh-color-accent-primary`) + utilitaires `--radius-*`/`--space-*`/`--shadow-*`/`--duration-*`/`--ease-*` non préfixés | `--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 12px, `--radius-full` 9999px + hardcodés `50%`, `2px`, `0`          | `#14b8a6` / `#0d9488` (`--oh-color-accent-primary`, sidebar.html:36/105) | `--font` = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif` (sidebar.html:61-62)                        | `#0a0a0a` / `#ffffff` (`--oh-color-bg-deepest`, sidebar.html:21/90)                                    |
| **Nav-popup** (`electron/nav-popup.html`)                                   | OUI (local court)                                                                                                                      | `--*` ultra-court non préfixé (`--bg`, `--border`, `--text`, `--accent`, `--active-bg`, `--hover-bg`) — PAS `--oh-*`                         | `--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 12px (utilisés) ; `--radius-full` 9999px DÉFINI mais jamais utilisé | `#14b8a6` / `#0d9488` (`--accent`, nav-popup.html:22/39)                 | `--font` = `-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif` (nav-popup.html:25) — SANS "SF Pro Display"                   | `#111111` / `#ffffff` (`--bg`, nav-popup.html:17/34) — fond dark `#111111` ≠ `#0a0a0a` des autres vues |
| **Global / overrides** (`electron/overrides/global/theme.css` + `theme.js`) | PARTIEL : seulement tokens d'animation `--oh-ease-*`, `--oh-duration-*`, `--oh-transition`. AUCUN token couleur/radius/espacement/typo | `--oh-*` (animation uniquement) ; tous inutilisés                                                                                            | hardcodé seulement : `3px` (scrollbar), `12px` (drag overlay). Aucun token radius                                       | accent 100% hardcodé : `#0D9488` (×3) et `#14B8A6` (×1) — deux nuances   | stack hardcodé : `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` (theme.css:39-45)   | `#0a0a0a` / `#ffffff` hardcodés (theme.css:52/37), texte `#ececec` / `#111111` (theme.css:53/38)       |

**Lecture transversale :** quatre systèmes de tokens distincts par NOMMAGE coexistent pour une palette de valeurs quasi identique (même accent teal `#14b8a6`/`#0d9488`, mêmes neutres, même échelle radius 4/8/12/9999). Seul `sidebar.html` porte le préfixe canonique `--oh-*` pour les couleurs ; Chat et Projects partagent un même schéma `--*` court (probablement copié-collé) ; Nav-popup a un troisième schéma ultra-court ; le Global n'a tokenisé que l'animation et hardcode tout le reste.

---

## Vue Chat (`electron/chat.html`)

Fichier source unique audité : `electron/chat.html` (7067 lignes, 257 K). Tout le CSS est dans un bloc `<style>` (lignes 11–2745). Le reste (lignes 2747–7063) est du HTML + JavaScript contenant de nombreux styles inline et des valeurs de couleurs/dimensions hardcodées dans des chaînes JS.

**Constat majeur :** cette vue définit ses PROPRES tokens CSS dans un `:root` local (préfixe `--*`, PAS `--oh-*`). Elle NE réutilise PAS le système `--oh-*` défini dans `electron/sidebar.html`. Les noms et la palette diffèrent (ex. ici `--accent-primary`, ailleurs `--oh-color-accent-primary`).

### Tokens / variables CSS définies ici (:root et équivalents)

Le `:root` est défini ligne 20. Le bloc `@media (prefers-color-scheme: dark)` redéfinit un sous-ensemble (lignes 72–108). Les valeurs « light » sont celles du `:root` par défaut (le défaut est le thème CLAIR ici).

#### Couleurs de fond

| Variable        | Valeur dark | Valeur light | Fichier:ligne      |
| --------------- | ----------- | ------------ | ------------------ |
| `--bg-deepest`  | `#0a0a0a`   | `#ffffff`    | chat.html:21 / :74 |
| `--bg-panel`    | `#141414`   | `#f7f7f7`    | chat.html:22 / :75 |
| `--bg-surface`  | `#1e1e1e`   | `#efefef`    | chat.html:23 / :76 |
| `--bg-elevated` | `#282828`   | `#ffffff`    | chat.html:24 / :77 |
| `--bg-overlay`  | `#111111`   | `#f2f2f2`    | chat.html:25 / :78 |

#### Bordures

| Variable           | Valeur dark | Valeur light | Fichier:ligne      |
| ------------------ | ----------- | ------------ | ------------------ |
| `--border-subtle`  | `#1f1f1f`   | `#e8e8e8`    | chat.html:26 / :79 |
| `--border-default` | `#2a2a2a`   | `#e0e0e0`    | chat.html:27 / :80 |
| `--border-strong`  | `#3a3a3a`   | `#cccccc`    | chat.html:28 / :81 |

#### Texte

| Variable           | Valeur dark | Valeur light | Fichier:ligne      |
| ------------------ | ----------- | ------------ | ------------------ |
| `--text-primary`   | `#ececec`   | `#111111`    | chat.html:29 / :82 |
| `--text-secondary` | `#999999`   | `#555555`    | chat.html:30 / :83 |
| `--text-muted`     | `#666666`   | `#888888`    | chat.html:31 / :84 |
| `--text-disabled`  | `#444444`   | `#bbbbbb`    | chat.html:32 / :85 |

#### Accent (teal/vert)

| Variable                | Valeur dark             | Valeur light            | Fichier:ligne      |
| ----------------------- | ----------------------- | ----------------------- | ------------------ |
| `--accent-primary`      | `#14b8a6`               | `#0d9488`               | chat.html:33 / :86 |
| `--accent-hover`        | `#2dd4bf`               | `#0f766e`               | chat.html:34 / :87 |
| `--accent-active`       | `#0d9488`               | `#115e59`               | chat.html:35 / :88 |
| `--accent-subtle`       | `rgba(20,184,166,0.1)`  | `rgba(13,148,136,0.06)` | chat.html:36 / :89 |
| `--accent-subtle-hover` | `rgba(20,184,166,0.16)` | `rgba(13,148,136,0.1)`  | chat.html:37 / :90 |

#### Sémantique (success / warning / error)

| Variable           | Valeur dark            | Valeur light           | Fichier:ligne      |
| ------------------ | ---------------------- | ---------------------- | ------------------ |
| `--success`        | `#22c55e`              | `#16a34a`              | chat.html:38 / :91 |
| `--success-subtle` | `rgba(34,197,94,0.1)`  | `rgba(22,163,74,0.08)` | chat.html:39 / :92 |
| `--warning`        | `#f59e0b`              | `#d97706`              | chat.html:40 / :93 |
| `--warning-subtle` | `rgba(245,158,11,0.1)` | `rgba(217,119,6,0.08)` | chat.html:41 / :94 |
| `--error`          | `#ef4444`              | `#dc2626`              | chat.html:42 / :95 |
| `--error-subtle`   | `rgba(239,68,68,0.1)`  | `rgba(220,38,38,0.08)` | chat.html:43 / :96 |

#### Ombres

| Variable          | Valeur dark                   | Valeur light                  | Fichier:ligne       |
| ----------------- | ----------------------------- | ----------------------------- | ------------------- |
| `--shadow-xs`     | `0 1px 2px rgba(0,0,0,0.2)`   | `0 1px 2px rgba(0,0,0,0.04)`  | chat.html:44 / :97  |
| `--shadow-sm`     | `0 2px 8px rgba(0,0,0,0.24)`  | `0 2px 8px rgba(0,0,0,0.06)`  | chat.html:45 / :98  |
| `--shadow-md`     | `0 4px 16px rgba(0,0,0,0.28)` | `0 4px 16px rgba(0,0,0,0.08)` | chat.html:46 / :99  |
| `--shadow-lg`     | `0 8px 32px rgba(0,0,0,0.4)`  | `0 8px 32px rgba(0,0,0,0.12)` | chat.html:47 / :100 |
| `--overlay-modal` | `rgba(0,0,0,0.4)`             | `rgba(0,0,0,0.1)`             | chat.html:48 / :101 |

#### Border-radius (tokens)

| Variable        | Valeur (identique dark/light) | Fichier:ligne |
| --------------- | ----------------------------- | ------------- |
| `--radius-sm`   | `4px`                         | chat.html:49  |
| `--radius-md`   | `8px`                         | chat.html:50  |
| `--radius-lg`   | `12px`                        | chat.html:51  |
| `--radius-full` | `9999px`                      | chat.html:52  |

#### Typographie (tokens)

| Variable         | Valeur                                                                       | Fichier:ligne |
| ---------------- | ---------------------------------------------------------------------------- | ------------- |
| `--font-sans`    | `"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif`    | chat.html:53  |
| `--font-display` | `"SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif` | chat.html:54  |
| `--font-mono`    | `"SF Mono", "Fira Code", ui-monospace, Menlo, monospace`                     | chat.html:55  |

#### Easing / Durations (tokens)

| Variable         | Valeur                           | Fichier:ligne |
| ---------------- | -------------------------------- | ------------- |
| `--ease-default` | `cubic-bezier(0.4,0,0.2,1)`      | chat.html:56  |
| `--ease-in`      | `cubic-bezier(0.4,0,1,1)`        | chat.html:57  |
| `--ease-out`     | `cubic-bezier(0,0,0.2,1)`        | chat.html:58  |
| `--ease-spring`  | `cubic-bezier(0.34,1.56,0.64,1)` | chat.html:59  |
| `--duration-75`  | `75ms`                           | chat.html:60  |
| `--duration-150` | `150ms`                          | chat.html:61  |
| `--duration-200` | `200ms`                          | chat.html:62  |
| `--duration-250` | `250ms`                          | chat.html:63  |
| `--duration-350` | `350ms`                          | chat.html:64  |

#### Overrides contextuels (mode recherche)

| Variable           | Valeur                 | Contexte                      | Fichier:ligne |
| ------------------ | ---------------------- | ----------------------------- | ------------- |
| `--accent-primary` | `#16a34a` (vert)       | `body.oh-search-mode` (light) | chat.html:68  |
| `--accent-subtle`  | `rgba(22,163,74,0.08)` | `body.oh-search-mode` (light) | chat.html:69  |
| `--accent-primary` | `#22c55e` (vert)       | `body.oh-search-mode` (dark)  | chat.html:105 |
| `--accent-subtle`  | `rgba(34,197,94,0.1)`  | `body.oh-search-mode` (dark)  | chat.html:106 |

#### Variables CSS locales (scoped, non `:root`)

| Variable               | Valeur                                                                   | Fichier:ligne                       |
| ---------------------- | ------------------------------------------------------------------------ | ----------------------------------- |
| `--conv-sidebar-width` | fallback `280px` (sur `.project-details-sidebar` et `.conv-sidebar`)     | chat.html:724, :893                 |
| `--conv-action-bg`     | `var(--bg-panel)` / `var(--bg-surface)` / `var(--bg-overlay)` selon état | chat.html:1007, :1011, :1015, :1019 |

#### Variables RÉFÉRENCÉES mais NON DÉFINIES dans ce fichier (bugs potentiels)

| Variable        | Usage                                  | Fichier:ligne  | Statut                     |
| --------------- | -------------------------------------- | -------------- | -------------------------- |
| `--text-base`   | `color` de `.more-dropdown-item`       | chat.html:1622 | NON DÉFINI dans ce fichier |
| `--text-strong` | `color` hover de `.more-dropdown-item` | chat.html:1631 | NON DÉFINI dans ce fichier |

### Couleurs réellement utilisées

#### Via variables CSS (échantillon représentatif, non exhaustif des centaines d'usages)

| Élément / propriété               | Valeur (var)      | Variable CSS source     | Fichier:ligne  |
| --------------------------------- | ----------------- | ----------------------- | -------------- |
| `html, body` background           | var               | `--bg-deepest`          | chat.html:128  |
| `html, body` color                | var               | `--text-primary`        | chat.html:127  |
| `.btn-send` background            | var               | `--accent-primary`      | chat.html:1689 |
| `.btn-send` color                 | `#fff` (hardcodé) | —                       | chat.html:1690 |
| `.btn-send:hover` background      | var               | `--accent-hover`        | chat.html:1706 |
| `.btn-send:active` background     | var               | `--accent-active`       | chat.html:1709 |
| `.msg-bubble` background          | var               | `--bg-surface`          | chat.html:1202 |
| `.msg-group--user .msg-bubble` bg | var               | `--accent-subtle-hover` | chat.html:1265 |
| `.msg-avatar--user` color         | var               | `--accent-primary`      | chat.html:1182 |
| `.input-bar` background           | var               | `--bg-surface`          | chat.html:1554 |
| `.oh-btn-primary` background      | var               | `--accent-primary`      | chat.html:1926 |
| `.oh-btn-primary` color           | `#fff` (hardcodé) | —                       | chat.html:1927 |
| `.hub-btn-danger:hover` color     | `#fff` (hardcodé) | —                       | chat.html:651  |
| `.oh-toast` color                 | `#fff` (hardcodé) | —                       | chat.html:690  |
| `.oh-toast` background            | var               | `--text-primary`        | chat.html:691  |

#### Couleurs HARDCODÉES (hors tokens) — liste des valeurs distinctes

| Élément / propriété                      | Valeur hardcodée                                                            | Fichier:ligne                                                       | Occurrences / notes                                                  |
| ---------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `::selection` background                 | `rgba(13,148,136,0.15)`                                                     | chat.html:132                                                       | teal light, dupliqué le token mais en dur                            |
| `::selection` background (dark)          | `rgba(20,184,166,0.25)`                                                     | chat.html:136                                                       | teal dark en dur                                                     |
| `::-webkit-scrollbar-thumb` bg           | `rgba(0,0,0,0.1)`                                                           | chat.html:151                                                       | light                                                                |
| `::-webkit-scrollbar-thumb:hover`        | `rgba(0,0,0,0.16)`                                                          | chat.html:155                                                       | light                                                                |
| `::-webkit-scrollbar-thumb` (dark)       | `rgba(255,255,255,0.08)`                                                    | chat.html:159                                                       | dark                                                                 |
| `::-webkit-scrollbar-thumb:hover` (dark) | `rgba(255,255,255,0.14)`                                                    | chat.html:162                                                       | dark                                                                 |
| `#fff` (blanc pur)                       | `#fff` / `white` / `#ffffff`                                                | chat.html:322, :651, :690, :1690, :1927, :1816, :5648, :5746, :5774 | bouton/texte sur fonds colorés + previews PDF                        |
| `.attach-remove` background              | `rgba(0,0,0,0.55)`                                                          | chat.html:1815                                                      | overlay sombre                                                       |
| `.attach-remove` color                   | `#fff`                                                                      | chat.html:1816                                                      | —                                                                    |
| `.oh-catalog-checkmark:after` border     | `solid #fff`                                                                | chat.html:2322                                                      | coche blanche                                                        |
| skeleton fallback bg                     | `#1c1c1e` / `#252528`                                                       | chat.html:2377, :2378                                               | fallbacks `var(--bg-elevated,#1c1c1e)` etc. (valeurs SOMBRES en dur) |
| `PROJ_COLORS` (JS)                       | `#0d9488` ×6, `#d97706`, `#dc2626`                                          | chat.html:3312–3321                                                 | palette swatches projet, teal/orange/rouge en dur                    |
| thinking spinner stroke                  | `var(--accent-primary,#14B8A6)`                                             | chat.html:5470                                                      | fallback teal en dur (×2)                                            |
| iframe preview HTML bg                   | `#fff`                                                                      | chat.html:5648                                                      | aperçu artifact HTML                                                 |
| PDF wrapper bg                           | `#fff`                                                                      | chat.html:5746                                                      | export SVG → PDF                                                     |
| PDF doc styles                           | `#1a1a1a`, `#111`, `#f5f5f5`, `#ddd`, `#f0f0f0`                             | chat.html:5774                                                      | feuille de style générée pour PDF (hors thème)                       |
| `HUB_TYPE_COLORS` (JS)                   | `#85B7EB`, `#639922`, `#D4537E`, `#D85A30`, `#1D9E75`, `#BA7517`, `#7F77DD` | chat.html:6119–6127                                                 | couleurs par type de projet, hardcodées                              |
| `HUB_FILTER_TYPES` dots (JS)             | `#85B7EB`, `#5DCAA5`, `#97C459`, `#ED93B1`, `#F0997B`, `#AFA9EC`, `#FAC775` | chat.html:6139–6145                                                 | pastilles de filtre, hardcodées                                      |

### Border-radius réellement utilisés

#### Via tokens

| Élément                                                      | Valeur                                  | Fichier:ligne                       |
| ------------------------------------------------------------ | --------------------------------------- | ----------------------------------- |
| `:focus-visible`                                             | `var(--radius-sm)` (4px)                | chat.html:142                       |
| `.projects-hub-search`                                       | `var(--radius-full)` (9999px)           | chat.html:230                       |
| `.hub-search-kbd`                                            | `var(--radius-sm)`                      | chat.html:263                       |
| `.projects-hub-sort` / `.projects-hub-btn-new` / `.hub-chip` | `var(--radius-full)`                    | chat.html:271, :285, :309           |
| `.p-card`                                                    | `var(--radius-lg)` (12px)               | chat.html:373                       |
| `.p-card-icon`                                               | `var(--radius-md)` (8px)                | chat.html:413                       |
| `.p-card-menu`                                               | `var(--radius-sm)`                      | chat.html:432                       |
| `.hub-ctx-menu` / `.hub-ctx-submenu`                         | `var(--radius-md)`                      | chat.html:479, :513                 |
| `.hub-btn-ghost` / `.hub-btn-danger`                         | `var(--radius-full)`                    | chat.html:629, :641                 |
| `.p-card-checkbox`                                           | `var(--radius-sm)`                      | chat.html:658                       |
| `.oh-toast`                                                  | `var(--radius-full)`                    | chat.html:687                       |
| `.instructions-textarea`                                     | `var(--radius-lg)`                      | chat.html:793                       |
| `.file-item`                                                 | `var(--radius-lg)`                      | chat.html:820                       |
| `.btn-back`                                                  | `var(--radius-md)`                      | chat.html:830                       |
| `.conv-nav-item`                                             | `var(--radius-lg)`                      | chat.html:918                       |
| `.btn-icon`                                                  | `var(--radius-md)`                      | chat.html:951                       |
| `.conv-search`                                               | `var(--radius-lg)`                      | chat.html:972                       |
| `.conv-item` / `.conv-actions`                               | `var(--radius-lg)`                      | chat.html:1004, :1047               |
| `.btn-sidebar-toggle`                                        | `var(--radius-md)`                      | chat.html:1124                      |
| `.msg-bubble`                                                | `var(--radius-lg)`                      | chat.html:1198                      |
| `.msg-bubble code`                                           | `var(--radius-sm)`                      | chat.html:1218                      |
| `.msg-bubble pre`                                            | `var(--radius-lg)`                      | chat.html:1224                      |
| `.code-header`                                               | `var(--radius-lg) var(--radius-lg) 0 0` | chat.html:1303                      |
| `.btn-copy` / `.btn-copy-msg`                                | `var(--radius-sm)`                      | chat.html:1322, :1335               |
| `.artifact-card`                                             | `var(--radius-lg)`                      | chat.html:1366                      |
| `.artifact-label`                                            | `var(--radius-sm)`                      | chat.html:1385                      |
| `.btn-stop`                                                  | `var(--radius-md)`                      | chat.html:1467                      |
| `.empty-state-icon`                                          | `var(--radius-lg)`                      | chat.html:1500                      |
| `.input-bar`                                                 | `var(--radius-full)`                    | chat.html:1556                      |
| `.btn-input-more`                                            | `var(--radius-md)`                      | chat.html:1584                      |
| `.more-dropdown`                                             | `var(--radius-lg)`                      | chat.html:1604                      |
| `.more-dropdown-item`                                        | `var(--radius-md)`                      | chat.html:1619                      |
| `.input-bar-actions .btn-icon`                               | `var(--radius-md)`                      | chat.html:1656                      |
| `.btn-send`                                                  | `var(--radius-full)`                    | chat.html:1687                      |
| `.input-context-pill`                                        | `var(--radius-full)`                    | chat.html:1731                      |
| `.attach-item`                                               | `var(--radius-sm)`                      | chat.html:1772                      |
| `.modal`                                                     | `var(--radius-lg)`                      | chat.html:1847                      |
| `.modal-item`                                                | `var(--radius-lg)`                      | chat.html:1886                      |
| `.oh-btn`                                                    | `var(--radius-sm)`                      | chat.html:1915                      |
| `.dropdown`                                                  | `var(--radius-lg)`                      | chat.html:1957                      |
| `.dropdown-item`                                             | `var(--radius-md)`                      | chat.html:1973                      |
| `.search-widget-container`                                   | `var(--radius-lg)`                      | chat.html:2021                      |
| `.search-result-item`                                        | `var(--radius-sm)`                      | chat.html:2098                      |
| `.msg-images img` / `.msg-file-chip`                         | `var(--radius-sm)`                      | chat.html:2150, :2164               |
| `.modal-catalog-search input`                                | `var(--radius-sm)`                      | chat.html:2197                      |
| `.oh-catalog-source-badge` (inline JS)                       | `var(--radius-sm)`                      | chat.html:4139, :4141, :4143, :4145 |
| badges dropdown modèle (inline JS)                           | `var(--radius-sm)`                      | chat.html:4492, :4495, :4498, :4501 |
| `.oh-catalog-checkmark`                                      | `var(--radius-sm)`                      | chat.html:2302                      |
| `.oh-skeleton` / `.oh-skel-box` / `.oh-skel-badge`           | `var(--radius-sm)`                      | chat.html:2382, :2388, :2389        |
| `.oh-modal-field input/textarea`                             | `var(--radius-sm)`                      | chat.html:2427, :2445               |
| `.oh-modal-x` / `.oh-modal-field` (focus)                    | `var(--radius-sm)`                      | chat.html:2483                      |
| `.modal-item` (instructions btn inline)                      | `var(--radius-lg)`                      | chat.html:3157                      |

#### Valeurs HARDCODÉES (hors tokens) — distinctes

| Élément                                   | Valeur                         | Fichier:ligne  | Note                                       |
| ----------------------------------------- | ------------------------------ | -------------- | ------------------------------------------ |
| `.hub-chip-dot`                           | `50%`                          | chat.html:320  | cercle (token `--radius-full` non utilisé) |
| `.p-card-icon` (alt usages cercle)        | —                              | —              | —                                          |
| `.conv-resize-handle::after`              | `2px`                          | chat.html:877  | en dur, pas de token 2px                   |
| `.msg-avatar`                             | `50%`                          | chat.html:1170 | cercle                                     |
| `.msg-bubble--streaming::after` (curseur) | `2px`                          | chat.html:1424 | en dur                                     |
| `.attach-remove`                          | `50%`                          | chat.html:1813 | cercle                                     |
| `.oh-color-swatch`                        | `50%`                          | chat.html:2467 | cercle                                     |
| `.oh-catalog-checkmark:after`             | `45deg` rotate (pas un radius) | chat.html:2324 | —                                          |
| `.status-dot`                             | `50%`                          | chat.html:2180 | cercle                                     |
| `.oh-color-swatch` (selected)             | `50%`                          | chat.html:2467 | —                                          |
| iframe preview style (inline JS)          | `border:none`                  | chat.html:5648 | —                                          |

**Échelle de radius observée (toutes valeurs distinctes) :** `4px` (`--radius-sm`), `8px` (`--radius-md`), `12px` (`--radius-lg`), `9999px` (`--radius-full`), plus hardcodés `2px` (curseur/handle), `50%` (cercles avatars/dots/swatches), `45deg` (coche, non-radius).

### Typographie

#### Réglages globaux et tailles distinctes

| Élément                          | Font               | Size    | Weight               | Line-height       | Fichier:ligne                   |
| -------------------------------- | ------------------ | ------- | -------------------- | ----------------- | ------------------------------- |
| `html, body`                     | `var(--font-sans)` | `14px`  | (défaut)             | `1.5`             | chat.html:124–126               |
| `.projects-hub-heading`          | hérité             | `20px`  | `500`                | —                 | chat.html:199–200               |
| `.projects-hub-search` / input   | hérité             | `13px`  | —                    | —                 | chat.html:231, :252             |
| `.hub-search-kbd`                | `var(--font-sans)` | `10px`  | —                    | `1.4`             | chat.html:260, :265–266         |
| `.projects-hub-sort`             | hérité             | `12px`  | —                    | —                 | chat.html:269                   |
| `.projects-hub-btn-new`          | hérité             | `13px`  | `500`                | —                 | chat.html:290–291               |
| `.hub-chip`                      | hérité             | `12px`  | (active `500`)       | —                 | chat.html:310, :319             |
| `.hub-section-label`             | —                  | `12px`  | `500`                | —                 | chat.html:333–334               |
| `.hub-section-count`             | —                  | `11px`  | —                    | —                 | chat.html:340                   |
| `.p-card-name`                   | —                  | `13px`  | `500`                | `1.35`            | chat.html:447–450               |
| `.p-card-type`                   | —                  | `11px`  | `500`                | —                 | chat.html:462                   |
| `.p-card-date` / `.p-card-chats` | —                  | `11px`  | —                    | —                 | chat.html:463, :465             |
| `.hub-ctx-item`                  | hérité             | `13px`  | —                    | —                 | chat.html:489                   |
| `.project-section-title`         | —                  | `11px`  | `600`                | —                 | chat.html:755–756               |
| `.project-section-desc`          | —                  | `13px`  | —                    | `1.5`             | chat.html:763–764               |
| `.instructions-textarea`         | `inherit`          | `14px`  | —                    | `1.55`            | chat.html:796–798               |
| `.file-item`                     | —                  | `13px`  | —                    | —                 | chat.html:821                   |
| `.conv-nav-item`                 | —                  | `14px`  | `500`                | —                 | chat.html:919–920               |
| `.conv-sidebar-title`            | —                  | `13px`  | `600`                | —                 | chat.html:942–943               |
| `.conv-search` / input           | `inherit`          | `13px`  | —                    | —                 | chat.html:973, :987             |
| `.conv-item-title`               | —                  | `14px`  | `500` (active `600`) | —                 | chat.html:1028–1029, :1022      |
| `.chat-header-title`             | —                  | `15px`  | `600`                | —                 | chat.html:1113–1114             |
| `.msg-avatar`                    | —                  | `13px`  | `600`                | —                 | chat.html:1175–1176             |
| `.msg-role-name`                 | —                  | `13px`  | `600`                | —                 | chat.html:1185–1186             |
| `.msg-bubble`                    | —                  | `14px`  | —                    | `1.55`            | chat.html:1199–1200             |
| `.msg-bubble code`               | `var(--font-mono)` | `0.9em` | —                    | —                 | chat.html:1214–1215             |
| `.msg-bubble pre`                | `var(--font-mono)` | `13px`  | —                    | `1.6`             | chat.html:1226–1228             |
| `.timestamp-sep`                 | —                  | `11px`  | `500`                | —                 | chat.html:1282–1283             |
| `.code-header`                   | —                  | `11px`  | `500`                | —                 | chat.html:1304, :1306           |
| `.btn-copy`                      | `inherit`          | `11px`  | —                    | —                 | chat.html:1319, :1321           |
| `.artifact-label`                | —                  | `11px`  | `600`                | —                 | chat.html:1380–1381             |
| `.btn-stop`                      | `inherit`          | `13px`  | `500`                | —                 | chat.html:1471–1473             |
| `.empty-state-title`             | —                  | `17px`  | `600`                | —                 | chat.html:1513–1514             |
| `.empty-state-desc`              | —                  | `14px`  | —                    | `1.55`            | chat.html:1518, :1521           |
| `.input-bar textarea`            | `var(--font-sans)` | `14px`  | —                    | `1.5`             | chat.html:1671–1673             |
| `.more-dropdown-item`            | `inherit`          | `13px`  | —                    | `1.3`             | chat.html:1623–1625             |
| `.input-context-pill`            | `inherit`          | `13px`  | `500`                | —                 | chat.html:1732–1733             |
| `.attach-file-name`              | —                  | `12px`  | —                    | —                 | chat.html:1797                  |
| `.attach-file-size`              | —                  | `10px`  | —                    | —                 | chat.html:1803                  |
| `.modal-header h3`               | —                  | `15px`  | `600`                | —                 | chat.html:1863–1864             |
| `.modal-group-label`             | —                  | `11px`  | `600`                | —                 | chat.html:1874–1875             |
| `.modal-item-name`               | —                  | `14px`  | `500`                | —                 | chat.html:1896–1897             |
| `.modal-item-desc`               | —                  | `12px`  | —                    | —                 | chat.html:1901–1902             |
| `.oh-btn`                        | `var(--font-sans)` | `12px`  | `500`                | —                 | chat.html:1916–1918             |
| `.dropdown-item`                 | `inherit`          | `13px`  | —                    | —                 | chat.html:1976, :1979           |
| `.drop-overlay`                  | —                  | `15px`  | `500`                | —                 | chat.html:2000–2001             |
| `.search-widget-title-area`      | —                  | `13px`  | `500`                | —                 | chat.html:2039–2040             |
| `.search-widget-status`          | —                  | `11px`  | —                    | —                 | chat.html:2063                  |
| `.search-result-title`           | —                  | `13px`  | `600`                | —                 | chat.html:2115–2116             |
| `.search-result-url`             | —                  | `11px`  | —                    | —                 | chat.html:2128                  |
| `.search-result-snippet`         | —                  | `12px`  | —                    | `1.5`             | chat.html:2135–2136             |
| `.msg-file-chip`                 | —                  | `12px`  | —                    | —                 | chat.html:2166                  |
| `.oh-catalog-provider-header`    | —                  | `11px`  | `700`                | —                 | chat.html:2233–2234             |
| `.oh-catalog-item-name`          | —                  | `13px`  | `500`                | —                 | chat.html:2258–2259             |
| `.oh-catalog-item-id`            | `var(--font-mono)` | `11px`  | —                    | —                 | chat.html:2267–2268             |
| `.oh-modal-field label`          | —                  | `11px`  | `600`                | —                 | chat.html:2409–2410             |
| `.oh-field-help`                 | —                  | `12px`  | —                    | —                 | chat.html:2418                  |
| `.oh-modal-field input/textarea` | `inherit`          | `13px`  | —                    | (textarea `1.55`) | chat.html:2430–2431, :2449–2450 |
| `.oh-modal-hdr h2`               | —                  | `15px`  | `600`                | —                 | chat.html:2503–2504             |

#### Tailles de police présentes UNIQUEMENT dans les styles inline JS (valeurs « cassées »)

| Élément (inline)              | Size                                      | Fichier:ligne         |
| ----------------------------- | ----------------------------------------- | --------------------- |
| reasoning dropdown item titre | `12.5px`                                  | chat.html:4451, :4615 |
| reasoning dropdown item desc  | `10px`                                    | chat.html:4454, :4618 |
| badges modèle/source dropdown | `9.5px`                                   | chat.html:4492–4501   |
| badges catalogue source       | `10px`                                    | chat.html:4139–4145   |
| skill content monospace       | `11px` (font `monospace`)                 | chat.html:4862        |
| skill editor textarea         | `12px` (font `monospace`)                 | chat.html:4926        |
| CSV preview header            | `11px`                                    | chat.html:5661        |
| CSV preview body              | `12px` (font `var(--font-mono)`)          | chat.html:5658        |
| markdown artifact preview     | `14px` / line-height `1.65`               | chat.html:5679        |
| text artifact preview         | `13px` (font `var(--font-mono)`) / `1.55` | chat.html:5684        |

**Familles de polices distinctes :** `var(--font-sans)` (= SF Pro Text, principale), `var(--font-mono)` (= SF Mono / code), et la chaîne hardcodée `monospace` (chat.html:4862, :4926) qui contourne le token mono. `var(--font-display)` est DÉFINI (chat.html:54) mais JAMAIS utilisé dans cette vue.

**Tailles distinctes (px) :** 9.5, 10, 11, 12, 12.5, 13, 14, 15, 17, 20 + relatives `0.9em`. **Poids distincts :** 500, 600, 700 (+ défaut/normal). **Line-heights distincts :** 1.3, 1.35, 1.4, 1.5, 1.55, 1.6, 1.65.

### Espacements (padding / margin / gap)

Liste des valeurs distinctes par propriété (échantillon de localisation ; valeurs très répétées).

#### Padding (valeurs distinctes observées)

| Élément (exemple)                          | Valeur           | Fichier:ligne        |
| ------------------------------------------ | ---------------- | -------------------- |
| `.projects-hub-toprow`                     | `20px 24px 12px` | chat.html:195        |
| `.project-details-header` / `.chat-header` | `10px 16px`      | chat.html:205, :1095 |
| `.projects-hub-search`                     | `7px 12px`       | chat.html:227        |
| `.projects-hub-sort`                       | `6px 10px`       | chat.html:270        |
| `.projects-hub-btn-new`                    | `7px 14px`       | chat.html:284        |
| `.projects-hub-filters`                    | `0 24px 12px`    | chat.html:300        |
| `.hub-chip`                                | `5px 12px`       | chat.html:308        |
| `.projects-hub-scroll`                     | `0 24px 24px`    | chat.html:324        |
| `.p-card`                                  | `14px`           | chat.html:372        |
| `.hub-ctx-item`                            | `7px 12px`       | chat.html:488        |
| `.hub-ctx-menu`                            | `4px`            | chat.html:480        |
| `.project-details-main-inner`              | `40px 32px`      | chat.html:744        |
| `.instructions-textarea`                   | `16px`           | chat.html:794        |
| `.file-item`                               | `10px 14px`      | chat.html:818        |
| `.btn-back`                                | `8px`            | chat.html:828        |
| `.conv-sidebar-nav`                        | `16px 16px 0`    | chat.html:907        |
| `.conv-nav-item`                           | `10px 12px`      | chat.html:914        |
| `.conv-sidebar-header`                     | `20px 20px 12px` | chat.html:936        |
| `.conv-search`                             | `8px 12px`       | chat.html:969        |
| `.conv-item`                               | `10px 12px`      | chat.html:1003       |
| `.messages-area`                           | `32px 0`         | chat.html:1148       |
| `.messages-inner`                          | `0 32px`         | chat.html:1153       |
| `.msg-bubble`                              | `12px 16px`      | chat.html:1197       |
| `.msg-bubble code`                         | `1px 5px`        | chat.html:1217       |
| `.msg-bubble pre code`                     | `12px 16px`      | chat.html:1233       |
| `.code-header`                             | `4px 12px`       | chat.html:1300       |
| `.btn-copy`                                | `3px 8px`        | chat.html:1321       |
| `.artifact-header`                         | `8px 16px`       | chat.html:1375       |
| `.artifact-label`                          | `1px 8px`        | chat.html:1384       |
| `.artifact-body`                           | `16px`           | chat.html:1412       |
| `.btn-stop`                                | `6px 16px`       | chat.html:1466       |
| `.empty-state`                             | `48px`           | chat.html:1494       |
| `.input-area`                              | `12px 24px 32px` | chat.html:1527       |
| `.input-bar`                               | `8px 16px`       | chat.html:1557       |
| `.more-dropdown`                           | `6px`            | chat.html:1606       |
| `.more-dropdown-item`                      | `10px 12px`      | chat.html:1618       |
| `.input-bar textarea`                      | `6px 4px`        | chat.html:1676       |
| `.oh-btn`                                  | `7px 16px`       | chat.html:1913       |
| `.input-context-pill`                      | `6px 12px`       | chat.html:1730       |
| `.attach-item.is-file`                     | `8px 12px`       | chat.html:1791       |
| `.modal-header`                            | `16px 20px`      | chat.html:1859       |
| `.modal-body`                              | `20px`           | chat.html:1868       |
| `.modal-item`                              | `12px 16px`      | chat.html:1885       |
| `.modal-footer`                            | `14px 16px`      | chat.html:1908       |
| `.dropdown`                                | `4px`            | chat.html:1959       |
| `.dropdown-item`                           | `8px 12px`       | chat.html:1971       |
| `.search-widget`                           | `0 16px`         | chat.html:2013       |
| `.search-widget-header`                    | `10px 14px`      | chat.html:2031       |
| `.oh-catalog-item`                         | `8px 20px`       | chat.html:2246       |
| `.oh-modal-field`                          | `14px 20px 0`    | chat.html:2398       |
| `.oh-modal-hdr`                            | `18px 20px 14px` | chat.html:2497       |
| `.oh-modal-ftr`                            | `14px 20px`      | chat.html:2511       |

**Valeurs de padding distinctes (axes) :** 0,1,2,3,4,5,6,7,8,10,12,14,16,18,20,24,32,40,48 px.

#### Margin (valeurs distinctes)

| Élément                      | Valeur                     | Fichier:ligne                |
| ---------------------------- | -------------------------- | ---------------------------- |
| `.project-detail-danger`     | `margin-top:40px`          | chat.html:705                |
| `.hub-gen-separator`         | `margin-top:20px`          | chat.html:545                |
| `.msg-group`                 | `margin-bottom:24px`       | chat.html:1158               |
| `.msg-group-header`          | `margin-bottom:8px`        | chat.html:1165               |
| `.msg-bubble p`              | `margin-bottom:8px`        | chat.html:1208               |
| `.msg-bubble pre`            | `margin:8px 0`             | chat.html:1221               |
| `.msg-bubble hr`             | `margin:16px 0`            | chat.html:1248               |
| `.msg-bubble blockquote`     | `margin:8px 0`             | chat.html:1253               |
| `.timestamp-sep`             | `margin:24px 0`            | chat.html:1280               |
| `.input-bar`                 | `margin:0 auto`            | chat.html:1553               |
| `.more-dropdown-divider`     | `margin:6px 8px`           | chat.html:1642               |
| `.attachments-preview`       | `margin:0 auto 8px`        | chat.html:1765               |
| `.search-widget`             | `margin:12px auto`         | chat.html:2013               |
| `.oh-catalog-provider-group` | `margin-bottom:20px`       | chat.html:2229               |
| séparateurs inline JS        | `margin:4px 8px` / `8px 0` | chat.html:4543, :4572, :2105 |
| sections hub (inline JS)     | `margin-bottom:20px`       | chat.html:6561, :6611        |

#### Gap (valeurs distinctes)

| Valeur | Exemples d'éléments                                                           | Fichier:ligne               |
| ------ | ----------------------------------------------------------------------------- | --------------------------- |
| `2px`  | `.conv-list`, `.projects-list`, dropdown reasoning                            | chat.html:1000, :571, :4448 |
| `4px`  | `.p-card-body`, `.conv-sidebar-nav`, `.artifact-actions`                      | chat.html:444, :906, :1409  |
| `5px`  | `.hub-chip`                                                                   | chat.html:307               |
| `6px`  | `.input-bar-actions`, `.hub-section-header`, `.dropdown-item`                 | chat.html:1649, :329, :1969 |
| `8px`  | `.projects-hub-actions`, `.msg-avatar header`, `.modal-body`                  | chat.html:221, :1164, :1871 |
| `10px` | `.conv-nav-item`, `.more-dropdown-item`, `.search-widget-title-area`          | chat.html:913, :1616, :2038 |
| `12px` | `.project-section`, `.project-details-main inner blocks`, `.msg-group-header` | chat.html:752, :1164        |
| `16px` | `.empty-state`, `.modal-body`                                                 | chat.html:1495, :1871       |
| `40px` | `.project-details-main-inner`, `.project-context-grid`                        | chat.html:747, :781         |

### Ombres, transitions, z-index

#### Ombres (box-shadow)

| Élément                              | Valeur                                  | Fichier:ligne         |
| ------------------------------------ | --------------------------------------- | --------------------- |
| `.projects-hub-search:focus-within`  | `0 0 0 3px var(--accent-subtle)` (ring) | chat.html:239         |
| `.hub-ctx-menu` / `.hub-ctx-submenu` | `var(--shadow-md)`                      | chat.html:482, :516   |
| `.instructions-textarea:focus`       | `0 0 0 3px var(--accent-subtle)`        | chat.html:806         |
| `@media 700px .conv-sidebar`         | `var(--shadow-md)`                      | chat.html:2533        |
| `.artifact-card`                     | `var(--shadow-sm)`                      | chat.html:1369        |
| `.btn-stop`                          | `var(--shadow-xs)`                      | chat.html:1475        |
| `body.oh-is-new-conv .input-bar`     | `var(--shadow-lg)`                      | chat.html:1548        |
| `.input-bar:focus-within`            | `0 0 0 3px var(--accent-subtle)`        | chat.html:1561        |
| `.more-dropdown`                     | `var(--shadow-lg)`                      | chat.html:1605        |
| `.modal`                             | `var(--shadow-lg)`                      | chat.html:1848        |
| `.dropdown`                          | `var(--shadow-md)`                      | chat.html:1958        |
| `.oh-toast`                          | `var(--shadow-md)`                      | chat.html:692         |
| `.oh-color-swatch.oh-selected`       | `0 0 0 2px var(--bg-panel)`             | chat.html:2474        |
| `.modal-catalog input focus`         | `0 0 0 3px var(--accent-subtle)`        | chat.html:2437, :2457 |

**Anneaux de focus distincts :** `0 0 0 3px var(--accent-subtle)` (récurrent), `0 0 0 2px var(--bg-panel)` (swatch sélectionné). Tokens d'ombre utilisés : `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`.

#### Transitions

| Élément                                                | Propriété/valeur                                                          | Fichier:ligne             |
| ------------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------- |
| `.projects-hub-search`                                 | `border-color`/`box-shadow var(--duration-150) var(--ease-default)`       | chat.html:234–235         |
| `.projects-hub-sort` / `.hub-chip`                     | `border-color`/`all var(--duration-150) var(--ease-default)`              | chat.html:277, :316       |
| `.p-card`                                              | `background`/`border-color var(--duration-150) var(--ease-default)`       | chat.html:376             |
| `.p-card-menu`                                         | `opacity var(--duration-150) var(--ease-default)`                         | chat.html:435             |
| `.hub-folder-actions`                                  | `opacity 0.15s` (hardcodé, pas de token)                                  | chat.html:526             |
| `.hub-section-chevron`                                 | `transform var(--duration-150) var(--ease-default)`                       | chat.html:361             |
| `.hub-view-btn` / `.hub-btn-ghost` / `.hub-btn-danger` | `all var(--duration-150) var(--ease-default)`                             | chat.html:561, :636, :649 |
| `.p-card-checkbox`                                     | `all var(--duration-150) var(--ease-default)`                             | chat.html:664             |
| `.instructions-textarea`                               | `border-color`/`box-shadow var(--duration-150) var(--ease-default)`       | chat.html:801–802         |
| `.btn-send`                                            | `background var(--duration-150)` + `transform var(--duration-75)`         | chat.html:1696–1698       |
| `.oh-btn`                                              | `background`/`color var(--duration-150)` + `transform var(--duration-75)` | chat.html:1920–1923       |

**Easings utilisés :** `--ease-default` (omniprésent), `--ease-out` (animations entrée), `--ease-in` (toast sortie). `--ease-spring` est DÉFINI (chat.html:59) mais JAMAIS utilisé. **Durées utilisées :** `--duration-75`, `--duration-150`, `--duration-200`, `--duration-250` + hardcodés `0.15s` (chat.html:526), `200ms`/`300ms` (animations msg-in, chat.html:1775, :2016). `--duration-350` DÉFINI mais JAMAIS utilisé.

#### Animations (@keyframes)

| Nom                        | Usage                    | Fichier:ligne     |
| -------------------------- | ------------------------ | ----------------- |
| `ohToastIn` / `ohToastOut` | toast                    | chat.html:700–701 |
| `blink`                    | curseur streaming        | chat.html:1427    |
| `thinking-fade`            | label réflexion          | chat.html:1450    |
| `fadeIn`                   | modals/dropdowns/layouts | chat.html:2331    |
| `msg-in`                   | bulles/widgets           | chat.html:2339    |
| `spin`                     | loaders                  | chat.html:2347    |
| `oh-shimmer`               | skeleton                 | chat.html:2369    |

#### z-index (valeurs distinctes)

| Élément                      | Valeur  | Fichier:ligne  |
| ---------------------------- | ------- | -------------- |
| `.conv-actions`              | `5`     | chat.html:1049 |
| `.conv-resize-handle`        | `10`    | chat.html:867  |
| `@media 700px .conv-sidebar` | `50`    | chat.html:2532 |
| `.hub-ctx-menu`              | `100`   | chat.html:476  |
| `.drop-overlay`              | `100`   | chat.html:1999 |
| `.more-dropdown`             | `100`   | chat.html:1608 |
| `.hub-ctx-submenu`           | `101`   | chat.html:517  |
| `.dropdown`                  | `500`   | chat.html:1963 |
| `.modal-overlay`             | `1000`  | chat.html:1837 |
| `convDropdown` (inline JS)   | `1000`  | chat.html:3559 |
| `.oh-toast-wrap`             | `10000` | chat.html:679  |

### Incohérences internes détectées (Chat)

1. **Système de tokens non aligné avec `--oh-*` (incohérence inter-vues majeure).** Cette vue définit son propre `:root` avec le préfixe `--*` (chat.html:20–65) au lieu de réutiliser `--oh-*`. Les noms ne correspondent pas (`--accent-primary` vs `--oh-color-accent-primary`). Conséquence : deux sources de vérité pour la même charte. La valeur accent dark `#14b8a6` (chat.html:86) coïncide avec `--oh-color-accent-primary` cité dans le brief, mais le canal light est `#0d9488` ici, ce qui doit être vérifié contre la valeur light de `--oh-*`.

2. **Variables référencées mais non définies → texte invisible/mal coloré.** `.more-dropdown-item` utilise `color: var(--text-base)` (chat.html:1622) et `:hover` `var(--text-strong)` (chat.html:1631). Ces deux variables n'existent NULLE PART dans le fichier (les tokens sont `--text-primary/secondary/muted/disabled`). Le menu « + » repose donc sur la valeur héritée par accident. Bug de cohérence confirmé.

3. **Trois palettes de couleurs de « type » concurrentes et incohérentes pour le MÊME concept.** Les couleurs par type de projet existent en triple, avec des hex DIFFÉRENTS :
   - `HUB_TYPE_COLORS` (chat.html:6119–6127) : ex. orchestrator `#1D9E75`, code `#639922`, design `#D4537E`.
   - `HUB_FILTER_TYPES` dots (chat.html:6139–6145) : ex. orchestrator `#5DCAA5`, code `#97C459`, design `#ED93B1`.
     Les pastilles de filtre et les couleurs de carte d'un même type ne correspondent donc pas (orchestrator vert foncé `#1D9E75` sur la carte mais vert clair `#5DCAA5` sur le filtre). Aucune de ces couleurs n'utilise les tokens.

4. **`PROJ_COLORS` quasi mono-couleur et redondant.** Le tableau de swatches (chat.html:3312–3321) contient 6 fois `#0d9488` + `#d97706` + `#dc2626`. Choisir une « couleur » revient donc presque toujours au même teal. Valeurs hardcodées dupliquant des tokens (`--accent-active` light = `#0d9488`).

5. **Tokens définis mais jamais utilisés (dead tokens).** `--font-display` (chat.html:54), `--ease-spring` (chat.html:59), `--duration-350` (chat.html:64), `--border-strong` (chat.html:28/81 — non retrouvé en usage). Ils gonflent la charte sans effet.

6. **Couleurs `::selection` et scrollbar hardcodées en doublon des tokens.** `rgba(13,148,136,0.15)` / `rgba(20,184,166,0.25)` (chat.html:132, :136) répliquent l'accent en dur au lieu d'utiliser `--accent-subtle`. Idem fallbacks skeleton sombres en dur `#1c1c1e`/`#252528` (chat.html:2377–2378) qui cassent le thème clair.

7. **`#fff` hardcodé pour le texte sur accent (≥ 9 occurrences).** Pas de token `--on-accent` / `--text-on-accent` : `#fff` est répété (chat.html:651, 690, 1690, 1816, 1927, 2322, etc.). Si l'accent change, le contraste n'est pas garanti.

8. **Transition/durée hardcodée hors échelle.** `.hub-folder-actions { transition: opacity 0.15s }` (chat.html:526) au lieu de `var(--duration-150)`. Les animations `msg-in` sont déclenchées à `200ms`/`300ms` en dur (chat.html:1775, :2016) alors que `--duration-200`/`--duration-250` existent.

9. **Tailles de police « non rondes » uniquement en inline JS.** `12.5px` (chat.html:4451, :4615) et `9.5px` (chat.html:4492–4501) n'apparaissent que dans le JS, jamais dans le CSS : échelle typo fragmentée et non systématisée.

10. **`font-family: monospace` en dur** (chat.html:4862, :4926) contourne le token `--font-mono`, créant un rendu de code potentiellement différent entre les zones (bulles utilisent `--font-mono`, l'éditeur de skill utilise `monospace`).

11. **Border-radius des cercles en `50%` vs token `--radius-full`.** Avatars/dots/swatches utilisent `50%` (chat.html:320, 1170, 1813, 2180, 2467) tandis que pills/boutons utilisent `--radius-full` (9999px). Deux conventions pour « entièrement arrondi ».

12. **Curseur de streaming et resize-handle utilisent `2px` en dur** (chat.html:877, :1424) — aucune correspondance avec l'échelle de radius des tokens (le plus petit token est `--radius-sm` = 4px).

---

## Vue Orchestrateur / Projects (`electron/projects/`)

Fichiers analysés EN ENTIER :

- `electron/projects.html` (558 lignes)
- `electron/projects/projects.css` (3476 lignes)
- `electron/projects/canvas.js` (681), `chat.js` (994), `detail.js` (294), `execution.js` (842), `main.js` (281), `management.js` (636), `modals.js` (551), `state.js` (269)

**Constat préliminaire majeur** : cette vue **définit ses PROPRES variables CSS** dans son `:root` (préfixe `--*`, ex `--accent-primary`, `--bg-deepest`), et **ne réutilise PAS le système de tokens `--oh-*`** défini dans `electron/sidebar.html`. Le mot `--oh-` n'apparaît **nulle part** dans les fichiers de cette vue (grep négatif). C'est un système de tokens parallèle/dupliqué.

### Tokens / variables CSS définies ici (`:root` et équivalents)

Définies dans `:root` (dark, défaut) à `projects.css:9-63` et surchargées en light dans `@media (prefers-color-scheme: light)` à `projects.css:65-96`.

| Variable                | Valeur dark                                                                                        | Valeur light                  | Fichier:ligne         |
| ----------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------- | --------------------- |
| `--bg-deepest`          | `#0a0a0a`                                                                                          | `#ffffff`                     | projects.css:10 / :67 |
| `--bg-panel`            | `#141414`                                                                                          | `#f7f7f7`                     | projects.css:11 / :68 |
| `--bg-surface`          | `#1e1e1e`                                                                                          | `#efefef`                     | projects.css:12 / :69 |
| `--bg-elevated`         | `#282828`                                                                                          | `#ffffff`                     | projects.css:13 / :70 |
| `--bg-overlay`          | `#111111`                                                                                          | `#f2f2f2`                     | projects.css:14 / :71 |
| `--border-subtle`       | `#1f1f1f`                                                                                          | `#e8e8e8`                     | projects.css:15 / :72 |
| `--border-default`      | `#2a2a2a`                                                                                          | `#e0e0e0`                     | projects.css:16 / :73 |
| `--border-strong`       | `#3a3a3a`                                                                                          | `#cccccc`                     | projects.css:17 / :74 |
| `--text-primary`        | `#ececec`                                                                                          | `#111111`                     | projects.css:18 / :75 |
| `--text-secondary`      | `#999999`                                                                                          | `#555555`                     | projects.css:19 / :76 |
| `--text-muted`          | `#666666`                                                                                          | `#888888`                     | projects.css:20 / :77 |
| `--text-disabled`       | `#444444`                                                                                          | `#bbbbbb`                     | projects.css:21 / :78 |
| `--accent-primary`      | `#14b8a6` (teal)                                                                                   | `#0d9488` (teal foncé)        | projects.css:22 / :79 |
| `--accent-hover`        | `#2dd4bf`                                                                                          | `#0f766e`                     | projects.css:23 / :80 |
| `--accent-active`       | `#0d9488`                                                                                          | `#115e59`                     | projects.css:24 / :81 |
| `--accent-subtle`       | `rgba(20, 184, 166, 0.1)`                                                                          | `rgba(13, 148, 136, 0.06)`    | projects.css:25 / :82 |
| `--accent-subtle-hover` | `rgba(20, 184, 166, 0.16)`                                                                         | `rgba(13, 148, 136, 0.1)`     | projects.css:26 / :83 |
| `--success`             | `#22c55e`                                                                                          | `#16a34a`                     | projects.css:27 / :84 |
| `--success-subtle`      | `rgba(34, 197, 94, 0.1)`                                                                           | `rgba(22, 163, 74, 0.08)`     | projects.css:28 / :85 |
| `--warning`             | `#f59e0b`                                                                                          | `#d97706`                     | projects.css:29 / :86 |
| `--warning-subtle`      | `rgba(245, 158, 11, 0.1)`                                                                          | `rgba(217, 119, 6, 0.08)`     | projects.css:30 / :87 |
| `--error`               | `#ef4444`                                                                                          | `#dc2626`                     | projects.css:31 / :88 |
| `--error-subtle`        | `rgba(239, 68, 68, 0.1)`                                                                           | `rgba(220, 38, 38, 0.08)`     | projects.css:32 / :89 |
| `--shadow-xs`           | `0 1px 2px rgba(0,0,0,0.2)`                                                                        | `0 1px 2px rgba(0,0,0,0.04)`  | projects.css:33 / :90 |
| `--shadow-sm`           | `0 2px 8px rgba(0,0,0,0.24)`                                                                       | `0 2px 8px rgba(0,0,0,0.06)`  | projects.css:34 / :91 |
| `--shadow-md`           | `0 4px 16px rgba(0,0,0,0.28)`                                                                      | `0 4px 16px rgba(0,0,0,0.08)` | projects.css:35 / :92 |
| `--shadow-lg`           | `0 8px 32px rgba(0,0,0,0.4)`                                                                       | `0 8px 32px rgba(0,0,0,0.12)` | projects.css:36 / :93 |
| `--overlay-modal`       | `rgba(0,0,0,0.4)`                                                                                  | `rgba(0,0,0,0.1)`             | projects.css:37 / :94 |
| `--radius-sm`           | `4px`                                                                                              | (hérité)                      | projects.css:38       |
| `--radius-md`           | `8px`                                                                                              | (hérité)                      | projects.css:39       |
| `--radius-lg`           | `12px`                                                                                             | (hérité)                      | projects.css:40       |
| `--radius-full`         | `9999px`                                                                                           | (hérité)                      | projects.css:41       |
| `--space-0`             | `0`                                                                                                | (hérité)                      | projects.css:42       |
| `--space-1`             | `4px`                                                                                              | (hérité)                      | projects.css:43       |
| `--space-2`             | `8px`                                                                                              | (hérité)                      | projects.css:44       |
| `--space-3`             | `12px`                                                                                             | (hérité)                      | projects.css:45       |
| `--space-4`             | `16px`                                                                                             | (hérité)                      | projects.css:46       |
| `--space-5`             | `20px`                                                                                             | (hérité)                      | projects.css:47       |
| `--space-6`             | `24px`                                                                                             | (hérité)                      | projects.css:48       |
| `--space-8`             | `32px`                                                                                             | (hérité)                      | projects.css:49       |
| `--font-sans`           | `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` | (hérité)                      | projects.css:50-52    |
| `--font-display`        | `"SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`                | (hérité)                      | projects.css:53-54    |
| `--font-mono`           | `"SF Mono", Menlo, ui-monospace, monospace`                                                        | (hérité)                      | projects.css:55       |
| `--ease-default`        | `cubic-bezier(0.4, 0, 0.2, 1)`                                                                     | (hérité)                      | projects.css:56       |
| `--ease-out`            | `cubic-bezier(0, 0, 0.2, 1)`                                                                       | (hérité)                      | projects.css:57       |
| `--ease-in`             | `cubic-bezier(0.4, 0, 1, 1)`                                                                       | (hérité)                      | projects.css:58       |
| `--duration-75`         | `75ms`                                                                                             | (hérité)                      | projects.css:59       |
| `--duration-150`        | `150ms`                                                                                            | (hérité)                      | projects.css:60       |
| `--duration-200`        | `200ms`                                                                                            | (hérité)                      | projects.css:61       |
| `--duration-250`        | `250ms`                                                                                            | (hérité)                      | projects.css:62       |

Note : aucun `--duration-300` n'est défini, alors que plusieurs transitions utilisent `0.3s`/`0.4s` en dur (voir Incohérences).

### Couleurs reellement utilisées

#### A) Via tokens `var(--*)` — usage dominant et correct

La quasi-totalité des couleurs DOM passent par les tokens ci-dessus (`--bg-*`, `--text-*`, `--accent-*`, `--success`, `--warning`, `--error`, `--border-*`). Exemples représentatifs (non exhaustif des centaines d'occurrences, mais distincts par variable) :

| Element / propriété                  | Valeur (ou var)                                             | Variable CSS source | Fichier:ligne               |
| ------------------------------------ | ----------------------------------------------------------- | ------------------- | --------------------------- |
| `html, body` background              | `var(--bg-deepest)`                                         | --bg-deepest        | projects.css:102            |
| `.btn--primary` background           | `var(--accent-primary)`                                     | --accent-primary    | projects.css:1163           |
| `.btn--primary` color                | `var(--bg-deepest)`                                         | --bg-deepest        | projects.css:1164           |
| `.node-card--done` border            | `var(--success)`                                            | --success           | projects.css:976            |
| `.node-card--error` border           | `var(--error)`                                              | --error             | projects.css:984            |
| `.node-card--warning` border         | `var(--warning)`                                            | --warning           | projects.css:981            |
| Edge SVG stroke (done/running/error) | `var(--success)` / `var(--accent-primary)` / `var(--error)` | tokens              | canvas.js:267-269           |
| Edge SVG stroke par défaut           | `var(--border-strong)`                                      | --border-strong     | canvas.js:266               |
| Ghost link path stroke               | `var(--accent-primary)`                                     | --accent-primary    | canvas.js:544               |
| mgmt icon background                 | `var(--accent-subtle)`                                      | --accent-subtle     | management.js:150, 209, 421 |

#### B) Couleurs HARDCODÉES (hors token) — à signaler

| Element / propriété                             | Valeur                                      | Variable CSS source                                      | Fichier:ligne          |
| ----------------------------------------------- | ------------------------------------------- | -------------------------------------------------------- | ---------------------- |
| Scrollbar thumb (dark)                          | `rgba(255, 255, 255, 0.08)`                 | NON DÉFINI (hardcodé)                                    | projects.css:126       |
| Scrollbar thumb (light)                         | `rgba(0, 0, 0, 0.1)`                        | NON DÉFINI (hardcodé)                                    | projects.css:131       |
| `.canvas` background-image (dots)               | `rgba(255, 255, 255, 0.02)`                 | NON DÉFINI (hardcodé)                                    | projects.css:597       |
| `.topbar-progress-fill::after` highlight        | `rgba(255, 255, 255, 0.3)`                  | NON DÉFINI (hardcodé)                                    | projects.css:320       |
| `.substep-bar-fill::after` highlight            | `rgba(255, 255, 255, 0.25)`                 | NON DÉFINI (hardcodé)                                    | projects.css:1106      |
| `.chat-msg--user .chat-msg-body` border         | `rgba(20, 184, 166, 0.2)`                   | NON DÉFINI (≈ teal hardcodé, doublon de --accent)        | projects.css:407       |
| `.btn--danger` color                            | `#fff` (blanc pur)                          | NON DÉFINI (hardcodé)                                    | projects.css:1192      |
| `.confirm-btn-delete` color                     | `#fff`                                      | NON DÉFINI (hardcodé)                                    | projects.css:1962      |
| `.mgmt-btn-primary` color                       | `#fff`                                      | NON DÉFINI (hardcodé)                                    | projects.css:2219      |
| `.chat-actions-card .action-btn.confirm` color  | `#fff`                                      | NON DÉFINI (hardcodé)                                    | projects.css:2605      |
| `.cm.user .bub` color                           | `#fff`                                      | NON DÉFINI (hardcodé)                                    | projects.css:2686      |
| `.question-confirm-btn` color                   | `#fff`                                      | NON DÉFINI (hardcodé)                                    | projects.css:3050      |
| `.switch-slider::before` background             | `white`                                     | NON DÉFINI (hardcodé)                                    | projects.css:1793      |
| `.zen-mode-active-btn` color                    | `white !important`                          | NON DÉFINI (hardcodé)                                    | projects.css:1244      |
| `.question-confirm-btn:hover` background/border | `var(--accent-hover, #0f766e)`              | fallback hardcodé teal                                   | projects.css:3060-3061 |
| `.stream-activity` bg fallback                  | `var(--bg-surface, rgba(255,255,255,0.04))` | fallback hardcodé                                        | projects.css:2854      |
| Spinner SVG "réflexion" stroke (×2)             | `var(--accent-primary,#14B8A6)`             | fallback hardcodé teal                                   | chat.js:295            |
| `form-select` chevron SVG `stroke='%23888888'`  | `#888888` (gris, encodé dans data-URI)      | NON tokenisé (= valeur de --text-muted light mais figée) | projects.css:1727      |
| `nameInput.style.borderColor` (erreur)          | `var(--error, #ef4444)`                     | fallback hardcodé                                        | modals.js:446, 452     |

#### C) Valeurs `color: "#..."` dans le JS = DONNÉES, pas du style DOM

Ces hex (`#0d9488`, `#d97706`, `#dc2626`) sont écrits dans le **champ `color` d'objets `project` sauvegardés** (données de templates seed), PAS appliqués comme style CSS. Ce champ `color` n'est **jamais lu** pour styliser une card (les node-cards se colorent via classes `node-card-type--*` / `status-dot--*`, cf. canvas.js:122-144). Champ de données potentiellement **mort** côté rendu.

- `#0d9488` (teal) : modals.js:140,160,181,192,225,236,248,271,281,292,304,327 ; chat.js:804,912 ; main.js:114
- `#d97706` (orange) : modals.js:150, 215
- `#dc2626` (rouge) : modals.js:170

### Border-radius reellement utilisés

#### Via tokens

| Element                  | Valeur                                                                 | Fichier:ligne                |
| ------------------------ | ---------------------------------------------------------------------- | ---------------------------- |
| `--radius-sm` (4px)      | omniprésent (boutons fins, inputs canvas, chips, tags…)                | projects.css:38 + ~40 usages |
| `--radius-md` (8px)      | boutons standards, inputs, selects, accordéons                         | projects.css:39 + ~50 usages |
| `--radius-lg` (12px)     | cards (node-card, modal-dialog, template-card, dropdowns, bulles chat) | projects.css:40 + ~25 usages |
| `--radius-full` (9999px) | pastilles, barres de progression, chips, switch slider                 | projects.css:41 + ~25 usages |

#### Valeurs de radius HARDCODÉES (hors token) — à signaler

| Element                                                      | Valeur                                                     | Fichier:ligne     |
| ------------------------------------------------------------ | ---------------------------------------------------------- | ----------------- |
| `.wf-dot`                                                    | `50%`                                                      | projects.css:201  |
| `.chat-msg-avatar` (via --radius-full) OK ; `.chat-send-btn` | `50%`                                                      | projects.css:449  |
| `.node-link-handle`                                          | `50%`                                                      | projects.css:918  |
| `.switch-slider::before`                                     | `50%`                                                      | projects.css:1794 |
| `.confirm-icon`                                              | `50%`                                                      | projects.css:1915 |
| `.mgmt-wf-dot`                                               | `50%`                                                      | projects.css:2114 |
| `.conv-dropdown-item .conv-dot`                              | `50%`                                                      | projects.css:2941 |
| `.history-status`                                            | `50%`                                                      | projects.css:3260 |
| `.status-dot`                                                | `var(--radius-full)` (incohérent avec les `50%` ci-dessus) | projects.css:1046 |
| `.mgmt-wf-item`                                              | `border-radius: 0`                                         | projects.css:2102 |
| `.chat-tab`                                                  | `border-radius: 0`                                         | projects.css:3092 |
| `.cm.user .bub`                                              | `border-bottom-right-radius: var(--radius-sm)`             | projects.css:2687 |
| `.cm.assistant .bub`                                         | `border-bottom-left-radius: var(--radius-sm)`              | projects.css:2693 |
| `.stream-activity`                                           | `var(--radius-sm, 4px)` (fallback dupliqué)                | projects.css:2853 |
| `.zen-mode .canvas`                                          | `border-radius: 0`                                         | projects.css:1240 |

Échelle radius DISTINCTE observée : **4px (`--radius-sm`), 8px (`--radius-md`), 12px (`--radius-lg`), 9999px (`--radius-full`), 50%, 0**.

### Typographie

Polices : `--font-sans` (SF Pro Text), `--font-display` (SF Pro Display), `--font-mono` (SF Mono). Aucune autre famille.

| Element                                | Font                | Size     | Weight | Line-height                          | Fichier:ligne           |
| -------------------------------------- | ------------------- | -------- | ------ | ------------------------------------ | ----------------------- |
| `html, body` (base)                    | var(--font-sans)    | (hérité) | normal | —                                    | projects.css:101        |
| `.topbar-title`                        | var(--font-display) | 14px     | 600    | —                                    | projects.css:276-279    |
| `.wf-trigger`                          | (hérité sans)       | 13px     | 600    | —                                    | projects.css:190-191    |
| `.topbar-progress(-text)`              | (sans)              | 11px     | 600    | —                                    | projects.css:290-291    |
| `.canvas-header-label`                 | (sans)              | 11px     | 600    | —                                    | projects.css:548-549    |
| `.canvas-mission-text`                 | inherit             | 13px     | normal | 1.4                                  | projects.css:658-660    |
| `.detail-header-title`                 | var(--font-display) | 15px     | 600    | —                                    | projects.css:721-723    |
| `.detail-label`                        | (sans)              | 11px     | 600    | — (uppercase, letter-spacing 0.03em) | projects.css:848-852    |
| `.detail-accordion-trigger`            | (sans)              | 12px     | 600    | —                                    | projects.css:777-778    |
| `.detail-textarea`                     | var(--font-sans)    | 13px     | normal | 1.5                                  | projects.css:864-866    |
| `.detail-textarea--mono`               | var(--font-mono)    | 12px     | —      | —                                    | projects.css:874-875    |
| `.node-card-type`                      | (sans)              | 11px     | 500    | —                                    | projects.css:992-993    |
| `.node-card-name`                      | var(--font-display) | 13px     | 600    | —                                    | projects.css:1009-1011  |
| `.node-card-status`                    | (sans)              | 11px     | 500    | —                                    | projects.css:1019-1020  |
| `.substep-label`                       | (sans)              | 9px      | —      | 1.2                                  | projects.css:1112, 1117 |
| `.orch-chip`                           | (sans)              | 9px      | 600    | —                                    | projects.css:1127-1130  |
| `.btn`                                 | var(--font-sans)    | 13px     | 600    | —                                    | projects.css:1155-1157  |
| `.panel-title`                         | var(--font-display) | 11px     | 600    | — (uppercase)                        | projects.css:1217-1219  |
| `.welcome-text`                        | (sans)              | 14px     | normal | 1.5                                  | projects.css:1263-1265  |
| `.template-card-title`                 | (sans)              | 13px     | 700    | —                                    | projects.css:1331-1332  |
| `.template-card-badge`                 | (sans)              | 9px      | 600    | —                                    | projects.css:1335-1336  |
| `.template-card-desc`                  | (sans)              | 11px     | normal | 1.4                                  | projects.css:1343-1345  |
| `.template-card-btn`                   | (sans)              | 11px     | 600    | —                                    | projects.css:1349-1350  |
| `.orchestration-console`               | var(--font-mono)    | 11px     | —      | 1.5                                  | projects.css:1373-1375  |
| `.orch-result-viewer`                  | var(--font-mono)    | 12px     | —      | 1.55                                 | projects.css:1404-1406  |
| `.orch-result-empty`                   | var(--font-sans)    | 13px     | —      | —                                    | projects.css:1417-1418  |
| `.modal-title`                         | var(--font-display) | 17px     | 600    | —                                    | projects.css:1633-1635  |
| `.form-label`                          | (sans)              | 12px     | 600    | —                                    | projects.css:1672-1673  |
| `.form-hint`                           | (sans)              | 11px     | normal | —                                    | projects.css:1677-1678  |
| `.form-input`                          | var(--font-sans)    | 13px     | —      | —                                    | projects.css:1689-1690  |
| `.form-textarea`                       | var(--font-mono)    | 12px     | —      | 1.5                                  | projects.css:1704-1706  |
| `.form-select`                         | var(--font-sans)    | 13px     | —      | —                                    | projects.css:1722-1723  |
| `.switch-label`                        | (sans)              | 13px     | 500    | —                                    | projects.css:1817-1818  |
| `.switch-help`                         | (sans)              | 11px     | normal | 1.4                                  | projects.css:1822-1824  |
| `.toast`                               | (sans)              | 13px     | 500    | —                                    | projects.css:1575-1576  |
| `.confirm-title`                       | (sans)              | 15px     | 700    | —                                    | projects.css:1927-1928  |
| `.confirm-desc`                        | (sans)              | 13px     | normal | 1.5                                  | projects.css:1933-1936  |
| `.mgmt-detail-name`                    | var(--font-display) | 18px     | 700    | —                                    | projects.css:2183-2185  |
| `.mgmt-wf-list-title`                  | (sans)              | 11px     | 700    | — (uppercase)                        | projects.css:2076-2078  |
| `.mgmt-section-title`                  | (sans)              | 11px     | 700    | — (uppercase)                        | projects.css:2243-2245  |
| `.mgmt-p-icon`                         | (sans)              | 15px     | —      | —                                    | projects.css:2351       |
| `.mgmt-p-badge`                        | (sans)              | 9px      | 600    | —                                    | projects.css:2367-2368  |
| `.chat-model-select`                   | var(--font-mono)    | 11px     | —      | —                                    | projects.css:2562, 2566 |
| `.cm .bub`                             | (sans)              | 12px     | —      | 1.5                                  | projects.css:2676-2677  |
| `.cm.system .bub`                      | (sans)              | 11px     | —      | —                                    | projects.css:2699-2700  |
| `.chat-actions-card .action-btn`       | (sans)              | 10px     | 600    | —                                    | projects.css:2598-2599  |
| `.chat-tab`                            | inherit             | 12px     | 500    | —                                    | projects.css:3095-3096  |
| `.activity-item`                       | (sans)              | 12px     | —      | 1.45                                 | projects.css:3147-3148  |
| `.activity-time`                       | (sans)              | 10px     | —      | —                                    | projects.css:3181-3182  |
| `.history-item-task`                   | (sans)              | 12px     | 600    | —                                    | projects.css:3291-3292  |
| `.history-detail-task`                 | (sans)              | 13px     | 600    | —                                    | projects.css:3343-3345  |
| `.history-node-result / .history-logs` | var(--font-mono)    | 11px     | —      | —                                    | projects.css:3388, 3399 |

Tailles de police DISTINCTES observées : **9, 10, 11, 12, 13, 14, 15, 17, 18 px**.
Graisses (font-weight) DISTINCTES : **normal/400, 500, 600, 700**. (Aucun token typo — toutes les tailles/graisses sont en dur.)

### Espacements (padding / margin / gap)

#### Via tokens `--space-*`

| Element           | Propriété     | Valeur                                               | Fichier:ligne           |
| ----------------- | ------------- | ---------------------------------------------------- | ----------------------- |
| `.topbar`         | padding / gap | `0 var(--space-3)` / `var(--space-3)`                | projects.css:169-170    |
| `.topbar-actions` | gap           | `var(--space-2)`                                     | projects.css:284        |
| `.chat-messages`  | padding / gap | `var(--space-3)`                                     | projects.css:362, 365   |
| `.detail-section` | padding / gap | `var(--space-3) var(--space-4)` / `var(--space-1)`   | projects.css:764, 767   |
| `.node-card`      | padding       | `var(--space-3)`                                     | projects.css:889        |
| `.btn`            | padding       | `0 var(--space-3)`                                   | projects.css:1152       |
| `.modal-header`   | padding       | `var(--space-4) var(--space-5)`                      | projects.css:1628       |
| `.modal-body`     | padding / gap | `0 var(--space-5) var(--space-5)` / `var(--space-4)` | projects.css:1659, 1664 |
| `.confirm-dialog` | padding / gap | `var(--space-6)` / `var(--space-4)`                  | projects.css:1907, 1910 |

#### Espacements HARDCODÉS (hors token `--space-*`) — nombreux, à signaler

| Element                             | Propriété            | Valeur                                  | Fichier:ligne           |
| ----------------------------------- | -------------------- | --------------------------------------- | ----------------------- |
| `.wf-trigger`                       | gap / padding        | `6px` / `4px 10px`                      | projects.css:185-186    |
| `.wf-dropdown`                      | padding / margin-top | `4px` / `4px`                           | projects.css:224, 215   |
| `.wf-dropdown-item`                 | gap / padding        | `8px` / `8px 10px`                      | projects.css:232-233    |
| `.chat-msg-body`                    | padding              | `10px 12px`                             | projects.css:397        |
| `.canvas-mission`                   | gap / padding        | `6px` / `12px 24px`                     | projects.css:650-651    |
| `.canvas-mission-text`              | padding              | `4px 8px`                               | projects.css:670        |
| `.node-card-orch-settings`          | gap                  | `3px`                                   | projects.css:1122       |
| `.orch-chip`                        | padding              | `2px 6px`                               | projects.css:1128       |
| `.btn`                              | gap                  | `6px`                                   | projects.css:1150       |
| `.template-card`                    | gap / padding        | `6px` / `var(--space-3) var(--space-4)` | projects.css:1300, 1305 |
| `.template-card-badge`              | padding              | `2px 6px`                               | projects.css:1337       |
| `.toast`                            | padding              | `10px 16px`                             | projects.css:1573       |
| `.confirm-btn-cancel / -delete`     | padding              | `8px 16px`                              | projects.css:1945, 1958 |
| `.mgmt-wf-list-header`              | padding              | `16px 16px 12px`                        | projects.css:2068       |
| `.mgmt-wf-items`                    | padding              | `8px`                                   | projects.css:2089       |
| `.mgmt-wf-item`                     | gap / padding        | `10px` / `10px 16px`                    | projects.css:2097-2098  |
| `.mgmt-detail-header`               | padding              | `20px 24px 16px`                        | projects.css:2170       |
| `.mgmt-detail-body`                 | padding / gap        | `20px 24px` / `20px`                    | projects.css:2237, 2240 |
| `.mgmt-btn`                         | padding              | `7px 16px`                              | projects.css:2209       |
| `.mgmt-proj-card`                   | gap / padding        | `12px` / `11px 14px`                    | projects.css:2334-2335  |
| `.mgmt-p-icon`                      | width/height         | `32px`                                  | projects.css:2345-2346  |
| `.mgmt-settings-card`               | gap / padding        | `12px` / `12px 16px`                    | projects.css:2466-2467  |
| `.filter-chip`                      | padding              | `4px 10px`                              | projects.css:2279       |
| `.chat-model-select`                | padding              | `2px 6px`                               | projects.css:2563       |
| `.chat-actions-card`                | padding / margin     | `8px 10px` / `4px 0`                    | projects.css:2576-2577  |
| `.cm .bub`                          | padding              | `8px 12px`                              | projects.css:2674       |
| `.chat-tab-content` (tabs)          | height / padding     | `36px` (bar) / `0 12px`                 | projects.css:3081, 3089 |
| `.activity-feed`                    | padding              | `10px 12px`                             | projects.css:3130       |
| `.activity-item`                    | gap / padding        | `8px` / `6px 8px`                       | projects.css:3144-3145  |
| `.history-item`                     | padding              | `10px 12px`                             | projects.css:3242       |
| `.history-detail-feedback`          | padding              | `6px 10px`                              | projects.css:3469       |
| `.canvas-iterate`                   | gap / padding        | `8px` / `8px 24px`                      | projects.css:3419-3420  |
| `.question-confirm-btn`             | padding              | `7px 16px`                              | projects.css:3046       |
| Inline HTML : `btnPickPath` etc.    | padding              | `2px 8px`                               | projects.html:254       |
| Inline HTML : `modal-body wfPrompt` | gap                  | `8px`                                   | projects.html:499       |
| Inline HTML : `projPath` row        | gap                  | `8px`                                   | projects.html:367       |

Valeurs d'espacement DISTINCTES hardcodées repérées : **2px, 3px, 4px, 6px, 7px, 8px, 10px, 11px, 12px, 14px, 16px, 20px, 24px, 32px** (chevauchent les tokens : 4=`--space-1`, 8=`--space-2`, 12=`--space-3`, 16=`--space-4`, 20=`--space-5`, 24=`--space-6`, 32=`--space-8`, mais écrits en dur au lieu du token).

### Ombres, transitions, z-index

#### Ombres (box-shadow)

| Element                                                                            | Propriété  | Valeur                                                                             | Fichier:ligne                            |
| ---------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------- | ---------------------------------------- |
| `.wf-dropdown`, `.modal-dialog`, `.confirm-dialog`, `.conv-dropdown`, `.mgmt-menu` | box-shadow | `var(--shadow-lg)`                                                                 | projects.css:222, 1616, 1904, 2916, 2518 |
| `.link-popover`, `.toast`                                                          | box-shadow | `var(--shadow-md)`                                                                 | projects.css:946, 1580                   |
| `.mgmt-proj-card:hover`                                                            | box-shadow | `var(--shadow-xs)`                                                                 | projects.css:2342                        |
| `.node-card` (repos)                                                               | box-shadow | `none`                                                                             | projects.css:894                         |
| `@keyframes card-running`                                                          | box-shadow | `0 0 0 1px var(--accent-primary), 0 0 12px -2px color-mix(... 35% ...)` (hardcodé) | projects.css:2742-2750                   |
| `@keyframes card-done`                                                             | box-shadow | `0 0 0 1px var(--accent-primary)` puis `0 0 8px -2px color-mix(--success 40%)`     | projects.css:2755, 2763                  |
| `@keyframes card-error`                                                            | box-shadow | `0 0 10px -2px color-mix(--error 35%)`                                             | projects.css:2789                        |
| `@keyframes card-warning`                                                          | box-shadow | `0 0 12px / 0 0 8px -2px color-mix(--warning 45%/30%)`                             | projects.css:2798, 2801                  |

#### Transitions

| Element                         | Propriété             | Valeur                                                                                                                                                                                              | Fichier:ligne                                                |
| ------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `.btn`                          | transition            | `all var(--duration-150) var(--ease-default)`                                                                                                                                                       | projects.css:1160                                            |
| `.chat-send-btn`                | transition            | `background var(--duration-150) var(--ease-default)`                                                                                                                                                | projects.css:458                                             |
| `.detail-accordion-chevron`     | transition            | `transform var(--duration-150) var(--ease-default)`                                                                                                                                                 | projects.css:825                                             |
| `.console-copy-btn`             | transition            | `opacity/color/background var(--duration-150)`                                                                                                                                                      | projects.css:806-809                                         |
| `.chat-tab`                     | transition            | `background/color/border-color var(--duration-150) var(--ease-default)`                                                                                                                             | projects.css:3100-3103                                       |
| `.filter-chip`                  | transition            | `background/border-color/color var(--duration-150) var(--ease-default)`                                                                                                                             | projects.css:2286-2289                                       |
| `.topbar-progress-fill`         | transition (HARDCODÉ) | `width 0.3s ease`                                                                                                                                                                                   | projects.css:309                                             |
| `.substep-bar-fill`             | transition (HARDCODÉ) | `width 0.4s var(--ease-out)`                                                                                                                                                                        | projects.css:1094                                            |
| `.chat-panel` / `.detail-panel` | transition (HARDCODÉ) | `width 0.3s ease, min-width 0.3s ease, opacity 0.3s ease`                                                                                                                                           | projects.css:343-347 / 707-710                               |
| `.canvas-header`                | transition (HARDCODÉ) | `height/min-height/padding/opacity 0.3s ease`                                                                                                                                                       | projects.css:536-540                                         |
| `.canvas`                       | transition (HARDCODÉ) | `border-radius 0.3s ease, border 0.3s ease`                                                                                                                                                         | projects.css:604-606                                         |
| `.canvas-mission-text`          | transition            | `background var(--duration-150, 0.15s) ease` (fallback)                                                                                                                                             | projects.css:671                                             |
| `.canvas-iterate textarea`      | transition            | `border-color var(--duration-150, 0.15s) ease` (fallback)                                                                                                                                           | projects.css:3437                                            |
| `.question-confirm-btn`         | transition (HARDCODÉ) | `background 0.15s, opacity 0.15s`                                                                                                                                                                   | projects.css:3055-3057                                       |
| Animations clés                 | duration              | `card-done 0.5s`, `card-warning 0.6s`, `card-error 0.5s`, `card-skipped 0.4s`, `dot-pulse 1.4s/1s`, `shimmer 1.5s/1.8s`, `spin 1.2s/1.8s`, `edge-flow 0.8s`, `thinking-fade 2s` (toutes HARDCODÉES) | projects.css:977-985, 1051-1063, 323, 1109, 2713, 2848, 3177 |

#### z-index

| Element                                          | Propriété | Valeur | Fichier:ligne                |
| ------------------------------------------------ | --------- | ------ | ---------------------------- |
| `.canvas-svg`                                    | z-index   | `1`    | projects.css:612             |
| `.node-card`                                     | z-index   | `2`    | projects.css:892             |
| `.canvas-empty`                                  | z-index   | `10`   | projects.css:637             |
| `.node-link-handle`                              | z-index   | `10`   | projects.css:920             |
| `.link-popover`                                  | z-index   | `20`   | projects.css:942             |
| `.canvas-controls`                               | z-index   | `20`   | projects.css:1493            |
| `.topbar`                                        | z-index   | `30`   | projects.css:174             |
| `.mgmt-overlay`                                  | z-index   | `40`   | projects.css:1979            |
| `.modal-overlay`                                 | z-index   | `50`   | projects.css:1606            |
| `.wf-dropdown` / `.conv-dropdown` / `.mgmt-menu` | z-index   | `100`  | projects.css:223, 2917, 2519 |
| `#modalConfirmDelete`                            | z-index   | `200`  | projects.css:1888            |
| `.toast-container`                               | z-index   | `1000` | projects.css:1566            |

Échelle z-index DISTINCTE : **1, 2, 10, 20, 30, 40, 50, 100, 200, 1000** (aucun token, valeurs en dur). Note : `.canvas-empty` (10) et `.node-link-handle` (10) partagent la même couche ; `.link-popover` (20) et `.canvas-controls` (20) aussi.

### Incohérences internes détectées (Orchestrateur / Projects)

1. **Système de tokens dupliqué, NON aligné sur `--oh-*`** — Cette vue redéfinit intégralement sa propre palette dans `:root` (projects.css:9-63) sans réutiliser les tokens `--oh-*` du shell (`sidebar.html`). Risque de divergence de marque entre vues. (`--oh-` introuvable dans tous les fichiers de la vue.)

2. **Pastilles circulaires : `50%` vs `var(--radius-full)`** — Mélange des deux conventions pour le MÊME composant visuel (cercle). `.status-dot` utilise `var(--radius-full)` (projects.css:1046) tandis que `.wf-dot`, `.mgmt-wf-dot`, `.conv-dot`, `.chat-send-btn`, `.confirm-icon`, `.history-status`, `.node-link-handle` utilisent `50%` en dur (projects.css:201, 2114, 2941, 449, 1915, 3260, 918).

3. **Espacements quasi systématiquement hardcodés** — Des dizaines de `padding/gap/margin` utilisent des px bruts (`8px`, `12px`, `16px`, `24px`…) qui correspondent EXACTEMENT à `--space-2/3/4/6` mais sans passer par le token. Ex : `.mgmt-detail-body` padding `20px 24px` (projects.css:2237) au lieu de `var(--space-5) var(--space-6)`. Le bloc "MGMT" (à partir de la ligne ~1976) est presque entièrement en px bruts, contrastant avec le haut du fichier qui utilise les tokens.

4. **Tailles de police 100% en dur** — Aucun token de taille de police n'existe ; 9 valeurs distinctes (9→18px) sont saupoudrées sans échelle nommée. Idem pour les graisses (400/500/600/700).

5. **Couleurs de texte sur fond accent : `#fff`/`white` hardcodés** — `.btn--danger`, `.cm.user .bub`, `.mgmt-btn-primary`, `.question-confirm-btn`, `.confirm-btn-delete`, `.action-btn.confirm`, `.switch-slider::before` utilisent `#fff`/`white` (projects.css:1192, 2686, 2219, 3050, 1962, 2605, 1793). EN REVANCHE `.btn--primary` (projects.css:1164) et `.chat-send-btn` (projects.css:452) utilisent `var(--bg-deepest)` pour le texte sur accent. **Deux conventions opposées** pour "texte sur bouton coloré" (blanc pur vs bg-deepest), incohérence de contraste light/dark.

6. **`color-mix()` sur `--accent-primary 70% white`** — `.topbar-progress-fill` (projects.css:303-307) et `.substep-bar-fill` (projects.css:1088-1092) génèrent un dégradé via `color-mix(... white)`, technique de teinte non factorisée en token (couleur dérivée invisible dans la palette).

7. **Durées de transition `0.3s`/`0.4s` hors token** — Aucun `--duration-300`/`--duration-400` n'existe ; les panneaux collapsibles, le canvas et plusieurs barres utilisent `0.3s`/`0.4s` en dur (projects.css:309, 343-347, 536-540, 604-606, 1094) alors que `--duration-75/150/200/250` sont définis. Échelle de durée incomplète et contournée.

8. **Fallbacks redondants dans `var(...)`** — Plusieurs `var(--token, valeur)` réinjectent une valeur de secours qui DUPLIQUE le token déjà garanti : `var(--duration-150, 0.15s)` (projects.css:671, 3437), `var(--radius-sm, 4px)` (projects.css:2853), `var(--accent-hover, #0f766e)` (projects.css:3060), `var(--font-mono, monospace)` (projects.css:3197), `var(--accent-primary,#14B8A6)` (chat.js:295), `var(--error, #ef4444)` (modals.js:446,452). Bruit + risque de désync si le token change.

9. **rgba blancs/noirs hardcodés pour overlays/highlights** — Scrollbar (`rgba(255,255,255,0.08)`, projects.css:126), dots du canvas (`rgba(255,255,255,0.02)`, projects.css:597), shimmer (`rgba(255,255,255,0.3/0.25)`, projects.css:320, 1106). Non tokenisés, ne s'adaptent pas proprement au thème light.

10. **Champ de données `color` (hex) jamais rendu** — Les templates écrivent `color: "#0d9488/#d97706/#dc2626"` sur chaque projet sauvegardé (modals.js:140-327, chat.js:804/912, main.js:114) mais aucune card/icône ne lit ce champ pour se colorer (couleur pilotée par classes `node-card-type--*`). Donnée morte côté UI OU intention de design non implémentée — incohérence design/data à clarifier.

11. **`form-select` chevron : gris `#888888` figé dans un data-URI** — projects.css:1727. Correspond à `--text-muted` en light mais reste figé en dark (où `--text-muted` = `#666666`), donc l'icône de la flèche ne suit pas le thème.

12. **`.btn--secondary` border-color = `--border-strong` au hover (projects.css:1180) vs `.template-card:hover` = `--border-strong` (projects.css:1309) OK ; mais `.node-card:hover` aussi `--border-strong` (projects.css:904)** — cohérent ici, en revanche `.wf-trigger:hover` (projects.css:196) utilise aussi `--border-strong` : la convention hover-border est respectée, à noter comme point POSITIF de cohérence.

---

## Vue Sidebar + Nav-popup (`electron/sidebar.html`, `electron/nav-popup.html`)

Fichiers audites (lus en entier) :

- `electron/sidebar.html` (3214 lignes)
- `electron/nav-popup.html` (163 lignes)

Constat majeur de coherence inter-fichiers : les **deux fichiers definissent leurs PROPRES `:root`** et **n'utilisent PAS le meme systeme de tokens**.

- `sidebar.html` utilise le systeme de design canonique `--oh-*` (+ tokens utilitaires `--radius-*`, `--space-*`, `--shadow-*`, `--duration-*`, `--ease-*`, `--font*`).
- `nav-popup.html` utilise un **systeme local court non prefixe** (`--bg`, `--border`, `--text`, `--accent`, etc.) qui DUPLIQUE les memes valeurs mais sous d'autres noms. C'est une incoherence structurelle (voir section dediee).

### Tokens / variables CSS definies ici (:root et equivalents)

#### sidebar.html — `:root` dark (defaut), lignes 19-85

| Variable                         | Valeur dark                                                                      | Valeur light                     | Fichier:ligne          |
| -------------------------------- | -------------------------------------------------------------------------------- | -------------------------------- | ---------------------- |
| `--oh-color-bg-deepest`          | `#0a0a0a`                                                                        | `#ffffff`                        | sidebar.html:21 / :90  |
| `--oh-color-bg-panel`            | `#141414`                                                                        | `#f7f7f7`                        | sidebar.html:22 / :91  |
| `--oh-color-bg-surface`          | `#1e1e1e`                                                                        | `#efefef`                        | sidebar.html:23 / :92  |
| `--oh-color-bg-elevated`         | `#282828`                                                                        | `#ffffff`                        | sidebar.html:24 / :93  |
| `--oh-color-bg-overlay`          | `#111111`                                                                        | `#f2f2f2`                        | sidebar.html:25 / :94  |
| `--oh-color-border-subtle`       | `#1f1f1f`                                                                        | `#e8e8e8`                        | sidebar.html:27 / :96  |
| `--oh-color-border-default`      | `#2a2a2a`                                                                        | `#e0e0e0`                        | sidebar.html:28 / :97  |
| `--oh-color-border-strong`       | `#3a3a3a`                                                                        | `#cccccc`                        | sidebar.html:29 / :98  |
| `--oh-color-text-primary`        | `#ececec`                                                                        | `#111111`                        | sidebar.html:31 / :100 |
| `--oh-color-text-secondary`      | `#999999`                                                                        | `#555555`                        | sidebar.html:32 / :101 |
| `--oh-color-text-muted`          | `#666666`                                                                        | `#888888`                        | sidebar.html:33 / :102 |
| `--oh-color-text-disabled`       | `#444444`                                                                        | `#bbbbbb`                        | sidebar.html:34 / :103 |
| `--oh-color-accent-primary`      | `#14b8a6` (teal)                                                                 | `#0d9488`                        | sidebar.html:36 / :105 |
| `--oh-color-accent-hover`        | `#2dd4bf`                                                                        | `#0f766e`                        | sidebar.html:37 / :106 |
| `--oh-color-accent-active`       | `#0d9488`                                                                        | `#115e59`                        | sidebar.html:38 / :107 |
| `--oh-color-accent-subtle`       | `rgba(20, 184, 166, 0.10)`                                                       | `rgba(13, 148, 136, 0.06)`       | sidebar.html:39 / :108 |
| `--oh-color-accent-subtle-hover` | `rgba(20, 184, 166, 0.16)`                                                       | `rgba(13, 148, 136, 0.1)`        | sidebar.html:40 / :109 |
| `--oh-color-bg-active`           | `rgba(20, 184, 166, 0.1)`                                                        | `rgba(13, 148, 136, 0.08)`       | sidebar.html:42 / :111 |
| `--oh-color-success`             | `#22c55e`                                                                        | `#16a34a`                        | sidebar.html:45 / :113 |
| `--oh-color-warning`             | `#f59e0b`                                                                        | `#d97706`                        | sidebar.html:46 / :114 |
| `--oh-color-error`               | `#ef4444`                                                                        | `#dc2626`                        | sidebar.html:47 / :115 |
| `--ease-default`                 | `cubic-bezier(0.4, 0, 0.2, 1)`                                                   | (non override)                   | sidebar.html:50        |
| `--ease-in`                      | `cubic-bezier(0.4, 0, 1, 1)`                                                     | (non override)                   | sidebar.html:51        |
| `--ease-out`                     | `cubic-bezier(0, 0, 0.2, 1)`                                                     | (non override)                   | sidebar.html:52        |
| `--ease-spring`                  | `cubic-bezier(0.34, 1.56, 0.64, 1)`                                              | (non override)                   | sidebar.html:53        |
| `--duration-75`                  | `75ms`                                                                           | (non override)                   | sidebar.html:55        |
| `--duration-150`                 | `150ms`                                                                          | (non override)                   | sidebar.html:56        |
| `--duration-250`                 | `250ms`                                                                          | (non override)                   | sidebar.html:57        |
| `--duration-350`                 | `350ms`                                                                          | (non override)                   | sidebar.html:58        |
| `--duration-200`                 | `200ms`                                                                          | (non override)                   | sidebar.html:76        |
| `--transition`                   | `var(--duration-150) var(--ease-default)`                                        | (non override)                   | sidebar.html:60        |
| `--font`                         | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif` | (non override)                   | sidebar.html:61-62     |
| `--font-mono`                    | `"SF Mono", "Monaco", "Menlo", monospace`                                        | (non override)                   | sidebar.html:84        |
| `--radius-sm`                    | `4px`                                                                            | (non override)                   | sidebar.html:63        |
| `--radius-md`                    | `8px`                                                                            | (non override)                   | sidebar.html:64        |
| `--radius-lg`                    | `12px`                                                                           | (non override)                   | sidebar.html:65        |
| `--radius-full`                  | `9999px`                                                                         | (non override)                   | sidebar.html:66        |
| `--space-1`                      | `4px`                                                                            | (non override)                   | sidebar.html:68        |
| `--space-2`                      | `8px`                                                                            | (non override)                   | sidebar.html:69        |
| `--space-3`                      | `12px`                                                                           | (non override)                   | sidebar.html:70        |
| `--space-4`                      | `16px`                                                                           | (non override)                   | sidebar.html:71        |
| `--space-5`                      | `20px`                                                                           | (non override)                   | sidebar.html:72        |
| `--space-6`                      | `24px`                                                                           | (non override)                   | sidebar.html:73        |
| `--space-8`                      | `32px`                                                                           | (non override)                   | sidebar.html:74        |
| `--shadow-xs`                    | `0 1px 2px rgba(0, 0, 0, 0.2)`                                                   | `0 1px 2px rgba(0, 0, 0, 0.04)`  | sidebar.html:78 / :117 |
| `--shadow-sm`                    | `0 2px 8px rgba(0, 0, 0, 0.24)`                                                  | `0 2px 8px rgba(0, 0, 0, 0.06)`  | sidebar.html:79 / :118 |
| `--shadow-md`                    | `0 4px 16px rgba(0, 0, 0, 0.28)`                                                 | `0 4px 16px rgba(0, 0, 0, 0.08)` | sidebar.html:80 / :119 |
| `--shadow-lg`                    | `0 8px 32px rgba(0, 0, 0, 0.4)`                                                  | `0 8px 32px rgba(0, 0, 0, 0.12)` | sidebar.html:81 / :120 |
| `--overlay-modal`                | `rgba(0, 0, 0, 0.4)`                                                             | `rgba(0, 0, 0, 0.10)`            | sidebar.html:82 / :121 |

#### nav-popup.html — `:root` local NON prefixe, lignes 16-30

| Variable        | Valeur dark                                                    | Valeur light               | Fichier:ligne           |
| --------------- | -------------------------------------------------------------- | -------------------------- | ----------------------- |
| `--bg`          | `#111111`                                                      | `#ffffff`                  | nav-popup.html:17 / :34 |
| `--border`      | `#222222`                                                      | `#e0e0e0`                  | nav-popup.html:18 / :35 |
| `--text`        | `#ececec`                                                      | `#111111`                  | nav-popup.html:19 / :36 |
| `--text-sec`    | `#999999`                                                      | `#555555`                  | nav-popup.html:20 / :37 |
| `--text-muted`  | `#666666`                                                      | `#888888`                  | nav-popup.html:21 / :38 |
| `--accent`      | `#14b8a6` (teal)                                               | `#0d9488`                  | nav-popup.html:22 / :39 |
| `--active-bg`   | `rgba(20, 184, 166, 0.1)`                                      | `rgba(13, 148, 136, 0.08)` | nav-popup.html:23 / :40 |
| `--hover-bg`    | `rgba(255, 255, 255, 0.05)`                                    | `rgba(0, 0, 0, 0.04)`      | nav-popup.html:24 / :41 |
| `--font`        | `-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif` | (non override)             | nav-popup.html:25       |
| `--radius-sm`   | `4px`                                                          | (non override)             | nav-popup.html:26       |
| `--radius-md`   | `8px`                                                          | (non override)             | nav-popup.html:27       |
| `--radius-lg`   | `12px`                                                         | (non override)             | nav-popup.html:28       |
| `--radius-full` | `9999px`                                                       | (non override)             | nav-popup.html:29       |

> Note : `nav-popup.html` definit `--radius-full: 9999px` (ligne 29) mais ne l'utilise nulle part dans son CSS. `--text-muted` n'est utilise que par `.item .shortcut` (ligne 116).

### Couleurs reellement utilisees

#### sidebar.html

| Element / propriete                                       | Valeur (ou var)                                            | Variable CSS source                                                                         | Fichier:ligne                   |
| --------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------- |
| `html, body` background                                   | `var(--oh-color-bg-deepest)`                               | oui                                                                                         | sidebar.html:136                |
| `html, body` color                                        | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:141                |
| `.header` background                                      | `var(--oh-color-bg-panel)`                                 | oui                                                                                         | sidebar.html:150                |
| `.header` border-bottom                                   | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:151                |
| `.top-row` border-bottom                                  | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:163                |
| `.brand-title` color                                      | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:177                |
| `.brand-logo` color                                       | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:189                |
| `#tab-indicator` background                               | `var(--oh-color-bg-active)`                                | oui                                                                                         | sidebar.html:225                |
| `.slot-btn.active` color                                  | `var(--active-color, var(--oh-color-accent-primary))`      | oui (fallback)                                                                              | sidebar.html:237, :329          |
| `.slot-btn` color                                         | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:260                |
| `.slot-btn:hover` background                              | `rgba(255, 255, 255, 0.05)`                                | **HARDCODE**                                                                                | sidebar.html:273                |
| `.slot-btn:hover` color                                   | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:274                |
| `.slot-btn:hover` (light) background                      | `rgba(0, 0, 0, 0.03)`                                      | **HARDCODE**                                                                                | sidebar.html:283                |
| `.slot-btn:focus-visible` outline                         | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:288                |
| `.btn-config` color                                       | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:345                |
| `.btn-config:hover` background                            | `rgba(255, 255, 255, 0.05)`                                | **HARDCODE**                                                                                | sidebar.html:362                |
| `.btn-config:hover` color                                 | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:363                |
| `.btn-config:hover` (light) background                    | `rgba(0, 0, 0, 0.03)`                                      | **HARDCODE**                                                                                | sidebar.html:372                |
| `.slot-btn.loading .status-ring` SVG stroke               | `%2314B8A6` (= `#14B8A6` teal hardcode dans data-URI)      | **HARDCODE**                                                                                | sidebar.html:403                |
| `.slot-btn.ready .status-ring` background                 | `var(--oh-color-success)`                                  | oui                                                                                         | sidebar.html:416                |
| `.slot-btn.ready .status-ring` box-shadow color           | `var(--oh-color-success)`                                  | oui                                                                                         | sidebar.html:417                |
| `.tooltip` background                                     | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:427                |
| `.tooltip` color                                          | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:428                |
| `.tooltip` border                                         | `var(--oh-color-border-strong)`                            | oui                                                                                         | sidebar.html:436                |
| `.tooltip` box-shadow                                     | `0 4px 12px rgba(0, 0, 0, 0.4)`                            | **HARDCODE** (n'utilise pas `--shadow-*`)                                                   | sidebar.html:438                |
| `.dropdown-trigger` color                                 | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:487                |
| `.dropdown-trigger:hover` background                      | `rgba(255, 255, 255, 0.05)`                                | **HARDCODE**                                                                                | sidebar.html:495                |
| `.dropdown-trigger:hover` (light) background              | `rgba(0, 0, 0, 0.04)`                                      | **HARDCODE**                                                                                | sidebar.html:500                |
| `#config-backdrop` background                             | `var(--overlay-modal)`                                     | oui                                                                                         | sidebar.html:565                |
| `.config-card` background                                 | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:582                |
| `.config-card` border                                     | `var(--oh-color-border-default)`                           | oui                                                                                         | sidebar.html:583                |
| `.config-nav` background                                  | `var(--oh-color-bg-panel)`                                 | oui                                                                                         | sidebar.html:602                |
| `.config-nav` border-right                                | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:603                |
| `.config-nav-title` color                                 | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:612                |
| `.config-tab` color                                       | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:625                |
| `.config-tab:hover` color                                 | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:642                |
| `.config-tab:hover` background                            | `var(--oh-color-bg-surface)`                               | oui                                                                                         | sidebar.html:643                |
| `.config-tab.active` color                                | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:646                |
| `.config-tab.active` background                           | `var(--oh-color-accent-subtle)`                            | oui                                                                                         | sidebar.html:647                |
| `.config-tab:focus-visible` outline                       | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:651                |
| `.config-nav-hint` color                                  | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:661                |
| `.config-main-heading h2` color                           | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:692                |
| `.config-main-heading p` color                            | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:696                |
| `.btn-close-cfg` border                                   | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:702                |
| `.btn-close-cfg` color                                    | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:705                |
| `.btn-close-cfg:hover` background                         | `var(--oh-color-bg-surface)`                               | oui                                                                                         | sidebar.html:714                |
| `.btn-close-cfg:hover` color                              | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:715                |
| `.btn-close-cfg:hover` border-color                       | `var(--oh-color-border-default)`                           | oui                                                                                         | sidebar.html:716                |
| `.config-tab-content` scrollbar-thumb                     | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:736                |
| `.settings-group-title` color                             | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:753                |
| `.settings-group-card` background                         | `var(--oh-color-bg-surface)`                               | oui                                                                                         | sidebar.html:758                |
| `.settings-group-card` border                             | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:759                |
| `.setting-row + .setting-row` border-top                  | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:773                |
| `.setting-label` color                                    | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:781                |
| `.setting-desc` color                                     | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:788                |
| `.switch-slider` background                               | `var(--oh-color-border-default)`                           | oui                                                                                         | sidebar.html:810                |
| `.switch-slider` border                                   | `var(--oh-color-border-default)`                           | oui                                                                                         | sidebar.html:811                |
| `.switch-slider::before` background                       | `#fff`                                                     | **HARDCODE**                                                                                | sidebar.html:823                |
| `.switch input:checked + .switch-slider` background       | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:829                |
| `.switch input:checked + .switch-slider` border-color     | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:830                |
| `.switch input:focus-visible + .switch-slider` box-shadow | `0 0 0 3px var(--oh-color-accent-subtle-hover)`            | oui (couleur)                                                                               | sidebar.html:836                |
| `.switch ... :focus-visible` border-color                 | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:837                |
| `.form-input` border                                      | `var(--oh-color-border-default)`                           | oui                                                                                         | sidebar.html:846                |
| `.form-input` background                                  | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:847                |
| `.form-input` color                                       | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:848                |
| `.form-input:focus` border-color                          | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:858                |
| `.form-input:focus` box-shadow                            | `0 0 0 3px var(--oh-color-accent-subtle)`                  | oui (couleur)                                                                               | sidebar.html:859                |
| `.form-input::placeholder` color                          | `var(--oh-color-text-disabled)`                            | oui                                                                                         | sidebar.html:862                |
| `.form-select` border                                     | `var(--oh-color-border-default)`                           | oui                                                                                         | sidebar.html:871                |
| `.form-select` background                                 | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:872                |
| `.form-select` color                                      | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:873                |
| `.form-select:focus` border-color                         | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:881                |
| `.form-select:focus` box-shadow                           | `0 0 0 3px var(--oh-color-accent-subtle)`                  | oui (couleur)                                                                               | sidebar.html:882                |
| `.form-select option` background                          | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:885                |
| `.form-select option` color                               | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:886                |
| `.form-select optgroup` color                             | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:891                |
| `.form-select optgroup option` color                      | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:895                |
| `.btn-icon` color                                         | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:919                |
| `.btn-icon:hover` color                                   | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:928                |
| `.btn-icon:hover` background                              | `var(--oh-color-bg-surface)`                               | oui                                                                                         | sidebar.html:929                |
| `.btn-reveal` color                                       | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:946                |
| `.btn-reveal:hover` color                                 | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:954                |
| `.config-toast` background                                | `var(--oh-color-bg-surface)`                               | oui                                                                                         | sidebar.html:976                |
| `.config-toast` border                                    | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:977                |
| `.config-toast` color                                     | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:979                |
| `.config-toast svg` stroke                                | `var(--oh-color-success)`                                  | oui                                                                                         | sidebar.html:994                |
| `.fact-list` scrollbar-thumb                              | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1012               |
| `.fact-item` background                                   | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:1020               |
| `.fact-item` border                                       | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1021               |
| `.fact-item` color                                        | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:1024               |
| `.fact-remove` color                                      | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1035               |
| `.fact-remove:hover` color                                | `var(--oh-color-error)`                                    | oui                                                                                         | sidebar.html:1041               |
| `.btn-add-fact` background                                | `var(--oh-color-accent-subtle)`                            | oui                                                                                         | sidebar.html:1056               |
| `.btn-add-fact` border                                    | `var(--oh-color-accent-subtle-hover)`                      | oui                                                                                         | sidebar.html:1057               |
| `.btn-add-fact` color                                     | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1059               |
| `.btn-add-fact:hover` background                          | `var(--oh-color-accent-subtle-hover)`                      | oui                                                                                         | sidebar.html:1068               |
| `.memory-token-hint` color                                | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1071               |
| `.update-item + .update-item` border-top                  | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1083               |
| `.update-item-icon` background                            | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:1095               |
| `.update-item-icon` color                                 | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1096               |
| `.update-item-icon` border                                | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1097               |
| `.update-item-name` color                                 | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:1103               |
| `.update-item-status` color                               | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1107               |
| `.update-item-status.latest` color                        | `var(--oh-color-success)`                                  | oui                                                                                         | sidebar.html:1110               |
| `.update-item-status.available` color                     | `var(--oh-color-warning)`                                  | oui                                                                                         | sidebar.html:1111               |
| `.update-item-status.error` color                         | `var(--oh-color-error)`                                    | oui                                                                                         | sidebar.html:1112               |
| `.update-item-status.updating` color                      | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1113               |
| `.btn-update` border                                      | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1116               |
| `.btn-update` background                                  | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:1118               |
| `.btn-update` color                                       | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:1119               |
| `.btn-update:hover` border-color                          | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1128               |
| `.btn-update:hover` color                                 | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1129               |
| `.btn-update.primary` background                          | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1133               |
| `.btn-update.primary` border-color                        | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1134               |
| `.btn-update.primary` color                               | `#fff`                                                     | **HARDCODE**                                                                                | sidebar.html:1135               |
| `.btn-update.primary:hover` background                    | `var(--oh-color-accent-hover)`                             | oui                                                                                         | sidebar.html:1137               |
| `.ollama-model-card` background                           | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:1143               |
| `.ollama-model-card` border                               | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1144               |
| `.ollama-model-name` color                                | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:1158               |
| `.ollama-model-status` color                              | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1162               |
| `.ollama-progress-container` background                   | `var(--oh-color-bg-deepest)`                               | oui                                                                                         | sidebar.html:1166               |
| `.ollama-progress-bar` background                         | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1173               |
| `.btn-ollama` border                                      | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1184               |
| `.btn-ollama` background                                  | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:1185               |
| `.btn-ollama` color                                       | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:1186               |
| `.btn-ollama:hover` border-color                          | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1191               |
| `.btn-ollama:hover` color                                 | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1192               |
| `.btn-ollama.cancel` color                                | `var(--oh-color-error)`                                    | oui                                                                                         | sidebar.html:1194               |
| `.btn-ollama.cancel:hover` background                     | `rgba(248, 113, 113, 0.1)`                                 | **HARDCODE** (= teinte de `#f87171`, ne correspond PAS a `--oh-color-error` dark `#ef4444`) | sidebar.html:1196               |
| `.btn-ollama.cancel:hover` border-color                   | `var(--oh-color-error)`                                    | oui                                                                                         | sidebar.html:1197               |
| `.cache-stat-card` background                             | `var(--oh-color-bg-elevated)`                              | oui                                                                                         | sidebar.html:1208               |
| `.cache-stat-card` border                                 | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1209               |
| `.cache-stat-label` color                                 | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1217               |
| `.cache-stat-value` color                                 | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:1224               |
| `.cache-stat-sub` color                                   | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1229               |
| `.cache-stat-bar-container` background                    | `var(--oh-color-bg-deepest)`                               | oui                                                                                         | sidebar.html:1235               |
| `.cache-stat-bar` background                              | `var(--oh-color-accent-primary)`                           | oui                                                                                         | sidebar.html:1242               |
| `.cache-table-wrapper` background                         | `var(--oh-color-bg-surface)`                               | oui                                                                                         | sidebar.html:1246               |
| `.cache-table-wrapper` border                             | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1247               |
| `.cache-table th` background                              | `var(--oh-color-bg-panel)`                                 | oui                                                                                         | sidebar.html:1259               |
| `.cache-table th` color                                   | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1260               |
| `.cache-table th` border-bottom                           | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1263               |
| `.cache-table td` color                                   | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:1267               |
| `.cache-table td` border-bottom                           | `var(--oh-color-border-subtle)`                            | oui                                                                                         | sidebar.html:1268               |
| `.btn-danger-ghost` border                                | `var(--oh-color-border-default)`                           | oui                                                                                         | sidebar.html:1275               |
| `.btn-danger-ghost` color                                 | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1277               |
| `.btn-danger-ghost:hover` border-color                    | `var(--oh-color-error)`                                    | oui                                                                                         | sidebar.html:1285               |
| `.btn-danger-ghost:hover` color                           | `var(--oh-color-error)`                                    | oui                                                                                         | sidebar.html:1286               |
| `.reset-confirm` color                                    | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1293               |
| `.btn-confirm-yes` background                             | `var(--oh-color-error)`                                    | oui                                                                                         | sidebar.html:1296               |
| `.btn-confirm-yes` color                                  | `#fff`                                                     | **HARDCODE**                                                                                | sidebar.html:1299               |
| `.btn-confirm-no` border                                  | `var(--oh-color-border-default)`                           | oui                                                                                         | sidebar.html:1308               |
| `.btn-confirm-no` color                                   | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1310               |
| Inline `#cache-empty-state` color                         | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:1898               |
| Inline empty-state titre color                            | `var(--oh-color-text-primary)`                             | oui                                                                                         | sidebar.html:1902               |
| Brand logo SVG `<g stroke>`                               | `currentColor`                                             | herite (via `.brand-logo` color)                                                            | sidebar.html:1334               |
| Inline JS `newFactInput.style.borderColor`                | `var(--error, #ef4444)`                                    | **var INEXISTANTE** (`--error` non defini → fallback `#ef4444` hardcode)                    | sidebar.html:2849, :2854, :2865 |
| Inline JS reset-confirm span color                        | `var(--oh-color-text-secondary)`                           | oui                                                                                         | sidebar.html:3161, :3191        |
| Inline JS `tdRatio` color                                 | `var(--oh-color-success)` / `var(--oh-color-text-primary)` | oui                                                                                         | sidebar.html:3139               |
| Inline JS ollama success status color                     | `var(--oh-color-success)`                                  | oui                                                                                         | sidebar.html:3005               |
| Inline JS ollama error status color                       | `var(--oh-color-error)`                                    | oui                                                                                         | sidebar.html:3012               |

#### nav-popup.html

| Element / propriete       | Valeur (ou var)     | Variable CSS source | Fichier:ligne      |
| ------------------------- | ------------------- | ------------------- | ------------------ |
| `html, body` background   | `transparent`       | non                 | nav-popup.html:48  |
| `.card` background        | `var(--bg)`         | oui (local)         | nav-popup.html:56  |
| `.card` border            | `var(--border)`     | oui (local)         | nav-popup.html:57  |
| `.item` background        | `transparent`       | non                 | nav-popup.html:69  |
| `.item` color             | `var(--text-sec)`   | oui (local)         | nav-popup.html:73  |
| `.item:hover` background  | `var(--hover-bg)`   | oui (local)         | nav-popup.html:81  |
| `.item:hover` color       | `var(--text)`       | oui (local)         | nav-popup.html:82  |
| `.item.active` background | `var(--active-bg)`  | oui (local)         | nav-popup.html:86  |
| `.item.active` color      | `var(--accent)`     | oui (local)         | nav-popup.html:87  |
| `.item .icon svg` stroke  | `currentColor`      | herite              | nav-popup.html:104 |
| `.item .shortcut` color   | `var(--text-muted)` | oui (local)         | nav-popup.html:116 |

### Border-radius reellement utilises

#### Valeurs DISTINCTES rencontrees (toutes vues confondues)

- `var(--radius-sm)` = `4px`
- `var(--radius-md)` = `8px`
- `var(--radius-lg)` = `12px`
- `var(--radius-full)` = `9999px`
- `50%` (hardcode, pour cercles)
- `2px` (hardcode, scrollbar-thumb)
- `0` (reset explicite sur status-ring loading)

| Element                                        | Valeur                        | Fichier:ligne     |
| ---------------------------------------------- | ----------------------------- | ----------------- |
| `#tab-indicator`                               | `var(--radius-md)` (8px)      | sidebar.html:227  |
| `.slot-btn`                                    | `var(--radius-md)` (8px)      | sidebar.html:257  |
| `.btn-config`                                  | `var(--radius-md)` (8px)      | sidebar.html:342  |
| `.slot-btn .status-ring`                       | `50%`                         | sidebar.html:391  |
| `.slot-btn.loading .status-ring`               | `0` (override)                | sidebar.html:405  |
| `.tooltip`                                     | `var(--radius-sm)` (4px)      | sidebar.html:432  |
| `.dropdown-trigger`                            | `var(--radius-sm)` (4px)      | sidebar.html:484  |
| `.config-card`                                 | `var(--radius-lg)` (12px)     | sidebar.html:584  |
| `.config-tab`                                  | `var(--radius-md)` (8px)      | sidebar.html:623  |
| `.btn-close-cfg`                               | `var(--radius-md)` (8px)      | sidebar.html:703  |
| `.config-tab-content::-webkit-scrollbar-thumb` | `2px`                         | sidebar.html:737  |
| `.settings-group-card`                         | `var(--radius-lg)` (12px)     | sidebar.html:760  |
| `.switch-slider`                               | `var(--radius-full)` (9999px) | sidebar.html:812  |
| `.switch-slider::before`                       | `50%`                         | sidebar.html:824  |
| `.form-input`                                  | `var(--radius-md)` (8px)      | sidebar.html:845  |
| `.form-select`                                 | `var(--radius-md)` (8px)      | sidebar.html:870  |
| `.btn-icon`                                    | `var(--radius-sm)` (4px)      | sidebar.html:917  |
| `.btn-reveal`                                  | `var(--radius-sm)` (4px)      | sidebar.html:943  |
| `.config-toast`                                | `var(--radius-full)` (9999px) | sidebar.html:975  |
| `.fact-list::-webkit-scrollbar-thumb`          | `2px`                         | sidebar.html:1013 |
| `.fact-item`                                   | `var(--radius-md)` (8px)      | sidebar.html:1022 |
| `.btn-add-fact`                                | `var(--radius-md)` (8px)      | sidebar.html:1058 |
| `.update-item-icon`                            | `var(--radius-md)` (8px)      | sidebar.html:1088 |
| `.btn-update`                                  | `var(--radius-md)` (8px)      | sidebar.html:1117 |
| `.ollama-model-card`                           | `var(--radius-lg)` (12px)     | sidebar.html:1145 |
| `.ollama-progress-container`                   | `var(--radius-full)` (9999px) | sidebar.html:1167 |
| `.btn-ollama`                                  | `var(--radius-sm)` (4px)      | sidebar.html:1183 |
| `.cache-stat-card`                             | `var(--radius-lg)` (12px)     | sidebar.html:1210 |
| `.cache-stat-bar-container`                    | `var(--radius-full)` (9999px) | sidebar.html:1236 |
| `.cache-stat-bar`                              | `var(--radius-full)` (9999px) | sidebar.html:1243 |
| `.cache-table-wrapper`                         | `var(--radius-lg)` (12px)     | sidebar.html:1248 |
| `.btn-danger-ghost`                            | `var(--radius-md)` (8px)      | sidebar.html:1276 |
| `.btn-confirm-yes`                             | `var(--radius-md)` (8px)      | sidebar.html:1298 |
| `.btn-confirm-no`                              | `var(--radius-md)` (8px)      | sidebar.html:1309 |
| `.card` (nav-popup)                            | `var(--radius-lg)` (12px)     | nav-popup.html:58 |
| `.item` (nav-popup)                            | `var(--radius-md)` (8px)      | nav-popup.html:70 |

### Typographie

Police principale partout : `var(--font)` = `-apple-system, BlinkMacSystemFont, "SF Pro Text"...` (sidebar inclut aussi `"SF Pro Display"`, pas nav-popup). Police mono : `var(--font-mono)` = `"SF Mono", "Monaco", "Menlo", monospace`.

| Element                       | Font                                                                                                 | Size      | Weight    | Line-height | Fichier:ligne          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | --------- | --------- | ----------- | ---------------------- |
| `html, body` (sidebar)        | `var(--font)`                                                                                        | (non def) | (non def) | (non def)   | sidebar.html:138       |
| `.brand-title`                | `-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif` (HARDCODE, n'utilise PAS `--font`) | `13px`    | `600`     | (non def)   | sidebar.html:175-178   |
| `.slot-btn`                   | (herite)                                                                                             | `13px`    | `500`     | (non def)   | sidebar.html:264-265   |
| `.slot-label`                 | (herite)                                                                                             | `13px`    | `500`     | (non def)   | sidebar.html:310-311   |
| `.dropdown-trigger`           | `var(--font)`                                                                                        | `13px`    | `600`     | (non def)   | sidebar.html:488-490   |
| `.config-nav-title`           | (herite)                                                                                             | `12px`    | `500`     | (non def)   | sidebar.html:610-611   |
| `.config-tab`                 | `var(--font)` (raccourci `font: 500 13px/1.2`)                                                       | `13px`    | `500`     | `1.2`       | sidebar.html:624       |
| `.config-nav-hint`            | (herite)                                                                                             | `11px`    | (non def) | (non def)   | sidebar.html:660       |
| `.config-main-heading h2`     | (herite)                                                                                             | `17px`    | `600`     | (non def)   | sidebar.html:690-691   |
| `.config-main-heading p`      | (herite)                                                                                             | `12px`    | (non def) | (non def)   | sidebar.html:695       |
| `.settings-group-title`       | `var(--font)` (raccourci `font: 600 11px/1`) + `text-transform:uppercase`                            | `11px`    | `600`     | `1`         | sidebar.html:750       |
| `.setting-label`              | `var(--font)` (raccourci `font: 500 13px/1.3`)                                                       | `13px`    | `500`     | `1.3`       | sidebar.html:780       |
| `.setting-desc`               | `var(--font)` (raccourci `font: 400 12px/1.4`)                                                       | `12px`    | `400`     | `1.4`       | sidebar.html:787       |
| `.form-input`                 | `var(--font)` (raccourci `font: 400 13px`)                                                           | `13px`    | `400`     | (non def)   | sidebar.html:849       |
| `.form-input--mono`           | `var(--font-mono)`                                                                                   | `12px`    | (herite)  | (non def)   | sidebar.html:854-855   |
| `.form-input::placeholder`    | `var(--font)`                                                                                        | `12px`    | (non def) | (non def)   | sidebar.html:863-864   |
| `.form-select`                | `var(--font)` (raccourci `font: 400 12px`)                                                           | `12px`    | `400`     | (non def)   | sidebar.html:874       |
| `.form-select--mono`          | `var(--font-mono)`                                                                                   | (herite)  | (herite)  | (non def)   | sidebar.html:898       |
| `.tooltip`                    | (herite)                                                                                             | `11px`    | `500`     | (non def)   | sidebar.html:429-430   |
| `.fact-item`                  | (herite)                                                                                             | `12px`    | (non def) | (non def)   | sidebar.html:1023      |
| `.btn-add-fact`               | `var(--font)`                                                                                        | `12px`    | `600`     | (non def)   | sidebar.html:1060-1066 |
| `.memory-token-hint`          | (herite)                                                                                             | `11px`    | (non def) | (non def)   | sidebar.html:1070      |
| `.update-item-icon`           | (herite)                                                                                             | `13px`    | `600`     | (non def)   | sidebar.html:1093-1094 |
| `.update-item-name`           | (herite)                                                                                             | `13px`    | `500`     | (non def)   | sidebar.html:1101-1102 |
| `.update-item-status`         | (herite)                                                                                             | `12px`    | (non def) | (non def)   | sidebar.html:1106      |
| `.btn-update`                 | `var(--font)`                                                                                        | `12px`    | `500`     | (non def)   | sidebar.html:1120-1122 |
| `.ollama-model-name`          | (herite)                                                                                             | `13px`    | `600`     | (non def)   | sidebar.html:1156-1157 |
| `.ollama-model-status`        | (herite)                                                                                             | `12px`    | (non def) | (non def)   | sidebar.html:1161      |
| `.btn-ollama`                 | `var(--font)`                                                                                        | `12px`    | `500`     | (non def)   | sidebar.html:1180-1188 |
| `.cache-stat-label`           | (herite)                                                                                             | `12px`    | `500`     | (non def)   | sidebar.html:1217-1220 |
| `.cache-stat-value`           | `var(--font)`                                                                                        | `24px`    | `700`     | (non def)   | sidebar.html:1223-1226 |
| `.cache-stat-sub`             | (herite)                                                                                             | `11px`    | (non def) | (non def)   | sidebar.html:1230      |
| `.cache-table`                | (herite)                                                                                             | `12px`    | (non def) | (non def)   | sidebar.html:1256      |
| `.cache-table th`             | (herite)                                                                                             | (herite)  | `600`     | (non def)   | sidebar.html:1261      |
| `.btn-danger-ghost`           | `var(--font)`                                                                                        | `12px`    | `500`     | (non def)   | sidebar.html:1278-1282 |
| `.btn-confirm-yes`            | `var(--font)`                                                                                        | `12px`    | `500`     | (non def)   | sidebar.html:1300-1304 |
| `.btn-confirm-no`             | `var(--font)`                                                                                        | `12px`    | (non def) | (non def)   | sidebar.html:1311-1314 |
| `.config-toast`               | (herite)                                                                                             | `12px`    | (non def) | (non def)   | sidebar.html:978       |
| `.item` (nav-popup)           | `var(--font)`                                                                                        | `13px`    | `500`     | (non def)   | nav-popup.html:74-76   |
| `.item.active` (nav-popup)    | (herite)                                                                                             | `13px`    | `600`     | (non def)   | nav-popup.html:88      |
| `.item .shortcut` (nav-popup) | (herite)                                                                                             | `11px`    | `400`     | (non def)   | nav-popup.html:115-117 |

Echelle de font-size DISTINCTE observee : `11px`, `12px`, `13px`, `17px`, `24px`.
Echelle de font-weight DISTINCTE : `400`, `500`, `600`, `700`.

### Espacements (padding / margin / gap)

Valeurs DISTINCTES via tokens : `--space-1`=4px, `--space-2`=8px, `--space-3`=12px, `--space-4`=16px, `--space-5`=20px, `--space-6`=24px. Beaucoup de valeurs hardcodees coexistent (`2px`, `4px`, `5px 10px`, `6px`, `6px 10px`, `6px 14px`, `7px 10px`, `8px 12px`, `10px`, `10px 14px`, `0 10px`, `0 14px`, etc.).

| Element                             | Propriete        | Valeur                                         | Fichier:ligne        |
| ----------------------------------- | ---------------- | ---------------------------------------------- | -------------------- |
| `*` reset                           | margin / padding | `0`                                            | sidebar.html:15-16   |
| `.bottom-row`                       | padding          | `0 16px` (HARDCODE)                            | sidebar.html:208     |
| `.tabs-container`                   | gap              | `4px` (HARDCODE)                               | sidebar.html:216     |
| `.slot-btn`                         | gap              | `6px` (HARDCODE)                               | sidebar.html:253     |
| `.slot-btn`                         | padding          | `0 14px` (HARDCODE)                            | sidebar.html:255     |
| `.slot-btn` (max680)                | padding          | `0 10px` (HARDCODE)                            | sidebar.html:321     |
| `.btn-config`                       | right            | `16px` (HARDCODE)                              | sidebar.html:349     |
| `.brand-title`                      | gap              | `6px` (HARDCODE)                               | sidebar.html:174     |
| `.tooltip`                          | padding          | `5px 10px` (HARDCODE)                          | sidebar.html:431     |
| `.dropdown-trigger`                 | gap              | `6px` (HARDCODE)                               | sidebar.html:480     |
| `.dropdown-trigger`                 | padding          | `0 10px` (HARDCODE)                            | sidebar.html:481     |
| `#config-panel`                     | padding          | `var(--space-6)`                               | sidebar.html:557     |
| `.config-nav`                       | padding          | `var(--space-4) var(--space-2) var(--space-3)` | sidebar.html:606     |
| `.config-nav`                       | gap              | `2px` (HARDCODE)                               | sidebar.html:607     |
| `.config-nav-title`                 | padding          | `0 var(--space-2) var(--space-2)`              | sidebar.html:613     |
| `.config-tab`                       | gap              | `var(--space-2)`                               | sidebar.html:618     |
| `.config-tab`                       | padding          | `7px 10px` (HARDCODE)                          | sidebar.html:620     |
| `.config-tab` (max720)              | padding          | `10px` (HARDCODE)                              | sidebar.html:1323    |
| `.config-nav-hint`                  | gap              | `6px` (HARDCODE)                               | sidebar.html:658     |
| `.config-nav-hint`                  | padding          | `6px 10px` (HARDCODE)                          | sidebar.html:659     |
| `.config-main-header`               | padding          | `var(--space-5) var(--space-6) var(--space-3)` | sidebar.html:686     |
| `.config-main-heading p`            | margin-top       | `2px` (HARDCODE)                               | sidebar.html:697     |
| `.config-tab-content`               | padding          | `0 var(--space-6) var(--space-6)`              | sidebar.html:731     |
| `.settings-group`                   | margin           | `0 0 var(--space-5)`                           | sidebar.html:745     |
| `.settings-group-title`             | padding          | `0 var(--space-1)`                             | sidebar.html:754     |
| `.settings-group-title`             | margin-bottom    | `var(--space-2)`                               | sidebar.html:755     |
| `.setting-row`                      | gap              | `var(--space-4)`                               | sidebar.html:768     |
| `.setting-row`                      | padding          | `var(--space-3) var(--space-4)`                | sidebar.html:769     |
| `.setting-desc`                     | margin-top       | `2px` (HARDCODE)                               | sidebar.html:789     |
| `.form-input`                       | padding          | `0 var(--space-3)`                             | sidebar.html:844     |
| `.form-select`                      | padding          | `0 var(--space-3)`                             | sidebar.html:869     |
| `.key-input-group`                  | gap              | `var(--space-2)`                               | sidebar.html:906     |
| `.config-toast`                     | bottom / right   | `var(--space-4)` / `var(--space-6)`            | sidebar.html:968-969 |
| `.config-toast`                     | gap              | `6px` (HARDCODE)                               | sidebar.html:973     |
| `.config-toast`                     | padding          | `0 var(--space-3)`                             | sidebar.html:974     |
| `.fact-list`                        | gap              | `4px` (HARDCODE)                               | sidebar.html:1007    |
| `.fact-list`                        | margin-bottom    | `var(--space-2)`                               | sidebar.html:1008    |
| `.fact-item`                        | gap              | `var(--space-2)`                               | sidebar.html:1018    |
| `.fact-item`                        | padding          | `7px 10px` (HARDCODE)                          | sidebar.html:1019    |
| `.add-fact-row`                     | gap              | `var(--space-2)`                               | sidebar.html:1051    |
| `.add-fact-row`                     | margin-top       | `var(--space-2)`                               | sidebar.html:1052    |
| `.btn-add-fact`                     | padding          | `0 var(--space-3)`                             | sidebar.html:1062    |
| `.memory-token-hint`                | margin-top       | `var(--space-2)`                               | sidebar.html:1072    |
| `.update-item`                      | gap              | `var(--space-3)`                               | sidebar.html:1079    |
| `.update-item`                      | padding          | `var(--space-3) var(--space-4)`                | sidebar.html:1080    |
| `.update-item-status`               | margin-top       | `1px` (HARDCODE)                               | sidebar.html:1108    |
| `.btn-update`                       | padding          | `6px 14px` (HARDCODE)                          | sidebar.html:1115    |
| `#ollama-model-manager`             | margin-top       | `var(--space-3)`                               | sidebar.html:1141    |
| `.ollama-model-card`                | padding          | `var(--space-3)`                               | sidebar.html:1146    |
| `.ollama-model-card`                | margin-bottom    | `var(--space-2)`                               | sidebar.html:1147    |
| `.ollama-model-header`              | margin-bottom    | `var(--space-2)`                               | sidebar.html:1153    |
| `.ollama-progress-container`        | margin-bottom    | `var(--space-2)`                               | sidebar.html:1169    |
| `.ollama-actions`                   | gap              | `var(--space-2)`                               | sidebar.html:1177    |
| `.btn-ollama`                       | padding          | `6px` (HARDCODE)                               | sidebar.html:1180    |
| `.cache-stats-grid`                 | gap              | `var(--space-3)`                               | sidebar.html:1204    |
| `.cache-stats-grid`                 | margin-bottom    | `var(--space-5)`                               | sidebar.html:1205    |
| `.cache-stat-card`                  | padding          | `var(--space-4)`                               | sidebar.html:1211    |
| `.cache-stat-label`                 | margin-bottom    | `6px` (HARDCODE)                               | sidebar.html:1219    |
| `.cache-stat-sub`                   | margin-top       | `var(--space-1)`                               | sidebar.html:1231    |
| `.cache-stat-bar-container`         | margin-top       | `var(--space-3)`                               | sidebar.html:1237    |
| `.cache-table-wrapper`              | margin-top       | `var(--space-2)`                               | sidebar.html:1250    |
| `.cache-table th`                   | padding          | `10px 14px` (HARDCODE)                         | sidebar.html:1262    |
| `.cache-table td`                   | padding          | `10px 14px` (HARDCODE)                         | sidebar.html:1266    |
| `.btn-danger-ghost`                 | padding          | `5px 12px` (HARDCODE)                          | sidebar.html:1280    |
| `.reset-confirm`                    | gap              | `var(--space-2)`                               | sidebar.html:1291    |
| `.btn-confirm-yes`                  | padding          | `5px 12px` (HARDCODE)                          | sidebar.html:1302    |
| `.btn-confirm-no`                   | padding          | `5px 12px` (HARDCODE)                          | sidebar.html:1312    |
| Inline `ollama-model-manager` title | margin-top       | `12px` (HARDCODE)                              | sidebar.html:1547    |
| Inline `vision-options-group`       | margin-top       | `8px` (HARDCODE)                               | sidebar.html:1637    |
| Inline memory-profile wrapper       | padding          | `0 var(--space-4) var(--space-3)`              | sidebar.html:1689    |
| Inline empty-state                  | padding          | `40px 20px` (HARDCODE)                         | sidebar.html:1898    |
| `.card` (nav-popup)                 | padding          | `4px` (HARDCODE)                               | nav-popup.html:59    |
| `.item` (nav-popup)                 | gap              | `10px` (HARDCODE)                              | nav-popup.html:66    |
| `.item` (nav-popup)                 | padding          | `8px 12px` (HARDCODE)                          | nav-popup.html:68    |

### Ombres, transitions, z-index

#### Ombres (box-shadow) — valeurs DISTINCTES

| Element                                        | Propriete                   | Valeur                                                                  | Fichier:ligne        |
| ---------------------------------------------- | --------------------------- | ----------------------------------------------------------------------- | -------------------- |
| `.slot-btn.ready .status-ring`                 | box-shadow                  | `0 0 4px var(--oh-color-success)` (HARDCODE blur, couleur token)        | sidebar.html:417     |
| `.tooltip`                                     | box-shadow                  | `0 4px 12px rgba(0, 0, 0, 0.4)` (HARDCODE — n'utilise pas `--shadow-*`) | sidebar.html:438     |
| `.config-card`                                 | box-shadow                  | `var(--shadow-lg)`                                                      | sidebar.html:591     |
| `.switch-slider::before`                       | box-shadow                  | `var(--shadow-xs)`                                                      | sidebar.html:825     |
| `.switch input:focus-visible + .switch-slider` | box-shadow                  | `0 0 0 3px var(--oh-color-accent-subtle-hover)` (HARDCODE spread)       | sidebar.html:836     |
| `.form-input:focus`                            | box-shadow                  | `0 0 0 3px var(--oh-color-accent-subtle)` (HARDCODE spread)             | sidebar.html:859     |
| `.form-select:focus`                           | box-shadow                  | `0 0 0 3px var(--oh-color-accent-subtle)` (HARDCODE spread)             | sidebar.html:882     |
| nav-popup                                      | (aucune box-shadow definie) | NON DEFINI                                                              | nav-popup.html (n/a) |

> Note : `--shadow-sm` et `--shadow-md` sont DEFINIS mais **jamais utilises** dans sidebar.html. Seuls `--shadow-xs` (1x) et `--shadow-lg` (1x) sont consommes.

#### Transitions / animations

| Element                                          | Propriete                                | Valeur                                                                                                | Fichier:ligne          |
| ------------------------------------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------- |
| `prefers-reduced-motion`                         | transition-duration / animation-duration | `0.01ms !important`                                                                                   | sidebar.html:127-128   |
| `#tab-indicator`                                 | transition                               | `width/left var(--duration-250) var(--ease-default), opacity var(--duration-150) var(--ease-default)` | sidebar.html:230-233   |
| `.slot-btn`                                      | transition                               | `color/background/transform var(--duration-150) var(--ease-default)`                                  | sidebar.html:266-269   |
| `.slot-btn:active`                               | transform                                | `scale(0.97)`                                                                                         | sidebar.html:278       |
| `.slot-btn.loading .status-ring`                 | animation                                | `oh-spin 1.8s linear infinite`                                                                        | sidebar.html:406       |
| `@keyframes oh-spin`                             | rotate                                   | `0deg → 360deg`                                                                                       | sidebar.html:409-412   |
| `.btn-config`                                    | transition                               | `color/background/transform var(--duration-150) var(--ease-default)`                                  | sidebar.html:355-358   |
| `.btn-config:active`                             | transform                                | `scale(0.97)`                                                                                         | sidebar.html:367       |
| `.tooltip` (hover)                               | transform                                | `translateX(-50%) translateY(0)` (depart `-4px`)                                                      | sidebar.html:426, :444 |
| `.dropdown-trigger`                              | transition                               | `background var(--duration-150) var(--ease-default)`                                                  | sidebar.html:491       |
| `.dropdown-trigger .trigger-chevron`             | transition                               | `transform var(--duration-150) var(--ease-default)`                                                   | sidebar.html:526       |
| `.dropdown-trigger.open .trigger-chevron`        | transform                                | `rotate(180deg)`                                                                                      | sidebar.html:540       |
| `#config-backdrop`                               | transition                               | `opacity var(--duration-250) var(--ease-out)`                                                         | sidebar.html:572       |
| `.config-card`                                   | transition                               | `opacity var(--duration-250) var(--ease-out)`                                                         | sidebar.html:593       |
| `.config-tab`                                    | transition                               | `background var(--transition), color var(--transition)`                                               | sidebar.html:629       |
| `.btn-close-cfg`                                 | transition                               | `background var(--transition), color var(--transition)`                                               | sidebar.html:711       |
| `.switch-slider`                                 | transition                               | `background/border-color var(--duration-200) var(--ease-default)`                                     | sidebar.html:813-814   |
| `.switch-slider::before`                         | transition                               | `transform var(--duration-200) var(--ease-default)`                                                   | sidebar.html:826       |
| `.switch input:checked + .switch-slider::before` | transform                                | `translateX(20px)`                                                                                    | sidebar.html:833       |
| `.form-input`                                    | transition                               | `border-color var(--transition)`                                                                      | sidebar.html:851       |
| `.form-select`                                   | transition                               | `border-color var(--transition)`                                                                      | sidebar.html:878       |
| `.btn-icon`                                      | transition                               | `color var(--transition), background var(--transition)`                                               | sidebar.html:925       |
| `.config-toast`                                  | transition                               | `opacity/transform var(--duration-200) var(--ease-out)`                                               | sidebar.html:982-983   |
| `.config-toast` (hidden)                         | transform                                | `translateY(4px)`                                                                                     | sidebar.html:981       |
| `.ollama-progress-bar`                           | transition                               | `width var(--duration-200) var(--ease-default)`                                                       | sidebar.html:1175      |
| `.item` (nav-popup)                              | transition                               | `background 150ms ease, color 150ms ease` (HARDCODE — pas de tokens)                                  | nav-popup.html:77      |

#### z-index — valeurs DISTINCTES : `-1`, `10`, `50`, `99`, `100`, `200`

| Element            | Propriete | Valeur             | Fichier:ligne        |
| ------------------ | --------- | ------------------ | -------------------- |
| `.header`          | z-index   | `50`               | sidebar.html:153     |
| `#tab-indicator`   | z-index   | `-1`               | sidebar.html:228     |
| `.tooltip`         | z-index   | `200`              | sidebar.html:437     |
| `#config-panel`    | z-index   | `100`              | sidebar.html:552     |
| `#config-backdrop` | z-index   | `99`               | sidebar.html:567     |
| `.config-card`     | z-index   | `100`              | sidebar.html:581     |
| `.config-toast`    | z-index   | `10`               | sidebar.html:985     |
| nav-popup          | z-index   | NON DEFINI (aucun) | nav-popup.html (n/a) |

### Incoherences internes detectees (Sidebar + Nav-popup)

1. **Deux systemes de tokens paralleles, valeurs dupliquees (CRITIQUE).** `nav-popup.html:17-29` redefinit en local (`--bg`, `--border`, `--text`, `--accent`, `--active-bg`, `--hover-bg`...) exactement les memes valeurs que `--oh-*` de `sidebar.html`, mais sous d'autres noms. Ex : `--accent:#14b8a6` (nav-popup.html:22) duplique `--oh-color-accent-primary:#14b8a6` (sidebar.html:36). Toute evolution de la palette doit etre faite a deux endroits → derive garantie. Le nav-popup est pourtant la continuite visuelle directe de la sidebar.

2. **Variable CSS inexistante `--error` dans le JS de sidebar.** Aux lignes sidebar.html:2849, :2854, :2865, le code fait `borderColor = "var(--error, #ef4444)"`. La variable `--error` n'est JAMAIS definie (le token reel est `--oh-color-error`). Le rendu retombe systematiquement sur le fallback hardcode `#ef4444`, qui se trouve coincider avec la valeur dark mais PAS avec la valeur light (`#dc2626`). En light mode la bordure d'erreur sera donc fausse.

3. **`.btn-ollama.cancel:hover` background `rgba(248, 113, 113, 0.1)` (sidebar.html:1196).** Cette teinte derive de `#f87171` alors que `--oh-color-error` vaut `#ef4444` (dark) / `#dc2626` (light). Couleur d'erreur hardcodee divergente du token a cote d'une `border-color: var(--oh-color-error)` (ligne 1197) sur le meme selecteur → deux rouges differents sur le meme element.

4. **`.brand-title` font-family hardcodee (sidebar.html:178)** : `-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif` au lieu de `var(--font)`. C'est la seule occurrence qui n'utilise pas le token police ; en plus elle privilegie "SF Pro Display" alors que `--font` ordonne d'abord "SF Pro Text".

5. **`.tooltip` box-shadow hardcodee (sidebar.html:438)** : `0 4px 12px rgba(0,0,0,0.4)` alors qu'il existe `--shadow-md` (`0 4px 16px ...`). Valeur d'ombre ad hoc a cote d'un systeme `--shadow-*`. De plus `--shadow-sm` et `--shadow-md` sont definis mais jamais consommes (dead tokens).

6. **Hover backgrounds entierement hardcodes** : `rgba(255,255,255,0.05)` (dark) et `rgba(0,0,0,0.03~0.04)` (light) repetes pour `.slot-btn:hover`, `.btn-config:hover`, `.dropdown-trigger:hover` (sidebar.html:273,283,362,372,495,500). Aucun token `--oh-color-bg-hover` n'existe alors que `nav-popup.html` a su isoler `--hover-bg` (nav-popup.html:24). Incoherence d'approche entre les deux fichiers + valeurs non factorisees.

7. **`#fff` hardcode pour le texte/pouce** au lieu d'un token : `.switch-slider::before` (sidebar.html:823), `.btn-update.primary` (sidebar.html:1135), `.btn-confirm-yes` (sidebar.html:1299). Pas de token `--oh-color-text-on-accent` / `--oh-color-white`.

8. **Espacements mixtes token + hardcode.** Le systeme `--space-*` existe et est largement utilise, mais cohabite avec de nombreuses valeurs brutes pour des cas quasi identiques : padding boutons `5px 12px` / `6px 14px` / `6px` / `7px 10px` ; gaps `2px` / `4px` / `6px` ; margins `1px` / `2px` / `6px` / `8px` / `12px`. Notamment `--space-1` vaut `4px` mais `4px` est ecrit en dur a `.tabs-container` gap (sidebar.html:216) et `.fact-list` gap (sidebar.html:1007).

9. **`#tab-indicator` background redondant** : defini en CSS via `var(--oh-color-bg-active)` (sidebar.html:225) PUIS re-set en JS via `indicator.style.background = "var(--oh-color-bg-active)"` (sidebar.html:2027). Double source de verite inline.

10. **nav-popup : `--radius-full` (nav-popup.html:29) defini mais jamais utilise** (dead token). Et la transition de `.item` est hardcodee `150ms ease` (nav-popup.html:77) sans token de duree/easing, alors que la sidebar a `--duration-150` + `--ease-default`. Easing different (`ease` natif vs `cubic-bezier(0.4,0,0.2,1)`) entre deux composants visuellement contigus.

11. **Police nav-popup vs sidebar legerement divergente.** `--font` de nav-popup (nav-popup.html:25) = `..."SF Pro Text", sans-serif` SANS `"SF Pro Display"`, alors que `--font` sidebar (sidebar.html:61-62) inclut `"SF Pro Display"`. Stacks de police non identiques entre les deux fichiers du meme systeme de navigation.

---

## Vue Global — Overrides injectés (notre code)

**Vue traitée :** Overrides globaux injectés dans TOUTES les WebContentsView des apps tierces.
**Fichiers analysés (lus en entier) :**

- `electron/overrides/global/theme.css` (134 lignes)
- `electron/overrides/global/layout.css` (6 lignes — vide de règles, commentaire uniquement)
- `electron/overrides/global/theme.js` (219 lignes)

**Source de marque référencée (commentaires) :** `fichier-de-la-marque/brand_colors.json`, `fichier-de-la-marque/typography.json`, `fichier-de-la-marque/design_system.md` (cités en `theme.css:6-8`, NON lus dans cette phase).

> Note méthodologique : `layout.css` est intentionnellement vide de règles CSS (commentaire `layout.css:4` : « This file is intentionally minimal — no global layout to avoid breaking apps. »). Aucune valeur design extractible.

### Tokens / variables CSS définies ici (`:root` et équivalents)

Tous les tokens définis ici concernent l'**animation** (easing + durations). Aucun token de couleur, de radius, d'espacement ou de typographie n'est défini sous forme de variable CSS dans ces fichiers. Les valeurs sont identiques en dark et light (définis une seule fois dans `:root`, ligne 14).

| Variable            | Valeur dark                                     | Valeur light  | Fichier:ligne |
| ------------------- | ----------------------------------------------- | ------------- | ------------- |
| `--oh-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)`                  | idem (unique) | theme.css:20  |
| `--oh-ease-in`      | `cubic-bezier(0.4, 0, 1, 1)`                    | idem (unique) | theme.css:21  |
| `--oh-ease-out`     | `cubic-bezier(0, 0, 0.2, 1)`                    | idem (unique) | theme.css:22  |
| `--oh-ease-spring`  | `cubic-bezier(0.34, 1.56, 0.64, 1)`             | idem (unique) | theme.css:23  |
| `--oh-duration-75`  | `75ms`                                          | idem (unique) | theme.css:25  |
| `--oh-duration-150` | `150ms`                                         | idem (unique) | theme.css:26  |
| `--oh-duration-250` | `250ms`                                         | idem (unique) | theme.css:27  |
| `--oh-duration-350` | `350ms`                                         | idem (unique) | theme.css:28  |
| `--oh-transition`   | `var(--oh-duration-150) var(--oh-ease-default)` | idem (unique) | theme.css:30  |

> **Aucun token `--oh-color-*`, `--oh-radius-*`, `--oh-space-*`, `--oh-font-*` n'est défini ici.** Le système de tokens `--oh-*` mentionné dans `electron/sidebar.html` (ex. `--oh-color-accent-primary:#14b8a6`) n'est PAS réutilisé dans cette vue : aucune référence `var(--oh-color-*)` n'apparaît dans ces 3 fichiers (vérifié — `A VERIFIER` côté sidebar.html, hors périmètre de cette phase).
> Les tokens d'animation définis ici (`--oh-ease-*`, `--oh-duration-*`, `--oh-transition`) ne sont **jamais consommés** dans ces mêmes fichiers (aucun `var(--oh-ease-...)` / `var(--oh-transition)` utilisé dans theme.css ni theme.js).

### Couleurs réellement utilisées

Toutes les couleurs sont **hardcodées** (aucune via `var(--oh-color-*)`). Regroupées par valeur distincte ; occurrences signalées.

| Élément / propriété                                       | Valeur (ou var)             | Variable CSS source           | Fichier:ligne |
| --------------------------------------------------------- | --------------------------- | ----------------------------- | ------------- |
| `:root, html, body` → `background-color` (mode clair)     | `#ffffff`                   | aucune (hardcodé)             | theme.css:37  |
| `:root, html, body` → `color` (mode clair)                | `#111111`                   | aucune (hardcodé)             | theme.css:38  |
| `html, body` → `background-color` (mode sombre)           | `#0a0a0a`                   | aucune (hardcodé)             | theme.css:52  |
| `html, body` → `color` (mode sombre)                      | `#ececec`                   | aucune (hardcodé)             | theme.css:53  |
| `::-webkit-scrollbar-track` → `background`                | `transparent`               | aucune                        | theme.css:63  |
| `::-webkit-scrollbar-thumb` → `background` (clair)        | `rgba(0, 0, 0, 0.1)`        | aucune                        | theme.css:66  |
| `::-webkit-scrollbar-thumb:hover` → `background` (clair)  | `rgba(0, 0, 0, 0.16)`       | aucune                        | theme.css:70  |
| `::-webkit-scrollbar-thumb` → `background` (sombre)       | `rgba(255, 255, 255, 0.08)` | aucune                        | theme.css:75  |
| `::-webkit-scrollbar-thumb:hover` → `background` (sombre) | `rgba(255, 255, 255, 0.14)` | aucune                        | theme.css:78  |
| `::selection` → `background` (clair)                      | `rgba(13, 148, 136, 0.15)`  | aucune (teal `#0D9488` @ 15%) | theme.css:84  |
| `::selection` → `color` (clair)                           | `#111111`                   | aucune                        | theme.css:85  |
| `::selection` → `background` (sombre)                     | `rgba(20, 184, 166, 0.25)`  | aucune (teal `#14B8A6` @ 25%) | theme.css:90  |
| `::selection` → `color` (sombre)                          | `#ffffff`                   | aucune                        | theme.css:91  |
| Drag overlay → `background`                               | `rgba(13, 148, 136, 0.06)`  | aucune (teal `#0D9488` @ 6%)  | theme.js:131  |
| Drag overlay → `border` color                             | `#0D9488` (teal)            | aucune                        | theme.js:132  |
| Drag label → `background`                                 | `rgba(0, 0, 0, 0.85)`       | aucune                        | theme.js:140  |
| Drag label → `border` color                               | `#2a2a2a`                   | aucune                        | theme.js:141  |
| Drag label → `color`                                      | `#ececec`                   | aucune                        | theme.js:142  |
| Drag label → `box-shadow` color                           | `rgba(0, 0, 0, 0.3)`        | aucune                        | theme.js:143  |

**Palette accent (teal) — formes distinctes rencontrées :**

- `#0D9488` (teal foncé) : theme.css:84 (via rgba), theme.js:131-132 — **3 occurrences**
- `#14B8A6` / `rgba(20,184,166,…)` (teal clair) : theme.css:90 — **1 occurrence**

> Les deux teals correspondent (par valeur) à l'accent de marque (`--oh-color-accent-primary:#14b8a6` mentionné dans sidebar.html), mais ils sont écrits **en dur** ici, jamais via token, et **deux nuances différentes** de teal coexistent (`#0D9488` vs `#14B8A6`).

### Border-radius réellement utilisés

| Élément                                         | Valeur | Fichier:ligne |
| ----------------------------------------------- | ------ | ------------- |
| `::-webkit-scrollbar-thumb`                     | `3px`  | theme.css:67  |
| Drag overlay (`dragOverlay.style.borderRadius`) | `12px` | theme.js:133  |

> Échelle observée : **2 valeurs distinctes — `3px` et `12px`**. Le label du drag overlay (theme.js:139-144) n'a **AUCUN** `border-radius` défini (NON DÉFINI), alors qu'il a un border, un background et une box-shadow — incohérence relevée plus bas.

### Typographie

| Élément                | Font                                                                                               | Size       | Weight     | Line-height | Fichier:ligne    |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ---------- | ---------- | ----------- | ---------------- |
| `:root, html, body`    | `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` | NON DÉFINI | NON DÉFINI | NON DÉFINI  | theme.css:39-45  |
| `:root` (rendu police) | `-webkit-font-smoothing: antialiased` ; `-moz-osx-font-smoothing: grayscale`                       | —          | —          | —           | theme.css:16-17  |
| Drag label (theme.js)  | NON DÉFINI (hérite)                                                                                | NON DÉFINI | NON DÉFINI | NON DÉFINI  | theme.js:139-144 |

> **Font principale :** stack système Apple — `SF Pro Text` puis `SF Pro Display` en tête, fallback `-apple-system` / `BlinkMacSystemFont` / `Helvetica Neue` / `sans-serif`.
> Aucune taille (`font-size`), aucun poids (`font-weight`), aucun interlignage (`line-height`) n'est défini dans ces 3 fichiers — entièrement délégué aux apps. Le drag label n'impose ni font-size ni font-family.

### Espacements (padding / margin / gap)

| Élément                     | Propriété                                    | Valeur              | Fichier:ligne    |
| --------------------------- | -------------------------------------------- | ------------------- | ---------------- |
| `::-webkit-scrollbar`       | `width`                                      | `6px`               | theme.css:59     |
| `::-webkit-scrollbar`       | `height`                                     | `6px`               | theme.css:60     |
| `::-webkit-scrollbar-thumb` | `border` (épaisseur implicite)               | —                   | —                |
| Drag overlay                | `inset`                                      | `0` (plein écran)   | theme.js:130     |
| Drag overlay                | `display:flex / alignItems / justifyContent` | `center` / `center` | theme.js:135-137 |
| Drag label                  | `padding`                                    | NON DÉFINI          | theme.js:139-144 |
| Drag label                  | `margin`                                     | NON DÉFINI          | theme.js:139-144 |

> **Quasi aucun système d'espacement** : seules les dimensions de scrollbar (`6px`) et l'`inset:0` du overlay sont présentes. Pas de tokens d'espacement, pas de `gap`, pas de `padding`/`margin` numériques. Le drag label n'a aucun padding (texte collé aux bords du fond noir) — voir incohérences.

### Ombres, transitions, z-index

| Élément                                            | Propriété         | Valeur                                       | Fichier:ligne   |
| -------------------------------------------------- | ----------------- | -------------------------------------------- | --------------- |
| `*:hover`                                          | `box-shadow`      | `none !important` (suppression globale)      | theme.css:110   |
| `*:hover`                                          | `outline`         | `none !important`                            | theme.css:111   |
| `button/[role=button]/.btn/a:hover`                | `box-shadow`      | `none !important` (redondant avec `*:hover`) | theme.css:118   |
| `[class*="ring"/"glow"/"sparkle"]`                 | `box-shadow`      | `none !important`                            | theme.css:126   |
| `[class*="ring"/"glow"/"sparkle"]`                 | `animation`       | `none !important`                            | theme.css:125   |
| `[data-role=modal], [role=dialog]`                 | `animation`       | `none !important`                            | theme.css:132   |
| `button/[role=button]/.btn:active`                 | `opacity`         | `0.8 !important`                             | theme.css:105   |
| Drag label                                         | `box-shadow`      | `0 8px 32px rgba(0, 0, 0, 0.3)`              | theme.js:143    |
| Drag overlay                                       | `z-index`         | `999999`                                     | theme.js:130    |
| **Transitions (tokens définis mais non utilisés)** | `--oh-transition` | `150ms cubic-bezier(0.4,0,0.2,1)`            | theme.css:30    |
| **Easing tokens (non utilisés)**                   | `--oh-ease-*`     | voir tableau Tokens                          | theme.css:20-23 |
| **Durations tokens (non utilisés)**                | `--oh-duration-*` | `75/150/250/350ms`                           | theme.css:25-28 |

> **Une seule ombre réelle** appliquée : `0 8px 32px rgba(0,0,0,0.3)` (drag label, theme.js:143).
> **Un seul z-index** : `999999` (drag overlay, theme.js:130).
> Les tokens de transition/easing/duration sont **déclarés mais jamais consommés** dans ces fichiers (aucune propriété `transition:` n'utilise `var(--oh-transition)`).
> Politique globale agressive : suppression de TOUTES les `box-shadow`/`outline` au hover via `*:hover` (theme.css:109-112) et suppression d'animations sur `ring/glow/sparkle` + dialogs.

### Incohérences internes détectées (Global)

1. **Tokens d'animation morts (définis, jamais utilisés).** `--oh-ease-default/in/out/spring`, `--oh-duration-75/150/250/350`, `--oh-transition` sont déclarés (theme.css:20-30) mais aucune règle de ces fichiers ne les consomme. Code décoratif inerte. (theme.css:20-30 vs reste du fichier)

2. **Tokens `--oh-*` de marque NON réutilisés ; couleurs 100 % hardcodées.** Alors que `sidebar.html` expose `--oh-color-accent-primary:#14b8a6`, cette vue n'utilise aucune `var(--oh-color-*)`. Tout l'accent teal est écrit en dur (theme.css:84, theme.js:131-132). Le contrat « système de tokens » n'est pas respecté ici.

3. **Deux nuances de teal pour le même rôle « accent ».** `#0D9488` (theme.css:84, theme.js:131-132) coexiste avec `#14B8A6` (theme.css:90). En mode clair la sélection et l'overlay utilisent `#0D9488` ; en mode sombre la sélection passe à `#14B8A6`. Choix possiblement intentionnel (dark vs light) mais **non tokenisé**, donc fragile et incohérent avec le token unique de marque.

4. **Drag overlay vs drag label : radius incohérent.** L'overlay a `border-radius:12px` (theme.js:133) mais le label interne n'a **AUCUN** `border-radius` (theme.js:139-144) alors qu'il porte un border, un background opaque et une box-shadow → coins carrés sur une carte qui devrait être arrondie. Incohérence visuelle directe.

5. **Drag label sans padding ni typographie.** Le label (theme.js:139-144) définit background/border/color/box-shadow/texte mais **aucun `padding`, aucun `font-size`, aucun `font-family`** → texte collé aux bords, taille de police héritée non maîtrisée.

6. **Échelle de border-radius incohérente / non systématisée.** Deux valeurs sans relation (`3px` scrollbar theme.css:67 ; `12px` overlay theme.js:133), aucune échelle commune, aucun token radius.

7. **Règle `*:hover` trop large (collatéraux).** `*:hover { box-shadow:none !important; outline:none !important }` (theme.css:109-112) supprime aussi les **outlines de focus au survol**, ce qui peut nuire à l'accessibilité (focus-visible masqué) — et rend redondante la règle `button…:hover` (theme.css:114-119).

8. **Bloc de règle vide.** Le sélecteur `button, [role="button"], .btn, a { }` (theme.css:96-100) est vide → résidu mort.

9. **Mode clair vs sombre : valeurs neutres non symétriques/non tokenisées.** Fond clair `#ffffff`/texte `#111111` (theme.css:37-38) vs fond sombre `#0a0a0a`/texte `#ececec` (theme.css:52-53). Aucune relation tokenisée ; valeurs en dur des deux côtés, dupliquées avec les scrollbars (`rgba(0,0,0,*)` vs `rgba(255,255,255,*)`).

10. **`layout.css` totalement vide de règles** (layout.css:1-6) : présent dans le système d'overrides mais n'apporte aucune valeur design (signalé, non un défaut en soi).

### Tableau récapitulatif des valeurs DISTINCTES (par catégorie) — Global

- **Couleurs neutres :** `#ffffff`, `#111111`, `#0a0a0a`, `#ececec`, `#2a2a2a`, `transparent` + alphas `rgba(0,0,0,0.1/0.16/0.3/0.85)`, `rgba(255,255,255,0.08/0.14)`.
- **Accent teal :** `#0D9488` (×3), `#14B8A6`/`rgba(20,184,166,…)` (×1), `rgba(13,148,136,0.06/0.15)`.
- **Border-radius :** `3px`, `12px`.
- **Dimensions :** scrollbar `6px`, overlay `inset:0`, z-index `999999`.
- **Ombre :** `0 8px 32px rgba(0,0,0,0.3)` (unique).
- **Font :** stack Apple `SF Pro Text/Display → -apple-system → BlinkMacSystemFont → Helvetica Neue → sans-serif` (unique). Aucune size/weight/line-height.
- **Animation tokens :** 4 easings + 4 durations + 1 transition (tous inutilisés).

---

## Incoherences internes (toutes vues)

Agrégation des incohérences signalées par chaque fichier de travail, regroupées par thème transversal. Chaque entrée renvoie à la vue et à la source.

### A. Fragmentation du système de tokens (inter-vues)

- **A1.** Chat redéfinit son propre `:root` `--*` (chat.html:20–65) au lieu de `--oh-*` ; deux sources de vérité. (Chat #1)
- **A2.** Projects redéfinit intégralement sa palette `--*` (projects.css:9-63), `--oh-` introuvable dans toute la vue. (Projects #1)
- **A3.** Nav-popup redéfinit en local `--bg`/`--border`/`--text`/`--accent`/`--active-bg`/`--hover-bg` (nav-popup.html:17-29), dupliquant les valeurs de `--oh-*` sous d'autres noms. (Sidebar/Nav #1, CRITIQUE)
- **A4.** Global n'utilise aucun `var(--oh-color-*)` ; couleurs 100 % hardcodées (theme.css:84, theme.js:131-132). (Global #2)
- **A5.** Police divergente entre fichiers du même système nav : nav-popup `--font` sans "SF Pro Display" (nav-popup.html:25) vs sidebar `--font` avec (sidebar.html:61-62). Ordre des familles également variable selon les vues. (Sidebar/Nav #11)

### B. Variables CSS référencées mais non définies (bugs de rendu)

- **B1.** Chat : `--text-base` (chat.html:1622) et `--text-strong` (chat.html:1631) jamais définis → couleur du menu « + » par accident. (Chat #2)
- **B2.** Sidebar : `var(--error, #ef4444)` dans le JS (sidebar.html:2849, :2854, :2865) — `--error` inexistant (le vrai token est `--oh-color-error`) → fallback `#ef4444` faux en light (`#dc2626` attendu). (Sidebar/Nav #2)
- **B3.** Projects : `var(--error, #ef4444)` (modals.js:446, 452) — même schéma de fallback hardcodé. (Projects #8)

### C. Couleurs « texte sur accent » non tokenisées (`#fff`/`white`)

- **C1.** Chat : `#fff` répété ≥ 9 fois (chat.html:651, 690, 1690, 1816, 1927, 2322…), pas de token `--on-accent`. (Chat #7)
- **C2.** Projects : `#fff`/`white` sur `.btn--danger`, `.cm.user .bub`, `.mgmt-btn-primary`, etc. (projects.css:1192, 2686, 2219, 3050, 1962, 2605, 1793) MAIS `.btn--primary`/`.chat-send-btn` utilisent `var(--bg-deepest)` → deux conventions opposées. (Projects #5)
- **C3.** Sidebar : `#fff` sur `.switch-slider::before`, `.btn-update.primary`, `.btn-confirm-yes` (sidebar.html:823, 1135, 1299), pas de token `--oh-color-text-on-accent`. (Sidebar/Nav #7)
- **C4.** Global : `::selection` color `#ffffff` en dark (theme.css:91), hardcodé. (Global, table couleurs)

### D. Border-radius des cercles : `50%` vs `--radius-full`

- **D1.** Chat : avatars/dots/swatches en `50%` (chat.html:320, 1170, 1813, 2180, 2467) vs pills/boutons en `--radius-full`. (Chat #11)
- **D2.** Projects : `.status-dot` en `var(--radius-full)` (projects.css:1046) mais `.wf-dot`/`.mgmt-wf-dot`/`.conv-dot`/`.chat-send-btn`/`.confirm-icon`/`.history-status`/`.node-link-handle` en `50%`. (Projects #2)
- **D3.** Sidebar : `.slot-btn .status-ring` et `.switch-slider::before` en `50%` (sidebar.html:391, 824) à côté des composants `--radius-*`. (Sidebar/Nav, table radius)
- **D4.** Global : overlay `12px` mais drag label sans `border-radius` du tout (theme.js:133 vs :139-144). (Global #4)

### E. Espacements hardcodés en doublon des tokens `--space-*`

- **E1.** Projects : bloc « MGMT » quasi entièrement en px bruts (`20px 24px`…) au lieu de `--space-*` (projects.css:2237 et environs). (Projects #3)
- **E2.** Sidebar : `--space-*` utilisé mais cohabite avec `5px 12px`/`6px 14px`/`6px`/`7px 10px`/`2px`/`4px`/`1px` en dur ; `4px` écrit en dur alors que `--space-1`=4px (sidebar.html:216, 1007). (Sidebar/Nav #8)
- **E3.** Chat : 19 valeurs de padding distinctes (0→48px) toutes en dur, aucun token espacement. (Chat, table espacements)
- **E4.** Global : quasi aucun système d'espacement (seulement scrollbar `6px`, `inset:0`) ; drag label sans padding. (Global #5)

### F. Tailles et graisses de police 100 % en dur (aucun token typo)

- **F1.** Chat : tailles 9.5/10/11/12/12.5/13/14/15/17/20px, dont `12.5px` et `9.5px` uniquement en inline JS (chat.html:4451, 4492…). (Chat #9)
- **F2.** Projects : 9 tailles distinctes (9→18px), graisses 400/500/600/700, aucun token. (Projects #4)
- **F3.** Sidebar/Nav : tailles 11/12/13/17/24px, graisses 400/500/600/700, aucun token. (Sidebar/Nav, table typo)
- **F4.** Global : aucune taille/poids/line-height défini (délégué aux apps). (Global, table typo)

### G. Familles de police contournées / hardcodées

- **G1.** Chat : `font-family: monospace` en dur (chat.html:4862, 4926) contourne `--font-mono` ; `--font-display` défini mais jamais utilisé (chat.html:54). (Chat #5, #10)
- **G2.** Sidebar : `.brand-title` font-family hardcodée (sidebar.html:178) au lieu de `var(--font)`, avec ordre des familles différent. (Sidebar/Nav #4)

### H. Durées / transitions hors échelle de tokens

- **H1.** Projects : `0.3s`/`0.4s` en dur (projects.css:309, 343-347, 536-540, 604-606, 1094), aucun `--duration-300/400`. (Projects #7)
- **H2.** Chat : `0.15s` en dur (chat.html:526), `msg-in` à `200ms`/`300ms` (chat.html:1775, 2016) malgré `--duration-200/250`. (Chat #8)
- **H3.** Nav-popup : transition `.item` hardcodée `150ms ease` (nav-popup.html:77), easing natif `ease` ≠ `cubic-bezier` de la sidebar. (Sidebar/Nav #10)
- **H4.** Global : tokens `--oh-ease-*`/`--oh-duration-*`/`--oh-transition` définis mais jamais consommés (theme.css:20-30). (Global #1)

### I. Fallbacks redondants dans `var(--token, valeur)`

- **I1.** Projects : `var(--duration-150,0.15s)`, `var(--radius-sm,4px)`, `var(--accent-hover,#0f766e)`, `var(--font-mono,monospace)`, `var(--accent-primary,#14B8A6)` (projects.css:671, 3437, 2853, 3060, 3197 ; chat.js:295). (Projects #8)
- **I2.** Chat : thinking spinner `var(--accent-primary,#14B8A6)` (chat.html:5470). (Chat, table couleurs)

### J. rgba blancs/noirs hardcodés pour overlays / hover / highlights

- **J1.** Projects : scrollbar `rgba(255,255,255,0.08)`, dots canvas `rgba(255,255,255,0.02)`, shimmer `rgba(255,255,255,0.3/0.25)` (projects.css:126, 597, 320, 1106). (Projects #9)
- **J2.** Chat : `::selection` et scrollbar hardcodées (chat.html:132, 136, 151-162), skeleton sombres `#1c1c1e`/`#252528` (chat.html:2377-2378). (Chat #6)
- **J3.** Sidebar : hover backgrounds `rgba(255,255,255,0.05)`/`rgba(0,0,0,0.03~0.04)` répétés, aucun token `--oh-color-bg-hover` (sidebar.html:273, 283, 362, 372, 495, 500). (Sidebar/Nav #6)
- **J4.** Global : neutres et scrollbars hardcodés des deux côtés clair/sombre (theme.css:37-38, 52-53, 66-78). (Global #9)

### K. Couleurs sémantiques divergentes du token

- **K1.** Sidebar : `.btn-ollama.cancel:hover` background `rgba(248,113,113,0.1)` (= `#f87171`) ≠ `--oh-color-error` `#ef4444`/`#dc2626`, à côté d'une border `var(--oh-color-error)` → deux rouges sur le même élément (sidebar.html:1196-1197). (Sidebar/Nav #3)
- **K2.** Global : deux nuances de teal `#0D9488` vs `#14B8A6` pour le même rôle accent (theme.css:84 vs :90). (Global #3)
- **K3.** Chat : trois palettes de couleurs « par type de projet » concurrentes avec hex différents — `HUB_TYPE_COLORS` vs `HUB_FILTER_TYPES` dots vs `PROJ_COLORS` (chat.html:6119-6127, 6139-6145, 3312-3321). (Chat #3, #4)
- **K4.** Projects : `form-select` chevron gris `#888888` figé dans data-URI, ne suit pas le thème (projects.css:1727). (Projects #11)

### L. Dead tokens (définis, jamais utilisés)

- **L1.** Chat : `--font-display`, `--ease-spring`, `--duration-350`, `--border-strong` (chat.html:54, 59, 64, 28). (Chat #5)
- **L2.** Sidebar : `--shadow-sm`, `--shadow-md` jamais consommés ; `.tooltip` utilise une ombre ad hoc à la place (sidebar.html:438). (Sidebar/Nav #5)
- **L3.** Nav-popup : `--radius-full` défini jamais utilisé (nav-popup.html:29). (Sidebar/Nav #10)
- **L4.** Global : tous les tokens d'animation inutilisés (theme.css:20-30). (Global #1)

### M. Données / résidus morts et doubles sources

- **M1.** Projects : champ de données `color` (`#0d9488/#d97706/#dc2626`) écrit sur chaque projet sauvegardé mais jamais lu pour le rendu (modals.js:140-327, chat.js:804/912, main.js:114). (Projects #10)
- **M2.** Sidebar : `#tab-indicator` background défini en CSS (`var(--oh-color-bg-active)`, sidebar.html:225) puis re-set en JS (sidebar.html:2027) → double source de vérité. (Sidebar/Nav #9)
- **M3.** Global : bloc de règle vide `button, [role="button"], .btn, a {}` (theme.css:96-100) ; `layout.css` totalement vide (layout.css:1-6). (Global #8, #10)

### N. Accessibilité / effets de bord

- **N1.** Global : `*:hover { box-shadow:none; outline:none !important }` (theme.css:109-112) masque les outlines de focus au survol → risque a11y, et rend redondante la règle `button…:hover` (theme.css:114-119). (Global #7)

### O. Points POSITIFS de cohérence relevés

- **O1.** Projects : convention hover-border `--border-strong` respectée sur `.btn--secondary`, `.template-card`, `.node-card`, `.wf-trigger` (projects.css:1180, 1309, 904, 196). (Projects #12)
