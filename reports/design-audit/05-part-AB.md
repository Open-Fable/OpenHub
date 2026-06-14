# 05 — Phase 5, parties A & B de l'audit design OpenHub

> **Objet** : confronter l'UI RÉELLE (documents `03` code propre + `04` overrides)
> à l'ADN de marque (`01`) et au design system de référence (`02`).
> Méthode : aucune valeur inventée. Chaque affirmation renvoie à un document
> source et à un `fichier:ligne`. Toute valeur absente est notée `NON DÉFINI`.
> Aucun fichier source n'a été modifié.
>
> Direction artistique senior. Date : 2026-06-14.

---

## A. La marque est-elle perceptible dans l'UI ?

Cette partie confronte l'UI réelle (`03`/`04`) aux **critères de jugement** de
l'ADN (`01`, §"Critères de jugement", 23 critères) et au **message** que l'UI
doit transmettre. On évalue : message/personnalité/valeurs transmis ? Évoque ce
qu'elle doit / évite ce qu'elle ne doit pas ? Un nouveau venu comprend-il
instantanément ce qu'est OpenHub ?

### A.1 — Ce que la marque dit devoir évoquer (rappel `01`)

L'UI doit incarner : message _"Une fenêtre. Trois outils. Zéro friction."_
(`01:136`) ; les 4 piliers **Unité, Contrôle, Respect, Fluidité** (`01:149`) ;
une personnalité **calme, directe, élégante, fiable, ouverte** (`01:59-80`) ;
des repères durs : **accent teal unique** `#14B8A6`/`#0D9488` (`01:235`),
**aucune couleur par outil** (`01:240`), **zéro violet `#7B67EE`** (`01:239`),
**grille 8px** (`01:261`), **typo SF Pro** (`01:268`), **vocabulaire d'arrondis
type φ / linecap round** (`01:250`), **trois entités égales** (`01:298`).

### A.2 — Confrontation critère par critère (faits 03/04)

**Ce qui transmet la marque (PRÉSENT et conforme) :**

- **Accent teal unique, partout.** Les 5 vues codées par nous utilisent toutes
  exactement le même accent : `#14b8a6` (dark) / `#0d9488` (light) — Chat
  (`03:66`, chat.html:33/86), Projects (`03:583`, projects.css:22/79), Sidebar
  (`03:933`, sidebar.html:36/105), Nav-popup (`03:980`, nav-popup.html:22/39),
  Global override (`04:10`). Les 3 apps tierces sont repeintes vers ce même teal
  par les overrides (OpenWork `04:38`, OpenCode `04:106-107`, Open Design
  `04:136-137`). → critère 1 (`01:235`) **SATISFAIT**.
- **Aucune couleur par outil.** Aucune des 5 vues ne définit `accent-work`/
  `-code`/`-design` ; l'unité passe par un teal unique (constat transversal
  `03:21`). Les overrides effacent les accents natifs distinctifs (bleu
  OpenWork/OpenCode `04:164,173` ; terracotta Open Design `04:182`) au profit du
  teal. → critère 3 (`01:240`) et critère 14 "enveloppe cohérente" (`01:279`)
  **SATISFAITS sur la couleur.**
- **Aucun violet v1.** Aucune trace de `#7B67EE` ni de `shadow-glow` dans les
  inventaires `03`/`04` (suppression v2 confirmée côté référence `02:94`).
  → critère 2 (`01:239`) **SATISFAIT**.
- **Thème sombre par défaut, fond très sombre.** Toutes les vues codées posent
  `#0a0a0a` en fond racine dark (Chat `03:39`, Projects `03:571`, Sidebar
  `03:921`, Global `04` theme.css:52) — cohérent avec le `#0A0A0A` de l'icône de
  marque (`01:245-247`). → critère 5 **SATISFAIT** côté vues internes.
- **Typo SF Pro.** Les 5 vues ouvrent leur stack par `"SF Pro Text"` /
  `-apple-system` (Chat `03:106`, Projects `03:611`, Sidebar `03:952`, Nav-popup
  `03:983`, Global `04`/03:1523). → critère 11 (`01:268`) **SATISFAIT côté vues
  internes** (PAS côté apps tierces, voir plus bas).
- **Logo OpenHub présent et seul.** La sidebar affiche le logo SVG en
  `currentColor` teal (`03:1153`, sidebar.html:1334) + le wordmark "OpenHub"
  (sidebar.html:1341), aucun logo upstream dans le shell. → critère 21
  (`01:302`) **SATISFAIT dans la sidebar**.
- **Iconographie trait cohérente côté marque.** L'icon set OpenHub est trait,
  `viewBox 24`, stroke 2, linecap round (`02:240-243`) — vocabulaire d'arrondis
  voulu par le logo (`01:250`). Les vues consomment des SVG trait `currentColor`
  (Sidebar `03:1153`, Nav-popup `03:1173`). → critère 7 (`01:255`) globalement
  cohérent côté shell.
- **Respect des durées/easing macOS.** Les 5 vues partagent la même échelle
  `cubic-bezier(0.4,0,0.2,1)` + durées 75/150/250/350 (`02:212-225` vs Chat
  `03:114-122`, Sidebar `03:942-950`) → sensation fluide et homogène (piliers
  Fluidité, `01:149`).

**Ce qui dilue ou casse la marque (ABSENT, divergent ou bogué) :**

