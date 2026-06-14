# 05 — Phase 5, partie D : Cohérence inter-apps

> Audit design OpenHub. Partie D : confrontation de NOS vues internes (Chat,
> Orchestrateur/Projects, Sidebar, Nav-popup) avec les 3 apps tierces telles
> qu'elles rendent réellement **POST-override** (apps jamais modifiées, habillées
> via `electron/overrides/`).
>
> Méthode : chaque valeur est dérivée des faits déjà tracés en Phase 3
> (`03-inventaire-code-propre.md`) pour nos vues et en Phase 4
> (`04-inventaire-overrides.md`) pour les apps tierces, qui croise l'override avec
> le CSS NATIF de `apps/*`. Aucune valeur n'est inventée : toute valeur absente
> est notée « NON DÉFINI ». Référentiel canonique : accent teal `#14b8a6`(dark)/
> `#0d9488`(light), échelle radius `4 / 8 / 12 / 9999px` (`sidebar.html:63-66`),
> accent par-outil supprimé en v2 (`brand_colors.json:328-329`).
>
> **Rappel structurel** : « Chat/Orch (nous) » = code écrit par OpenHub, on
> contrôle tout. « OpenWork / OpenCode / Open-Design » = code tiers qu'on NE
> touche jamais ; la colonne donne la valeur **effectivement rendue** après
> application de l'override, et signale entre parenthèses la valeur **native** qui
> subsiste quand l'override ne la corrige pas. C'est cette valeur rendue qui crée
> (ou non) la cohérence inter-apps.

---

## D. Cohérence inter-apps (nos vues vs apps tierces via overrides)

### Tableau comparatif — valeurs réelles POST-override

