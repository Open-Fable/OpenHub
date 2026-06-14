# Audit Design Final — OpenHub — 2026-06-14

> Rapport exécutif de la Phase 10. Synthèse des Phases 1 à 9 de l'audit design.
> Chaque score est DÉRIVÉ des scores réels mesurés en Phase 5 (`05-audit-alignement-marque.md`)
> et Phase 9 (`09-etats-interactions.md`) — aucune valeur n'est inventée.
> Chaque problème cite sa source (document + `fichier:ligne`). Aucun fichier
> source n'a été modifié.
>
> Direction artistique senior. Date : 2026-06-14.

---

## Résumé Exécutif

| Indicateur                         | Score        | Source dérivée                                              |
| ---------------------------------- | ------------ | ----------------------------------------------------------- |
| **Score d'alignement marque**      | **6,5 / 10** | `05-audit-alignement-marque.md:21,177,360` (Partie A)       |
| **Score de cohérence interne**     | **3,5 / 10** | `05-audit-alignement-marque.md:24,671,707` (Partie C)       |
| **Score d'unification inter-apps** | **6,5 / 10** | `05-audit-alignement-marque.md:24,893,928` (Partie D)       |
| **Score global**                   | **5,5 / 10** | Moyenne des 3 axes : (6,5 + 3,5 + 6,5) / 3 = 16,5 / 3 = 5,5 |

**Prêt pour publication : NON — publiable uniquement Avec réserves** une fois les
7 problèmes CRITIQUES traités (les 5 corrections code propre de
`06-corrections-code-propre.md:42-89` + les 2 blocages d'accessibilité clavier de
la Phase 9 : focus absent du Nav-popup et `outline:none` sans substitut sur les
champs Projects, `09-etats-interactions.md:268-269`).

> **Note de dérivation du score global.** Le squelette demande explicitement
> 4 scores : alignement marque, cohérence interne, unification inter-apps, et
> global. Les trois premiers sont les scores RÉELS de la Phase 5 (Parties A, C, D).
> Le score global est leur moyenne arithmétique non pondérée = **5,5/10**. Donnée
> de contrôle convergente : la conformité au design system mesurée en Phase 5 est
> de **9/58 tokens strictement conformes (~16 %)**, ou **50/58 (~86 %) corrects en
> VALEUR** si l'on tolère le décalage de nommage `--oh-*`
> (`05-audit-alignement-marque.md:22,393-396`). La Phase 9 ne produit pas de score
> chiffré mais une liste de 11 problèmes gradués (2 CRITIQUES, 3 HAUTS, 5 MOYENS,
> 1 BAS — `09-etats-interactions.md:266-279`), cohérente avec un état « socle bon,
> finitions et plomberie à reprendre ».

---

## État actuel en un paragraphe

OpenHub réussit ce qui se voit le plus : l'accent teal `#14b8a6`/`#0d9488` est
conforme et identique partout (shell + 3 apps tierces via overrides), zéro couleur
par outil, zéro violet v1 `#7B67EE`, fond sombre `#0a0a0a` par défaut, SF Pro et
logo OpenHub dans le shell — d'où une perception de marque et une unification
inter-apps honorables (6,5/10 chacune)
(`05-audit-alignement-marque.md:26-29,62-100`). Mais l'unité tient « par recopie »
et non « par construction » : quatre systèmes de tokens parallèles avec trois
conventions de nommage (seul `sidebar.html` porte le canon `--oh-*`), aucune
échelle typographique tokenisée, une échelle radius incomplète (paliers 6px et
16px manquants) et non imposée aux apps tierces
(`05-audit-alignement-marque.md:104-113,294,316-321`). Ces fractures produisent des
bugs réels (`--error` inexistant → bordure d'erreur fausse en mode clair ; ruptures
du thème clair OpenWork/Open Design) et une couture shell↔apps visible (boutons
pilule et cartes 24-32px, typo IBM Plex dans OpenWork). La cohérence interne,
plombée par cette fragmentation, par la réintroduction de couleurs par-type dans
Chat et par des états interactifs incomplets (focus absent du Nav-popup), tombe à
3,5/10 (`05-audit-alignement-marque.md:671-701`). Le socle de marque existe ; la
plomberie des tokens, la géométrie et les états d'interaction restent à unifier.

