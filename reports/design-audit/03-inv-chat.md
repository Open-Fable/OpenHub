# 03 — Inventaire design RÉEL — Vue Chat

Fichier source unique audité : `electron/chat.html` (7067 lignes, 257 K).
Tout le CSS est dans un bloc `<style>` (lignes 11–2745). Le reste (lignes 2747–7063) est du HTML + JavaScript contenant de nombreux styles inline et des valeurs de couleurs/dimensions hardcodées dans des chaînes JS.

**Constat majeur préliminaire : cette vue définit ses PROPRES tokens CSS dans un `:root` local (préfixe `--*`, PAS `--oh-*`). Elle NE réutilise PAS le système `--oh-*` défini dans `electron/sidebar.html`.** Les noms et la palette diffèrent (ex. ici `--accent-primary`, ailleurs `--oh-color-accent-primary`).

---

## Tokens / variables CSS définies ici (:root et équivalents)

Le `:root` est défini ligne 20. Le bloc `@media (prefers-color-scheme: dark)` redéfinit un sous-ensemble (lignes 72–108). Les valeurs « light » sont celles du `:root` par défaut (le défaut est le thème CLAIR ici).

### Couleurs de fond

| Variable        | Valeur dark | Valeur light | Fichier:ligne      |
| --------------- | ----------- | ------------ | ------------------ |
| `--bg-deepest`  | `#0a0a0a`   | `#ffffff`    | chat.html:21 / :74 |
| `--bg-panel`    | `#141414`   | `#f7f7f7`    | chat.html:22 / :75 |
| `--bg-surface`  | `#1e1e1e`   | `#efefef`    | chat.html:23 / :76 |
| `--bg-elevated` | `#282828`   | `#ffffff`    | chat.html:24 / :77 |
| `--bg-overlay`  | `#111111`   | `#f2f2f2`    | chat.html:25 / :78 |

### Bordures

| Variable           | Valeur dark | Valeur light | Fichier:ligne      |
| ------------------ | ----------- | ------------ | ------------------ |
| `--border-subtle`  | `#1f1f1f`   | `#e8e8e8`    | chat.html:26 / :79 |
| `--border-default` | `#2a2a2a`   | `#e0e0e0`    | chat.html:27 / :80 |
| `--border-strong`  | `#3a3a3a`   | `#cccccc`    | chat.html:28 / :81 |

### Texte

| Variable           | Valeur dark | Valeur light | Fichier:ligne      |
| ------------------ | ----------- | ------------ | ------------------ |
| `--text-primary`   | `#ececec`   | `#111111`    | chat.html:29 / :82 |
| `--text-secondary` | `#999999`   | `#555555`    | chat.html:30 / :83 |
| `--text-muted`     | `#666666`   | `#888888`    | chat.html:31 / :84 |
| `--text-disabled`  | `#444444`   | `#bbbbbb`    | chat.html:32 / :85 |

### Accent (teal/vert)

| Variable                | Valeur dark             | Valeur light            | Fichier:ligne      |
| ----------------------- | ----------------------- | ----------------------- | ------------------ |
| `--accent-primary`      | `#14b8a6`               | `#0d9488`               | chat.html:33 / :86 |
| `--accent-hover`        | `#2dd4bf`               | `#0f766e`               | chat.html:34 / :87 |
| `--accent-active`       | `#0d9488`               | `#115e59`               | chat.html:35 / :88 |
| `--accent-subtle`       | `rgba(20,184,166,0.1)`  | `rgba(13,148,136,0.06)` | chat.html:36 / :89 |
| `--accent-subtle-hover` | `rgba(20,184,166,0.16)` | `rgba(13,148,136,0.1)`  | chat.html:37 / :90 |

### Sémantique (success / warning / error)

| Variable           | Valeur dark            | Valeur light           | Fichier:ligne      |
| ------------------ | ---------------------- | ---------------------- | ------------------ |
| `--success`        | `#22c55e`              | `#16a34a`              | chat.html:38 / :91 |
| `--success-subtle` | `rgba(34,197,94,0.1)`  | `rgba(22,163,74,0.08)` | chat.html:39 / :92 |
| `--warning`        | `#f59e0b`              | `#d97706`              | chat.html:40 / :93 |
| `--warning-subtle` | `rgba(245,158,11,0.1)` | `rgba(217,119,6,0.08)` | chat.html:41 / :94 |
| `--error`          | `#ef4444`              | `#dc2626`              | chat.html:42 / :95 |
| `--error-subtle`   | `rgba(239,68,68,0.1)`  | `rgba(220,38,38,0.08)` | chat.html:43 / :96 |

### Ombres

