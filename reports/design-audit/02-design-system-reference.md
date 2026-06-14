# Audit Design OpenHub — Phase 2 : Design System de Référence

> **Objet** : extraction des valeurs **PRESCRITES** par la marque OpenHub (le « doit être »).
> Aucune valeur du code applicatif n'est auditée ici — uniquement les fichiers de marque.
> **Version de marque** : Design System v2.0 (refonte minimaliste, 2026-06-10).
> Date d'extraction : 2026-06-14.

## Sources lues (toutes dans `fichier-de-la-marque/`)

| Fichier                                  | Rôle                                                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `design_system.md` (v1.1 / palette v2.0) | Spécification maîtresse : couleurs, typo, espacements, radius, ombres, animations, composants, iconographie |
| `brand_colors.json` (v2.0.0)             | Tokens de couleur dark + light, états, sélection, scrollbar, suppressions v2                                |
| `typography.json` (v1.0.0)               | Familles de police, échelle complète, poids, letter-spacing                                                 |
| `icon_set/` (33 fichiers `.svg`)         | Inventaire et style des icônes (inspectés directement)                                                      |
| `refonte-v2-guide.md`                    | Guide de migration v1→v2 (confirme suppressions et nouvelles valeurs accent)                                |

> **Avertissement de périmètre** : le dossier `pied/` (`STYLEGUIDE.md`, `charte_graphique.md`, `brand_identity.md`)
> appartient à une **autre marque** sans rapport — « SEREINA Paris » (chaussures/confort, palette or mat + serif
> Cormorant/Playfair, radius 0px). **Il a été exclu** de cette référence. Ne pas l'utiliser comme source OpenHub.

> **Note de cohérence** : la palette v2 est définie en _deux_ endroits concordants (`design_system.md` §2 et
> `brand_colors.json`). En cas de besoin, `brand_colors.json` fait foi pour les hex exacts (tokens `--oh-*`).

---

## Couleurs

> Convention de nommage : `--oh-color-{catégorie}-{propriété}-{variante}` (`design_system.md` §11.2).
> Mode par défaut = **clair** (suit `prefers-color-scheme`) ; le mode sombre s'active sous macOS dark.
> Source des hex : `brand_colors.json` ; usages confirmés dans `design_system.md` §2.

### Fonds (`background`)

| Token                    | Hex (light) | Hex (dark) | Usage prévu                           | Source                                |
| ------------------------ | ----------- | ---------- | ------------------------------------- | ------------------------------------- |
| `--oh-color-bg-deepest`  | `#FFFFFF`   | `#0A0A0A`  | Fond racine (html, body)              | `brand_colors.json` L12-18 / L159-164 |
| `--oh-color-bg-panel`    | `#F7F7F7`   | `#141414`  | Sidebar, panneaux latéraux            | `brand_colors.json` L19-24 / L166-170 |
| `--oh-color-bg-surface`  | `#EFEFEF`   | `#1E1E1E`  | Cartes, inputs, surfaces interactives | `brand_colors.json` L25-30 / L172-176 |
| `--oh-color-bg-elevated` | `#FFFFFF`   | `#282828`  | Modales, sheets, tooltips             | `brand_colors.json` L31-36 / L178-182 |
| `--oh-color-bg-overlay`  | `#F2F2F2`   | `#111111`  | Dropdowns, menus flottants            | `brand_colors.json` L37-42 / L184-188 |

### Bordures (`border`)

| Token                       | Hex (light) | Hex (dark) | Usage prévu                     | Source                                |
| --------------------------- | ----------- | ---------- | ------------------------------- | ------------------------------------- |
| `--oh-color-border-subtle`  | `#E8E8E8`   | `#1F1F1F`  | Séparateurs, bordures discrètes | `brand_colors.json` L45-49 / L192-196 |
| `--oh-color-border-default` | `#E0E0E0`   | `#2A2A2A`  | Bordures standard               | `brand_colors.json` L50-54 / L197-201 |
| `--oh-color-border-strong`  | `#CCCCCC`   | `#3A3A3A`  | Focus, bordures actives         | `brand_colors.json` L55-60 / L202-207 |