---

## Problèmes critiques (bloquants pour publication)

Sept blocages : les 5 CRITIQUES du code propre (`06-corrections-code-propre.md`),
plus 2 CRITIQUES d'accessibilité de la Phase 9 (`09-etats-interactions.md`).

1. **Fragmentation du système de tokens — contrat `--oh-*` non respecté hors
   Sidebar.** Quatre implémentations parallèles de la même charte sous trois
   conventions de nommage ; racine de toute la dette.
   Source : `06-corrections-code-propre.md:82-89` ; `05-audit-alignement-marque.md:104-113,620,711`.
   Fichiers : `electron/chat.html:21-64`, `electron/projects/projects.css:10-69`,
   `electron/nav-popup.html:16-29`, `electron/overrides/global/theme.css:20-30`
   (seul `electron/sidebar.html:17` est canonique).

2. **Variable `--error` non définie dans le JS de la Sidebar → bordure d'erreur
   fausse en mode clair** (`#ef4444` au lieu de `#dc2626`).
   Source : `06-corrections-code-propre.md:46-53` ; `05-audit-alignement-marque.md:261,612,624,716`.
   Fichier : `electron/sidebar.html:2849,2854,2865`.

3. **Variables `--text-base` / `--text-strong` fantômes dans Chat → couleur du
   menu « + » livrée au fallback navigateur.**
   Source : `06-corrections-code-propre.md:55-62` ; `05-audit-alignement-marque.md:524,626`.
   Fichier : `electron/chat.html:1622,1631`.

4. **Absence de token texte-sur-accent → deux conventions opposées + contraste
   faible en clair (Projects).** `#fff` (Chat/Sidebar) vs `var(--bg-deepest)`
   (Projects, qui se contredit lui-même).
   Source : `06-corrections-code-propre.md:64-71` ; `05-audit-alignement-marque.md:540-551,633,720`.
   Fichiers : `electron/chat.html:690,1690,1816,1927`,
   `electron/projects/projects.css:452,1164,2044`, `electron/sidebar.html:1135,1299`.

5. **Réintroduction de couleurs par-type dans Chat (interdit v2).** Trois palettes
   JS (`PROJ_COLORS`, `HUB_TYPE_COLORS`, `HUB_FILTER_TYPES`) attribuent des hex
   différents par type — décoration multicolore proscrite par la marque.
   Source : `06-corrections-code-propre.md:73-80` ; `05-audit-alignement-marque.md:534,635,722-723`.
   Fichier : `electron/chat.html:3312,6119,6137`.

6. **Nav-popup sans aucun état focus (accessibilité clavier).** 0 `:focus`,
   0 `:focus-visible`, 0 `outline` sur des `<button>` navigables au clavier →
   impossible de savoir quel slot est focalisé.
   Source : `09-etats-interactions.md:53-57,217,254,268`.
   Fichier : `electron/nav-popup.html` (entier ; boutons `123-147`).

7. **`outline:none` sur tous les champs de Projects sans substitut de focus
   garanti.** Anneau de focus retiré globalement sur `input/textarea/select` sans
   `box-shadow` de remplacement systématique.
   Source : `09-etats-interactions.md:45,215,256,269`.
   Fichier : `electron/projects/projects.css:140-143`.

---

## Problèmes majeurs (fortement recommandé avant publication)

1. **Échelle radius incomplète — paliers 6px et 16px manquants** (échelle réelle
   `4/8/12/9999` vs prescrit `0/4/6/8/12/16/9999`), nommage décalé.
   Source : `06-corrections-code-propre.md:97-104` ; `05-audit-alignement-marque.md:309-321,491-497`.
   Fichiers : `electron/chat.html:49-52`, `electron/projects/projects.css:38-41`,
   `electron/sidebar.html:63-66`, `electron/nav-popup.html:25-28`.