- **Fragmentation du système de tokens (4 nommages pour 1 charte).** Le pilier
  _Unité_ (`01:149`) est contredit dans le code lui-même : Chat et Projects
  redéfinissent un `:root` `--*` court non aligné sur `--oh-*` (`03:527`,
  `03:879`), Nav-popup un troisième schéma ultra-court (`03:1421`, CRITIQUE),
  Global ne tokenise que l'animation (`04`/03:1474). Seul `sidebar.html` porte
  le préfixe canonique `--oh-*` (`03:17`). Conséquence : 4 sources de vérité
  pour le MÊME teal et les MÊMES neutres → "Rien n'est gratuit / tout est
  intentionnel" (`01:168`) n'est pas tenu sous le capot. Invisible pour
  l'utilisateur tant que les valeurs coïncident, mais fragilise la promesse de
  cohérence dès qu'une valeur diverge (voir bugs ci-dessous).
- **Fond sombre incohérent dans la nav.** Nav-popup pose `--bg:#111111` en dark
  (`03:18`, nav-popup.html:17) au lieu du `#0a0a0a` de toutes les autres vues.
  Le popup de navigation — continuité visuelle directe de la sidebar — rend sur
  un noir différent. Petite rupture du critère "enveloppe cohérente" (`01:279`).
- **Rupture thème clair dans 2 apps tierces (point de casse réel).**
  - OpenWork : les overlays projets injectés (`projects.css`/`projects-hub.css`)
    consomment des tokens non définis avec fallback dark figé ; en mode clair,
    `var(--bg-deepest, #0a0a0a)` reste NOIR dans une app claire (`04:70,92`).
  - Open Design : bug de cascade dark — le bloc dark de l'override est enfermé
    dans `@media (prefers-color-scheme: dark)`, donc en OS clair + thème forcé
    sombre on obtient un **mélange** fonds anthracite natifs + accents/bordures
    clairs (`04:152,206`).
    → ces deux cassures contredisent frontalement la peur de Léa ("aspect brut",
    `01:112`) et le critère 12 "app native, pas wrapper" (`01:272`).
- **Radius natif des apps jamais ramené à l'échelle de marque.** Le vocabulaire
  d'arrondis (8/12px, `02:177-178`) n'est PAS imposé aux surfaces natives :
  OpenWork garde des cartes 24px et des **boutons pilule 9999px** (`04:47,165`),
  OpenCode reste anguleux (échelle 2-10px + hardcodés, `04:124,174`), Open
  Design rend ses inputs en 6px au lieu de 4px (`04:155`). → l'utilisateur voit
  des arrondis HÉTÉROGÈNES selon le slot, alors que l'unité par la forme est le
  cœur de la v2 (`01:225`). Critère 6 (`01:250`) et 14 (`01:279`)
  **PARTIELLEMENT NON SATISFAITS**.
- **Typo des apps tierces non alignée.** L'override OpenWork ne touche pas la
  typo native `"IBM Plex Sans"` (`04:48,169`) ; OpenCode garde sa stack native
  (`04:175`). Le slot Work/Code n'est donc pas en SF Pro → critère 11
  contredit hors shell.
- **Trois palettes "couleur par type de projet" concurrentes et hors charte.**
  Chat définit `HUB_TYPE_COLORS`, `HUB_FILTER_TYPES` dots et `PROJ_COLORS` avec
  des hex DIFFÉRENTS pour le même concept (`03:531-536`, chat.html:6119-6145,
  3312-3321), aucun n'utilisant les tokens. C'est exactement le "Je ne sais pas
  quel outil/élément utilise quoi" que la marque proscrit (`01:212`), et une
  forme de décoration multicolore non justifiée (`01:206`).
- **Bugs de couleur sémantique réels.** `--error` référencé mais inexistant en
  JS (Sidebar `03:1423`, Projects `03:1616`) → bordure d'erreur FAUSSE en mode
  clair. `.btn-ollama.cancel:hover` utilise un rouge `#f87171` ≠ token
  (`03:1425`). Deux nuances de teal `#0D9488`/`#14B8A6` dans le Global
  (`03:1572`). → "fait ce qu'elle dit" / fiabilité (`01:73`) localement entamée.
- **`#fff` hardcodé sur accent, sans token `text-on-accent`.** Répété ≥9 fois en
  Chat (`03:542`), opposé à `var(--bg-deepest)` en Projects pour le même rôle
  (`03:887`) → contraste non garanti si l'accent évolue ; deux conventions
  opposées (incohérence interne, `01:168`).

### A.3 — Test du nouveau venu

Un nouveau venu ouvrant OpenHub perçoit-il _"Une fenêtre, trois outils, zéro
friction"_ (`01:136`) ?

- **OUI pour le shell.** La sidebar nomme la marque ("OpenHub", logo teal,
  `03:1341`), expose trois slots égaux Work/Code/Design (`03:17`,
  sidebar.html), un accent teal unique et cohérent, une enveloppe SF Pro /
  fond sombre. L'idée d'un hub unifiant trois outils est lisible.
- **PARTIELLEMENT pour le contenu.** Dès qu'on entre dans un slot, l'app tierce
  affiche ses arrondis natifs (pilules OpenWork, angles OpenCode), parfois un
  fond clair "cassé" — la couture entre shell OpenHub et app habillée reste
  visible. Le "Zéro friction" et le "macOS-native" ne sont pas tenus
  uniformément (`04:47,152,169`).
- **Contrôle PEU mis en scène.** Le pilier _Contrôle_ (Keychain, proxy local,
  pas de cloud — `01:170,287`) n'apparaît pas comme élément de design rassurant
  visible dans les inventaires `03` (pas de statut proxy/sécurité mis en avant
  dans les vues relevées) — c'est un manque d'incarnation, pas une faute.

### A.4 — Score partie A

**Score A : 6,5 / 10.**

Justification appuyée sur les faits :

