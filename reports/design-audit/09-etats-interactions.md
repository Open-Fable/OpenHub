# 09 — États, interactions et micro-détails — PHASE 9

## Introduction et méthodologie

Ce document audite les états interactifs (`:hover`, `:focus`, `:active`, `:disabled`), le
feedback visuel (loading, erreurs, succès), les animations/transitions, le rythme vertical,
le responsive intra-Electron et l'accessibilité visuelle des **vues internes codées par nous** :
Chat (`electron/chat.html`), Orchestrateur/Projects (`electron/projects/projects.css`),
Sidebar (`electron/sidebar.html`) et Nav-popup (`electron/nav-popup.html`). Les apps tierces
en WebContentsView sont hors périmètre (jamais modifiées). Chaque affirmation est tracée
(`fichier:ligne` + doc source Phase 3 quand applicable). Aucune valeur n'est inventée : les
chiffres sont relevés par lecture directe du source et recoupés avec
`03-inventaire-code-propre.md`, `03-inv-chat.md`, `03-inv-projects.md`, `03-inv-sidebar-nav.md`.

Référentiel canonique : accent teal `#14b8a6` (dark) / `#0d9488` (light) ; échelle radius
`4 / 8 / 12 / 9999 px` ; accent par-outil supprimé en v2 (`02-design-system-reference.md`).

**Faits clés établis par comptage (`grep -c`) :**

| Fichier                          | `:hover` | `:active` | `:focus-visible` | `:focus` (total) | `:disabled`/`[disabled]` | `outline` |
| -------------------------------- | -------- | --------- | ---------------- | ---------------- | ------------------------ | --------- |
| `electron/chat.html`             | 48       | 2         | 13               | 18               | 1                        | 14        |
| `electron/projects/projects.css` | 61       | 2         | 4                | 14               | 2                        | 14        |
| `electron/sidebar.html`          | 19       | 2         | 3                | 5                | 2                        | 8         |
| `electron/nav-popup.html`        | **1**    | **0**     | **0**            | **0**            | **0**                    | **0**     |

---

## A. États interactifs

Tableau par composant. « Cohérent entre vues ? » compare la convention pour le même type
de composant à travers Chat / Projects / Sidebar / Nav-popup.

