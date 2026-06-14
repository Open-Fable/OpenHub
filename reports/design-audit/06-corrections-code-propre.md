# 06 — Plan de corrections du code propre (Phase 6)

> **Objet** : plan d'action priorisé pour amener NOTRE code propre (Chat,
> Orchestrateur/Projects, Sidebar, Nav-popup, Settings, overrides global) à la
> cohérence interne + alignement de marque exigés par l'ADN (`01`) et le design
> system de référence (`02`), à partir des écarts mesurés en `05`.
>
> **Périmètre** : UNIQUEMENT le code écrit par OpenHub. Les 3 apps tierces
> (OpenWork, OpenCode, Open-Design) et leurs overrides `electron/overrides/<app>/`
> sont HORS périmètre de ce document (traités ailleurs : alignement radius/typo
> via redéfinition de variables natives, cf. `05:932-966`).
>
> **Méthode** : chaque bloc renvoie à un fait tracé (`05`, `02`) et à un
> `fichier:ligne` re-vérifié dans le source. Aucune valeur inventée. Les valeurs
> cibles sont les tokens canoniques `--oh-*` de `02`. **Aucun fichier source n'a
> été modifié** — c'est un PLAN.
>
> Direction artistique senior. Date : 2026-06-14.

---

## Synthèse — nombre de corrections par priorité

| Priorité       | Nombre |
| -------------- | ------ |
| **CRITIQUE**   | 5      |
| **HAUTE**      | 7      |
| **MOYENNE**    | 6      |
| **BASSE**      | 4      |
| **COSMÉTIQUE** | 3      |
| **TOTAL**      | **25** |

> Ordre de traitement recommandé (priorité absolue) :
>
> 1. Unifier le nommage des tokens vers le canon `--oh-*` (racine de la dette).
> 2. Corriger les variables non définies (`--error`, `--text-base`/`--text-strong`).
> 3. Introduire le token texte-sur-accent (`--oh-on-accent`).
> 4. Compléter l'échelle radius (paliers 6px / 16px) et durées (500ms).
> 5. Défragmenter la palette (sélection/teal hardcodés, palettes par-type Chat).

---

# CRITIQUE

> Rompt l'unité de marque ou casse le rendu réel. À traiter en premier.

### [CRITIQUE] Variable `--error` non définie dans le JS de la Sidebar → bordure d'erreur fausse en mode clair

- **Fichier :** `electron/sidebar.html:2849, 2854, 2865`
- **Problème :** le JS écrit `borderColor = "var(--error, #ef4444)"` mais la Sidebar ne définit QUE `--oh-color-error` (`electron/sidebar.html:47` dark `#ef4444` / `:115` light `#dc2626`). `--error` n'existe nulle part (grep `--error:` = 0 résultat dans sidebar.html). La variable étant absente, le fallback `#ef4444` s'applique TOUJOURS. En mode clair, la bordure d'erreur devrait être `#dc2626` mais rend `#ef4444`. **Bug réel confirmé** (`05:612, 624, 716`).
- **Valeur actuelle :** `var(--error, #ef4444)`
- **Valeur cible :** `var(--oh-color-error)` (token `--oh-color-error` déjà défini dark/light, `02:76`)
- **Impact visuel :** rouge d'erreur trop clair (`#ef4444`) en thème clair au lieu du `#dc2626` prescrit → signal d'erreur incohérent avec le reste du thème clair.
- **Risque de régression :** Faible (le token cible existe déjà et porte les deux valeurs dark/light ; on remplace un nom cassé par le nom réel).
- **Note :** 3 occurrences identiques dans le même handler (`btn-add-fact`). Aligne aussi la Sidebar sur sa propre convention de nommage canonique.

### [CRITIQUE] Variables `--text-base` / `--text-strong` fantômes dans Chat → couleur du menu « + » livrée au fallback navigateur

- **Fichier :** `electron/chat.html:1622` (`--text-base`), `electron/chat.html:1631` (`--text-strong`)
- **Problème :** `.more-dropdown-item` pose `color: var(--text-base)` et `.more-dropdown-item:hover` pose `color: var(--text-strong)`. Ni `--text-base` ni `--text-strong` ne sont définis dans chat.html (le `:root` Chat expose `--text-primary/-secondary/-muted/-disabled`, pas `-base`/`-strong`). Variables sans fallback → couleur du texte du menu « + » remise au défaut du moteur de rendu. **Bug réel confirmé** (`05:524, 626`).
- **Valeur actuelle :** `var(--text-base)` (item) / `var(--text-strong)` (hover)
- **Valeur cible :** `var(--oh-color-text-primary)` pour les deux états (le hover utilise déjà `--bg-surface` comme fond ; le texte primaire est le rôle adéquat, `02:55`)
- **Impact visuel :** couleur du libellé d'item de menu non maîtrisée (potentiellement noir système au lieu de `#ececec` dark / `#111111` light) → item peu lisible ou hors charte selon le thème.
- **Risque de régression :** Faible (on remplace deux variables inexistantes par un token réel).
- **Note :** à arbitrer si une nuance hover plus marquée est voulue — sinon `text-primary` pour les deux suffit. Dépend de l'unification de nommage Chat (bloc HAUTE ci-dessous).