- **+** Les repères durs de marque sont respectés là où ils comptent le plus
  visuellement : teal unique partout (`03:66,583,933,980` ; `04:10`), zéro
  couleur par outil (`03:21`), zéro violet (`02:94`), thème sombre `#0a0a0a`
  par défaut (`03:39,571,921`), SF Pro + logo OpenHub dans le shell
  (`03:106,1341`), échelle d'animation homogène (`03:114,942`). Un nouveau venu
  comprend l'idée de hub unifié.
- **−** La marque est perceptible mais **inégalement tenue** : 4 systèmes de
  tokens parallèles pour une charte unique (`03:21`, contredit le pilier
  _Unité_), fond nav `#111111` divergent (`03:18`), radius natif des apps non
  unifié laissant des arrondis hétérogènes selon le slot (`04:47,124,155`),
  typo IBM Plex conservée dans Work (`04:48`), rupture du thème clair dans
  OpenWork et Open Design (`04:70,152`), 3 palettes "type" incohérentes en Chat
  (`03:531-536`), bugs d'erreur en light (`03:1423`).
- Le shell **affirme** la marque ; la jonction shell↔apps et la plomberie des
  tokens la **diluent**. D'où une note nettement au-dessus de la moyenne mais
  loin du "montrable sans s'excuser du look" exigé par Léa (`01:110`,
  critère 19).

---

## B. Le design system est-il respecté ?

Tableau pour **chaque token** du design system de référence (`02`), confronté à
la valeur réelle du code propre (`03`) et des overrides (`04`).

**Légende "Conforme ?"** :

- **OUI** : valeur réelle = valeur prescrite (au moins dans les vues codées).
- **PARTIEL** : valeur correcte mais nommage non canonique (`--oh-*` non
  respecté) OU correct dans certaines vues seulement OU non appliqué aux apps.
- **NON** : valeur absente, divergente, ou jamais tokenisée.

> Rappel structurel majeur : le système prescrit le préfixe `--oh-color-*` /
> `--oh-radius-*` / `--oh-space-*` etc. (`02:29,145,170`). **Une seule vue
> (`sidebar.html`) le respecte** (`03:17`). Chat, Projects, Nav-popup, Global
> utilisent des noms différents pour les mêmes valeurs (`03:21`). Beaucoup de
> tokens sont donc cotés **PARTIEL** : la VALEUR est bonne, le CONTRAT de
> nommage `--oh-*` ne l'est pas hors sidebar.

### B.1 — Couleurs : fonds

| Token                    | Valeur prescrite (02) | Réel code propre (03)                                                                                  | Réel overrides (04)                                                                                            | Conforme ? | Détail                                                                                                                                               |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--oh-color-bg-deepest`  | `#FFFFFF` / `#0A0A0A` | `#ffffff`/`#0a0a0a` (Chat 03:39, Projects 03:571, Sidebar 03:921) ; Nav-popup dark = `#111111` (03:18) | OpenWork/OpenCode `#ffffff`/`#0a0a0a` (04:105) ; Open Design idem (04:136-137)                                 | PARTIEL    | Valeur OK partout SAUF nav-popup dark `#111111` (03:18). Nommage `--oh-*` seulement en sidebar. Fallbacks dark figés en clair côté OpenWork (04:70). |
| `--oh-color-bg-panel`    | `#F7F7F7` / `#141414` | `#f7f7f7`/`#141414` (Chat 03:40, Projects 03:572, Sidebar 03:922)                                      | OpenWork (04:36), OpenCode `--background-weak` `#f7f7f7`/`#141414` (04:105), Open Design `--bg-panel` (04:136) | PARTIEL    | Valeur conforme ; nommage non canonique hors sidebar.                                                                                                |
| `--oh-color-bg-surface`  | `#EFEFEF` / `#1E1E1E` | `#efefef`/`#1e1e1e` (Chat 03:41, Projects 03:573, Sidebar 03:923)                                      | OpenCode/Open Design mappés (04:105,136)                                                                       | PARTIEL    | Valeur conforme ; nommage non canonique hors sidebar.                                                                                                |
| `--oh-color-bg-elevated` | `#FFFFFF` / `#282828` | `#ffffff`/`#282828` (Chat 03:42, Projects 03:574, Sidebar 03:924)                                      | NON DÉFINI explicitement (overrides ne distinguent pas elevated)                                               | PARTIEL    | Conforme dans les vues codées ; non mappé finement dans les overrides.                                                                               |
| `--oh-color-bg-overlay`  | `#F2F2F2` / `#111111` | `#f2f2f2`/`#111111` (Chat 03:43, Projects 03:575, Sidebar 03:925)                                      | NON DÉFINI distinct                                                                                            | PARTIEL    | Conforme côté vues codées.                                                                                                                           |

### B.2 — Couleurs : bordures

| Token                       | Valeur prescrite (02) | Réel code propre (03)                                             | Réel overrides (04)                                                                         | Conforme ? | Détail                                                                                           |
| --------------------------- | --------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `--oh-color-border-subtle`  | `#E8E8E8` / `#1F1F1F` | `#e8e8e8`/`#1f1f1f` (Chat 03:49, Projects 03:576, Sidebar 03:926) | NON mappé sous ce nom                                                                       | PARTIEL    | Conforme côté vues codées.                                                                       |
| `--oh-color-border-default` | `#E0E0E0` / `#2A2A2A` | `#e0e0e0`/`#2a2a2a` (Chat 03:50, Projects 03:577, Sidebar 03:927) | OpenWork `--dls-border` `#2a2a2a`/`#e0e0e0` (04:37), OpenCode `--border-weak-base` (04:105) | PARTIEL    | Valeur conforme jusque dans les overrides ; nommage divergent.                                   |
| `--oh-color-border-strong`  | `#CCCCCC` / `#3A3A3A` | `#cccccc`/`#3a3a3a` (Chat 03:51, Projects 03:578, Sidebar 03:928) | NON mappé sous ce nom                                                                       | PARTIEL    | Conforme code propre ; `--border-strong` Chat défini mais non retrouvé en usage (dead, 03:1679). |