| Composant                                             | Normal                                                                                                    | Hover                                                                                                                            | Active                                                                                                 | Focus                                                                                                             | Disabled                                                                                                          | Cohérent entre vues ?                                                                                                                                                                                                                                              |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Bouton primaire (envoi)** — Chat `.btn-send`        | `background:var(--accent-primary)`, `color:#fff` (chat.html:1689-1690)                                    | `background:var(--accent-hover)` (chat.html:1706)                                                                                | `background:var(--accent-active)` + `transform:scale(0.97)` (chat.html:1708-1710)                      | hérite `:focus-visible` global `outline:2px solid var(--accent-primary)` (chat.html:139-141)                      | `background:transparent`, `color:var(--text-disabled)`, `opacity:0.5`, `cursor:not-allowed` (chat.html:1712-1717) | **Partiel** : Projects `.btn--primary:active` existe (projects.css:1169) mais **pas de `:disabled`** sur `.btn--primary` ; convention texte-sur-accent diverge (`#fff` en Chat vs `var(--bg-deepest)` en Projects `.btn--primary` — voir `03-inv-projects.md:345`) |
| **Bouton primaire** — Projects `.btn--primary`        | tokenisé                                                                                                  | défini                                                                                                                           | `:active` opacity (projects.css:1169)                                                                  | `:focus-visible` global (projects.css:136-138)                                                                    | **ABSENT** (aucune règle `.btn--primary:disabled`)                                                                | Non — pas de disabled                                                                                                                                                                                                                                              |
| **Bouton confirm** — Projects `.question-confirm-btn` | tokenisé                                                                                                  | `:hover:not(:disabled)` (projects.css:3059)                                                                                      | —                                                                                                      | global                                                                                                            | `:disabled { opacity:0.45; cursor:not-allowed }` (projects.css:3063-3065)                                         | Référence locale correcte ; `opacity` disabled = **0.45** ici vs **0.5** ailleurs (chat.html:1716) vs **0.4** (sidebar.html:1131) → 3 valeurs                                                                                                                      |
| **Bouton icône** — Chat `.btn-icon` 30×30             | `background:transparent`, `color:var(--text-muted)` (chat.html:948-957)                                   | `background:var(--bg-surface)`, `color:var(--text-secondary)` (chat.html:960-963)                                                | **ABSENT**                                                                                             | global `:focus-visible`                                                                                           | **ABSENT**                                                                                                        | Partiel — Sidebar `.btn-icon:hover` tokenisé (sidebar.html:928-929) mais tailles/états divergent                                                                                                                                                                   |
| **Bouton onglet** — Sidebar `.slot-btn` h=32          | `color:var(--oh-color-text-secondary)`, `outline:none` (sidebar.html:259,262)                             | `background:rgba(255,255,255,0.05)` **HARDCODÉ**, `color:...text-primary` (sidebar.html:273-274 ; light `rgba(0,0,0,0.03)` :283) | `transform:scale(0.97)` (sidebar.html:277-279)                                                         | `:focus-visible outline:1px solid var(--oh-color-accent-primary)` (sidebar.html:287-288) — **1px** ≠ 2px ailleurs | `.loading` (état réseau, sidebar.html:395) — pas un vrai `:disabled`                                              | Non — hover hardcodé, focus 1px                                                                                                                                                                                                                                    |
| **Onglet config** — Sidebar `.config-tab`             | tokenisé                                                                                                  | `color/background` tokenisés (sidebar.html:642-643)                                                                              | —                                                                                                      | `:focus-visible outline:2px ... offset:-2px` (sidebar.html:650-652) — **offset négatif**                          | —                                                                                                                 | Incohérent avec slot-btn (1px) et global (2px/+2px)                                                                                                                                                                                                                |
| **Nav item** — Nav-popup `.item`                      | `color:var(--text-sec)`, `transition:background 150ms ease,color 150ms ease` (nav-popup.html:73,77)       | `background:var(--hover-bg)`, `color:var(--text)` (nav-popup.html:80-83)                                                         | `.active` (état logique, pas `:active`) (nav-popup.html:85-89)                                         | **ABSENT — aucun `:focus`/`:focus-visible`/`outline`** (nav-popup.html, fichier entier)                           | **ABSENT**                                                                                                        | **NON — manque total focus** alors que ce sont des `<button>`                                                                                                                                                                                                      |
| **Input texte** — Chat `.input-bar` / textarea        | `outline:none` sur textarea (chat.html:1679)                                                              | —                                                                                                                                | `.input-bar:focus-within { box-shadow:0 0 0 3px var(--accent-subtle) }` (chat.html:1561)               | —                                                                                                                 | **Cohérent** — anneau focus `0 0 0 3px accent-subtle` récurrent (chat.html:239,806,1561,2437,2457)                |
| **Input** — Sidebar `.form-input`                     | tokenisé                                                                                                  | —                                                                                                                                | `:focus border-color:accent-primary + box-shadow:0 0 0 3px accent-subtle` (sidebar.html:857-859)       | placeholder `text-disabled`                                                                                       | **Cohérent** avec Chat (même anneau 3px)                                                                          |
| **Input** — Projects                                  | `outline:none` sur `input/textarea/select:focus-visible` (projects.css:140-143)                           | —                                                                                                                                | **anneau focus retiré** (`outline:none`) sans `box-shadow` de remplacement vérifié sur tous les champs | —                                                                                                                 | **Risque** : suppression d'outline sans substitut systématique (voir §F)                                          |
| **Card cliquable** — Projects `.node-card`            | tokenisé                                                                                                  | hover défini (parmi 61 hover)                                                                                                    | `.node-card:active` (projects.css:900)                                                                 | global `:focus-visible`                                                                                           | états `--error`/`--success` sur bordure (projects.css:983-984,976)                                                | Cohérent en interne ; pas de focus dédié carte                                                                                                                                                                                                                     |
| **Card** — Chat `.p-card`                             | `transition:background/border-color` (chat.html:376)                                                      | hover défini                                                                                                                     | —                                                                                                      | `.p-card:focus-visible outline:2px ... offset:2px` (chat.html:385-386,398-399)                                    | —                                                                                                                 | Chat a un focus carte explicite ; Projects s'appuie sur le global                                                                                                                                                                                                  |
| **Chip / filtre** — Chat `.hub-chip`                  | `transition:all var(--duration-150)` (chat.html:316)                                                      | hover défini                                                                                                                     | — `active` = classe d'état (`font-weight:500`)                                                         | global                                                                                                            | —                                                                                                                 | OK interne                                                                                                                                                                                                                                                         |
| **Lien**                                              | Aucune des 4 vues n'a de style `a:hover`/`a:visited`/`a:focus` dédié relevé (vues très orientées boutons) | —                                                                                                                                | —                                                                                                      | global `:focus-visible` (sauf nav-popup)                                                                          | —                                                                                                                 | N/A — peu de `<a>` ; le focus repose sur le global                                                                                                                                                                                                                 |