### Texte (`text`)

| Token                       | Hex (light) | Hex (dark) | Usage prévu               | Source                                |
| --------------------------- | ----------- | ---------- | ------------------------- | ------------------------------------- |
| `--oh-color-text-primary`   | `#111111`   | `#ECECEC`  | Texte principal, contenu  | `brand_colors.json` L65-71 / L212-217 |
| `--oh-color-text-secondary` | `#555555`   | `#999999`  | Descriptions, labels      | `brand_colors.json` L72-78 / L218-224 |
| `--oh-color-text-muted`     | `#888888`   | `#666666`  | Placeholders, métadonnées | `brand_colors.json` L79-85 / L225-231 |
| `--oh-color-text-disabled`  | `#BBBBBB`   | `#444444`  | Texte inactif             | `brand_colors.json` L86-91 / L232-238 |

### Accent (teal unique — aucune couleur par outil en v2)

| Token                            | Light                   | Dark                    | Usage prévu                         | Source                                  |
| -------------------------------- | ----------------------- | ----------------------- | ----------------------------------- | --------------------------------------- |
| `--oh-color-accent-primary`      | `#0D9488`               | `#14B8A6`               | Actions, liens, onglet actif, focus | `brand_colors.json` L94-100 / L241-247  |
| `--oh-color-accent-hover`        | `#0F766E`               | `#2DD4BF`               | Survol des éléments accent          | `brand_colors.json` L101-106 / L248-253 |
| `--oh-color-accent-active`       | `#115E59`               | `#0D9488`               | Appui, état actif                   | `brand_colors.json` L107-112 / L254-259 |
| `--oh-color-accent-subtle`       | `rgba(13,148,136,0.06)` | `rgba(20,184,166,0.10)` | Fond d'interaction subtil           | `brand_colors.json` L113-118 / L260-265 |
| `--oh-color-accent-subtle-hover` | `rgba(13,148,136,0.10)` | `rgba(20,184,166,0.16)` | Survol fond d'interaction           | `brand_colors.json` L119-124 / L266-271 |

### Sémantiques (`success` / `warning` / `error`)

| Token                | Hex (light) | Hex (dark) | Usage prévu              | Source                                  |
| -------------------- | ----------- | ---------- | ------------------------ | --------------------------------------- |
| `--oh-color-success` | `#16A34A`   | `#22C55E`  | Succès, validation       | `brand_colors.json` L127-132 / L274-279 |
| `--oh-color-warning` | `#D97706`   | `#F59E0B`  | Attention, avertissement | `brand_colors.json` L133-138 / L280-285 |
| `--oh-color-error`   | `#DC2626`   | `#EF4444`  | Erreur, danger           | `brand_colors.json` L139-144 / L286-291 |

### Couleurs annexes (sélection, scrollbar, overlays de modale)

| Élément                          | Light                                   | Dark                                                | Source                                  |
| -------------------------------- | --------------------------------------- | --------------------------------------------------- | --------------------------------------- |
| Sélection texte (fond / couleur) | `rgba(13,148,136,0.15)` / `#111111`     | `rgba(20,184,166,0.25)` / `#FFFFFF`                 | `brand_colors.json` L307-310            |
| Scrollbar (largeur)              | `6px`                                   | `6px`                                               | `brand_colors.json` L311-323            |
| Scrollbar thumb / hover          | `rgba(0,0,0,0.10)` / `rgba(0,0,0,0.16)` | `rgba(255,255,255,0.08)` / `rgba(255,255,255,0.14)` | `brand_colors.json` L311-323            |
| Overlay modale `modal`           | `rgba(0,0,0,0.10)`                      | `rgba(0,0,0,0.40)`                                  | `brand_colors.json` L152-155 / L299-302 |
| Overlay `heavy`                  | `rgba(0,0,0,0.20)`                      | `rgba(0,0,0,0.60)`                                  | `brand_colors.json` L152-155 / L299-302 |