### B.3 — Couleurs : texte

| Token                       | Valeur prescrite (02) | Réel code propre (03)                                             | Réel overrides (04)                                                                                    | Conforme ? | Détail                                                                 |
| --------------------------- | --------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------------------------------------------- |
| `--oh-color-text-primary`   | `#111111` / `#ECECEC` | `#111111`/`#ececec` (Chat 03:57, Projects 03:579, Sidebar 03:929) | OpenWork (04:35-36), OpenCode `--text-strong` `#111`/`#ececec` (04:105), Open Design `--text` (04:136) | PARTIEL    | Valeur conforme partout ; nommage `--oh-*` hors sidebar non respecté.  |
| `--oh-color-text-secondary` | `#555555` / `#999999` | `#555555`/`#999999` (Chat 03:58, Projects 03:580, Sidebar 03:930) | NON mappé distinct                                                                                     | PARTIEL    | Conforme côté vues codées.                                             |
| `--oh-color-text-muted`     | `#888888` / `#666666` | `#888888`/`#666666` (Chat 03:59, Projects 03:581, Sidebar 03:931) | NON mappé distinct ; Projects fige `#888888` dans un data-URI chevron (03:899)                         | PARTIEL    | Valeur OK ; chevron `#888888` figé ne suit pas le thème dark (03:899). |
| `--oh-color-text-disabled`  | `#BBBBBB` / `#444444` | `#bbbbbb`/`#444444` (Chat 03:60, Projects 03:582, Sidebar 03:932) | NON mappé distinct                                                                                     | PARTIEL    | Conforme côté vues codées.                                             |

### B.4 — Couleurs : accent (teal unique)

| Token                            | Valeur prescrite (02)                           | Réel code propre (03)                                                                       | Réel overrides (04)                                           | Conforme ? | Détail                                                                                                                                                           |
| -------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--oh-color-accent-primary`      | `#0D9488` / `#14B8A6`                           | `#14b8a6`/`#0d9488` partout (Chat 03:66, Projects 03:583, Sidebar 03:933, Nav-popup 03:980) | Teal imposé dans les 3 apps (04:38,106-107,136-137)           | PARTIEL    | **Valeur exactement conforme partout** (point fort) ; nommage `--oh-*` hors sidebar non respecté. Global le hardcode en 2 nuances `#0D9488`/`#14B8A6` (03:1572). |
| `--oh-color-accent-hover`        | `#0F766E` / `#2DD4BF`                           | `#2dd4bf`/`#0f766e` (Chat 03:67, Projects 03:584, Sidebar 03:934)                           | OpenWork/Open Design hover `#2dd4bf`/`#0f766e` (04:38,137)    | PARTIEL    | Valeur conforme ; nommage divergent.                                                                                                                             |
| `--oh-color-accent-active`       | `#115E59` / `#0D9488`                           | `#0d9488`/`#115e59` (Chat 03:68, Projects 03:585, Sidebar 03:935)                           | NON mappé distinct                                            | PARTIEL    | Conforme code propre.                                                                                                                                            |
| `--oh-color-accent-subtle`       | `rgba(13,148,136,.06)` / `rgba(20,184,166,.10)` | `rgba(20,184,166,.1)`/`rgba(13,148,136,.06)` (Chat 03:69, Projects 03:586, Sidebar 03:936)  | Global `rgba(13,148,136,0.06)` drag overlay (04 theme.js:131) | PARTIEL    | Valeur conforme ; doublons hardcodés en Chat (03:540) et Global.                                                                                                 |
| `--oh-color-accent-subtle-hover` | `rgba(13,148,136,.10)` / `rgba(20,184,166,.16)` | `rgba(20,184,166,.16)`/`rgba(13,148,136,.1)` (Chat 03:70, Projects 03:587, Sidebar 03:937)  | NON mappé distinct                                            | PARTIEL    | Conforme code propre.                                                                                                                                            |

### B.5 — Couleurs : sémantiques

| Token                           | Valeur prescrite (02)        | Réel code propre (03)                                             | Réel overrides (04)       | Conforme ? | Détail                                                                                                                                                                                                   |
| ------------------------------- | ---------------------------- | ----------------------------------------------------------------- | ------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--oh-color-success`            | `#16A34A` / `#22C55E`        | `#22c55e`/`#16a34a` (Chat 03:76, Projects 03:588, Sidebar 03:939) | NON mappé distinct        | PARTIEL    | Valeur conforme ; nommage divergent.                                                                                                                                                                     |
| `--oh-color-warning`            | `#D97706` / `#F59E0B`        | `#f59e0b`/`#d97706` (Chat 03:78, Projects 03:590, Sidebar 03:940) | NON mappé distinct        | PARTIEL    | Valeur conforme.                                                                                                                                                                                         |
| `--oh-color-error`              | `#DC2626` / `#EF4444`        | `#ef4444`/`#dc2626` (Chat 03:80, Projects 03:592, Sidebar 03:941) | NON mappé distinct        | NON        | Valeur du token OK, MAIS le JS référence `--error` INEXISTANT → fallback `#ef4444` faux en light (Sidebar 03:1423, Projects 03:1616) ; `.btn-ollama.cancel:hover` `#f87171` ≠ token (03:1425). Bug réel. |
| `--oh-color-info` (SUPPRIMÉ v2) | doit avoir disparu (`02:93`) | Absent des inventaires 03                                         | Absent des inventaires 04 | OUI        | Suppression respectée (aucun `#3B82F6` info relevé).                                                                                                                                                     |

