# 07 — Plan d'unification des apps tierces via OVERRIDES (Phase 7)

> **Objet** : pour chacune des 3 apps tierces (OpenWork = Work, OpenCode = Code,
> Open-Design = Design), définir ce qui PEUT être unifié de façon fiable via
> overrides CSS/JS, ce qui est RISQUÉ, ce qui est IMPOSSIBLE sans toucher le
> source, puis une stratégie propriété par propriété.
>
> **Règle de périmètre** : aucun fichier source n'est modifié. `apps/` reste
> intact ; `npm run update:apps` (git pull + rebuild) doit continuer à marcher.
> Toute personnalisation passe par `electron/overrides/` injecté dans la
> WebContentsView.
>
> **Méthode** : aucune valeur ni aucun score inventé. Chaque affirmation renvoie
> à un document source (`02`, `04`, `05`) et à un `fichier:ligne`. Les variables
> et sélecteurs cités sont ceux réellement relevés en Phase 4 (`04`).
>
> **Référentiel canonique** (`02:64,176-182` ; `sidebar.html:63-66`) :
> accent teal `#14B8A6` (dark) / `#0D9488` (light), hover `#2DD4BF` / `#0F766E` ;
> échelle radius prescrite `0 → 4 → 6 → 8 → 12 → 16 → 9999px` (`02:182`) ;
> typo SF Pro (`02:107`) ; accent par-outil supprimé en v2 (`brand_colors.json:328-329`,
> `02:92`).
>
> Direction artistique senior. Date : 2026-06-14.

---

## Préambule — l'état de départ (ce qui marche déjà, ce qui reste)

Le socle COULEUR est déjà unifié de façon fiable sur les 3 apps : l'accent teal
est propagé par redéfinition de variables natives, et c'est la grande réussite
de l'override (`05:899` note 9,5/10 sur l'axe accent ; `04:38,106-107,136-137`).
Les neutres dark (`#0a0a0a`/`#141414`/`#ececec`) sont également alignés
(`05:900`).

Ce qui RESTE non unifié et que ce plan vise — par ordre d'impact visuel
(`05:893-922`) :

1. **Radius** (axe le plus faible, 3,5/10 — `05:902`) : géométrie hétérogène
   d'un slot à l'autre.
2. **Typographie** (5/10 — `05:903`) : 2 apps sur 4 hors SF Pro.
3. **Thème clair** (5/10 — `05:901`) : cascade dark cassée d'Open-Design +
   overlays projets figés en dark.
4. **Transitions / ombres** (4/10 — `05:904`) : courbe et échelle d'ombre non
   propagées.

Les fichiers d'override existants (à étendre, jamais à dupliquer) sont :
`openwork/theme.css` (53 lignes, 38 `!important`), `opencode/theme.css`
(323 lignes, 111 `!important`), `open-design/theme.css` (313 lignes, 144
`!important`) (`04:17-23`), tous déjà enregistrés dans
`electron/overrides/index.json` (vérifié).

---

# 1. OpenWork (slot Work)

## A. Ce qui PEUT être overridé de façon fiable

**Variables CSS natives redéfinissables à `:root` / scope thème** (méthode la
plus sûre, déjà éprouvée — cible des VARIABLES, pas des classes générées,
`04:41,43`) :

- **Couleurs (déjà fait, à conserver)** : échelle Radix `--slate-1..12`
  (`04:35-36`), `--dls-border` (`04:37`), `--dls-accent` / `--dls-accent-hover`
  (`04:38`), tokens shadcn `--primary` / `--ring` / `--sidebar-primary`
  (`04:39`). Pilotables sur les deux scopes sémantiques stables `[data-theme="dark"]`
  et `:root:not(.dark)` (`04:41`), alignés sur le `@custom-variant dark` natif
  (`apps/openwork/apps/app/src/app/index.css:14`).
- **Radius (NON encore actionné — levier propre disponible)** : les variables
  natives `--dls-radius` (16px), `--dls-radius-lg` (24px) et `--radius`
  (`0.45rem`) sont redéfinissables à `:root` (`04:167,194`). Redéfinir `--radius`
  recalcule toute l'échelle `@theme inline` dérivée (`--radius-lg/-md/-sm`,
  `index.css:503-505`).
- **Éléments injectés par OpenHub** (`.oh-*` / `#oh-*` des overlays projets) :
  100 % sous notre contrôle, immunisés contre les updates (`04:63,87`).

## B. Ce qui est RISQUÉ

- **Surfaces à radius hardcodé dans le markup natif** : `.ow-soft-shell`
  (`2rem` = 32px, `index.css:166`), `.ow-soft-card` (`1.5rem` = 24px,
  `index.css:172`), `.ow-button-primary` (pilule `9999px`, `index.css:188`)
  (`04:47,165`). Ces classes posent un `border-radius` EN DUR (pas via variable) :
  redéfinir `--dls-radius*` ne les corrige PAS. Il faut cibler la classe
  directement — or `.ow-*` sont des classes produit susceptibles d'être
  renommées en update (même catégorie de risque que les `.entry-*` d'Open-Design,
  `04:146`).