| Propriété                        | Chat/Orch (nous)                                                                                                                                                                                                                     | OpenWork (Work)                                                                                                                                                                                                                   | OpenCode (Code)                                                                                                                                                                            | Open-Design (Design)                                                                                                         | Unifié ?                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Radius boutons**               | `--radius-md` 8px (Chat `.btn-back`/`.btn-icon` chat.html:830,951 ; Orch `.btn` 8px via `--radius-md` projects.css:39) ; pills boutons via `--radius-full` 9999px (`.btn-send` chat.html:1687)                                       | **Natif non corrigé** : `.ow-button-primary` = pilule `9999px` (`index.css:188`) ; l'override `theme.css` ne touche aucun radius (Phase 4 §1.1)                                                                                   | **Natif non corrigé** : boutons 6/8/4/2px hardcodés ; échelle native `--radius-xs..xl` 2-10px (`theme.css:45-49`) — override ne pose `var(--radius-md,8px)` QUE sur inputs (theme.css:204) | Boutons forcés `var(--radius-md,8px)` → **8px** (override `theme.css:124`, `--radius-md` natif absent donc fallback atteint) | **NON** (3/4) — seul Open-Design aligné à 8px ; OpenWork en pilule, OpenCode hétérogène 2-10px                                |
| **Radius cards**                 | `--radius-lg` 12px (Chat `.p-card`/`.artifact-card`/`.msg-bubble` chat.html:373,1366,1198 ; Orch node/modal/template-card 12px via `--radius-lg` projects.css:40)                                                                    | **Natif non corrigé** : `.ow-soft-card` `1.5rem`=24px (`index.css:172`), `.ow-soft-shell` `2rem`=32px (`index.css:166`) ; `--dls-radius` 16px / `--dls-radius-lg` 24px (`index.css:63-64`)                                        | **Natif non corrigé** : cartes/popovers en radius natif hétérogène 2-12px (Phase 4 §1.4)                                                                                                   | `[role="region"]/[role="card"]` forcés `var(--radius-md,8px)` → **8px** (override `theme.css:184`)                           | **NON** (0/4 sur la valeur 12px) — chacun diffère : 12 (nous) vs 24-32 (Work) vs 2-12 (Code) vs 8 (Design)                    |
| **Radius inputs**                | `--radius-sm` 4px ou `--radius-md` 8px selon vue (Chat `.oh-modal-field input` 4px chat.html:2427 ; Sidebar `.form-input` 8px sidebar.html:845)                                                                                      | **Overlays projets `.oh-*` seulement** : `var(--radius-md,8px)` mais collision native `@theme inline` → rend **~5.8px** (`--radius-md` natif ≈5.8px, fallback jamais atteint, Phase 4 §1.2). Inputs natifs OpenWork : non traités | `var(--radius-md,8px)` → **8px** sur inputs/textarea/select (override theme.css:204)                                                                                                       | `var(--radius-sm,4px)` mais `--radius-sm` natif = **6px** → rend **6px**, pas 4px (override theme.css:145 ; Phase 4 §1.5)    | **NON** — valeurs rendues 4/8 (nous) vs ~5.8 (Work overlay) vs 8 (Code) vs 6 (Design) : aucune convergence                    |
| **Radius cercles**               | `50%` hardcodé (avatars/dots/swatches : chat.html:320,1170,2180,2467 ; projects.css:201,449,918,1915) — coexiste avec `--radius-full` 9999px                                                                                         | Non géré par override (natif)                                                                                                                                                                                                     | `999px` pilule hardcodé natif (Phase 4 §1.4)                                                                                                                                               | `--radius-pill` 999px natif (`tokens.css:58`), non re-forcé                                                                  | **PARTIEL** — visuellement équivalent (cercle plein) malgré 3 notations (`50%`, `9999px`, `999px`)                            |
| **Fond (deepest, dark)**         | `#0a0a0a` (Chat `--bg-deepest` chat.html:21 ; Orch projects.css:10 ; Sidebar `--oh-color-bg-deepest` sidebar.html:21). Nav-popup : **`#111111`** (`--bg` nav-popup.html:17) — écart                                                  | `#0a0a0a` (override `--slate-1` dark, theme.css:7)                                                                                                                                                                                | `#0a0a0a` (override `--background-base` dark, theme.css)                                                                                                                                   | `#0a0a0a` (override `--bg` dark, theme.css:79)                                                                               | **OUI (dark)** sur `#0a0a0a` — sauf Nav-popup interne à `#111111`                                                             |
| **Fond panel (dark)**            | `#141414` (Chat chat.html:22 ; Orch projects.css:11 ; Sidebar sidebar.html:22)                                                                                                                                                       | `#141414` (override `--background-weak`/équiv. neutre)                                                                                                                                                                            | `#141414` (override `--background-weak` dark)                                                                                                                                              | `#141414` (override `--bg-panel` dark, theme.css:79-107)                                                                     | **OUI (dark)**                                                                                                                |
| **Fond (mode clair)**            | `#ffffff` (deepest light, partout)                                                                                                                                                                                                   | `#ffffff` (override `:root:not(.dark)`, theme.css:31)                                                                                                                                                                             | `#ffffff` (override clair, theme.css)                                                                                                                                                      | `#ffffff` (override `--bg` light, theme.css:32) — **MAIS cascade dark cassée** (cf. note)                                    | **OUI en principe** ; **RISQUE Open-Design** : mélange thème si `[data-theme="dark"]` forcé sous OS clair (Phase 4 §1.5)      |
| **Texte primaire (dark/light)**  | `#ececec` / `#111111` (Chat chat.html:29/82 ; Orch projects.css:18/75 ; Sidebar sidebar.html:31/100)                                                                                                                                 | `#ececec` / `#111111` (override `--slate-12` theme.css:18/42)                                                                                                                                                                     | `#ececec` / `#111111` (override `--text-strong` theme.css)                                                                                                                                 | `#ececec` / `#111111` (override `--text` theme.css:32,79)                                                                    | **OUI**                                                                                                                       |
| **Font (sans)**                  | Stack Apple **SF Pro Text** d'abord (Chat `--font-sans` chat.html:53 ; Orch projects.css:50-52 ; Sidebar `--font` sidebar.html:61-62) — conforme marque (`design_system.md`/`typography.json`)                                       | **Natif IBM Plex Sans / Geist** non corrigé (`index.css:144-145`) — override ne touche pas la typo (Phase 4 §1.1)                                                                                                                 | **Natif** `ui-sans-serif, system-ui, -apple-system…` (`theme.css:2`) — override ne touche pas la typo                                                                                      | **SF Pro forcé** : `-apple-system,"SF Pro Text"…` sur `html,body` + inputs (override theme.css:115-116,147)                  | **NON** (2/4) — Design aligné SF Pro, nos vues alignées SF Pro ; Work reste IBM Plex, Code reste system-ui générique          |
| **Accent primaire (dark/light)** | `#14b8a6` / `#0d9488` (Chat chat.html:33/86 ; Orch projects.css:22/79 ; Sidebar sidebar.html:36/105)                                                                                                                                 | `#14b8a6` / `#0d9488` (override `--dls-accent`+`--primary`+`--ring` theme.css:21,45,25-27,49-51)                                                                                                                                  | `#14b8a6` / `#0d9488` (override OC-1 + v2 : `--v2-background-bg-accent:#14b8a6` etc. theme.css:79-84,142-147)                                                                              | `#14b8a6` / `#0d9488` (override `--accent` theme.css:32,79-107)                                                              | **OUI** — point fort majeur de l'unification                                                                                  |
| **Hover accent**                 | `#2dd4bf` / `#0f766e` (Chat chat.html:34/87 ; Orch projects.css:23/80 ; Sidebar sidebar.html:37/106)                                                                                                                                 | `#2dd4bf` / `#0f766e` (override theme.css:22,46)                                                                                                                                                                                  | teal hover (override échelle teal v2, theme.css:24-35/92-103)                                                                                                                              | `#2dd4bf` (dark) (override `--accent-hover` theme.css)                                                                       | **OUI (dark)** ; light à vérifier côté Code/Design mais alignement teal général                                               |
| **Hover surface (fond)**         | **Hardcodé, non tokenisé** : `rgba(255,255,255,0.05)` (dark) / `rgba(0,0,0,0.03)` (light) (Sidebar sidebar.html:273,283). Nav-popup : token `--hover-bg` (nav-popup.html:24). Chat/Orch : `--bg-surface`/`--accent-subtle` selon cas | Géré par les surfaces natives override (pas de token hover dédié)                                                                                                                                                                 | Surfaces hover natives override (`--surface-*-hover`)                                                                                                                                      | `--accent`/surfaces override                                                                                                 | **PARTIEL** — pas de token de hover-surface commun ; conventions divergentes même entre nos vues                              |
| **Focus (ring)**                 | Outline 2px ou ring `0 0 0 3px var(--accent-subtle)` teal (Chat `:focus-visible` chat.html:142,239 ; Sidebar `.form-input:focus` ring teal sidebar.html:859)                                                                         | Focus via `--ring` teal override (theme.css:25-27)                                                                                                                                                                                | `:focus-visible` outline **teal** forcé (override theme.css:190-198) ; `--v2-border-border-focus` teal (theme.css:84)                                                                      | Liens/`[role]` teal ; pas de ring uniforme documenté                                                                         | **OUI sur la couleur (teal)** ; **PARTIEL sur la forme** (3px ring vs 2px outline vs souligné)                                |
| **Sélection (`::selection`)**    | teal : Chat hardcodé `rgba(13,148,136,0.15)`/`rgba(20,184,166,0.25)` (chat.html:132,136)                                                                                                                                             | via global override `::selection` teal (`global/theme.css:84,90`) — s'applique dans la WebContentsView                                                                                                                            | `::selection` teal forcé (override theme.css:180-187)                                                                                                                                      | hérite global override teal                                                                                                  | **OUI (couleur teal)** — mais valeurs hardcodées partout, jamais tokenisées                                                   |
| **Transition standard**          | `var(--duration-150) var(--ease-default)` = 150ms `cubic-bezier(0.4,0,0.2,1)` (Chat/Orch/Sidebar). Nav-popup : **`150ms ease`** hardcodé (easing natif ≠ cubic-bezier) (nav-popup.html:77)                                           | Non re-spécifié par override → easings natifs OpenWork                                                                                                                                                                            | Non re-spécifié → easings natifs OpenCode                                                                                                                                                  | `--oh-dur-*`/`--oh-ease*` propriétaires posés (override theme.css:32-76) mais portée limitée                                 | **NON** — durée 150ms partagée chez nous mais courbe non imposée aux apps tierces ; Nav-popup lui-même diverge (easing natif) |
| **Ombres**                       | Tokens `--shadow-xs..lg` (échelle marque) ; mais Sidebar `.tooltip` hardcode `0 4px 12px rgba(0,0,0,0.4)` (sidebar.html:438) ; global override **supprime toutes les box-shadow au `*:hover`** (`global/theme.css:110`)              | Ombres natives **non touchées** par override (Phase 4 §1.1) — sauf suppression hover globale                                                                                                                                      | Ombres natives non touchées (override ne pilote pas `--shadow-*`)                                                                                                                          | Ombres natives non touchées                                                                                                  | **NON** — aucune unification des ombres ; nos tokens d'ombre ne sont pas propagés aux apps tierces                            |