| Variable          | Valeur dark                   | Valeur light                  | Fichier:ligne       |
| ----------------- | ----------------------------- | ----------------------------- | ------------------- |
| `--shadow-xs`     | `0 1px 2px rgba(0,0,0,0.2)`   | `0 1px 2px rgba(0,0,0,0.04)`  | chat.html:44 / :97  |
| `--shadow-sm`     | `0 2px 8px rgba(0,0,0,0.24)`  | `0 2px 8px rgba(0,0,0,0.06)`  | chat.html:45 / :98  |
| `--shadow-md`     | `0 4px 16px rgba(0,0,0,0.28)` | `0 4px 16px rgba(0,0,0,0.08)` | chat.html:46 / :99  |
| `--shadow-lg`     | `0 8px 32px rgba(0,0,0,0.4)`  | `0 8px 32px rgba(0,0,0,0.12)` | chat.html:47 / :100 |
| `--overlay-modal` | `rgba(0,0,0,0.4)`             | `rgba(0,0,0,0.1)`             | chat.html:48 / :101 |

### Border-radius (tokens)

| Variable        | Valeur (identique dark/light) | Fichier:ligne |
| --------------- | ----------------------------- | ------------- |
| `--radius-sm`   | `4px`                         | chat.html:49  |
| `--radius-md`   | `8px`                         | chat.html:50  |
| `--radius-lg`   | `12px`                        | chat.html:51  |
| `--radius-full` | `9999px`                      | chat.html:52  |

### Typographie (tokens)

| Variable         | Valeur                                                                       | Fichier:ligne |
| ---------------- | ---------------------------------------------------------------------------- | ------------- |
| `--font-sans`    | `"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif`    | chat.html:53  |
| `--font-display` | `"SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif` | chat.html:54  |
| `--font-mono`    | `"SF Mono", "Fira Code", ui-monospace, Menlo, monospace`                     | chat.html:55  |

### Easing / Durations (tokens)

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

### Overrides contextuels (mode recherche)

| Variable           | Valeur                 | Contexte                      | Fichier:ligne |
| ------------------ | ---------------------- | ----------------------------- | ------------- |
| `--accent-primary` | `#16a34a` (vert)       | `body.oh-search-mode` (light) | chat.html:68  |
| `--accent-subtle`  | `rgba(22,163,74,0.08)` | `body.oh-search-mode` (light) | chat.html:69  |
| `--accent-primary` | `#22c55e` (vert)       | `body.oh-search-mode` (dark)  | chat.html:105 |
| `--accent-subtle`  | `rgba(34,197,94,0.1)`  | `body.oh-search-mode` (dark)  | chat.html:106 |

### Variables CSS locales (scoped, non `:root`)

| Variable               | Valeur                                                                   | Fichier:ligne                       |
| ---------------------- | ------------------------------------------------------------------------ | ----------------------------------- |
| `--conv-sidebar-width` | fallback `280px` (sur `.project-details-sidebar` et `.conv-sidebar`)     | chat.html:724, :893                 |
| `--conv-action-bg`     | `var(--bg-panel)` / `var(--bg-surface)` / `var(--bg-overlay)` selon état | chat.html:1007, :1011, :1015, :1019 |

### Variables RÉFÉRENCÉES mais NON DÉFINIES dans ce fichier (bugs potentiels)

| Variable        | Usage                                  | Fichier:ligne  | Statut                     |
| --------------- | -------------------------------------- | -------------- | -------------------------- |
| `--text-base`   | `color` de `.more-dropdown-item`       | chat.html:1622 | NON DÉFINI dans ce fichier |
| `--text-strong` | `color` hover de `.more-dropdown-item` | chat.html:1631 | NON DÉFINI dans ce fichier |

---

## Couleurs réellement utilisées

### Via variables CSS (échantillon représentatif, non exhaustif des centaines d'usages)

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

### Couleurs HARDCODÉES (hors tokens) — liste des valeurs distinctes

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

---

## Border-radius réellement utilisés

### Via tokens

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

### Valeurs HARDCODÉES (hors tokens) — distinctes

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

---

## Typographie

### Réglages globaux et tailles distinctes

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

### Tailles de police présentes UNIQUEMENT dans les styles inline JS (valeurs « cassées »)

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

---

## Espacements (padding / margin / gap)

Liste des valeurs distinctes par propriété (échantillon de localisation ; valeurs très répétées).

### Padding (valeurs distinctes observées)

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

### Margin (valeurs distinctes)

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

### Gap (valeurs distinctes)

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

---

## Ombres, transitions, z-index

### Ombres (box-shadow)

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

### Transitions

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

### Animations (@keyframes)

| Nom                        | Usage                    | Fichier:ligne     |
| -------------------------- | ------------------------ | ----------------- |
| `ohToastIn` / `ohToastOut` | toast                    | chat.html:700–701 |
| `blink`                    | curseur streaming        | chat.html:1427    |
| `thinking-fade`            | label réflexion          | chat.html:1450    |
| `fadeIn`                   | modals/dropdowns/layouts | chat.html:2331    |
| `msg-in`                   | bulles/widgets           | chat.html:2339    |
| `spin`                     | loaders                  | chat.html:2347    |
| `oh-shimmer`               | skeleton                 | chat.html:2369    |

### z-index (valeurs distinctes)

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

---

## Incohérences internes détectées

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