- **Overlays projets OpenHub avec tokens fantômes** : `projects.css` /
  `projects-hub.css` consomment `--accent-primary`, `--bg-panel`, `--bg-surface`,
  `--bg-deepest`, etc. NON définis côté OpenWork → fallbacks dark figés
  (`04:69-70,92`). Risqué non par sélecteur (les `.oh-*` sont stables) mais par
  cascade : `var(--bg-panel, #141414)` reste sombre en mode clair (`04:70`,
  `05:121`).

## C. Ce qui est IMPOSSIBLE via CSS

- **Aucun** point de markup/JS hardcodé bloquant n'est relevé pour OpenWork dans
  `04`/`05`. Le radius des `.ow-*` est en dur dans le CSS natif mais reste
  atteignable par sélecteur CSS (donc RISQUÉ, section B, pas impossible). La typo
  IBM Plex est overridable (variable `font-family` redéfinissable).

## D. Stratégie recommandée par propriété

### D.1 — Radius des surfaces génériques (cartes, boutons via tokens)

- **App :** OpenWork
- **Méthode :** redéfinition de variables natives
- **Sélecteur :** `[data-theme="dark"]`, `:root:not(.dark)` (les deux scopes,
  `04:41`)
- **CSS à ajouter :** `--dls-radius: 8px; --dls-radius-lg: 12px;` + `--radius: 0.5rem;`
  (8px ; recale `@theme inline` vers ~8/8/6px au lieu de ~7.2/5.8/4.3px,
  `index.css:503-505` / `04:71`)
- **Fichier cible :** `electron/overrides/openwork/theme.css` (ajout dans les
  blocs existants `theme.css:6,30`)
- **Fiabilité :** HAUTE — variables nominales, déjà la mécanique en place pour
  les couleurs (`04:43`)
- **Risque de casse :** FAIBLE — variables stables d'une version à l'autre
  (`04:43`)
- **Alternative si casse :** si une version supprime `--dls-radius`, retomber sur
  un ciblage par classe sémantique des conteneurs concernés

### D.2 — Radius des surfaces à radius HARDCODÉ (`.ow-soft-card`, `.ow-soft-shell`, boutons pilule)

- **App :** OpenWork
- **Méthode :** override direct par classe (le token ne suffit pas, valeur en dur
  `04:47`)
- **Sélecteur :** `.ow-soft-card`, `.ow-soft-shell`, `.ow-button-primary`
  (`index.css:166,172,188`)
- **CSS à ajouter :** `.ow-soft-card { border-radius: 12px !important; }`
  `.ow-soft-shell { border-radius: 12px !important; }`
  `.ow-button-primary { border-radius: 8px !important; }` (ramène pilule → 8px,
  canonique boutons `02:177`)
- **Fichier cible :** `electron/overrides/openwork/theme.css`
- **Fiabilité :** MOYENNE — dépend de classes produit non hashées mais nommées
  (`.ow-*`), renommables en update (`04:47,165`)
- **Risque de casse :** MOYEN — si `.ow-soft-card`/`-shell` disparaissent, le
  correctif devient inerte (silencieux). NON détecté par `check-selectors.sh`
  (son grep ne matche que `[data-*]`/`#id`/`[role]`/`[aria-*]`, vérifié
  `scripts/check-selectors.sh:11`)
- **Alternative si casse :** garder le passage D.1 (qui ramène déjà les surfaces
  tokenisées) ; ces classes pilule resteront en pilule mais le reste sera
  cohérent. Vérification manuelle après chaque `update:apps`

### D.3 — Typographie (passer de IBM Plex à SF Pro)

- **App :** OpenWork
- **Méthode :** forçage `font-family` (même geste que celui déjà appliqué à
  Open-Design `04:139`, qui prouve la faisabilité)
- **Sélecteur :** `html, body` (large mais sûr ; éviter `*` qui casserait les
  zones mono)
- **CSS à ajouter :** `html, body { font-family: "SF Pro Text", "SF Pro Display",
-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif !important; }`
  (stack exacte `02:107`) ; ajouter `-webkit-font-smoothing: antialiased;`
  (`02:112`)
- **Fichier cible :** `electron/overrides/openwork/theme.css`
- **Fiabilité :** HAUTE — `html, body` toujours présents ; OpenWork définit sa
  typo via `index.css:144-145` (`04:48,169`), un override `!important` au scope
  body gagne