### B.6 — Couleurs annexes (sélection, scrollbar, overlays modale)

| Token                   | Valeur prescrite (02)                                                       | Réel code propre (03)                                                                               | Réel overrides (04)                                     | Conforme ? | Détail                                                                         |
| ----------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| Sélection texte         | `rgba(13,148,136,.15)`/`#111` (light), `rgba(20,184,166,.25)`/`#fff` (dark) | Chat hardcode `rgba(13,148,136,0.15)` / `rgba(20,184,166,0.25)` (03:174-175)                        | Global hardcode idem (04 theme.css:84,90-91)            | PARTIEL    | Valeur exacte mais **hardcodée**, pas via `--accent-subtle` (03:540, doublon). |
| Scrollbar largeur       | `6px`                                                                       | Chat scrollbar présente (03:176-179) ; Sidebar/Projects `2px` thumb radius (03:1200, 03 hardcodés)  | Global `::-webkit-scrollbar` `6px` (04 theme.css:59-60) | OUI        | Largeur 6px conforme côté Global.                                              |
| Scrollbar thumb / hover | `rgba(0,0,0,.10/.16)` (light), `rgba(255,255,255,.08/.14)` (dark)           | Chat exact (03:176-179) ; Projects `rgba(255,255,255,0.08)` / `rgba(0,0,0,0.1)` (03:646-647)        | Global exact (04 theme.css:66-78)                       | PARTIEL    | Valeurs conformes mais **toutes hardcodées**, jamais tokenisées (03:646, 04).  |
| Overlay modale `modal`  | `rgba(0,0,0,.10)` / `rgba(0,0,0,.40)`                                       | `--overlay-modal` `rgba(0,0,0,0.4)`/`rgba(0,0,0,0.1)` (Chat 03:91, Projects 03:598, Sidebar 03:969) | NON mappé                                               | PARTIEL    | Valeur conforme ; nommage `--overlay-modal` ≠ `--oh-color-bg-overlay`.         |
| Overlay `heavy`         | `rgba(0,0,0,.20)` / `rgba(0,0,0,.60)`                                       | NON DÉFINI dans les vues 03                                                                         | NON DÉFINI                                              | NON        | Token "heavy" prescrit (`02:86`) absent du code.                               |

### B.7 — Couleurs supprimées en v2 (ne doivent plus exister)

| Élément retiré (02:88-94)                                       | Réel code propre (03)                                                              | Réel overrides (04)                           | Conforme ? | Détail                                  |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------- | ---------- | --------------------------------------- |
| Accents par outil (`accent-work/-code/-design/-chat/-projects`) | Absents (03:21)                                                                    | Apps repeintes en teal unique (04:38,106,136) | OUI        | Suppression respectée.                  |
| `--oh-color-info` (bleu `#3B82F6`)                              | Absent                                                                             | Absent                                        | OUI        | Respecté.                               |
| `shadow-glow` (glow violet)                                     | Absent ; Global supprime même les glows natifs (`[class*="glow"]` → none, 03:1551) | Absent                                        | OUI        | Respecté et même activement neutralisé. |

### B.8 — Typographie : familles

| Token                 | Valeur prescrite (02)                                                                              | Réel code propre (03)                                                                                                                                                     | Réel overrides (04)                                                                                                 | Conforme ?      | Détail                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sans` (interface)    | `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` | Projects EXACT (03:611) ; Chat raccourci sans Helvetica Neue (03:106) ; Sidebar ordre inversé `-apple-system` d'abord (03:952) ; Nav-popup sans "SF Pro Display" (03:983) | OpenWork garde IBM Plex natif (04:48,169) ; OpenCode garde sa stack (04:175) ; Open Design forcé en SF Pro (04:139) | PARTIEL         | Stacks **divergentes selon la vue** (03:1441) ; apps Work/Code PAS en SF Pro. `.brand-title` hardcode une stack ≠ token (03:1427).                            |
| `mono` (code)         | `"SF Mono", "Menlo", "Monaco", "Courier New", monospace`                                           | Chat `"SF Mono","Fira Code",ui-monospace,Menlo` (03:108) ; Projects `"SF Mono",Menlo,ui-monospace` (03:613) ; Sidebar `"SF Mono","Monaco","Menlo"` (03:953)               | NON DÉFINI distinct                                                                                                 | PARTIEL         | "SF Mono" partout en tête, mais fallbacks divergents ; Chat ajoute Fira Code (hors prescription). `font-family:monospace` en dur contourne le token (03:548). |
| `rounded` (optionnel) | `"SF Pro Rounded", "SF Pro Text", -apple-system…`                                                  | NON DÉFINI                                                                                                                                                                | NON DÉFINI                                                                                                          | NON (optionnel) | Famille `rounded` jamais déclarée — acceptable (optionnelle, `02:109`).                                                                                       |

### B.9 — Typographie : échelle (tokens `--oh-font-*`)

| Token prescrit (02)                                                       | Valeur prescrite                                                        | Réel code propre (03)                                                                                                                          | Réel overrides (04)                                       | Conforme ? | Détail                                                                                                                                                                                                        |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--oh-font-text-xs` … `display-md` (11 rôles texte/heading, `02:119-130`) | échelle nommée 11→34px avec weights/line-heights/letter-spacing définis | **AUCUN token typo n'existe.** Tailles 100 % en dur : Chat 9.5→20px (03:354), Projects 9→18px (03:764), Sidebar/Nav 11/12/13/17/24px (03:1275) | Délégué aux apps (Global ne définit aucune size, 03:1528) | NON        | **Écart majeur** : l'échelle typographique tokenisée prescrite (`02:117-130`) n'est implémentée NULLE PART. Toutes les tailles/graisses sont saupoudrées en dur, hors échelle (12.5px, 9.5px en JS — 03:546). |
| `--oh-font-mono-xs` … `mono-md` (`02:136-139`)                            | 11/13/14/15px, line-height 1.5-1.6                                      | Aucun token ; tailles mono en dur (Chat pre 13px/1.6 — 03:303 ; Projects mono 11/12px)                                                         | NON DÉFINI                                                | NON        | Échelle mono tokenisée absente.                                                                                                                                                                               |