### Couleurs SUPPRIMÉES en v2 (ne doivent plus exister)

| Élément retiré                                                                                      | Raison                                  | Source                                                         |
| --------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| Accents par outil : `accent-work`, `accent-code`, `accent-design`, `accent-chat`, `accent-projects` | Remplacés par l'accent teal unique      | `brand_colors.json` L327-330                                   |
| `--oh-color-info` (bleu `#3B82F6`)                                                                  | Remplacé par `text-secondary` (gris)    | `brand_colors.json` L331-334 ; `design_system.md` L111         |
| `shadow-glow` (glow violet)                                                                         | Ombres purement structurelles désormais | `brand_colors.json` L335-338 ; `design_system.md` L112,240,251 |

---

## Typographie

> Familles : `typography.json` L5-22. Échelle : `typography.json` L23-137 (texte) et L138-175 (mono).
> Confirmé dans `design_system.md` §3.

### Familles de police

| Rôle                                     | Font family (stack)                                                                                | Poids                                           | Source                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------ |
| `sans` (interface, corps)                | `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` | regular 400, medium 500, semibold 600, bold 700 | `typography.json` L6-11  |
| `mono` (code, terminal)                  | `"SF Mono", "Menlo", "Monaco", "Courier New", monospace`                                           | 400 / 500 / 600 / 700                           | `typography.json` L12-16 |
| `rounded` (badges, chiffres — optionnel) | `"SF Pro Rounded", "SF Pro Text", -apple-system, sans-serif`                                       | medium 500, semibold 600                        | `typography.json` L17-21 |

> `SF Pro Display` est appliqué automatiquement à partir de 20px par macOS (`typography.json` L10).
> Anti-aliasing prescrit (macOS) : `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` (`typography.json` L182-184).
> Taille de base = 14px ; taille minimale = 11px (`typography.json` L185-190).

### Échelle texte (`sans`)

| Rôle / Token           | Font family | Weight | Size | Line-height | Letter-spacing             | Source                     |
| ---------------------- | ----------- | ------ | ---- | ----------- | -------------------------- | -------------------------- |
| `--oh-font-text-xs`    | sans        | 400    | 11px | 1.4 (15px)  | `0.01em`                   | `typography.json` L24-33   |
| `--oh-font-text-sm`    | sans        | 400    | 13px | 1.4 (18px)  | NON DÉFINI (hérité normal) | `typography.json` L34-42   |
| `--oh-font-text-base`  | sans        | 400    | 14px | 1.5 (21px)  | NON DÉFINI (hérité normal) | `typography.json` L43-51   |
| `--oh-font-text-md`    | sans        | 400    | 15px | 1.5 (22px)  | NON DÉFINI (hérité normal) | `typography.json` L52-60   |
| `--oh-font-text-lg`    | sans        | 500    | 17px | 1.5 (25px)  | NON DÉFINI (hérité normal) | `typography.json` L61-69   |
| `--oh-font-heading-xs` | sans        | 600    | 13px | 1.3 (17px)  | `0.03em` (uppercase)       | `typography.json` L70-80   |
| `--oh-font-heading-sm` | sans        | 600    | 15px | 1.3 (19px)  | NON DÉFINI (hérité normal) | `typography.json` L81-89   |
| `--oh-font-heading-md` | sans        | 600    | 17px | 1.3 (22px)  | NON DÉFINI (hérité normal) | `typography.json` L90-98   |
| `--oh-font-heading-lg` | sans        | 700    | 20px | 1.2 (24px)  | NON DÉFINI (hérité normal) | `typography.json` L99-107  |
| `--oh-font-heading-xl` | sans        | 700    | 24px | 1.2 (29px)  | NON DÉFINI (hérité normal) | `typography.json` L108-116 |
| `--oh-font-display-sm` | sans        | 700    | 28px | 1.1 (31px)  | `-0.01em`                  | `typography.json` L117-126 |
| `--oh-font-display-md` | sans        | 700    | 34px | 1.1 (37px)  | `-0.01em`                  | `typography.json` L127-136 |