2. **Radius des apps tierces non unifié** (axe le plus faible, 3,5/10) : boutons
   pilule + cartes 24-32px (OpenWork), 2-12px hétérogène (OpenCode), inputs 6px
   au lieu de 4px (Open-Design).
   Source : `05-audit-alignement-marque.md:759-762,786-838,902` ; `07-unification-overrides.md:38`.

3. **Typographie : 4 stacks `font-family` différents en interne + 2 apps tierces
   hors SF Pro** (IBM Plex pour OpenWork, system-ui pour OpenCode).
   Source : `06-corrections-code-propre.md:115-122` ; `05-audit-alignement-marque.md:557,629,717-719,839-849,903`.
   Fichiers : `electron/chat.html:53`, `electron/projects/projects.css:50-52`,
   `electron/sidebar.html:61-62`, `electron/nav-popup.html:24` ;
   `apps/openwork/.../index.css:144-145`, `apps/opencode/.../theme.css:2`.

4. **États de focus divergents** : 2px/offset +2px (Chat/Projects) vs 1px
   (Sidebar slots) vs 2px/offset -2px (Sidebar config-tab).
   Source : `06-corrections-code-propre.md:124-131` ; `09-etats-interactions.md:65-67,273` ;
   `05-audit-alignement-marque.md:583-588,640,724-725`.
   Fichiers : `electron/chat.html:140-141`, `electron/projects/projects.css:137-138`,
   `electron/sidebar.html:288,651-652,859`.

5. **`:disabled` quasi absent et incohérent** : une seule règle en Chat ; opacités
   disabled à 3 valeurs (0.4 / 0.45 / 0.5).
   Source : `09-etats-interactions.md:59-63,270`.
   Fichiers : `electron/chat.html:1712-1716`, `electron/projects/projects.css:3064`,
   `electron/sidebar.html:1131`.

6. **Pas d'`aria-live`/`role` d'état dans Projects** : changements erreur/succès
   des nœuds non annoncés aux lecteurs d'écran (présents en Chat et Sidebar).
   Source : `09-etats-interactions.md:95-98,271`.
   Fichier : `electron/projects/` (aucune occurrence).

7. **Thème clair cassé dans 2 apps tierces** : cascade dark d'Open-Design enfermée
   dans `@media (prefers-color-scheme: dark)` ; overlays projets OpenWork figés en
   dark via fallbacks codés en dur.
   Source : `05-audit-alignement-marque.md:118-127,851-863,901` ; `07-unification-overrides.md:41-42`.
   Fichiers : `electron/overrides/open-design/theme.css:79-107`,
   `electron/overrides/openwork/projects.css`, `projects-hub.css`.

8. **Radius boutons/inputs Chat non aligné** (boutons pilule 9999px + inputs à 4px
   ET 12px) et **cercles `50%` mélangés avec `--radius-full`** dans Chat et Projects.
   Source : `06-corrections-code-propre.md:133-149` ; `05-audit-alignement-marque.md:487-490,643,647`.
   Fichiers : `electron/chat.html:629,1687,1915,2427,972,793,1170,2180,1816`,
   `electron/projects/projects.css:201,449,1915,1046`.

9. **Sélection texte teal hardcodée au lieu d'un token** (dupliquée Chat + Global).
   Source : `06-corrections-code-propre.md:151-158` ; `05-audit-alignement-marque.md:268,772`.
   Fichiers : `electron/chat.html:132,136`, `electron/overrides/global/theme.css:84,90`.

---

## Problèmes mineurs (améliorations post-publication)

1. **Aucun token typographique (`--oh-font-*`)** : 11 rôles texte + 4 mono prescrits
   jamais implémentés ; tailles en dur, dont valeurs cassées (9.5px, 12.5px).
   Source : `06-corrections-code-propre.md:166-173` ; `05-audit-alignement-marque.md:294,406-413,561-562`.