- **Risque de casse :** FAIBLE-MOYEN — risque de toucher des blocs de code/mono
  s'il y en a. Mitigation : exclure les zones mono (`code, pre, [class*="mono"]
{ font-family: "SF Mono", Menlo, monospace; }`)
- **Alternative si casse :** restreindre le forçage aux conteneurs d'interface
  identifiés plutôt qu'à `body`

### D.4 — Overlays projets : tokens fantômes figés en mode clair

- **App :** OpenWork (NOTRE code injecté)
- **Méthode :** définir les tokens consommés à `:root` au lieu de s'appuyer sur
  des fallbacks dark figés
- **Sélecteur :** `:root` (ou réutiliser `[data-theme="dark"]` / `:root:not(.dark)`)
- **CSS à ajouter :** déclarer `--accent-primary`, `--bg-panel`, `--bg-surface`,
  `--bg-deepest`, `--border-default`, `--shadow-*` avec les paires dark/light
  canoniques (`02:35-49,64`), de sorte que `var(--bg-panel)` suive le thème
- **Fichier cible :** `electron/overrides/openwork/projects.css` +
  `projects-hub.css` (ou un bloc `:root` partagé en tête de `theme.css`)
- **Fiabilité :** HAUTE — éléments `.oh-*` propres, zéro dépendance tierce
  (`04:63,87`)
- **Risque de casse :** FAIBLE — c'est NOTRE code (`05:862`)
- **Alternative si casse :** n/a (correctif interne)

### D.5 — Overlays projets : collision `--radius-lg/md` natif

- **App :** OpenWork (NOTRE code injecté)
- **Méthode :** ne PAS dépendre du fallback de `var(--radius-lg, 12px)`
  (intercepté par le natif ~7.2px, `04:71,93`) — soit redéfinir explicitement
  ces tokens, soit poser la valeur en dur sur les `.oh-*`
- **Sélecteur :** `#oh-project-modal`, `.oh-project-card`, `.oh-panel`, etc.
  (`04:58,82,84`)
- **CSS à ajouter :** sur ces éléments, `border-radius: 12px;` (cartes/panels) /
  `8px` (inputs/boutons ghost) en valeur littérale, OU redéfinir
  `--radius-lg: 12px; --radius-md: 8px;` à `:root` pour l'overlay
- **Fichier cible :** `electron/overrides/openwork/projects.css` /
  `projects-hub.css`
- **Fiabilité :** HAUTE
- **Risque de casse :** FAIBLE (`.oh-*` stables)
- **Alternative si casse :** n/a

## Synthèse OpenWork — 3 leviers les plus fiables

1. **Radius générique par variables natives** (`--dls-radius` 8px,
   `--dls-radius-lg` 12px, `--radius` 0.5rem) — fiabilité HAUTE, même mécanique
   que les couleurs déjà en place (D.1, `04:167,194`).
2. **Typo SF Pro forcée sur `html, body`** — fiabilité HAUTE, faisabilité
   prouvée par Open-Design (D.3, `04:139`).
3. **Réparation des overlays projets `.oh-*`** (tokens définis + radius littéral)
   — fiabilité HAUTE, code 100 % nôtre (D.4, D.5, `05:862`).

## Ce qui RESTERA non unifiable (OpenWork)

- **Boutons pilule et cartes 24/32px si `.ow-soft-*` / `.ow-button-primary` sont
  renommés en update** : le correctif D.2 repose sur des classes produit non
  sémantiques, non couvertes par `check-selectors.sh` (`scripts/check-selectors.sh:11`).
  C'est un risque RÉSIDUEL, pas un blocage — il faut une re-vérification manuelle
  post-`update:apps` (`05:836-837`).

---

# 2. OpenCode (slot Code)

## A. Ce qui PEUT être overridé de façon fiable

**Double système de tokens à overrider ensemble** (`04:100,176`) — robuste car
même si OpenCode bascule OC-1 ↔ v2, l'accent reste teal (`04:119`) :

- **OC-1** (déjà fait, à conserver) : `--background-base/-weak/-strong`,
  `--surface-float-base(-hover)`, `--input-base/-hover`, `--text-strong/-base`,
  `--border-weak-base/-weaker-base`, `--border-selected`,
  `--text-interactive-base`, `--surface-brand-base/-hover` (`04:105-106,199`).
- **v2** (déjà fait, à conserver) : `--v2-blue-100..1200`,
  `--v2-background-bg-accent`, `--v2-text-text-accent`, `--v2-icon-icon-accent`,
  `--v2-border-border-focus` (`04:107,176`). Le `:root` override bat le
  `@layer theme` natif (`04:119`).
- **Token scopé** : `--menu-v2-accent` re-ciblé sur `[data-component="menu-v2-item"]`
  (correctement diagnostiqué et déjà traité, `04:108,120`).
- **Radius via variables natives (NON encore actionné)** : l'échelle native
  `--radius-xs/sm/md/lg/xl` (2/4/6/8/10px) est redéfinissable
  (`apps/opencode/packages/ui/src/styles/theme.css:45-49` ; `04:174,199`).
