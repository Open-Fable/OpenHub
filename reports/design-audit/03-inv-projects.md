# Inventaire design RÉEL — Vue Orchestrateur / Projects

PHASE 3 de l'audit design OpenHub. Vue traitée : **Orchestrateur / Projects**.

Fichiers analysés EN ENTIER :

- `electron/projects.html` (558 lignes)
- `electron/projects/projects.css` (3476 lignes)
- `electron/projects/canvas.js` (681), `chat.js` (994), `detail.js` (294), `execution.js` (842), `main.js` (281), `management.js` (636), `modals.js` (551), `state.js` (269)

**Constat préliminaire majeur** : cette vue **définit ses PROPRES variables CSS** dans son `:root` (préfixe `--*`, ex `--accent-primary`, `--bg-deepest`), et **ne réutilise PAS le système de tokens `--oh-*`** défini dans `electron/sidebar.html`. Le mot `--oh-` n'apparaît **nulle part** dans les fichiers de cette vue (grep négatif). C'est un système de tokens parallèle/dupliqué.

---

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

---

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

---

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

---

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

---

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

---

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

---

### Incohérences internes détectées

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