2. **Police mono : 3 stacks distincts** (Fira Code vs Monaco vs absent).
   Source : `06-corrections-code-propre.md:175-182` ; `05-audit-alignement-marque.md:287,559`.
   Fichiers : `electron/chat.html:55`, `electron/projects/projects.css:55`, `electron/sidebar.html:84`.

3. **Durées hors échelle hardcodées + palier 500ms absent** (`0.15s`/`200ms`/`300ms`/`0.3s`/`0.4s`).
   Source : `06-corrections-code-propre.md:184-191` ; `05-audit-alignement-marque.md:344,596,658`.
   Fichiers : `electron/chat.html:526,1775,2016`, `electron/projects/projects.css:309,344-346,537-540`.

4. **Nav-popup : fond `#111111` au lieu de `#0a0a0a`** + **easing natif `ease`** au
   lieu de la cubic-bezier + **aucune ombre** (menu flottant) + **pas de
   `prefers-reduced-motion`**.
   Source : `06-corrections-code-propre.md:106-113,193-200,226-233` ;
   `09-etats-interactions.md:138,142-144,278` ; `05-audit-alignement-marque.md:114-117,503,644,886`.
   Fichier : `electron/nav-popup.html:17,77`.

5. **Grille 8px violée partout** (paddings 5/7/10/14/18px), tokens `--space-*`
   absents en Chat et Nav-popup.
   Source : `06-corrections-code-propre.md:235-242` ; `09-etats-interactions.md:162-176,275` ;
   `05-audit-alignement-marque.md:568-570,652-653`.

6. **Aucune cible interactive ≥ 44×44 px** (`.btn-send` 32, `.btn-icon` 30,
   `.slot-btn` h32, `.item` ≈33).
   Source : `09-etats-interactions.md:224-236,272`.

7. **Breakpoints responsive non alignés** (900/700/640/480 vs 680/720 vs 600 vs aucun).
   Source : `09-etats-interactions.md:182-200,276`.

8. **Durées feedback divergentes** (shimmer 1.5s/1.8s ; spin 1.8s/2s) +
   **Sidebar omet `animation-iteration-count:1`** dans `prefers-reduced-motion`.
   Source : `09-etats-interactions.md:79-80,100-102,146-148,274,277`.

9. **Sidebar : tooltip ombre hardcodée** au lieu de `--shadow-md` ;
   **btn-ollama.cancel:hover** fond rouge hors token ; **tokens d'ombre morts**.
   Source : `06-corrections-code-propre.md:202-218` ; `05-audit-alignement-marque.md:329,605,774,148,261`.
   Fichier : `electron/sidebar.html:438,1196`.

10. **Cosmétiques** : chevron Projects `#888888` figé (data-URI) ;
    Nav-popup `--accent-subtle` light `.08` au lieu de `.06` ; drag overlay teal
    hardcodé en JS (Global) ; statuts SVG teal `%2314B8A6` figé.
    Source : `06-corrections-code-propre.md:253-260,268-293`.
    Fichiers : `electron/projects/projects.css` (chevron), `electron/nav-popup.html:23`,
    `electron/overrides/global/theme.js:131-132`, `electron/sidebar.html` (data-URI statut).

---

## Plan d'action ordonné

L'ordre suit la logique de la Phase 6 : la source unique de tokens d'abord (elle
résout « gratuitement » plusieurs bugs en aval), puis le code propre, puis les
apps tierces via overrides, puis les états/interactions
(`06-corrections-code-propre.md:33-39`).

### Étape 1 : Définir les design tokens (`08-design-tokens.md`) — effort estimé : moyen (1-2 jours)

