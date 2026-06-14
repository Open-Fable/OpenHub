# PHASE 3 — Inventaire design REEL : Sidebar + Nav-popup

Fichiers audites (lus en entier) :

- `electron/sidebar.html` (3214 lignes)
- `electron/nav-popup.html` (163 lignes)

Constat majeur de coherence inter-fichiers : les **deux fichiers definissent leurs PROPRES `:root`** et **n'utilisent PAS le meme systeme de tokens**.

- `sidebar.html` utilise le systeme de design canonique `--oh-*` (+ tokens utilitaires `--radius-*`, `--space-*`, `--shadow-*`, `--duration-*`, `--ease-*`, `--font*`).
- `nav-popup.html` utilise un **systeme local court non prefixe** (`--bg`, `--border`, `--text`, `--accent`, etc.) qui DUPLIQUE les memes valeurs mais sous d'autres noms. C'est une incoherence structurelle (voir section dediee).

---

## Tokens / variables CSS definies ici (:root et equivalents)

### sidebar.html — `:root` dark (defaut), lignes 19-85

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

### nav-popup.html — `:root` local NON prefixe, lignes 16-30

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

---

## Couleurs reellement utilisees

### sidebar.html

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

### nav-popup.html

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

---

## Border-radius reellement utilises

### Valeurs DISTINCTES rencontrees (toutes vues confondues)

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

---

## Typographie

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

---

## Espacements (padding / margin / gap)

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

---

## Ombres, transitions, z-index

### Ombres (box-shadow) — valeurs DISTINCTES

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

### Transitions / animations

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

### z-index — valeurs DISTINCTES : `-1`, `10`, `50`, `99`, `100`, `200`

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

---

## Incoherences internes detectees

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