- **Sélecteurs `data-component` sémantiques** STABLES :
  `[data-component="sidebar-nav-desktop"]`, `[data-component="menu-v2-item"]`,
  `[data-component="sidebar-rail"]` (`04:114`) — couverts par
  `check-selectors.sh` (grep `[data-*]`, `scripts/check-selectors.sh:11`).

## B. Ce qui est RISQUÉ

- **Correctifs LAYOUT via classes Tailwind échappées** : `.hidden.xl\:flex:has(button)`
  (`theme.css:271`), `div.hidden.xl\:flex` (`theme.css:276`),
  `.xl\:hidden:has(nav[data-component=…])` (`theme.css:298-303`),
  `.hidden.xl\:block[class*="pointer-events-none"][class*="z-25"]`
  (`theme.css:306`), `[data-component="sidebar-nav-desktop"] ~ div.z-20`
  (`theme.css:293`) (`04:115,200`). Dépendent de breakpoints (`xl`), z-index
  (`z-25`/`z-20`) et classes utilitaires générés → cassent en SILENCE après
  `update:apps` et ne sont PAS détectés par `check-selectors.sh`
  (`04:201`, `scripts/check-selectors.sh:11`).
- **Variable référencée non définie** : `--main-left` (`theme.css:295`) →
  `left` potentiellement invalide/ignoré (`04:125,200`) — à vérifier côté natif.

## C. Ce qui est IMPOSSIBLE via CSS

- **Radius codés en dur dans les composants** : mesuré `6px ×8`, `8px ×6`,
  `4px ×5`, `2px ×5`, `12px ×3`, `999px ×5` (`04:124,174`). Là où le radius est
  une valeur littérale dans le markup/CSS natif d'un composant SANS variable et
  SANS classe stable atteignable, il est inatteignable par simple redéfinition de
  token (`05:817`). Une partie reste corrigeable par sélecteur de composant
  (RISQUÉ), mais le résidu hardcodé est IMPOSSIBLE sans toucher le source.
- **Structure HTML / breakpoints du layout responsive** : non modifiable ; seuls
  les correctifs CSS fragiles de la section B y touchent en surface.

## D. Stratégie recommandée par propriété

### D.1 — Radius de l'échelle native (cartes, boutons, popovers tokenisés)

- **App :** OpenCode
- **Méthode :** redéfinition des variables natives
- **Sélecteur :** `:root` (les tokens natifs y sont définis, `04:114`)
- **CSS à ajouter :** `--radius-xs: 4px; --radius-sm: 6px; --radius-md: 8px;
--radius-lg: 8px; --radius-xl: 12px;` (resserre l'échelle 2-10px vers 4-12px,
  alignée sur `02:175-179`)
- **Fichier cible :** `electron/overrides/opencode/theme.css` (bloc `:root`
  existant `theme.css:23,41`)
- **Fiabilité :** HAUTE pour tous les composants qui CONSOMMENT ces tokens —
  variables nominales (`04:174,199`)
- **Risque de casse :** FAIBLE sur les tokens ; NUL effet sur les composants à
  radius hardcodé (section C)
- **Alternative si casse :** ciblage par `[data-component="…"]` du composant
  concerné

### D.2 — Radius hardcodé des cartes/boutons (résidu non tokenisé)

- **App :** OpenCode
- **Méthode :** ciblage par sélecteur `data-component` STABLE quand il existe
  (`04:114`)
- **Sélecteur :** `[data-component="…"]` du composant carte/bouton concerné
  (à confirmer par inspection DOM — les `data-component` sont la surface stable
  `04:114`)
- **CSS à ajouter :** `border-radius: 8px !important;` (cartes/boutons) sur le
  `data-component` ciblé
- **Fichier cible :** `electron/overrides/opencode/theme.css`
- **Fiabilité :** MOYENNE — dépend de l'existence d'un `data-component` sur le
  composant ; couvert par `check-selectors.sh` si attribut `data-*`
- **Risque de casse :** MOYEN — si le composant n'expose pas d'attribut
  sémantique, on retombe sur des classes Tailwind (FRAGILE, à éviter)
- **Alternative si casse :** accepter le radius natif du composant (cf. résidu
  IMPOSSIBLE, section C)

### D.3 — Typographie (passer system-ui à SF Pro)

- **App :** OpenCode
- **Méthode :** forçage `font-family` (l'override ne touche actuellement PAS la
  typo, `04:175`, `05:844`)