**Constats A :**

1. **Nav-popup est le maillon faible absolu** : 0 `:focus`, 0 `:focus-visible`, 0 `outline`,
   0 `:active`, 0 `:disabled`, 1 seul `:hover` (nav-popup.html:80). Ses `.item` sont de
   vrais `<button>` (nav-popup.html:123-147) navigables au clavier mais **sans aucun
   indicateur de focus** → impossible de savoir quel slot est focalisé au clavier.
   Gravité **CRITIQUE** (a11y).

2. **`:disabled` quasi inexistant et incohérent.** Une seule règle `:disabled` en Chat
   (`.btn-send`, chat.html:1712), aucune sur `.btn--primary`/`.btn-icon`/`.oh-btn`. Les
   opacités disabled relevées valent **0.4** (sidebar.html:1131), **0.45**
   (projects.css:3064), **0.5** (chat.html:1716) → trois valeurs pour le même état.
   Gravité **HAUTE**.

3. **Épaisseur/offset de focus non unifiés** : global 2px/offset +2px (chat.html:140-141,
   projects.css:137-138) ; `.slot-btn` 1px (sidebar.html:288) ; `.config-tab` 2px/offset
   **-2px** (sidebar.html:651-652). Gravité **MOYENNE**.

---

## B. Feedback visuel

| Mécanisme                       | Implémentation                                                                       | Fichier:ligne                   | Statut                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------- |
| **Toast** (Chat)                | `.oh-toast` + keyframes `ohToastIn`/`ohToastOut`, `box-shadow:var(--shadow-md)`      | chat.html:687-701               | Présent ; conteneur `.oh-toast-wrap` z-index `10000` (chat.html:679)          |
| **Toast** (Sidebar)             | `.config-toast` avec `role="status" aria-live="polite"`                              | sidebar.html:1910               | **Bon** — seul toast doté d'annonce ARIA                                      |
| **Annonceur SR** (Chat)         | `<div aria-live="polite" aria-atomic="true" class="sr-only" id="hubAnnouncer">`      | chat.html:3107                  | Présent ; aussi `aria-live="polite"` sur compteurs (chat.html:2836,3101-3103) |
| **Skeleton loading** (Chat)     | `.oh-skeleton` + keyframes `oh-shimmer 1.5s infinite linear`                         | chat.html:2369,2381             | Riche : listes/lignes/badges (chat.html:4082,4482,4841)                       |
| **Skeleton/shimmer** (Projects) | `animation: shimmer 1.5s` et `1.8s`                                                  | projects.css:323,1109           | **Incohérence durée** : 1.5s vs 1.8s pour le même effet shimmer               |
| **Spinner** (Chat)              | `@keyframes spin` ; usages `spin 1.8s`, `spin 2s`                                    | chat.html:2347,2365,2053        | **Incohérence durée** : 1.8s vs 2s                                            |
| **Spinner** (Projects)          | `@keyframes spin` ; `.activity-icon--spinner`                                        | projects.css:2720,3176          | Présent                                                                       |
| **Loading slot** (Sidebar)      | `.slot-btn.loading .status-ring` + JS `setLoading()`                                 | sidebar.html:395,2037-2105      | Bon — feedback de démarrage process                                           |
| **États erreur** (Projects)     | `--error`, `.node-card--error`, `.node-card-status--error`, `.status-dot--error`     | projects.css:31,983,1034,1061   | Système d'état riche (bordure + statut + dot)                                 |
| **États succès** (Projects)     | `--success`, `.node-card-status` succès, `.status-dot` succès, `--success-subtle` bg | projects.css:976,1006,1054,1138 | Bon                                                                           |
| **Curseur streaming** (Chat)    | `.msg-bubble--streaming::after` + `animation: blink 1s step-end infinite`            | chat.html:1424-1427             | Présent                                                                       |
| **Label réflexion** (Chat)      | `animation: thinking-fade 2s ease-in-out infinite`                                   | chat.html:1448                  | Présent                                                                       |