### Échelle monospace (`mono`)

| Token                 | Font family | Weight | Size | Line-height | Source                     |
| --------------------- | ----------- | ------ | ---- | ----------- | -------------------------- |
| `--oh-font-mono-xs`   | mono        | 400    | 11px | 1.5 (16px)  | `typography.json` L139-147 |
| `--oh-font-mono-sm`   | mono        | 400    | 13px | 1.6 (21px)  | `typography.json` L148-156 |
| `--oh-font-mono-base` | mono        | 400    | 14px | 1.6 (22px)  | `typography.json` L157-165 |
| `--oh-font-mono-md`   | mono        | 400    | 15px | 1.6 (24px)  | `typography.json` L166-174 |

---

## Espacements

> Grille de base **8px** (`design_system.md` §4.1). Préfixe `--oh-space-*` (`design_system.md` §11.2).

| Token           | Valeur | Usage                            | Source                  |
| --------------- | ------ | -------------------------------- | ----------------------- |
| `--oh-space-0`  | 0      | Collé                            | `design_system.md` L190 |
| `--oh-space-1`  | 4px    | Micro-espacement (icône + texte) | `design_system.md` L191 |
| `--oh-space-2`  | 8px    | Espacement interne standard      | `design_system.md` L192 |
| `--oh-space-3`  | 12px   | Padding de composant compact     | `design_system.md` L193 |
| `--oh-space-4`  | 16px   | Padding de composant standard    | `design_system.md` L194 |
| `--oh-space-5`  | 20px   | Padding de modal / carte         | `design_system.md` L195 |
| `--oh-space-6`  | 24px   | Marge entre sections             | `design_system.md` L196 |
| `--oh-space-8`  | 32px   | Marge de layout large            | `design_system.md` L197 |
| `--oh-space-10` | 40px   | Séparation majeure               | `design_system.md` L198 |
| `--oh-space-12` | 48px   | Padding de page                  | `design_system.md` L199 |
| `--oh-space-16` | 64px   | Marge de section héro            | `design_system.md` L200 |

> Dimensions de layout prescrites (`design_system.md` §4.2-4.3) :
> Sidebar = **64px** de large ; icônes de slot **28×28px** centrées, espacement vertical **8px**.
> Zone de contenu : padding horizontal **24px** min ; largeur lisible max **720px** (texte), illimitée (éditeurs/canevas).
> (À noter : §4.2 dit « sidebar 64px (espace-12) » alors que `space-12`=48px — légère incohérence dans la doc, mais la **valeur prescrite est 64px**.)

---

## Border-radius (CRITIQUE)

> Préfixe `--oh-radius-*`. Source unique : `design_system.md` §5.

| Token              | Valeur | Usage                                                | Source                  |
| ------------------ | ------ | ---------------------------------------------------- | ----------------------- |
| `--oh-radius-none` | 0      | Éléments pleine largeur                              | `design_system.md` L219 |
| `--oh-radius-xs`   | 4px    | Badges, tags, petites étiquettes (ex. `code-inline`) | `design_system.md` L220 |
| `--oh-radius-sm`   | 6px    | Inputs, petits boutons, close-button, list-item      | `design_system.md` L221 |
| `--oh-radius-md`   | 8px    | Boutons, cartes, dropdowns, slot sidebar, toast      | `design_system.md` L222 |
| `--oh-radius-lg`   | 12px   | Modales, panels                                      | `design_system.md` L223 |
| `--oh-radius-xl`   | 16px   | Grandes modales, sheets                              | `design_system.md` L224 |
| `--oh-radius-full` | 9999px | Pills, avatars, badges circulaires, toggle, progress | `design_system.md` L225 |