### [CRITIQUE] Absence de token texte-sur-accent → deux conventions opposées + faible contraste en clair (Projects)

- **Fichier :** `electron/chat.html:690, 1690, 1816, 1927` (`color: #fff`) ; `electron/projects/projects.css:452, 1164, 2044` (`color: var(--bg-deepest)`) ; `electron/sidebar.html:1135, 1299` (`#fff`)
- **Problème :** le label sur bouton accent teal est écrit en `#fff` (Chat, Sidebar) MAIS en `var(--bg-deepest)` (Projects). En mode clair, `--bg-deepest` = `#ffffff` → label blanc sur teal clair `#0d9488` (contraste faible), et Projects se contredit lui-même (`.btn--danger` repasse en `#fff`). Aucune vue n'a de token texte-sur-accent (`05:540-551, 633, 720`).
- **Valeur actuelle :** `#fff` (Chat/Sidebar) vs `var(--bg-deepest)` (Projects)
- **Valeur cible :** définir un token canonique `--oh-on-accent: #ffffff` (constant dark+light, le teal `#0d9488`/`#14b8a6` portant un contraste suffisant avec le blanc) et l'employer partout pour le texte/icône sur fond accent.
- **Impact visuel :** unifie la couleur du label des boutons primaires et garantit un contraste constant indépendant du thème ; supprime le label sombre sur teal clair de Projects.
- **Risque de régression :** Moyen (touche tous les boutons primaires des 3 vues ; vérifier visuellement chaque bouton primaire/danger en dark ET light après remplacement).
- **Note :** le référentiel `02` ne prescrit pas ce token (manque amont) ; il est néanmoins requis pour éliminer la divergence. Le déclarer dans le futur fichier de tokens partagé (cf. bloc unification).

### [CRITIQUE] Réintroduction de couleurs par-type dans Chat (interdit v2)