Créer le fichier de tokens unique `--oh-*` (source de vérité), consommé par les
4 vues internes via migration incrémentale par alias
(`06-corrections-code-propre.md:86-88`). **104 tokens** proposés au total, dont
**~53 à introduire** et **~51 à renommer/unifier** (existent déjà en valeur)
(`08-design-tokens.md:524-601`). Comprend : token `--oh-color-on-accent`, échelle
radius complète (6px/16px), échelle typographique tokenisée, `--oh-duration-500`,
tokens sélection/scrollbar et z-index. Résout la racine de la dette (4 systèmes
parallèles) et neutralise les bugs `--error` et `--text-base`/`--text-strong`.

### Étape 2 : Corriger le code propre (`06-corrections-code-propre.md`) — effort moyen-élevé ; 5 fichiers ; 25 modifications

**25 corrections** réparties : **5 CRITIQUES, 7 HAUTES, 6 MOYENNES, 4 BASSES,
3 COSMÉTIQUES** (`06-corrections-code-propre.md:24-31`). **5 fichiers** touchés
(`06-corrections-code-propre.md:299-306`) :

- `electron/sidebar.html` — 7 corrections (dont `--error`, texte-sur-accent, focus).
- `electron/chat.html` — 12 corrections (dont `--text-base`/`--text-strong`,
  texte-sur-accent, palettes par-type, radius, typo).
- `electron/projects/projects.css` — 7 corrections (texte-sur-accent, radius,
  cercles, durées, chevron).
- `electron/nav-popup.html` — 5 corrections (fond, focus, easing, ombre, opacité).
- `electron/overrides/global/theme.css` + `theme.js` — 3 corrections (sélection,
  ease/duration inutilisés, drag overlay JS).

Risque principal : la suppression des couleurs par-type de Chat est une refonte
fonctionnelle (risque moyen/élevé), à cadrer comme tâche dédiée
(`06-corrections-code-propre.md:79-80`).

### Étape 3 : Unifier via les overrides (`07-unification-overrides.md`) — effort moyen ; risques par app

Étendre les `theme.css` existants (jamais dupliquer la charte). Leviers fiables :
redéfinir les **variables radius natives** par app et **forcer SF Pro** sur OpenWork
et OpenCode (`07-unification-overrides.md:196-204,339-348,480-489`).

- **OpenWork** : `--dls-radius`/`--dls-radius-lg`/`--radius` + SF Pro `html,body` +
  réparer overlays projets `.oh-*` (tokens dark+light définis, radius littéral).
- **OpenCode** : `--radius-xs..xl` + SF Pro en EXCLUANT les zones de code/terminal
  (risque UX fort sinon).
- **Open-Design** : `--radius-sm` inputs 6px→4px + sortir le bloc dark de `@media`
  vers `[data-theme="dark"]` (corrige le thème clair cassé).

Risques résiduels (non bloquants) : radius hardcodé natif ciblable seulement par
classe produit non sémantique (`.ow-soft-*`, OpenCode sans `data-component`) →
casse silencieuse possible après `npm run update:apps`, hors radar de
`scripts/check-selectors.sh:11`. Re-vérification manuelle requise
(`07-unification-overrides.md:206-212,349-357,491-498,553-557`).

### Étape 4 : Corriger les états/interactions (`09-etats-interactions.md`) — effort faible-moyen

Traiter les 11 problèmes priorisés (`09-etats-interactions.md:266-279`), en
commençant par les CRITIQUES a11y : **ajouter le focus clavier au Nav-popup** et
**garantir un substitut de focus visible sur les champs Projects**
(`09-etats-interactions.md:268-269`). Puis HAUTES : unifier `:disabled`
(opacité unique), ajouter `aria-live`/`role` d'état dans Projects. Puis MOYENNES :
harmoniser l'épaisseur/offset de focus, cibles tactiles, `prefers-reduced-motion`
du Nav-popup et `animation-iteration-count` de la Sidebar, grille 8px, breakpoints.
La plupart se résolvent en consommant les tokens de l'Étape 1.

---

## Index des documents produits