### B.10 — Espacements (grille 8px, `--oh-space-*`)

| Token                | Valeur prescrite (02)                          | Réel code propre (03)                                                                                                                                                                | Réel overrides (04)                                                | Conforme ? | Détail                                                                                                                                                                                                                     |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--oh-space-0..16`   | `0,4,8,12,16,20,24,32,40,48,64` (`02:149-159`) | Sidebar définit `--space-1..8` (4→32px) et les utilise (03:958-964) ; Projects définit `--space-0..8` (03:603-610) ; **Chat n'a AUCUN token espacement** (03:1636) ; Nav-popup aucun | Global : quasi aucun espacement (scrollbar 6px, inset:0 — 03:1542) | PARTIEL    | Nommage `--space-*` (pas `--oh-space-*`), échelle tronquée (pas de 40/48/64). Largement contourné par des px bruts même quand le token existe (Sidebar 03:1435, Projects bloc MGMT 03:883). Chat 100 % hardcodé (03:1636). |
| Sidebar = 64px large | `64px` (`02:163`)                              | NON VÉRIFIÉ dans 03 (largeur de layout non relevée comme valeur)                                                                                                                     | n/a                                                                | A VÉRIFIER | Dimension de layout, non capturée par l'inventaire token.                                                                                                                                                                  |

### B.11 — Border-radius (échelle critique)

| Token              | Valeur prescrite (02) | Réel code propre (03)                                                                                      | Réel overrides (04)                                                                                      | Conforme ? | Détail                                                                                                                                                                               |
| ------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--oh-radius-none` | `0`                   | Utilisé en dur `0` (Projects `.chat-tab`/`.zen .canvas` 03:696-701 ; Sidebar status-ring 03:1194)          | n/a                                                                                                      | PARTIEL    | Valeur OK, hors token nommé.                                                                                                                                                         |
| `--oh-radius-xs`   | `4px`                 | `--radius-sm`=4px (Chat 03:97, Projects 03:599, Sidebar 03:954, Nav-popup 03:984)                          | OpenWork natif `~4.3px` reçu au lieu de 4px (04:71) ; Open Design inputs **6px au lieu de 4px** (04:155) | PARTIEL    | **Décalage de nommage** : la marque appelle 4px `radius-xs` ; le code l'appelle `--radius-sm`. Valeur OK code propre ; **cassé dans Open Design** (input 6px, 04:155).               |
| `--oh-radius-sm`   | `6px`                 | **Aucun token = 6px.** L'échelle code propre saute 6px (4→8→12→9999, Chat 03:97-100)                       | OpenWork `~5.8px` natif, OpenCode 6px hardcodés ×8 (04:124)                                              | NON        | **Écart d'échelle** : la marque prescrit un palier 6px (`02:176`) ABSENT du code propre. Le `--radius-sm` du code vaut 4px (≠ 6px prescrit). Confusion de nommage + palier manquant. |
| `--oh-radius-md`   | `8px`                 | `--radius-md`=8px (Chat 03:98, Projects 03:600, Sidebar 03:955, Nav-popup 03:985)                          | OpenWork visait 12px reçoit `~7.2px` natif (04:71) ; Open Design fallback 8px OK par hasard (04:154)     | PARTIEL    | Valeur 8px OK côté code propre ; nommage cohérent avec la marque ici. Apps non alignées.                                                                                             |
| `--oh-radius-lg`   | `12px`                | `--radius-lg`=12px (Chat 03:99, Projects 03:601, Sidebar 03:956, Nav-popup 03:986)                         | OpenWork overlays visent 12px mais natif `--radius-lg≈7.2px` les écrase (04:71,93)                       | PARTIEL    | Valeur OK code propre ; **collision** côté OpenWork (rendu ~7.2px, 04:71).                                                                                                           |
| `--oh-radius-xl`   | `16px`                | **Absent du code** (échelle s'arrête à 12px puis 9999px)                                                   | n/a                                                                                                      | NON        | Palier 16px prescrit (`02:179`) jamais défini ni utilisé dans les vues.                                                                                                              |
| `--oh-radius-full` | `9999px`              | `--radius-full`=9999px (Chat 03:100, Projects 03:602, Sidebar 03:957, Nav-popup 03:987 défini non utilisé) | OpenWork boutons pilule 9999px natif NON corrigé (04:47)                                                 | PARTIEL    | Valeur OK ; mais cercles souvent en `50%` en dur au lieu de `--radius-full` (Chat 03:550, Projects 03:881, Sidebar 03:1203). Nav-popup le définit sans l'utiliser (dead, 03:1681).   |

> **Synthèse radius (CRITIQUE).** L'échelle de marque est `0→4→6→8→12→16→9999`
> (`02:182`). L'échelle réelle du code propre est `0→4→8→12→9999` + `50%` en dur :
> **les paliers 6px et 16px manquent**, et le nommage diffère (marque `radius-xs`
> =4px / `radius-sm`=6px ; code `--radius-sm`=4px, pas de 6px). De plus le radius
> des apps tierces n'est PAS unifié (04:47,124,155). Conformité radius
> **PARTIELLE/NON**.

### B.12 — Ombres

| Token            | Valeur prescrite (02)            | Réel code propre (03)                                             | Réel overrides (04)                                         | Conforme ? | Détail                                                                                                                    |
| ---------------- | -------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| `--oh-shadow-xs` | `0 1px 2px rgba(0,0,0,.04/.20)`  | `--shadow-xs` exact (Chat 03:87, Projects 03:594, Sidebar 03:965) | Open Design définit `--oh-shadow-*` propres (04:136)        | PARTIEL    | Valeur conforme ; nommage `--shadow-*` ≠ `--oh-shadow-*`.                                                                 |
| `--oh-shadow-sm` | `0 2px 8px rgba(0,0,0,.06/.24)`  | `--shadow-sm` exact (Chat 03:88, Projects 03:595, Sidebar 03:966) | n/a                                                         | PARTIEL    | Valeur OK ; **dead token en Sidebar** (défini jamais utilisé, 03:1680).                                                   |
| `--oh-shadow-md` | `0 4px 16px rgba(0,0,0,.08/.28)` | `--shadow-md` exact (Chat 03:89, Projects 03:596, Sidebar 03:967) | n/a                                                         | PARTIEL    | Valeur OK ; **Sidebar `.tooltip` hardcode `0 4px 12px rgba(0,0,0,0.4)` au lieu de `--shadow-md`** (03:1429) ; dead token. |
| `--oh-shadow-lg` | `0 8px 32px rgba(0,0,0,.12/.40)` | `--shadow-lg` exact (Chat 03:90, Projects 03:597, Sidebar 03:968) | Global drag label `0 8px 32px rgba(0,0,0,0.3)` (≈, 03:1555) | PARTIEL    | Valeur conforme ; Global hardcode une variante 0.3 hors token.                                                            |

### B.13 — Transitions / animations

| Token                                   | Valeur prescrite (02)            | Réel code propre (03)                                                    | Réel overrides (04)                                            | Conforme ? | Détail                                                                                |
| --------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `--oh-ease-default`                     | `cubic-bezier(0.4,0,0.2,1)`      | exact (Chat 03:114, Sidebar 03:942, Projects 03:614)                     | Global `--oh-ease-default` exact mais INUTILISÉ (03:1464,1568) | PARTIEL    | Valeur conforme ; Nav-popup utilise `ease` natif ≠ cubic-bezier (03:1439).            |
| `--oh-ease-in`                          | `cubic-bezier(0.4,0,1,1)`        | exact (Chat 03:115, Sidebar 03:943)                                      | Global exact mais inutilisé (03:1465)                          | PARTIEL    | Conforme ; Global dead token.                                                         |
| `--oh-ease-out`                         | `cubic-bezier(0,0,0.2,1)`        | exact (Chat 03:116, Sidebar 03:944)                                      | Global exact mais inutilisé (03:1466)                          | PARTIEL    | Conforme.                                                                             |
| `--oh-ease-spring`                      | `cubic-bezier(0.34,1.56,0.64,1)` | exact (Chat 03:117, Sidebar 03:945)                                      | Global exact mais inutilisé (03:1467)                          | PARTIEL    | **Dead token en Chat** (défini jamais utilisé, 03:1679) et Global.                    |
| `--oh-duration-75`                      | `75ms`                           | exact (Chat 03:118, Sidebar 03:946)                                      | Global exact inutilisé (03:1468)                               | PARTIEL    | Conforme.                                                                             |
| `--oh-duration-150`                     | `150ms`                          | exact (Chat 03:119, Sidebar 03:947)                                      | Global inutilisé (03:1469)                                     | PARTIEL    | Conforme ; contourné par `0.15s` en dur (Chat 03:544).                                |
| `--oh-duration-250`                     | `250ms`                          | exact (Chat 03:121, Sidebar 03:948)                                      | Global inutilisé (03:1470)                                     | PARTIEL    | Conforme.                                                                             |
| `--oh-duration-350`                     | `350ms`                          | exact (Chat 03:122, Sidebar 03:949)                                      | Global inutilisé (03:1471)                                     | PARTIEL    | **Dead token en Chat** (03:1679).                                                     |
| `--oh-duration-500`                     | `500ms`                          | **Absent** ; mais `0.3s`/`0.4s` (=300/400ms) en dur en Projects (03:891) | NON DÉFINI                                                     | NON        | Palier 500ms prescrit (`02:225`) absent ; pire, 300/400ms utilisés en dur sans token. |
| `--oh-duration-200` (hors prescription) | non prescrit                     | DÉFINI en Chat/Projects/Sidebar (03:120,619,950)                         | n/a                                                            | n/a        | Palier 200ms ajouté hors référence (`02` ne liste pas 200ms).                         |

### B.14 — Iconographie

| Critère prescrit (02:238-243)                                                                                | Réel code propre (03)                                                                                            | Réel overrides (04)                              | Conforme ? | Détail                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SVG trait, `viewBox 0 0 24 24`, `fill=none`, `stroke=currentColor`, linecap/join round, stroke-width **2px** | Sidebar/Nav consomment des SVG trait en `currentColor` (03:1153,1173) ; logo `<g stroke>` currentColor (03:1153) | Apps habillées via `currentColor` hérité du teal | PARTIEL    | Style trait/currentColor cohérent côté shell. Le respect fin (viewBox 24, stroke 2 sur CHAQUE icône utilisée) n'est pas re-vérifié dans 03 (l'inventaire `02:242` confirme 33/33 SVG conformes côté set de marque). Statuts SVG hardcodent le teal en data-URI (`%2314B8A6`, 03:1016) hors `currentColor`. |
| Tailles 18px (composants) / 24px (sidebar)                                                                   | NON capturé finement par l'inventaire 03                                                                         | n/a                                              | A VÉRIFIER | Dimensions d'affichage non relevées token par token.                                                                                                                                                                                                                                                       |