**Constats B :**

1. **Feedback erreur/succès uniquement structuré dans Projects** (système `--error`/`--success`
   - variantes). Chat possède les tokens sémantiques (chat.html:38-43) mais le feedback
     utilisateur passe surtout par toasts. Sidebar n'a qu'un toast `role="status"`. Pas de
     convention partagée « affichage d'erreur inline ». Gravité **MOYENNE**.

2. **Annonces ARIA `aria-live` présentes en Chat et Sidebar mais ABSENTES en Projects**
   (aucun `aria-live`/`role="status"`/`role="alert"` relevé dans `electron/projects/`).
   Les changements d'état des nœuds (erreur/succès) ne sont pas annoncés aux lecteurs
   d'écran. Gravité **HAUTE** (a11y).

3. **Durées d'animation feedback divergentes** : shimmer 1.5s (chat.html:2381,
   projects.css:323) vs 1.8s (projects.css:1109) ; spin 1.8s vs 2s (chat.html:2365 vs 2053).
   Gravité **BASSE**.

---

## C. Animations / transitions

### Tokens d'animation par vue (source `03-inventaire-code-propre.md`)

- **Chat** : tokens `--ease-default/in/out/spring`, `--duration-75/150/200/250/350`
  (chat.html:56-64). En pratique, transitions quasi 100 % `var(--duration-150)
var(--ease-default)` (13 occ., comptage). `--ease-spring` et `--duration-350` **définis
  mais jamais utilisés** (`03-inventaire-code-propre.md:495`).
- **Sidebar** : `--transition = var(--duration-150) var(--ease-default)` (sidebar.html:60).
  Transitions plus variées : `--duration-150` (3×), `--duration-200` (4×), `--duration-250`
  (2×) avec `--ease-default`/`--ease-out` (comptage).
- **Projects** : transitions `var(--duration-150) var(--ease-default)` (12×) ; quelques
  longues animations d'ambiance `3s`/`4s`/`15s` (comptage) + `--ease-out` (1×).
- **Nav-popup** : **aucun token** — transition **hardcodée** `background 150ms ease,
color 150ms ease` (nav-popup.html:77). `ease` ≠ `--ease-default`
  (`cubic-bezier(0.4,0,0.2,1)`).

### Divergences inter-vues

| Aspect              | Chat                                                                         | Sidebar                       | Projects                      | Nav-popup          |
| ------------------- | ---------------------------------------------------------------------------- | ----------------------------- | ----------------------------- | ------------------ |
| Durée dominante     | 150ms (token)                                                                | 150/200/250ms (tokens)        | 150ms (token)                 | **150ms hardcodé** |
| Easing              | `--ease-default`                                                             | `--ease-default`/`--ease-out` | `--ease-default`/`--ease-out` | **`ease` natif**   |
| Hardcodés résiduels | `opacity 0.15s` (chat.html:526) ; `msg-in 200ms/300ms` (chat.html:1775,2016) | —                             | shimmer 1.8s                  | tout               |

### prefers-reduced-motion