- [01 — ADN de marque](./01-adn-marque.md)
- [02 — Design system de référence](./02-design-system-reference.md)
- [03 — Inventaire du code propre](./03-inventaire-code-propre.md)
  - [03 — Inventaire Chat](./03-inv-chat.md)
  - [03 — Inventaire Projects](./03-inv-projects.md)
  - [03 — Inventaire Sidebar / Nav](./03-inv-sidebar-nav.md)
  - [03 — Inventaire Global](./03-inv-global.md)
- [04 — Inventaire des overrides](./04-inventaire-overrides.md)
- [05 — Audit d'alignement de marque](./05-audit-alignement-marque.md)
  - [05 — Parties A & B](./05-part-AB.md)
  - [05 — Partie C](./05-part-C.md)
  - [05 — Partie D](./05-part-D.md)
- [06 — Plan de corrections du code propre](./06-corrections-code-propre.md)
- [07 — Plan d'unification des apps tierces via overrides](./07-unification-overrides.md)
- [08 — Design tokens unifiés `--oh-*` (proposition)](./08-design-tokens.md)
- [09 — États, interactions et micro-détails](./09-etats-interactions.md)

---

## Annexe : ce qui ne peut PAS être unifié (depuis `07`, avec explication)

Limites résiduelles documentées en Phase 7. Aucune n'est un blocage de publication ;
toutes exigent une re-vérification manuelle post-`update:apps` car invisibles pour
`scripts/check-selectors.sh:11` (qui ne matche que `[data-*]`/`#id`/`[role]`/`[aria-*]`).

**OpenWork (Work)** — boutons pilule et cartes 24/32px **si** les classes produit
`.ow-soft-card` / `.ow-soft-shell` / `.ow-button-primary` sont renommées en update.
Pourquoi : leur `border-radius` est codé EN DUR dans le markup natif (pas via
variable), donc seul un ciblage par classe non sémantique les corrige — classe
renommable, casse silencieuse.
Source : `07-unification-overrides.md:206-212,573-576` ;
`apps/openwork/.../index.css:166,172,188`.

**OpenCode (Code)** — (a) **radius HARDCODÉ des composants sans `data-component`**
(mesuré 6/8/4/2/12px, 999px) : inatteignable sans toucher le source quand il n'y a
ni variable ni sélecteur sémantique stable. (b) **Correctifs layout `xl:`/`z-25`** :
dépendent de breakpoints, z-index et classes Tailwind générées → cassent en silence
post-update. (c) **Typo des zones de code/terminal** : volontairement laissée en
mono (ne pas forcer SF Pro proportionnel, régression UX).
Source : `07-unification-overrides.md:349-357,587-591` ;
`apps/opencode/.../theme.css:45-49` (échelle native).

**Open-Design (Design)** — (a) **unification des fonds via classes produit**
(`.entry-*`, `.workspace-shell`, `.split-chat-slot > .pane`) : classes internes
renommables, casse silencieuse ; mitigée mais non garantie par le repli sur les
variables `--bg-*`. (b) **Collapse de rail / `workspace-tabs-chrome`** : déjà
documenté comme cassant le layout en grille (tentatives commentées dans l'override)
→ non réactivable de façon fiable via CSS seul.
Source : `07-unification-overrides.md:491-498,605-608` ;
`electron/overrides/open-design/theme.css:6-29,283-295`.

**Contrainte structurelle commune** — on ne peut jamais SUPPRIMER les chemins de
cascade de thème natifs des apps ; on peut seulement aligner NOS overrides sur les
bons scopes (`[data-theme="dark"]` + `:root:not(.dark)` hors `@media`). Et il ne
faut jamais compter sur le fallback `var(--x, défaut)` quand la variable existe
nativement (elle intercepte le fallback : OpenWork `var(--radius-lg,12px)`→~7,2px,
Open-Design `var(--radius-sm,4px)`→6px).
Source : `07-unification-overrides.md:396-407,515-519`.

---

_Fin du rapport — Phase 10. Aucun fichier source modifié. Scores dérivés des
Phases 5 et 9 ; problèmes tracés aux Phases 6, 7 et 9._