- **Sélecteur :** `html, body` ; EXCLURE explicitement les zones de code/terminal
- **CSS à ajouter :** `html, body { font-family: "SF Pro Text","SF Pro Display",
-apple-system, BlinkMacSystemFont, sans-serif !important; }` (`02:107`) +
  préserver le mono : `code, pre, [class*="mono"], [class*="terminal"] {
font-family: "SF Mono", Menlo, Monaco, monospace !important; }` (`02:108`)
- **Fichier cible :** `electron/overrides/opencode/theme.css`
- **Fiabilité :** MOYENNE-HAUTE — `html, body` stables ; risque réel de toucher
  l'éditeur/terminal de code, d'où l'exclusion mono OBLIGATOIRE (OpenCode est un
  outil de code)
- **Risque de casse :** MOYEN — un éditeur de code mal exclu rendrait du code en
  proportionnel (régression UX forte)
- **Alternative si casse :** restreindre le forçage aux conteneurs de chrome
  (barres, menus, panneaux) plutôt qu'à `body`

### D.4 — Correctifs layout fragiles (`xl:`/`z-25`) — durcissement

- **App :** OpenCode
- **Méthode :** préférer les ancres `data-component` aux classes Tailwind
  échappées partout où c'est possible (`04:114-115`)
- **Sélecteur :** remplacer `.hidden.xl\:flex:has(button)` etc. par des
  sélecteurs ancrés sur `[data-component="sidebar-nav-desktop"]` /
  `[data-component="sidebar-rail"]` quand la cible le permet
- **CSS à ajouter :** n/a (refactor de sélecteurs, pas nouvelle propriété)
- **Fichier cible :** `electron/overrides/opencode/theme.css:261-308`
- **Fiabilité :** dépend de la disponibilité d'un `data-component` équivalent
- **Risque de casse :** réduit le risque actuel (les `xl:`/`z-25` cassent en
  silence, `04:201`)
- **Alternative si casse :** documenter ces sélecteurs comme « à re-vérifier
  manuellement à chaque update » + définir `--main-left` ou retirer la référence
  (`theme.css:295`, `04:125`)

## Synthèse OpenCode — 3 leviers les plus fiables

1. **Couleur double-système OC-1 + v2** (déjà en place, à conserver) — fiabilité
   TRÈS HAUTE, `:root` bat `@layer` (`04:119`).
2. **Radius par variables natives `--radius-xs..xl`** pour tous les composants
   tokenisés (D.1, `04:174,199`) — fiabilité HAUTE.
3. **Ciblage par `data-component` sémantiques** (`[data-component="menu-v2-item"]`,
   `sidebar-nav-desktop`, `sidebar-rail`) — fiabilité HAUTE, couverts par
   `check-selectors.sh` (`04:114`, `scripts/check-selectors.sh:11`).

## Ce qui RESTERA non unifiable (OpenCode)

- **Radius hardcodé des composants sans `data-component`** (résidu sur 6/8/4/2/12px,
  999px — `04:124`) : inatteignable sans toucher le source (section C, `05:817`).
- **Correctifs layout `xl:`/`z-25`** : resteront FRAGILES tant qu'aucune ancre
  `data-component` n'existe pour la cible ; cassent en silence post-update et
  hors radar de `check-selectors.sh` (`04:201`).
- **Typo des zones de code** : à NE PAS forcer en SF Pro proportionnel (doit
  rester mono) — donc volontairement non unifiée avec la typo d'interface.

---

# 3. Open-Design (slot Design)

## A. Ce qui PEUT être overridé de façon fiable

App la mieux unifiée aujourd'hui (8px partout + SF Pro déjà forcé, `05:948`) ;
override par variables + rôles ARIA, robuste (`04:148,186`) :

- **Variables natives** (déjà fait, à conserver) : `--bg`, `--bg-app`,
  `--bg-panel`, `--bg-subtle`, `--bg-muted`, `--bg-elevated`, `--border(-strong/-soft)`,
  `--text(-strong/-muted/-soft/-faint)`, `--accent(-strong/-soft/-tint/-hover)`
  (`04:185,204`).
- **Radius natifs** : `--radius-sm` (6px), `--radius` (8px), `--radius-lg` (12px),
  `--radius-pill` (999px) (`tokens.css:55-58` ; `04:153,183`). REDÉFINISSABLES.
- **Composants par RÔLE ARIA** (méthode la plus robuste — sémantique, couverte
  par `check-selectors.sh`) : `[role="dialog"]`, `[role="region"]`, `[role="card"]`,
  `[role="tab"][aria-selected="true"]`, `[role="menu"]`, `[role="tooltip"]`
  (`04:138,145`). Plus `[data-sidebar="trigger"]`, `[data-slot="sidebar-trigger"]`
  (`04:145`).
- **Typo SF Pro** : déjà forcée sur `html, body` + inputs (`04:139`).

## B. Ce qui est RISQUÉ