| Vue           | Présent ? | Fichier:ligne        | Couverture                                                                                                                  |
| ------------- | --------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Chat**      | OUI       | chat.html:110-119    | `*,*::before,*::after` → `animation-duration:0.01ms`, `animation-iteration-count:1`, `transition-duration:0.01ms` (complet) |
| **Sidebar**   | OUI       | sidebar.html:125-130 | `*,*::before,*::after` → `transition-duration` + `animation-duration` (manque `animation-iteration-count`)                  |
| **Projects**  | OUI       | projects.css:146-154 | identique à Chat (complet)                                                                                                  |
| **Nav-popup** | **NON**   | —                    | **AUCUN bloc** `prefers-reduced-motion` ; sa transition 150ms ne sera pas neutralisée                                       |

**Constats C :**

1. **`prefers-reduced-motion` couvert dans 3 vues sur 4, manquant en Nav-popup**
   (nav-popup.html, fichier entier). Gravité **MOYENNE** (le popup est court mais sa
   transition échappe au respect de la préférence système).

2. **Sidebar omet `animation-iteration-count:1`** (sidebar.html:125-130) présent en Chat
   et Projects → les animations infinies (ex. spinner) pourraient continuer à boucler.
   Gravité **MOYENNE**.

3. **Nav-popup contourne entièrement le système d'easing/durée** : `150ms ease`
   hardcodé (nav-popup.html:77) au lieu de `var(--duration-150) var(--ease-default)`.
   Gravité **BASSE** (cohérence).

---

## D. Espacement et rythme vertical (grille 8px)

Le système définit une échelle d'espacement (`--space-*`) côté Sidebar
(`03-inv-sidebar-nav.md`) mais **Chat et Projects ne l'utilisent pas** : les espacements y
sont massivement hardcodés en px bruts.

- **Valeurs de padding distinctes en Chat** (`03-inventaire-code-propre.md:418`) :
  `0,1,2,3,4,5,6,7,8,10,12,14,16,18,20,24,32,40,48 px`. La présence de **5, 7, 10, 14, 18 px**
  casse une grille stricte 8 px (multiples non-8). Ex. `.projects-hub-search` padding
  `7px 12px` (chat.html:227), `.oh-btn` `7px 16px` (chat.html:1913), `.hub-chip` `5px 12px`
  (chat.html:308).
- **Gaps Chat** (`03-inventaire-code-propre.md:443-453`) : `2,4,5,6,8,10,12,16,40 px` — là
  encore 5/10 hors grille 8.
- **Projects** : « le bloc MGMT est presque entièrement en px bruts »
  (`03-inv-projects.md:341`), ex. `.mgmt-detail-body` padding `20px 24px` (projects.css:2237)
  alors qu'un token `--space-5/--space-6` existe.

**Constat D :** la grille 8 px **n'est pas respectée de façon stricte** : multiples de 4 px
dominants mais nombreuses valeurs intermédiaires (5/7/10/14/18 px) et espacements quasi
toujours hardcodés en Chat/Projects au lieu des tokens `--space-*` portés par la Sidebar.
Rythme vertical donc **non systématisé** entre vues. Gravité **MOYENNE**.

---

## E. Responsive dans Electron

Breakpoints `@media (max-width)` relevés (hors `prefers-color-scheme`/`prefers-reduced-motion`) :

| Vue           | Breakpoints              | Fichier:ligne                    |
| ------------- | ------------------------ | -------------------------------- |
| **Chat**      | 900 / 700 / 640 / 480 px | chat.html:2517, 2526, 2544, 2614 |
| **Sidebar**   | 680 / 680 / 720 px       | sidebar.html:242, 316, 1318      |
| **Projects**  | **600 px (unique)**      | projects.css:1291                |
| **Nav-popup** | **aucun**                | — (popup à taille fixe)          |

**Constats E :**

1. **Jeux de breakpoints non alignés** : Chat (900/700/640/480), Sidebar (680/720),
   Projects (600 seul). Aucune échelle de breakpoints partagée → comportements de
   redimensionnement incohérents entre vues lors d'un resize de fenêtre Electron.
   Gravité **MOYENNE**.

2. **Projects n'a qu'un seul breakpoint (600 px)** (projects.css:1291) alors que c'est une
   vue dense (cartes, grilles `.templates-grid`, panneaux MGMT) → adaptation pauvre sur
   fenêtre étroite. Gravité **MOYENNE**.