> **Échelle prescrite** : `0 → 4 → 6 → 8 → 12 → 16 → 9999px`. Aucune autre valeur de rayon n'est autorisée.

---

## Ombres

> Préfixe `--oh-shadow-*`. Ombres **purement structurelles** (noir alpha neutre) ; `shadow-glow` supprimé en v2.
> Source : `design_system.md` §6 et `brand_colors.json` (`shadow`).

| Token            | Valeur (light)                | Valeur (dark)                 | Usage               | Source                                                       |
| ---------------- | ----------------------------- | ----------------------------- | ------------------- | ------------------------------------------------------------ |
| `--oh-shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)`  | `0 1px 2px rgba(0,0,0,0.20)`  | Cartes, inputs      | `design_system.md` L246/L235 ; `brand_colors.json` L147/L294 |
| `--oh-shadow-sm` | `0 2px 8px rgba(0,0,0,0.06)`  | `0 2px 8px rgba(0,0,0,0.24)`  | Dropdowns, tooltips | `design_system.md` L247/L236 ; `brand_colors.json` L148/L295 |
| `--oh-shadow-md` | `0 4px 16px rgba(0,0,0,0.08)` | `0 4px 16px rgba(0,0,0,0.28)` | Modales, sheets     | `design_system.md` L248/L237 ; `brand_colors.json` L149/L296 |
| `--oh-shadow-lg` | `0 8px 32px rgba(0,0,0,0.12)` | `0 8px 32px rgba(0,0,0,0.40)` | Modales larges      | `design_system.md` L249/L238 ; `brand_colors.json` L150/L297 |

> **Incohérence à signaler** : l'exemple de nommage CSS (`design_system.md` L1129) cite
> `--oh-shadow-sm  /* 0 2px 8px rgba(0,0,0,0.45) */`. La valeur `0.45` ne correspond **ni** au dark (0.24) **ni**
> au light (0.06). À VÉRIFIER — la valeur faisant foi est celle des tableaux §6 / du JSON.

---

## Transitions / Animations

> Préfixes `--oh-ease-*` et `--oh-duration-*`. Source : `design_system.md` §7.

### Courbes d'interpolation

| Token               | Valeur                              | Usage                           | Source                  |
| ------------------- | ----------------------------------- | ------------------------------- | ----------------------- |
| `--oh-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)`      | Transitions standard            | `design_system.md` L261 |
| `--oh-ease-in`      | `cubic-bezier(0.4, 0, 1, 1)`        | Entrées (apparition)            | `design_system.md` L262 |
| `--oh-ease-out`     | `cubic-bezier(0, 0, 0.2, 1)`        | Sorties (disparition)           | `design_system.md` L263 |
| `--oh-ease-spring`  | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Rebond léger (curseurs, toggle) | `design_system.md` L264 |

### Durées

| Token               | Valeur | Usage                                   | Source                  |
| ------------------- | ------ | --------------------------------------- | ----------------------- |
| `--oh-duration-75`  | 75ms   | Micro-interactions (hover, press)       | `design_system.md` L270 |
| `--oh-duration-150` | 150ms  | Transitions standard (couleur, opacité) | `design_system.md` L271 |
| `--oh-duration-250` | 250ms  | Apparition/disparition (fade)           | `design_system.md` L272 |
| `--oh-duration-350` | 350ms  | Modales, sheets, transitions de page    | `design_system.md` L273 |
| `--oh-duration-500` | 500ms  | Transitions majeures (rare)             | `design_system.md` L274 |

> Règles prescrites (`design_system.md` §7.3) : hover ≤ 150ms `ease-default` ; apparition = opacity + translateY(4px→0)
> 250ms `ease-out` ; disparition = inverse 150ms `ease-in` ; focus = outline instantané 2px `accent-primary` ;
> respect obligatoire de `prefers-reduced-motion` (animations → 0ms ou fondu simple).