- **Fichier :** `electron/chat.html:3312` (`PROJ_COLORS`), `electron/chat.html:6119` (`HUB_TYPE_COLORS`), `electron/chat.html:6137` (`HUB_FILTER_TYPES`)
- **Problème :** trois palettes JS attribuent des hex DIFFÉRENTS par type de projet pour un même concept, aucune n'utilisant les tokens. C'est exactement la « couleur par outil/élément » proscrite en v2 (`02:92`, `05:534, 635, 722-723`) et une décoration multicolore non justifiée par la marque.
- **Valeur actuelle :** trois tableaux/maps d'hex arbitraires par type (`PROJ_COLORS`, `HUB_TYPE_COLORS`, `HUB_FILTER_TYPES`)
- **Valeur cible :** supprimer la teinte par-type ; n'utiliser que l'accent unique `var(--oh-color-accent-primary)` pour l'état actif/sélection et les neutres (`text-secondary`/`border-default`) pour la différenciation de type. Si une distinction visuelle de type reste nécessaire, la porter par la FORME (icône) et non par la couleur.
- **Impact visuel :** disparition des pastilles/badges multicolores par type ; retour à une enveloppe mono-accent conforme v2.
- **Risque de régression :** Moyen/Élevé (logique JS consommant ces maps à plusieurs endroits ; nécessite de retracer chaque usage avant suppression — c'est une refonte fonctionnelle, pas un simple remplacement de valeur).
- **Note :** changement le plus invasif de la liste ; à cadrer comme tâche dédiée. Vérifier qu'aucune logique métier ne dépend de la couleur comme clé.

### [CRITIQUE] Fragmentation du système de tokens — contrat `--oh-*` non respecté hors Sidebar

- **Fichier :** `electron/chat.html:53-55` + `:21-64` (`--*` court) ; `electron/projects/projects.css:10-69` (`--*` court) ; `electron/nav-popup.html:16-29` (`--bg`/`--text`/`--accent` ultra-court) ; `electron/overrides/global/theme.css:20-30` (ne tokenise que l'animation)
- **Problème :** quatre implémentations parallèles de la MÊME charte sous trois conventions de nommage ; seule `sidebar.html` porte le canon `--oh-*` (`05:457-472, 611, 620, 711`). Une charte = 4 sources de vérité → toute évolution doit être répliquée 4 fois, et la dérive est déjà cassante (cf. blocs `--error` et `--text-base` ci-dessus, qui découlent directement de cette fragmentation).
- **Valeur actuelle :** `--accent-primary`/`--bg-deepest`/`--text-primary` (Chat, Projects) ; `--accent`/`--bg`/`--text` (Nav-popup) ; `--oh-color-*` (Sidebar uniquement)
- **Valeur cible :** un fichier de tokens unique partagé exposant les tokens canoniques `--oh-color-*`, `--oh-radius-*`, `--oh-space-*`, `--oh-shadow-*`, `--oh-font-*`, `--oh-ease-*`, `--oh-duration-*` (`02`), consommé par les 4 vues ; aliasing des noms courts vers `--oh-*` pendant la migration pour éviter une réécriture massive en un coup.
- **Impact visuel :** aucun à valeurs égales — mais supprime la cause racine des bugs de nommage et garantit que toute évolution de charte est propagée partout.
- **Risque de régression :** Élevé si fait d'un bloc (touche les 4 vues) ; Faible si fait par étapes via alias `--oh-* → valeur` puis migration vue par vue. **Recommandé : migration incrémentale.**
- **Note :** racine de toute la dette ; conditionne la pérennité des autres corrections (les blocs `--error`, `--text-base`, `--oh-on-accent`, sélection hardcodée se résolvent « gratuitement » une fois la source unique en place).

---

# HAUTE

> Incohérence visible mais sans casse fonctionnelle.

### [HAUTE] Échelle radius incomplète — paliers 6px et 16px manquants

- **Fichier :** `electron/chat.html:49-52`, `electron/projects/projects.css:38-41`, `electron/sidebar.html:63-66`, `electron/nav-popup.html:25-28`
- **Problème :** l'échelle réelle est `sm=4 / md=8 / lg=12 / full=9999` ; la marque prescrit `0 → 4 → 6 → 8 → 12 → 16 → 9999` (`02:182`). Les paliers **6px** (inputs/petits boutons) et **16px** (grandes modales) manquent partout, et le nommage est décalé (`--radius-sm` local = 4px ≠ `radius-sm` prescrit = 6px ; le 4px prescrit est `radius-xs`) (`05:309-321, 491-497`).
- **Valeur actuelle :** `--radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-full: 9999px;`
- **Valeur cible :** échelle canonique complète `--oh-radius-xs: 4px; --oh-radius-sm: 6px; --oh-radius-md: 8px; --oh-radius-lg: 12px; --oh-radius-xl: 16px; --oh-radius-full: 9999px;` (`02:174-180`)
- **Impact visuel :** rend disponible le 6px pour les inputs (cohérence avec Open-Design natif) et le 16px pour les grandes modales ; corrige le décalage de nommage `xs`/`sm`.
- **Risque de régression :** Moyen (renommer `--radius-sm`→`--oh-radius-xs` change la valeur ciblée si on garde le même usage ; auditer chaque usage de `--radius-sm` pour décider 4px vs 6px).
- **Note :** à coupler avec l'unification de nommage. Les usages actuels de `--radius-sm` (=4px) qui sont des inputs devraient passer à 6px (`--oh-radius-sm`) ; les tags/badges restent à 4px (`--oh-radius-xs`).

### [HAUTE] Nav-popup : fond dark `#111111` au lieu de `#0a0a0a`

- **Fichier :** `electron/nav-popup.html:17`
- **Problème :** le popup pose `--bg: #111111` en dark alors que Chat/Projects/Sidebar utilisent `#0a0a0a` en fond racine. Le dropdown rend plus clair que le fond des autres vues, dont il est la continuité visuelle directe (`05:114-117, 503, 644, 886`).
- **Valeur actuelle :** `--bg: #111111;`
- **Valeur cible :** sémantiquement, un dropdown est une surface `overlay` ; la valeur `#111111` correspond au token `--oh-color-bg-overlay` (`02:41`). Cible : exposer la surface via `var(--oh-color-bg-overlay)` (et non un `--bg` ad-hoc), ce qui conserve `#111111` mais le rend tracé et nommé correctement. Si l'on veut un alignement strict sur le fond racine des autres vues, utiliser `--oh-color-bg-deepest` (`#0a0a0a`).
- **Impact visuel :** soit nul (si l'on garde `#111111` via `bg-overlay`, choix défendable pour un menu flottant), soit léger assombrissement (si l'on aligne sur `#0a0a0a`).
- **Risque de régression :** Faible.
- **Note :** décision de design à acter — `bg-overlay` (`#111111`) est le choix le plus correct sémantiquement pour un dropdown ; l'essentiel est de tracer la valeur via un token canonique plutôt qu'un `--bg` inventé.

### [HAUTE] font-family : 4 stacks différents → police de base non uniforme

- **Fichier :** `electron/chat.html:53`, `electron/projects/projects.css:50-52`, `electron/sidebar.html:61-62`, `electron/nav-popup.html:24`
- **Problème :** Chat et Projects priorisent `"SF Pro Text"` en tête ; Sidebar et Nav-popup priorisent `-apple-system`. Fallbacks divergents (`system-ui` vs `Helvetica Neue`). La police de base — l'élément le plus visible de l'unité — n'est pas la même selon la vue (`05:557, 629, 717-719`).
- **Valeur actuelle :** 4 stacks distincts (cf. lignes ci-dessus)
- **Valeur cible :** stack `sans` unique prescrite : `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` (`02:107`) — exactement la stack déjà correcte dans `projects.css:50-52`.
- **Impact visuel :** rendu typographique identique au pixel près d'une vue à l'autre (même police, même fallback) ; supprime tout saut de fonte interne.
- **Risque de régression :** Faible (sur un Mac, `-apple-system` et `"SF Pro Text"` résolvent vers la même fonte ; impact réel surtout sur fallback/ordre).
- **Note :** aligner aussi le token mono sur la prescription `"SF Mono", "Menlo", "Monaco", "Courier New", monospace` (`02:108`) — voir bloc MOYENNE mono.

### [HAUTE] États de focus divergents + Nav-popup sans focus (accessibilité)

- **Fichier :** `electron/chat.html:140-141` (2px), `electron/projects/projects.css:137-138` (2px), `electron/sidebar.html:288` (1px) / `:651-652` (2px offset -2px) / `:859` (ring 3px) ; `electron/nav-popup.html` (aucun focus)
- **Problème :** Chat/Projects respectent la prescription (outline 2px `accent-primary` + offset 2px) ; Sidebar mélange 1px / offset négatif / ring box-shadow 3px ; Nav-popup n'a AUCUN état focus (`05:583-588, 640, 724-725`). Le référentiel impose « focus = outline instantané 2px `accent-primary` » (`02:228`).
- **Valeur actuelle :** Sidebar `outline: 1px` (slots) / ring 3px (inputs) ; Nav-popup absent
- **Valeur cible :** partout `outline: 2px solid var(--oh-color-accent-primary); outline-offset: 2px;` (`02:228`), y compris sur les items focusables du Nav-popup.
- **Impact visuel :** anneau de focus teal homogène ; corrige un trou d'accessibilité clavier dans le Nav-popup.
- **Risque de régression :** Faible/Moyen (le ring 3px des inputs Sidebar est un choix délibéré ; vérifier qu'un outline 2px ne casse pas le layout d'input — sinon conserver le ring mais à 2px d'épaisseur visuelle équivalente).
- **Note :** prioriser l'AJOUT du focus manquant au Nav-popup (accessibilité) avant l'harmonisation fine Sidebar.

### [HAUTE] Radius boutons/inputs Chat non aligné (4px + 12px + pilule)

- **Fichier :** `electron/chat.html:1687, 629` (boutons pilule `--radius-full`), `:1915` (`.oh-btn` 4px), `:2427` (input 4px), `:972, 793` (inputs 12px)
- **Problème :** Chat a des boutons pilule `9999px` (`.btn-send`, `.hub-btn-ghost`) que Projects/Sidebar n'ont pas, et mélange des inputs à 4px ET 12px ; Projects/Sidebar sont à 8px (`05:487-489, 643`).
- **Valeur actuelle :** boutons `--radius-full` 9999px (Chat seul) ; inputs `--radius-sm` 4px / `--radius-lg` 12px (incohérent)
- **Valeur cible :** boutons standard `--oh-radius-md` (8px) comme Projects/Sidebar ; inputs `--oh-radius-sm` (6px) ; réserver `--oh-radius-full` aux pills/avatars/toggles seulement (`02:177, 180`).
- **Impact visuel :** géométrie de boutons/inputs cohérente entre les 3 vues internes ; suppression des pilules de bouton non justifiées.
- **Risque de régression :** Moyen (le bouton d'envoi pilule peut être un choix esthétique assumé ; à confirmer avant de l'aplatir à 8px).
- **Note :** dépend de l'échelle radius complète (bloc HAUTE radius). Distinguer un bouton circulaire icône-only (légitimement `--radius-full`) d'un bouton-texte pilule (à ramener à 8px).

### [HAUTE] Cercles : `50%` hardcodé mélangé avec `--radius-full` DANS Chat et Projects

- **Fichier :** `electron/chat.html:1170, 2180, 1816` (`50%`) ; `electron/projects/projects.css:201, 449, 1915` (`50%`) coexistant avec `var(--radius-full)` (`projects.css:1046`)
- **Problème :** deux notations pour le même résultat (cercle plein), mélangées à l'intérieur d'une même vue (`05:490, 647`). Incohérence d'implémentation pure.
- **Valeur actuelle :** `border-radius: 50%` hardcodé
- **Valeur cible :** `border-radius: var(--oh-radius-full)` (9999px) partout pour les avatars/dots/swatches circulaires (`02:180`).
- **Impact visuel :** nul (visuellement équivalent) ; uniformise la convention.
- **Risque de régression :** Faible.
- **Note :** dette d'implémentation, pas de rendu. Regrouper avec l'unification de nommage.

### [HAUTE] Sélection texte teal hardcodée au lieu d'un token (Chat + Global)

- **Fichier :** `electron/chat.html:132, 136` ; `electron/overrides/global/theme.css:84, 90`
- **Problème :** la couleur de sélection teal est codée en dur (`rgba(13,148,136,0.15)` light / `rgba(20,184,166,0.25)` dark) au lieu de passer par un token, dupliquée entre Chat et Global (`05:268, 772`).
- **Valeur actuelle :** `background: rgba(13, 148, 136, 0.15)` (light) / `rgba(20, 184, 166, 0.25)` (dark) hardcodés
- **Valeur cible :** tokeniser la sélection (`--oh-color-selection-bg` light `rgba(13,148,136,0.15)` / dark `rgba(20,184,166,0.25)`, `02:82`) et la consommer ; la valeur reste exacte, seul le hardcode disparaît.
- **Impact visuel :** nul ; supprime le doublon et garantit la cohérence si la teinte évolue.
- **Risque de régression :** Faible.
- **Note :** le référentiel donne la valeur exacte (`02:82`) mais ne nomme pas le token ; le créer dans la source unique.

---

# MOYENNE

> Cohérence d'implémentation / maintenabilité.

### [MOYENNE] Aucun token typographique (`--oh-font-*`) — échelles ad-hoc avec valeurs cassées

- **Fichier :** `electron/chat.html` (tailles 9.5/10/11/12/12.5/13/14/15/17/20px en dur), `electron/projects/projects.css` (9→18px), `electron/sidebar.html` (11/12/13/17/24px), `electron/nav-popup.html` (11/13px)
- **Problème :** les 11 rôles texte + 4 rôles mono prescrits (`02:117-139`) ne sont implémentés NULLE PART ; toutes les tailles/graisses sont en dur, avec des valeurs hors échelle (9px, 9.5px, 12.5px) (`05:294, 406-413, 561-562, 655`).
- **Valeur actuelle :** tailles littérales saupoudrées (dont 9.5px, 12.5px hors échelle)
- **Valeur cible :** tokens `--oh-font-text-xs..lg`, `--oh-font-heading-xs..xl`, `--oh-font-display-sm/md`, `--oh-font-mono-xs..md` avec size/weight/line-height/letter-spacing prescrits (`02:119-139`), et remplacement des tailles en dur par ces tokens (en arrondissant les valeurs cassées au palier le plus proche).
- **Impact visuel :** rythme typographique régulier ; disparition des tailles cassées (9.5/12.5px).
- **Risque de régression :** Moyen (chaque réassignation de taille modifie potentiellement le rendu d'un composant ; faire vue par vue avec relecture visuelle).
- **Note :** chantier volumineux ; commencer par déclarer les tokens, puis migrer composant par composant. Taille de base = 14px, minimale = 11px (`02:113`).

### [MOYENNE] Police mono : 3 stacks distincts (Fira Code vs Monaco vs absent)

- **Fichier :** `electron/chat.html:55` (`"SF Mono", "Fira Code", ui-monospace, Menlo`), `electron/projects/projects.css:55` (`"SF Mono", Menlo, ui-monospace`), `electron/sidebar.html:84` (`"SF Mono", "Monaco", "Menlo"`)
- **Problème :** trois stacks mono différents ; Chat ajoute `Fira Code` hors prescription (`05:287, 559`).
- **Valeur actuelle :** 3 stacks mono divergents
- **Valeur cible :** stack mono unique prescrite `"SF Mono", "Menlo", "Monaco", "Courier New", monospace` (`02:108`).
- **Impact visuel :** rendu mono identique entre vues ; retrait de `Fira Code` non prescrit.
- **Risque de régression :** Faible.
- **Note :** à grouper avec l'harmonisation font-family sans (bloc HAUTE).

### [MOYENNE] Durées hors échelle hardcodées (Chat + Projects) + palier 500ms absent

- **Fichier :** `electron/chat.html:526` (`0.15s`), `:1775` (`200ms`), `:2016` (`300ms`) ; `electron/projects/projects.css:309, 344-346, 537-540, 605-606` (`0.3s`) et `0.4s`
- **Problème :** durées en dur hors token (`0.3s`/`0.4s`/`300ms`) que l'échelle ne nomme pas, et le palier prescrit `--oh-duration-500` (`02:225`) est absent du code (`05:344, 596, 658`).
- **Valeur actuelle :** `0.15s`, `200ms`, `300ms`, `0.3s`, `0.4s` en dur
- **Valeur cible :** mapper sur les tokens canoniques `--oh-duration-75/150/250/350/500` (`02:221-225`) ; ajouter `--oh-duration-500: 500ms`. `0.3s`→`--oh-duration-250` ou `-350` selon l'effet ; `0.4s`→`--oh-duration-350` ou `-500`.
- **Impact visuel :** léger ajustement des durées d'animation vers les paliers prescrits (mouvement plus homogène).
- **Risque de régression :** Faible/Moyen (certaines animations de panneau Projects à `0.3s` sont calibrées ; vérifier le ressenti après mappage).
- **Note :** `--duration-200` est ajouté hors référence (`02` ne liste pas 200ms) ; décider de le conserver (micro-interaction) ou de le ramener à 150/250.

### [MOYENNE] Nav-popup : easing natif `ease` au lieu de la cubic-bezier

- **Fichier :** `electron/nav-popup.html:77`
- **Problème :** `.item` transition `150ms ease` (easing natif du navigateur) alors que les 3 autres vues utilisent `cubic-bezier(0.4,0,0.2,1)` (`05:594, 657, 773, 888`).
- **Valeur actuelle :** `transition: background 150ms ease, color 150ms ease;`
- **Valeur cible :** `transition: background var(--oh-duration-150) var(--oh-ease-default), color var(--oh-duration-150) var(--oh-ease-default);` (`02:212, 222`)
- **Impact visuel :** courbe d'animation du popup alignée sur le reste du shell (ressenti de mouvement identique).
- **Risque de régression :** Faible.
- **Note :** Nav-popup ne définit aujourd'hui aucun token ease/duration ; les introduire ou les consommer depuis la source unique.

### [MOYENNE] Sidebar : tooltip avec ombre hardcodée au lieu de `--shadow-md`

- **Fichier :** `electron/sidebar.html:438`
- **Problème :** `.tooltip` code `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4)` au lieu du token. La valeur (12px de flou) ne correspond exactement à aucun palier (`--shadow-md` = `0 4px 16px`), donc c'est une variante ad-hoc (`05:329, 605, 774`).
- **Valeur actuelle :** `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);`
- **Valeur cible :** `box-shadow: var(--oh-shadow-md);` (dark `0 4px 16px rgba(0,0,0,0.28)`, `02:195`) ou `--oh-shadow-sm` selon l'élévation voulue d'un tooltip (`02:194`).
- **Impact visuel :** ombre de tooltip alignée sur l'échelle (flou et opacité standardisés).
- **Risque de régression :** Faible.
- **Note :** active aussi les tokens `--shadow-sm`/`--shadow-md` actuellement morts dans la Sidebar (`05:328-329`).

### [MOYENNE] btn-ollama.cancel:hover — fond rouge hors token

- **Fichier :** `electron/sidebar.html:1196`
- **Problème :** `.btn-ollama.cancel:hover` pose `background: rgba(248, 113, 113, 0.1)` (= `#f87171` à 10 %), une teinte rouge qui n'est pas le token error (`#ef4444`/`#dc2626`) (`05:148, 261, 1425 cf. inventaire`). La bordure du même sélecteur utilise correctement `var(--oh-color-error)` (`sidebar.html:1197`), d'où une incohérence interne au composant.
- **Valeur actuelle :** `background: rgba(248, 113, 113, 0.1);`
- **Valeur cible :** dériver du token error, ex. `var(--oh-color-error-subtle)` (à définir : `rgba(239,68,68,0.1)` dark / `rgba(220,38,38,0.08)` light, sur le modèle de `projects.css:32, 89`) ; aligne fond hover et bordure sur la même source error.
- **Impact visuel :** teinte de hover du bouton annuler cohérente avec le rouge d'erreur du reste de l'UI.
- **Risque de régression :** Faible.
- **Note :** `projects.css` définit déjà `--error-subtle` ; réutiliser la même définition dans la source unique.

---

# BASSE

> Dette mineure.

### [BASSE] Nav-popup sans aucune ombre (menu flottant)

- **Fichier :** `electron/nav-popup.html` (`:root` 16-29, aucun `--shadow-*`, aucune `box-shadow` sur `.card`/`.item`)
- **Problème :** le Nav-popup est un menu FLOTTANT mais ne définit ni n'applique aucune ombre, alors que les 3 autres vues ont l'échelle `--shadow-xs..lg` (`05:603, 664`).
- **Valeur actuelle :** aucune ombre
- **Valeur cible :** appliquer `--oh-shadow-sm` (`0 2px 8px`, prescrit pour « dropdowns, tooltips », `02:194`) sur le conteneur du popup.
- **Impact visuel :** détache visuellement le popup du fond (profondeur attendue d'un menu flottant).
- **Risque de régression :** Faible.
- **Note :** purement additif.

### [BASSE] Grille 8px violée (valeurs d'espacement hors grille)

- **Fichier :** `electron/chat.html` (14px/10px/7px/5px), `electron/projects/projects.css` (11px/7px/6px/3px), `electron/sidebar.html` (5px/6px/7px/1px), `electron/nav-popup.html:68` (`8px 12px`, 10px)
- **Problème :** chaque vue introduit des valeurs hors grille 8px « non négociable » ; tokens `--space-*` absents en Chat et Nav-popup (`05:568-570, 652-653`).
- **Valeur actuelle :** mélange de px bruts hors grille (ex. 14px, 10px, 7px)
- **Valeur cible :** tokens `--oh-space-0..16` (`0/4/8/12/16/20/24/32/40/48/64`, `02:149-159`) et remplacement des valeurs ad-hoc par le palier le plus proche.
- **Impact visuel :** rythme d'espacement régulier ; léger ajustement des paddings hors grille.
- **Risque de régression :** Moyen (chaque réassignation de padding modifie le layout ; faire avec relecture visuelle).
- **Note :** chantier diffus ; à mener progressivement après l'introduction des tokens space partagés. Chat n'a aujourd'hui aucun token space.

### [BASSE] Tokens morts incohérents entre vues

- **Fichier :** `electron/chat.html` (`--ease-spring` `:59` jamais utilisé, `--duration-350` jamais utilisé) ; `electron/sidebar.html` (`--shadow-sm`/`--shadow-md` jamais utilisés `:78-81`) ; `electron/nav-popup.html` (`--radius-full` `:28` défini non utilisé)
- **Problème :** des tokens sont définis dans une vue et morts dans une autre, présence incohérente (`05:328, 339, 343, 597, 666-667`).
- **Valeur actuelle :** tokens définis sans usage (variable selon la vue)
- **Valeur cible :** dans la source unique, conserver l'échelle complète ; les « morts » deviennent simplement non utilisés mais disponibles et cohérents — supprime l'incohérence de présence.
- **Impact visuel :** nul.
- **Risque de régression :** Faible.
- **Note :** se résout en grande partie automatiquement avec l'unification des tokens (bloc CRITIQUE).

### [BASSE] Chevron Projects en data-URI avec couleur figée `#888888`

- **Fichier :** `electron/projects/projects.css` (data-URI chevron, cf. `05:242`, `03:899`)
- **Problème :** le chevron des selects est un SVG data-URI avec `#888888` figé, qui ne suit pas le thème dark (le muted dark prescrit est `#666666`) (`05:242`).
- **Valeur actuelle :** `#888888` figé dans le data-URI
- **Valeur cible :** SVG `currentColor` héritant de `var(--oh-color-text-muted)` (light `#888888` / dark `#666666`, `02:57`), ou deux data-URI conditionnés au thème.
- **Impact visuel :** chevron au bon gris selon le thème (légèrement plus sombre en dark).
- **Risque de régression :** Faible.
- **Note :** un data-URI ne peut pas consommer `currentColor` directement comme `background-image` ; alternative : masque CSS (`mask-image`) coloré par `background-color: var(--oh-color-text-muted)`.

---

# COSMÉTIQUE

> Détails de finition.

### [COSMÉTIQUE] Nav-popup : `--accent-subtle` light à `.08` au lieu de `.06`

- **Fichier :** `electron/nav-popup.html:23` (`--active-bg`)
- **Problème :** `--active-bg` light = `rgba(13,148,136,0.08)` vs `.06` dans les 3 autres vues et le référentiel (`02:67`) (`05:533, 660`).
- **Valeur actuelle :** `rgba(13, 148, 136, 0.08)` (light)
- **Valeur cible :** `var(--oh-color-accent-subtle)` = `rgba(13,148,136,0.06)` light (`02:67`)
- **Impact visuel :** micro-ajustement d'opacité du fond actif (quasi imperceptible).
- **Risque de régression :** Faible.
- **Note :** se résout via la source unique de tokens.

### [COSMÉTIQUE] Global override : teinte teal hardcodée dans le drag overlay (JS)

- **Fichier :** `electron/overrides/global/theme.js:131-132`
- **Problème :** le drag overlay code `rgba(13, 148, 136, 0.06)` (fond) et `#0D9488` (bordure) en dur dans le JS au lieu de tokens (`05:149, 252`).
- **Valeur actuelle :** `background = "rgba(13, 148, 136, 0.06)"` ; `border = "2px dashed #0D9488"`
- **Valeur cible :** lire les valeurs depuis les CSS custom properties (`var(--oh-color-accent-subtle)` / `var(--oh-color-accent-primary)`) plutôt que des littéraux JS.
- **Impact visuel :** nul ; supprime un hardcode hors token côté JS.
- **Risque de régression :** Faible.
- **Note :** le JS étant injecté, vérifier que `getComputedStyle` retourne bien les tokens dans la WebContentsView ciblée ; sinon conserver un fallback littéral.

### [COSMÉTIQUE] Statuts SVG : teal en data-URI `%2314B8A6` au lieu de `currentColor`

- **Fichier :** `electron/sidebar.html` (data-URI statut, `05:351`, `03:1016`)
- **Problème :** des SVG de statut encodent le teal en dur (`%2314B8A6`) dans un data-URI, hors `currentColor`, donc ne suivent pas un éventuel changement d'accent (`05:351`).
- **Valeur actuelle :** `%2314B8A6` figé dans le data-URI
- **Valeur cible :** SVG `currentColor` hérité de `var(--oh-color-accent-primary)`, ou masque CSS coloré par le token accent.
- **Impact visuel :** nul tant que l'accent ne change pas ; garantit le suivi du token si l'accent évolue.
- **Risque de régression :** Faible.
- **Note :** même contrainte technique que le chevron data-URI (cf. bloc BASSE) — privilégier `mask-image` + `background-color: var(--oh-color-accent-primary)`.

---

## Annexe — corrections regroupées par fichier

| Fichier                                            | Corrections (priorité)                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `electron/sidebar.html`                            | `--error` non défini (CRITIQUE) ; texte-sur-accent `#fff` (CRITIQUE) ; focus 1px/ring divergent (HAUTE) ; tooltip ombre hardcodée (MOYENNE) ; btn-ollama hover hors token (MOYENNE) ; tokens d'ombre morts (BASSE) ; statut SVG `%2314B8A6` (COSMÉTIQUE)                                                                                                                                                                                                   |
| `electron/chat.html`                               | `--text-base`/`--text-strong` fantômes (CRITIQUE) ; texte-sur-accent `#fff` (CRITIQUE) ; palettes par-type `PROJ_COLORS`/`HUB_TYPE_COLORS`/`HUB_FILTER_TYPES` (CRITIQUE) ; échelle radius incomplète (HAUTE) ; radius boutons/inputs 4/12/pilule (HAUTE) ; cercles `50%` (HAUTE) ; sélection teal hardcodée (HAUTE) ; tokens typo absents (MOYENNE) ; mono `Fira Code` (MOYENNE) ; durées hardcodées (MOYENNE) ; tokens morts (BASSE) ; grille 8px (BASSE) |
| `electron/projects/projects.css`                   | texte-sur-accent `var(--bg-deepest)` (CRITIQUE) ; échelle radius incomplète (HAUTE) ; cercles `50%` (HAUTE) ; tokens typo absents (MOYENNE) ; durées `0.3s`/`0.4s` (MOYENNE) ; chevron `#888888` figé (BASSE) ; grille 8px (BASSE)                                                                                                                                                                                                                         |
| `electron/nav-popup.html`                          | fond `#111111` non tokenisé (HAUTE) ; aucun focus (HAUTE) ; easing natif `ease` (MOYENNE) ; aucune ombre (BASSE) ; `--accent-subtle` `.08` vs `.06` (COSMÉTIQUE)                                                                                                                                                                                                                                                                                           |
| `electron/overrides/global/theme.css` + `theme.js` | sélection teal hardcodée (HAUTE) ; ease/duration définis mais inutilisés (BASSE) ; drag overlay teal hardcodé en JS (COSMÉTIQUE)                                                                                                                                                                                                                                                                                                                           |
| **Transversal (tous fichiers)**                    | Unification du nommage vers `--oh-*` via source unique (CRITIQUE) ; échelle radius `6px`/`16px` (HAUTE) ; token `--oh-on-accent` (CRITIQUE) ; tokens typo `--oh-font-*` (MOYENNE) ; `--oh-duration-500` (MOYENNE)                                                                                                                                                                                                                                          |

---

_Fin du plan — Phase 6. Aucun fichier source modifié. Les valeurs cibles sont les
tokens canoniques de `02-design-system-reference.md`. Les apps tierces et leurs
overrides `<app>/` sont hors périmètre (traités via redéfinition des variables
radius/typo natives, cf. `05:932-966`)._