- **Unification des fonds via classes PRODUIT** : `.entry-nav-rail`,
  `.split-chat-slot > .pane`, `.settings-sidebar`, `.drawer-content`,
  `.entry-main--scroll`, `.workspace-shell`, `.app` (`theme.css:283-295` ;
  `04:140,146`). Ce ne sont pas des hashs générés, mais des classes internes
  renommables en update → l'unification des fonds casse en silence (`04:146`),
  hors radar de `check-selectors.sh` (`scripts/check-selectors.sh:11`).
- **Collapse de rail / `workspace-tabs-chrome`** : tentatives DÉJÀ commentées car
  elles cassaient le layout grille (`theme.css:6-29` ; `04:141`). Toute reprise
  est RISQUÉE par nature (documenté comme cassant).
- **`* { -webkit-app-region: no-drag !important }`** : sélecteur universel, coût
  de spécificité élevé, peut interférer si Open-Design réintroduit un drag voulu
  (`04:156`).

## C. Ce qui est IMPOSSIBLE via CSS

- **La cascade de thème native elle-même** : Open-Design active le dark par DEUX
  chemins — `[data-theme="dark"]` (toujours) ET
  `@media (prefers-color-scheme: dark) html:not([data-theme])`
  (`tokens.css:84,~133` ; `04:152`). On ne peut pas SUPPRIMER ces chemins natifs
  ; on peut seulement aligner NOTRE override sur les bons scopes (corrigeable,
  section D.3 — donc pas un vrai « impossible », mais une contrainte structurelle
  imposée par le natif).
- **Typo `--sans` native non localisée** (`base.css:6`, valeur `--sans` non
  trouvée dans `tokens.css`, `04:184,205`) : déjà contournée par le forçage SF
  Pro direct sur `html, body` (donc neutralisée, pas bloquante).

## D. Stratégie recommandée par propriété

### D.1 — Radius des inputs (corriger le 6px → 4px)

- **App :** Open-Design
- **Méthode :** ne PAS dépendre du fallback `var(--radius-sm, 4px)` — le natif
  `--radius-sm` = 6px écrase le fallback (`04:155,183` ; `05:826`)
- **Sélecteur :** sélecteurs inputs déjà en place (`theme.css:145`)
- **CSS à ajouter :** soit `border-radius: 4px !important;` littéral sur les
  inputs, soit redéfinir `--radius-sm: 4px;` à `:root` (impacte tout consommateur
  de `--radius-sm`, à valider)
- **Fichier cible :** `electron/overrides/open-design/theme.css:145`
- **Fiabilité :** HAUTE (valeur littérale) ou MOYENNE (redéfinition globale du
  token, effets de bord possibles)
- **Risque de casse :** FAIBLE
- **Alternative si casse :** garder le littéral sur le seul sélecteur input

### D.2 — Radius cartes/dialogs/boutons (déjà OK, à fiabiliser)