> **Lecture rapide du tableau** : la cohérence inter-apps est **forte sur la
> colorimétrie** (accent teal, neutres dark/light, texte, sélection, focus-couleur)
> et **faible sur la géométrie** (radius), la **typographie** (2 apps sur 4 hors SF
> Pro) et les **propriétés de mouvement/élévation** (transitions, ombres non
> propagées).

---

### Ce qui RESTE NON unifié — et POURQUOI (tracé)

#### 1. Le RADIUS — l'écart résiduel n°1 (cf. critère B de l'ADN, `01-adn-marque.md:249-258`)

C'est l'incohérence la plus visible. Le canonique OpenHub est `4 / 8 / 12 / 9999`
(`sidebar.html:63-66`) et nos 4 vues le respectent (Chat, Orch, Sidebar, Nav-popup
définissent toutes `--radius-sm 4px / md 8px / lg 12px / full 9999px`). Côté apps
tierces, le radius reste majoritairement natif, pour des raisons **différentes par
app** :

- **OpenWork — l'override n'aborde tout simplement pas le radius.** Vérifié en
  Phase 4 (§1.1) : 0 occurrence de `radius` dans `openwork/theme.css`. Le natif est
  très arrondi (`--dls-radius` 16px, `.ow-soft-card` 24px, `.ow-soft-shell` 32px,
  boutons pilule `9999px`, `index.css:63-64,166,172,188`). **Cause : levier non
  actionné** (les variables `--dls-radius`, `--dls-radius-lg`, `--radius` ne sont
  pas redéfinies). Résultat : surfaces Work rondes/molles vs 8-12px anguleux-doux
  des vues OpenHub.