---

## RÉSULTAT

### Score partie A

**A = 6,5 / 10.** La marque est clairement perceptible dans le shell (teal
unique conforme partout, zéro couleur par outil, zéro violet, fond sombre par
défaut, SF Pro + logo OpenHub, animations homogènes) mais inégalement tenue à
la jonction shell↔apps (radius natif hétérogène, typo IBM Plex conservée,
ruptures du thème clair) et fragilisée sous le capot (4 systèmes de tokens
parallèles, bugs d'erreur en light, 3 palettes "type" incohérentes). Un nouveau
venu comprend l'idée de hub unifié, mais la couture reste visible — encore loin
du "montrable sans s'excuser du look" (`01:110`).

### Conformité du design system (comptage par token)

Décompte sur les **lignes de tokens explicitement prescrites par `02`** et
auditées ci-dessus (catégories B.1 → B.14). "Conforme" = OUI (valeur ET
exigence respectées) ; PARTIEL et NON sont comptés séparément.

| Catégorie           | OUI   | PARTIEL | NON               | Tokens audités         |
| ------------------- | ----- | ------- | ----------------- | ---------------------- |
| Fonds (B.1)         | 0     | 5       | 0                 | 5                      |
| Bordures (B.2)      | 0     | 3       | 0                 | 3                      |
| Texte (B.3)         | 0     | 4       | 0                 | 4                      |
| Accent (B.4)        | 0     | 5       | 0                 | 5                      |
| Sémantiques (B.5)   | 2     | 1       | 1                 | 4                      |
| Annexes (B.6)       | 1     | 3       | 1                 | 5                      |
| Supprimés v2 (B.7)  | 3     | 0       | 0                 | 3                      |
| Typo familles (B.8) | 0     | 2       | 1                 | 3                      |
| Typo échelle (B.9)  | 0     | 0       | 2                 | 2                      |
| Espacements (B.10)  | 0     | 1       | 0 (+1 à vérifier) | 2                      |
| Radius (B.11)       | 0     | 4       | 3                 | 7                      |
| Ombres (B.12)       | 0     | 4       | 0                 | 4                      |
| Transitions (B.13)  | 0     | 8       | 1                 | 9                      |
| Iconographie (B.14) | 0     | 1       | 0 (+1 à vérifier) | 2                      |
| **TOTAL**           | **9** | **41**  | **10**            | **58** (+2 à vérifier) |

**Tokens pleinement conformes : 9 / 58** (toutes catégories), soit **~16 %**
strictement conformes. Si l'on tolère le décalage de NOMMAGE `--oh-*` (valeur
correcte mais préfixe non canonique), alors **valeur correcte = 9 OUI + 41
PARTIEL = 50 / 58 (~86 %)**, et **réellement non conformes = 10 / 58 (~17 %)**.