- **App :** Open-Design
- **Méthode :** explicitation — `var(--radius-md, 8px)` tombe sur 8px par
  COÏNCIDENCE (`--radius-md` n'existe pas nativement, `04:154,183`). Rendre la
  valeur robuste en cessant de dépendre d'un token natif absent.
- **Sélecteur :** `[role="dialog"]` (12px), `[role="region"]`/`[role="card"]`
  (8px), boutons (8px) (`04:138`)
- **CSS à ajouter :** valeurs littérales `border-radius: 12px` (dialog) / `8px`
  (cartes/boutons) au lieu de `var(--radius-md, 8px)`, OU redéfinir
  `--radius: 8px; --radius-lg: 12px;` (tokens natifs réels, `tokens.css:55-58`)
- **Fichier cible :** `electron/overrides/open-design/theme.css:124,184,191`
- **Fiabilité :** HAUTE — rôles ARIA stables (`04:145`), couverts par
  `check-selectors.sh`
- **Risque de casse :** FAIBLE
- **Alternative si casse :** n/a

### D.3 — Cascade dark cassée (bug thème clair, point de casse confirmé)

- **App :** Open-Design
- **Méthode :** SORTIR le bloc dark de l'override de `@media (prefers-color-scheme: dark)`
  et le cibler sur `[data-theme="dark"]`, à l'image d'`openwork/theme.css:6` qui
  cible bien l'attribut hors media (`04:152,206`)
- **Sélecteur :** `[data-theme="dark"]` (au lieu de `@media (prefers-color-scheme: dark)`,
  `theme.css:79-107`)
- **CSS à ajouter :** déplacer les tokens dark (`--bg #0a0a0a`, `--bg-panel
#141414`, `--accent #14b8a6`, `--accent-hover #2dd4bf`, `04:137`) sous
  `[data-theme="dark"]` ; conserver éventuellement un bloc `@media` additionnel
  pour le cas `html:not([data-theme])`
- **Fichier cible :** `electron/overrides/open-design/theme.css:79-107`
- **Fiabilité :** HAUTE — `[data-theme="dark"]` est le scope natif principal
  (`tokens.css:84`)
- **Risque de casse :** FAIBLE — aligne sur le mécanisme natif ; supprime le
  mélange anthracite/accents clairs (`05:856-858`)
- **Alternative si casse :** dupliquer le bloc dark sous les deux scopes
  (`[data-theme="dark"]` ET `@media … html:not([data-theme])`) pour couvrir les
  deux chemins natifs (`04:152`)

### D.4 — Unification des fonds (sécuriser les classes produit fragiles)

- **App :** Open-Design
- **Méthode :** privilégier les rôles/attributs sémantiques quand ils existent ;
  conserver les classes produit en correctif explicitement « à re-vérifier »
- **Sélecteur :** garder `.entry-nav-rail`, `.workspace-shell`, etc.
  (`theme.css:283-295`) mais documenter leur fragilité
- **CSS à ajouter :** n/a (pas de nouvelle propriété ; geste de robustesse)
- **Fichier cible :** `electron/overrides/open-design/theme.css:283-295`
- **Fiabilité :** MOYENNE — classes internes renommables (`04:146`)
- **Risque de casse :** MOYEN — casse en silence post-update, hors radar
  `check-selectors.sh`
- **Alternative si casse :** si un fond se désynchronise, retomber sur la
  redéfinition des variables `--bg-*` à `:root` (qui couvre la majorité des
  surfaces sans cibler la classe, `04:185`)

## Synthèse Open-Design — 3 leviers les plus fiables

1. **Variables natives `--bg-*` / `--text-*` / `--accent-*`** (déjà en place) —
   fiabilité TRÈS HAUTE, repeinture complète par variables (`04:148,185`).
2. **Composants par RÔLE ARIA** (`[role="dialog"|"card"|"tab"|"menu"|"tooltip"]`)
   — fiabilité TRÈS HAUTE, sémantique et couverts par `check-selectors.sh`
   (`04:138,145`).
3. **Radius par tokens natifs RÉELS** (`--radius` 8px, `--radius-lg` 12px,
   `--radius-pill` 999px) + correction explicite du `--radius-sm` inputs à 4px
   (D.1, D.2 — `tokens.css:55-58`, `04:153,183`).

## Ce qui RESTERA non unifiable (Open-Design)

- **Unification des fonds via classes produit** (`.entry-*`, `.workspace-shell`,
  `.split-chat-slot > .pane`) : restera FRAGILE et cassable en silence si ces
  classes sont renommées (`04:146`) — mitigé mais non garanti par le repli sur
  les variables `--bg-*`.
- **Collapse de rail / `workspace-tabs-chrome`** : documenté comme cassant le
  grid (`theme.css:6-29`, `04:141`) — non réactivable de façon fiable via CSS.

---

# E. Bonnes pratiques overrides (transversal)

Dérivées des constats `04`/`05` et du mécanisme réel de `check-selectors.sh`
(`scripts/check-selectors.sh:11`).

1. **Prioriser les VARIABLES CSS natives.** L'override par variable (et non par
   classe utilitaire) est la seule méthode robuste aux updates : c'est pourquoi
   les couleurs tiennent partout (`04:43,119,148`) alors que les correctifs par
   classe Tailwind cassent (`04:115,201`). Pour le radius, redéfinir
   `--dls-radius*`/`--radius` (Work), `--radius-xs..xl` (Code),
   `--radius`/`--radius-sm` (Design) plutôt que compter sur des fallbacks de
   `var()` que la cascade native INTERCEPTE (`04:71,155` ; `05:835`).

2. **Ne JAMAIS compter sur le fallback de `var(--x, défaut)` quand la variable
   existe nativement.** Trois pièges confirmés : OpenWork `var(--radius-lg, 12px)`
   → rend ~7.2px (`04:71`) ; Open-Design `var(--radius-sm, 4px)` → rend 6px
   (`04:155`). Si la valeur doit être garantie, la poser en littéral OU
   redéfinir explicitement la variable native.

3. **Cibler `data-*` / `aria-*` / `role` / `#id` sémantiques** avant toute classe.
   Ce sont les SEULS sélecteurs que `check-selectors.sh` sait inventorier
   (grep `\[data-…\]|#id|\[role="…"\]|\[aria-…\]`, `scripts/check-selectors.sh:11`).
   Les classes Tailwind échappées (`xl\:flex`, `z-25`) et les classes produit
   (`.entry-*`, `.ow-soft-*`) sont INVISIBLES pour ce check et cassent en silence
   (`04:201`, `05:837`).

4. **Aligner les scopes de thème sur le natif.** Toujours cibler `[data-theme="dark"]`
   (et `:root:not(.dark)` côté clair) hors `@media`, comme `openwork/theme.css:6`.
   Le bug Open-Design vient d'avoir enfermé le dark dans
   `@media (prefers-color-scheme: dark)` alors que le natif active aussi
   `[data-theme="dark"]` (`04:152,206`). Couvrir les deux chemins natifs si l'app
   en a deux.