- **OpenWork (overlays projets `.oh-*`) — collision de variable native qui écrase
  le fallback.** `projects.css`/`projects-hub.css` posent `var(--radius-lg,12px)` et
  `var(--radius-md,8px)`, MAIS OpenWork définit nativement ces mêmes tokens dans un
  `@theme inline` dérivé de `--radius:0.45rem` → `--radius-lg ≈ 7.2px`,
  `--radius-md ≈ 5.8px` (`index.css:503-505`). **Cause : le fallback n'est jamais
  atteint** parce que la variable existe déjà (valeur ≠ celle voulue). Nos propres
  overlays rendent donc plus serrés que prévu (Phase 4 §1.2). C'est un piège de
  cascade, pas un oubli.

- **OpenCode — échelle native serrée + radius hardcodés, override partiel.**
  L'override ne pose `var(--radius-md,8px)` que sur les inputs (theme.css:204). Le
  natif a une échelle `--radius-xs 2px … --radius-xl 10px` (`theme.css:45-49`) ET de
  nombreux radius **codés en dur dans les composants** (mesuré : 6px×8, 8px×6, 4px×5,
  2px×5, 12px×3, 999px×5, Phase 4 §1.4). **Cause double : `!important` manquant /
  override non posé sur les cartes-boutons-popovers + radius hardcodés
  inatteignables par redéfinition de token.** Résultat : cartes/boutons OpenCode plus
  anguleux et hétérogènes que les nôtres.