> Lecture : **la palette de VALEURS est presque toujours bonne** (teal, neutres,
> ombres, easings identiques aux prescriptions) ; ce qui pèche est (1) le
> **contrat de nommage** `--oh-*` respecté par une seule vue sur cinq, (2)
> l'**échelle typographique** jamais tokenisée, (3) l'**échelle radius**
> incomplète (paliers 6px et 16px manquants) et non unifiée sur les apps.

### Les 3 écarts majeurs

1. **Échelle typographique tokenisée totalement absente (B.9 — NON).**
   La référence prescrit 11 rôles texte/heading + 4 rôles mono nommés
   (`--oh-font-text-xs` … `display-md`, `02:117-139`). AUCUN token typo n'existe
   dans le code : toutes les tailles/graisses sont en dur, hors échelle
   (Chat 9.5→20px dont 12.5px/9.5px en JS, 03:354,546 ; Projects 9→18px,
   03:764 ; Sidebar/Nav 11→24px, 03:1275). Impact : pas de rythme typographique
   garanti, dérive inévitable entre vues. Contredit "Rien n'est laissé au
   hasard" (`01:50`).

2. **Échelle de border-radius incomplète et non unifiée (B.11 — NON/PARTIEL).**
   La marque exige `0→4→6→8→12→16→9999` (`02:182`). Le code propre n'implémente
   que `0→4→8→12→9999` (+ `50%` en dur) : **paliers 6px et 16px manquants**, et
   le nommage est décalé (marque `radius-sm`=6px ≠ code `--radius-sm`=4px). Pire,
   le radius des apps tierces n'est pas ramené à l'échelle : OpenWork garde
   cartes 24px et boutons pilule (04:47), Open Design rend ses inputs en 6px au
   lieu de 4px (04:155), OpenCode reste anguleux (04:124). Résultat visible :
   arrondis hétérogènes d'un slot à l'autre, contraire à "l'unité par la forme"
   (`01:225`).

3. **Fragmentation du système de tokens — contrat `--oh-*` non respecté
   (B.1-B.13, transversal).** Un seul fichier (`sidebar.html`) porte le préfixe
   canonique `--oh-*` (03:17). Chat et Projects dupliquent la charte sous `--*`
   court (03:527,879), Nav-popup sous un schéma ultra-court (03:1421, CRITIQUE),
   le Global ne tokenise que l'animation et hardcode les couleurs en 2 nuances
   de teal (03:1572). Quatre sources de vérité pour une charte unique → bugs
   réels déjà présents (`--error` inexistant → erreur fausse en light, 03:1423 ;
   ruptures du thème clair dans OpenWork/Open Design, 04:70,152). Contredit
   directement le pilier _Unité_ (`01:149`).