5. **Minimiser `!important`.** Les overlays propres `.oh-*` y arrivent à 0
   (`04:52,75`) grâce à la spécificité naturelle ; les overrides d'apps tierces
   en sont à 111 (OpenCode) et 144 (Open-Design) (`04:22-23`). Réserver
   `!important` aux cas de radius hardcodé natif (D.2 Work, D.2 Code) ; éviter le
   sélecteur universel `*` (cf. `no-drag` global, coût de spécificité, `04:156`).

6. **Toujours fournir des tokens dark ET light définis** plutôt que des fallbacks
   figés sur la valeur dark. Le bug des overlays projets OpenWork
   (`var(--bg-panel, #141414)` reste sombre en clair, `04:70`) vient d'un fallback
   dark codé en dur sans paire light — déclarer les deux à `:root` /
   `:root:not(.dark)`.

7. **Grouper par fonctionnalité, 1 fichier = 1 but, enregistrer dans
   `index.json`.** Étendre les `theme.css` existants (déjà enregistrés, vérifié
   dans `electron/overrides/index.json`) plutôt que multiplier les fichiers ;
   ne JAMAIS dupliquer la charte (la dette « 4 systèmes de tokens » vient déjà de
   cette duplication côté vues internes, `05:620,711`).

8. **Re-vérifier manuellement après chaque `npm run update:apps`.** Le check
   automatique ne couvre pas les classes utilitaires/produit (`04:201`) ; les
   correctifs RISQUÉS (radius hardcodé par classe, fonds par classe produit,
   layout `xl:`) exigent un contrôle visuel du DOM (`scripts/check-selectors.sh:21`
   le rappelle : « Manual verification needed »).

---

# RETOUR demandé — 3 leviers les plus fiables + résidu non unifiable, par app

## OpenWork (Work)

**3 leviers les plus fiables :**

1. Radius générique via variables natives `--dls-radius` 8px / `--dls-radius-lg`
   12px / `--radius` 0.5rem (`04:167,194`).
2. Typo SF Pro forcée sur `html, body` (faisabilité prouvée par Open-Design,
   `04:139`).
3. Réparation des overlays projets `.oh-*` : tokens dark+light définis et radius
   posé en littéral (code 100 % nôtre, `05:862`).

**Restera non unifiable :** boutons pilule et cartes 24/32px SI les classes
produit `.ow-soft-card` / `.ow-soft-shell` / `.ow-button-primary` sont renommées
en update (radius hardcodé natif, ciblable seulement par classe non sémantique,
hors `check-selectors.sh`) (`04:47,165` ; `scripts/check-selectors.sh:11`).

## OpenCode (Code)

**3 leviers les plus fiables :**

1. Couleur double-système OC-1 + v2 (déjà en place, `:root` bat `@layer`,
   `04:119`).
2. Radius via variables natives `--radius-xs..xl` (`04:174,199`).
3. Ciblage par `data-component` sémantiques (`menu-v2-item`, `sidebar-nav-desktop`,
   `sidebar-rail`), couverts par `check-selectors.sh` (`04:114`).

**Restera non unifiable :** (a) radius HARDCODÉ des composants sans
`data-component` (6/8/4/2/12px, 999px — `04:124`), inatteignable sans toucher le
source ; (b) correctifs layout `xl:`/`z-25` qui resteront fragiles et cassables
en silence (`04:201`) ; (c) typo des zones de code/terminal, volontairement
laissée en mono (ne pas forcer SF Pro proportionnel).

## Open-Design (Design)

**3 leviers les plus fiables :**

1. Variables natives `--bg-*` / `--text-*` / `--accent-*` (repeinture complète,
   `04:148,185`).
2. Composants par RÔLE ARIA `[role="dialog"|"card"|"tab"|"menu"|"tooltip"]`,
   sémantiques et couverts par `check-selectors.sh` (`04:138,145`).
3. Radius par tokens natifs réels `--radius` 8px / `--radius-lg` 12px +
   correction du `--radius-sm` inputs 6px → 4px (`tokens.css:55-58`, `04:153,183`).
   Plus la correction de cascade dark : déplacer le bloc dark de `@media` vers
   `[data-theme="dark"]` (`04:152,206`).

**Restera non unifiable :** l'unification des fonds via classes produit
`.entry-*` / `.workspace-shell` / `.split-chat-slot > .pane` (renommables, casse
silencieuse, `04:146`) et le collapse de rail / `workspace-tabs-chrome`,
documenté comme cassant le grid (`theme.css:6-29`, `04:141`).

---

_Fin du rapport — Phase 7. Aucun fichier source ni override n'a été modifié ;
seul ce document a été écrit dans `reports/design-audit/`._