3. **Chat utilise `max-width:700px` pour passer la `.conv-sidebar` en overlay**
   (z-index 50, `var(--shadow-md)` — chat.html:2526-2533), comportement correct mais isolé
   au seul Chat. Gravité **BASSE**.

---

## F. Accessibilité visuelle

### Focus visible

| Vue           | Indicateur de focus                                                                                                                       | Fichier:ligne                    | Verdict                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| Chat          | `:focus-visible { outline:2px solid var(--accent-primary); outline-offset:2px }` global + cartes/inputs (focus-within 3px)                | chat.html:139-141, 385-386, 1561 | **Bon** (mais 11 `outline:none` à vérifier qu'ils ont un substitut)                         |
| Projects      | `:focus-visible` global 2px (projects.css:136-138) **mais** `input/textarea/select:focus-visible { outline:none }` (projects.css:140-143) | projects.css:136-143             | **À risque** : outline retiré sur tous les champs ; substitut `box-shadow` non systématique |
| Sidebar       | `.slot-btn:focus-visible` 1px, `.config-tab:focus-visible` 2px/offset -2px, `.form-input:focus` anneau 3px                                | sidebar.html:288, 651, 858-859   | Présent mais épaisseurs hétérogènes (1px/2px)                                               |
| **Nav-popup** | **AUCUN**                                                                                                                                 | nav-popup.html (entier)          | **CRITIQUE — focus invisible**                                                              |

`outline:none` total : 11 occ. Chat, 12 occ. Projects, 8 occ. Sidebar (comptage). Chaque
`outline:none` sur un élément focalisable doit fournir un substitut visible — vérifié pour
les inputs Chat (`focus-within` box-shadow) mais **non garanti** pour tous les champs
Projects (projects.css:140-143).

### Cibles tactiles / clic (≥ 44×44 px recommandé)

| Élément                                       | Taille                                          | Fichier:ligne                    | < 44×44 ?          |
| --------------------------------------------- | ----------------------------------------------- | -------------------------------- | ------------------ |
| Chat `.btn-icon`                              | 30×30 px                                        | chat.html:949-950                | **OUI** (30 < 44)  |
| Chat `.btn-send`                              | 32×32 px                                        | chat.html:1681-1682              | **OUI** (32 < 44)  |
| Sidebar `.slot-btn`                           | hauteur 32 px                                   | sidebar.html:254                 | **OUI** (32 < 44)  |
| Nav-popup `.item`                             | padding `8px 12px`, font 13px → hauteur ≈ 33 px | nav-popup.html:68                | **OUI** (≈33 < 44) |
| Sidebar diverses (`height:14/16/18/26/28 px`) | 14–28 px                                        | sidebar.html:185,293,482,701,915 | **OUI**            |

**Aucune** cible interactive principale relevée n'atteint 44×44 px. Sur desktop la souris est
fine, mais le seuil WCAG 2.5.5 (AAA) / 2.5.8 (AA, 24×24 min) reste pertinent : `.btn-icon`
30×30 et `.slot-btn` h=32 passent le minimum AA 24×24 mais pas le confort 44×44.

### Contraste (WCAG AA, faits issus Phase 3)

- **`#fff` hardcodé pour le texte sur accent** (≥ 9 occ. Chat : chat.html:651, 690, 1690,
  1816, 1927, 2322… — `03-inv-chat.md:529`). Pas de token `--text-on-accent` ; si l'accent
  évolue, le ratio n'est pas garanti.
- **Deux conventions opposées texte-sur-bouton** : `#fff`/`white`
  (`.btn--danger`, `.mgmt-btn-primary`, `.question-confirm-btn`…) vs `var(--bg-deepest)`
  (`.btn--primary`, `.chat-send-btn`) — `03-inv-projects.md:345`. Impact contraste light/dark.
- **Accent light `#0d9488` sur bouton noté « contraste faible »** dans `05-part-C.md:111`.
- Texte secondaire/muté : `--text-muted` dark `#666666` sur `--bg-deepest` `#0a0a0a`
  (`03-inventaire-code-propre.md:39,59) → ratio ≈ 4.2:1, **limite AA pour texte normal**
(seuil 4.5:1) ; `--text-disabled`dark`#444444` (chat.html:32) très faible (attendu pour
  disabled).

**Constats F :**

1. **Focus invisible en Nav-popup** = blocage clavier. Gravité **CRITIQUE**.
2. **`outline:none` sur tous les champs Projects sans substitut systématique**
   (projects.css:140-143). Gravité **HAUTE** — à corriger ou prouver le box-shadow par champ.
3. **Aucune cible ≥ 44×44** ; `.slot-btn`/`.btn-send`/`.btn-icon`/`.item` autour de 30-33 px.
   Gravité **MOYENNE** (desktop atténue).
4. **Contraste non garanti sur texte-sur-accent** (`#fff` hardcodé, accent light faible) et
   `--text-muted` dark en limite AA. Gravité **MOYENNE-HAUTE**.

---

## Synthèse — Top problèmes états/interactions

| #   | Problème                                                                                                          | Fichier:ligne                                                       | Gravité      |
| --- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------ |
| 1   | **Nav-popup sans aucun état focus** (0 `:focus`/`:focus-visible`/`outline`) sur des `<button>` clavier-navigables | nav-popup.html (entier ; boutons 123-147)                           | **CRITIQUE** |
| 2   | **`outline:none` sur tous les champs Projects** sans substitut focus garanti                                      | projects.css:140-143                                                | **HAUTE**    |
| 3   | **`:disabled` quasi absent et incohérent** (1 seul en Chat ; opacités 0.4/0.45/0.5)                               | chat.html:1712-1716 ; projects.css:3064 ; sidebar.html:1131         | **HAUTE**    |
| 4   | **Pas d'`aria-live`/`role` d'état dans Projects** (erreur/succès non annoncés)                                    | `electron/projects/` (aucun)                                        | **HAUTE**    |
| 5   | **Aucune cible ≥ 44×44 px** (`.btn-send` 32, `.btn-icon` 30, `.slot-btn` h32, `.item` ≈33)                        | chat.html:1681-1682, 949-950 ; sidebar.html:254 ; nav-popup.html:68 | **MOYENNE**  |
| 6   | **Focus non unifié** : 2px/+2px (global) vs 1px (slot-btn) vs 2px/-2px (config-tab)                               | chat.html:140-141 ; sidebar.html:288, 651-652                       | **MOYENNE**  |
| 7   | **`prefers-reduced-motion` manquant en Nav-popup** + Sidebar omet `animation-iteration-count`                     | nav-popup.html (aucun) ; sidebar.html:125-130                       | **MOYENNE**  |
| 8   | **Grille 8px non respectée** (paddings 5/7/10/14/18px, espacements hardcodés)                                     | chat.html:227, 308, 1913 ; projects.css:2237                        | **MOYENNE**  |
| 9   | **Breakpoints responsive non alignés** (900/700/640/480 vs 680/720 vs 600 vs aucun)                               | chat.html:2517+ ; sidebar.html:242+ ; projects.css:1291             | **MOYENNE**  |
| 10  | **Durées feedback divergentes** (shimmer 1.5s/1.8s ; spin 1.8s/2s)                                                | chat.html:2381, 2365 ; projects.css:323, 1109                       | **BASSE**    |
| 11  | **Nav-popup transition hardcodée `150ms ease`** (hors tokens)                                                     | nav-popup.html:77                                                   | **BASSE**    |

---

**Statut `prefers-reduced-motion`** : présent dans **3 vues sur 4** — Chat (chat.html:110-119,
complet), Sidebar (sidebar.html:125-130, **sans** `animation-iteration-count:1`), Projects
(projects.css:146-154, complet). **ABSENT en Nav-popup** (aucun bloc).

**Statut focus visible** : correct et tokenisé en Chat (chat.html:139-141) et Sidebar
(`:focus-visible` présent, mais épaisseurs 1px/2px hétérogènes) ; **à risque en Projects**
(`outline:none` global sur inputs sans substitut systématique, projects.css:140-143) ;
**totalement ABSENT en Nav-popup** (aucun `:focus`/`:focus-visible`/`outline`) → focus
clavier invisible (CRITIQUE).