---

## Iconographie

> Source : `design_system.md` §9 + inspection directe des 33 fichiers de `icon_set/`.
> Style = trait (line icons, famille type Feather/Lucide), aucun fill.

| Style                                                                       | Taille standard                                                            | Stroke width                                   | Couleur                              | Source                                                               |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| SVG trait, `viewBox 0 0 24 24`, `linecap`/`linejoin` `round`, `fill="none"` | 18×18px (composants), 24×24px (sidebar) ; zone de dessin 20×20 (marge 2px) | **2px** (uniforme, vérifié sur 33/33 fichiers) | `currentColor` (héritée du contexte) | `design_system.md` L990-994, L996-1011 ; inspection `icon_set/*.svg` |

**Vérification factuelle** : les 33 SVG du dossier ont tous `viewBox="0 0 24 24"` et `stroke-width="2"`
(grep exhaustif : 0 exception). Attributs constants : `fill="none"`, `stroke="currentColor"`,
`stroke-linecap="round"`, `stroke-linejoin="round"`. Tailles standard d'affichage selon contexte
(boutons : 16/18/20px pour sm/md/lg — `design_system.md` L366 ; spinner : 20×20 stroke 2 — L855).

> **Écart d'inventaire** : `design_system.md` (L1175, L1013-1049) annonce **« 32 icônes »** mais le dossier
> en contient **33** (`work, code, design, project, folder, file, settings, search, plus, close, chevron-down,
chevron-right, check, check-circle, copy, trash, edit, external-link, download, user, users, chat, memory,
more-horizontal, arrow-left, refresh, info, help, alert, eye, moon, sun, logout`). La liste de la doc est
> exhaustive (33 noms) ; seul le total écrit « 32 » est erroné. À VÉRIFIER côté doc.

---

## Récapitulatif des tokens « NON DÉFINI » / « À VÉRIFIER »

| Élément                                                             | Statut                       | Détail                                                                                                                                                                                                |
| ------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `letter-spacing` des rôles texte/heading médians                    | NON DÉFINI (hérité `normal`) | Seuls 4 rôles ont un letter-spacing explicite : `text-xs` (0.01em), `heading-xs` (0.03em), `display-sm` & `display-md` (-0.01em). Tous les autres : non spécifié → `normal`.                          |
| `--oh-shadow-sm` valeur d'exemple `0.45`                            | À VÉRIFIER                   | Contradiction entre l'exemple de nommage (`design_system.md` L1129, `0.45`) et les valeurs réelles (dark 0.24 / light 0.06).                                                                          |
| Sidebar « 64px (espace-12) »                                        | À VÉRIFIER                   | `space-12`=48px ≠ 64px ; la largeur prescrite reste **64px** mais le renvoi au token est faux.                                                                                                        |
| Total « 32 icônes »                                                 | À VÉRIFIER                   | Le dossier contient **33** SVG.                                                                                                                                                                       |
| Tokens d'opacité / z-index / dimensions de composant                | NON DÉFINI comme tokens      | Les z-index (500/1000/1100/2000), opacités disabled (0.4), hauteurs de bouton (28/34/42px), etc. sont écrits en dur dans les recettes de composants `design_system.md` §8, sans token `--oh-*` dédié. |
| Spacing nommé `--oh-space-7`, `--oh-space-9`, `--oh-space-11`, etc. | NON DÉFINI (volontaire)      | L'échelle saute certaines valeurs (0,1,2,3,4,5,6,8,10,12,16). C'est intentionnel, pas un manque.                                                                                                      |
| Couleurs de marque dans `pied/`                                     | HORS PÉRIMÈTRE               | Marque « SEREINA » sans rapport — ne pas utiliser.                                                                                                                                                    |

---

_Fin du rapport — Phase 2. Ce document décrit les valeurs PRESCRITES (référence). L'écart avec le code
applicatif réel sera traité dans une phase ultérieure de l'audit._