- **Open-Design — `--radius-md` inexistant (fallback OK par chance) mais
  `--radius-sm` natif écrase le fallback.** L'override pose `var(--radius-md,8px)`
  sur boutons/cartes/dialogs : comme `--radius-md` **n'existe pas** nativement
  (`tokens.css`), le fallback **8px** s'applique → cohérent par coïncidence avec le
  natif `--radius`. MAIS les inputs posent `var(--radius-sm,4px)` alors que
  `--radius-sm` natif = **6px** (`tokens.css:55`) → l'input rend **6px, pas 4px**
  (Phase 4 §1.5). **Cause : variable native qui écrase le fallback** (même mécanisme
  qu'OpenWork mais sur un seul token). C'est l'app la plus proche du canonique
  (8px partout) tout en restant légèrement désalignée sur les inputs (6 vs 4px).

**Synthèse radius :** valeurs de boutons rendues = 8px(nous)/pilule(Work)/2-10px
(Code)/8px(Design) ; valeurs de cards rendues = 12px(nous)/24-32px(Work)/2-12px
(Code)/8px(Design). **Aucune des 3 apps ne rejoint le 12px des cartes OpenHub.** Le
correctif propre est connu (Phase 4 §3) : redéfinir explicitement les variables
radius natives (`--dls-radius*`/`--radius` pour Work, `--radius-xs..xl` pour Code,
`--radius-sm` à 4px pour Design) plutôt que de s'appuyer sur des fallbacks que la
cascade native intercepte — ce qui veut souvent dire ajouter `!important` ou cibler
les composants par sélecteur quand le radius est hardcodé.

#### 2. La TYPOGRAPHIE — 2 apps sur 4 hors marque

La marque prescrit SF Pro (`design_system.md`/`typography.json`, repris en
`01-adn-marque.md:266-269`). Nos 4 vues le respectent. Open-Design est ramené à SF
Pro par l'override (theme.css:115-116). Mais **OpenWork garde IBM Plex Sans/Geist**
(`index.css:144-145`) et **OpenCode garde son stack `ui-sans-serif, system-ui`**
(`theme.css:2`) : dans les deux cas, **l'override ne touche pas la typo du tout**
(Phase 4 §1.1, §1.4). Cause : choix de non-intervention (probablement pour ne pas
casser le rendu de code/mise en page native). Conséquence directe pour le persona
Léa (« le montrer sans s'excuser du look », `01-adn-marque.md:110`) : passer de la
sidebar/Chat (SF Pro) à l'écran Work (IBM Plex) produit un saut de fonte perceptible.

#### 3. Le THÈME en mode clair — risque de casse sur Open-Design

Cohérence dark excellente (`#0a0a0a`/`#141414`/`#ececec` partout). En clair,
**Open-Design a une cascade dark cassée** (Phase 4 §1.5) : son bloc dark d'override
est enfermé dans `@media (prefers-color-scheme: dark)`, alors que le natif active
aussi le dark via `[data-theme="dark"]` hors media. Si l'OS est clair mais le thème
forcé sombre, l'override n'applique pas ses fonds sombres → mélange fonds anthracite
natifs + accents/bordures clairs. Cause : asymétrie de scope (`@media` au lieu de
`[data-theme="dark"]`, contrairement à `openwork/theme.css:6` qui cible bien
l'attribut). Secondairement, les **overlays projets OpenWork** (`.oh-*`) reposent sur
des fallbacks couleur figés sur la valeur dark (`var(--bg-panel,#141414)`) → en mode
clair, ces overlays propres restent sombres (Phase 4 §1.2-1.3). C'est NOTRE code qui
casse ici, pas l'app tierce.

#### 4. TRANSITIONS et OMBRES — non propagées aux apps tierces

Nos vues partagent une transition standard 150ms `cubic-bezier(0.4,0,0.2,1)`. Les
apps tierces ne se voient **pas** imposer cette courbe (les overrides ne pilotent que
couleurs/radius-partiel/layout). Le seul geste global est négatif : le global
override **supprime toutes les box-shadow au `*:hover`** (`global/theme.css:110`,
Phase 3 global §117). Les échelles d'ombre `--shadow-*` de la marque ne sont donc
**jamais propagées** dans les WebContentsView. Cause : YAGNI/prudence (ne pas casser
le layout natif), mais cela laisse mouvement et élévation hétérogènes entre coquille
et apps.

#### 5. Incohérences résiduelles DANS nos propres vues (qui dégradent la cohérence d'ensemble)

Même côté « nous », deux écarts pèsent sur la cohérence inter-vues (et donc sur la
perception d'unité quand on passe d'une vue à l'app voisine) :

- **4 systèmes de tokens par nommage** pour une palette identique : `--oh-*`
  (Sidebar, canonique), `--*` court (Chat + Orch, dupliqué), `--*` ultra-court
  (Nav-popup), et le global override qui n'a tokenisé que l'animation et hardcode
  tout le reste (Phase 3, tableau §13-21). Valeurs identiques, noms divergents →
  toute évolution de charte doit être répétée 4 fois.
- **Nav-popup diverge** sur le fond dark (`#111111` au lieu de `#0a0a0a`,
  nav-popup.html:17) et sur l'easing de transition (`150ms ease` natif au lieu de
  `cubic-bezier`, nav-popup.html:77), alors qu'il est la continuité visuelle directe
  de la Sidebar (Phase 3 sidebar §1, §10).

---

## Score d'unification inter-apps : **6,5 / 10**

### Justification (dérivée des faits, pondérée par axe)

| Axe de cohérence                                      | État                                                                                                                                                                       | Poids | Note /10 |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------- |
| Accent (primaire + hover + focus-couleur + sélection) | Teal `#14b8a6`/`#0d9488` propagé sur les 4 apps via overrides par variables (OpenWork `--dls-accent`/`--primary` ; OpenCode OC-1+v2 ; Open-Design `--accent`) + nos 4 vues | 25%   | **9,5**  |
| Fonds + texte neutres (mode sombre)                   | `#0a0a0a`/`#141414`/`#ececec` identiques partout (sauf Nav-popup `#111111`)                                                                                                | 20%   | **9**    |
| Thème mode clair                                      | OK en principe mais cascade dark cassée d'Open-Design + overlays projets figés en dark                                                                                     | 10%   | **5**    |
| Radius (boutons + cards + inputs)                     | Non unifié : pilule/24-32 (Work), 2-12 (Code), 6-8 (Design) vs 8/12/4 (nous) ; fallbacks interceptés par variables natives, `!important`/redéfinition manquants            | 25%   | **3,5**  |
| Typographie                                           | SF Pro chez nous + Open-Design ; IBM Plex (Work) et system-ui (Code) non corrigés                                                                                          | 10%   | **5**    |
| Transitions + ombres                                  | Courbe/échelle non propagées aux apps tierces ; suppression globale des ombres hover                                                                                       | 10%   | **4**    |

Moyenne pondérée ≈ **6,5/10**.

**Lecture du score.** L'unification est portée presque entièrement par la
**couleur** : l'accent teal et les neutres dark sont remarquablement cohérents d'un
slot à l'autre, ce qui valide le principe de marque « unité par la forme et un accent
unique, pas de couleur par-outil » (`01-adn-marque.md:224-225`, v2). C'est le socle
de la promesse « une fenêtre, trois outils » ressentie visuellement.

Le score est plafonné par la **géométrie** (radius) et la **typographie** : ce sont
précisément les deux signaux qui trahissent qu'on regarde trois apps différentes
sous une coquille commune. Un utilisateur passant de la Sidebar (8/12px, SF Pro) à
OpenWork (boutons pilule, cartes 24-32px, IBM Plex) perçoit un changement de
matériau, pas seulement de contenu — ce qui contrarie le critère « unité sans
uniformité » et le test Léa (`01-adn-marque.md:278-284, :110`). Les causes sont
documentées et corrigeables (redéfinir les variables radius natives plutôt que de
compter sur des fallbacks que la cascade intercepte ; forcer SF Pro sur Work et Code
comme déjà fait sur Design).

---

## RETOUR demandé

**Score d'unification inter-apps : 6,5 / 10.**

**Principaux écarts résiduels par app :**

- **OpenWork (Work)** — (1) **Radius natif jamais corrigé** : boutons pilule
  `9999px`, cartes 24px (`.ow-soft-card`), shell 32px, `--dls-radius` 16px
  (`index.css:63-64,166,172,188`) ; l'override ne traite aucun radius (Phase 4 §1.1).
  (2) **Typo IBM Plex Sans/Geist** non ramenée à SF Pro (`index.css:144-145`).
  (3) **Overlays projets `.oh-*`** : `var(--radius-lg,12px)` intercepté par
  `--radius-lg`≈7,2px natif (`@theme inline`, `index.css:505`) → rend ~7,2px, et
  couleurs en fallback figé dark → restent sombres en mode clair (Phase 4 §1.2-1.3).

- **OpenCode (Code)** — (1) **Radius le plus hétérogène** : échelle native 2-10px +
  radius hardcodés dans les composants (6/8/4/2/12px, 999px) ; override pose 8px
  uniquement sur les inputs (theme.css:204) → cartes/boutons/popovers anguleux et
  incohérents (Phase 4 §1.4). (2) **Typo `ui-sans-serif/system-ui`** non corrigée
  (`theme.css:2`). (3) Risque secondaire hors design strict : correctifs layout via
  classes Tailwind échappées (`xl:flex`, `z-25`) cassables en silence après
  `update:apps`.

- **Open-Design (Design)** — app la mieux unifiée (8px partout + SF Pro forcé), mais
  (1) **inputs en 6px au lieu de 4px** car `--radius-sm` natif (6px) écrase le
  fallback `var(--radius-sm,4px)` (theme.css:145 ; `tokens.css:55`) ;
  (2) **cascade dark cassée** : bloc dark de l'override enfermé dans
  `@media (prefers-color-scheme: dark)` alors que le natif active aussi le dark via
  `[data-theme="dark"]` → en OS clair + thème forcé sombre, mélange fonds anthracite
  natifs + accents/bordures clairs (Phase 4 §1.5).

- **Nos vues (transversal)** — accent et neutres dark parfaitement alignés, MAIS
  4 conventions de tokens par nommage pour une même palette (`--oh-*` vs `--*` court
  vs ultra-court vs global hardcodé), et **Nav-popup diverge** sur le fond dark
  (`#111111` vs `#0a0a0a`, nav-popup.html:17) et l'easing (`150ms ease` vs
  `cubic-bezier`, nav-popup.html:77).

**Le levier n°1 d'amélioration** est le radius : redéfinir explicitement les
variables radius natives de chaque app (et non s'appuyer sur des fallbacks que la
cascade native intercepte), au besoin avec `!important` ou un ciblage composant quand
le radius est hardcodé. **Le levier n°2** est la typo : appliquer à OpenWork et
OpenCode le même forçage SF Pro déjà en place sur Open-Design.
