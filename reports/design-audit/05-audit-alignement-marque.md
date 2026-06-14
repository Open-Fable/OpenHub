# 05 — Audit d'alignement de marque OpenHub (document maître, Phase 5)

> **Objet** : confronter l'UI RÉELLE (documents `03` code propre + `04` overrides)
> à l'ADN de marque (`01`) et au design system de référence (`02`). Ce document
> est autonome : il regroupe au complet les sections A, B (perception de marque +
> conformité du design system), C (cohérence interne entre nos vues) et D
> (cohérence inter-apps).
>
> Méthode : aucune valeur inventée. Chaque affirmation renvoie à un document
> source et à un `fichier:ligne`. Toute valeur absente est notée `NON DÉFINI`.
> Aucun fichier source n'a été modifié.
>
> Direction artistique senior. Date : 2026-06-14.

---

## Scores Phase 5

| Axe d'évaluation                | Score                                                                                                                                      | Source                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| **Perception de la marque (A)** | **6,5 / 10**                                                                                                                               | `05-part-AB.md:148,331` |
| **Conformité au design system** | **9 / 58 tokens strictement conformes (~16 %)** ; valeur correcte (OUI+PARTIEL) = 50/58 (~86 %) ; réellement non conformes = 10/58 (~17 %) | `05-part-AB.md:362-367` |
| **Cohérence interne (C)**       | **3,5 / 10**                                                                                                                               | `05-part-C.md:235,271`  |
| **Unification inter-apps (D)**  | **6,5 / 10**                                                                                                                               | `05-part-D.md:165,200`  |

**Synthèse (5 lignes).** OpenHub réussit ce qui se voit le plus — l'accent teal
`#14b8a6`/`#0d9488` est conforme et identique partout (shell + 3 apps), zéro
couleur par outil, zéro violet, fond sombre `#0a0a0a` par défaut — d'où une
perception de marque et une unification inter-apps honorables (6,5/10 chacune).
Mais l'unité tient « par recopie » et non « par construction » : quatre systèmes
de tokens parallèles (3 conventions de nommage), aucune échelle typographique
tokenisée, une échelle radius incomplète (paliers 6px et 16px manquants) et non
imposée aux apps tierces. Ces fractures produisent des bugs réels (`--error`
inexistant → erreur fausse en mode clair, ruptures du thème clair OpenWork/Open
Design) et une couture shell↔apps visible (radius pilule/24-32px et typo IBM
Plex dans OpenWork). La cohérence interne, plombée par cette fragmentation et la
réintroduction de couleurs par-type dans Chat, tombe à 3,5/10. Le socle de
marque existe ; la plomberie des tokens et la géométrie restent à unifier.

---

# Partie A — La marque est-elle perceptible dans l'UI ?

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

# Partie B — Le design system est-il respecté ?

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

## RÉSULTAT (parties A & B)

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

---

# Partie C — Cohérence interne entre nos vues

> **Objet** : auditer la cohérence visuelle entre les **5 vues codées par nous**
> (Chat, Orchestrateur/Projects, Sidebar, Nav-popup, et accessoirement le panneau
> Settings qui vit DANS `sidebar.html`). C'est le problème central signalé par le
> commanditaire : ces vues doivent former une enveloppe unique (valeur de marque
> « Unité sans uniformité » — `plateforme_de_marque.md:39-43`, critère F-14 de
> `01-adn-marque.md`).
>
> **Méthode** : valeurs EXACTES + `fichier:ligne` issues de l'inventaire Phase 3
> (`03-inv-chat.md`, `03-inv-projects.md`, `03-inv-sidebar-nav.md`) et du
> référentiel Phase 2 (`02-design-system-reference.md`). Faits sensibles
> re-vérifiés directement dans le source. Aucune valeur inventée.
>
> Auteur : direction artistique senior. Date : 2026-06-14.

---

## Préambule — la racine de toutes les divergences

Les 4 vues NE PARTAGENT AUCUN fichier de tokens. Chacune redéfinit sa propre
palette dans un `:root` local, avec **trois conventions de nommage différentes** :

| Vue                    | Fichier                          | Préfixe de tokens                                                               | Référence            |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------- | -------------------- |
| Sidebar (+ Settings)   | `electron/sidebar.html`          | `--oh-color-*` (couleurs) + `--radius-*`/`--space-*`/`--shadow-*` (utilitaires) | sidebar.html:21-82   |
| Chat                   | `electron/chat.html`             | `--*` court (ex. `--accent-primary`, `--bg-deepest`)                            | chat.html:21-64      |
| Orchestrateur/Projects | `electron/projects/projects.css` | `--*` court (identique à Chat)                                                  | projects.css:10-69   |
| Nav-popup              | `electron/nav-popup.html`        | `--*` ultra-court non sémantique (`--bg`, `--text`, `--accent`)                 | nav-popup.html:17-29 |

**Seule la Sidebar utilise le système canonique `--oh-*`** décrit dans
`02-design-system-reference.md`. Les trois autres vues le dupliquent sous d'autres
noms. La bonne nouvelle : **les VALEURS hex coïncident dans l'immense majorité des
cas** (la charte est respectée). La mauvaise : **quatre sources de vérité** pour la
même charte → toute évolution doit être répliquée 4 fois, et la dérive est déjà
mesurable (voir tableau et divergences).

---

## C. Cohérence interne entre nos vues

Légende des cellules : valeur réelle (`fichier:ligne`). « — » = non applicable /
composant absent de la vue. Colonne « Cohérent ? » : **oui** si les 4 vues
concernées s'alignent (valeur identique, même si le nom du token diffère),
**non** sinon, **partiel** si l'écart est cosmétique/mineur.

### C.1 Border-radius

| Propriété              | Chat                                                                                                                                                                                                         | Orchestrateur/Projects                                                                                                                                  | Sidebar                                                                                                  | Nav-popup                                          | Cohérent ?                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| radius boutons         | `--radius-md`=8px (`.btn-back`, `.btn-icon`, `chat.html:830,951`) **et** `--radius-full`=9999px (`.btn-send`, `.hub-btn-ghost`, `chat.html:1687,629`) **et** `--radius-sm`=4px (`.oh-btn`, `chat.html:1915`) | `--radius-sm`=4px (boutons fins) / `--radius-md`=8px (`.btn`, projects.css:39) ; pas de bouton pilule                                                   | `--radius-md`=8px (`.btn-update`,`.btn-confirm-*`, sidebar.html:1117,1298,1309)                          | `.item` `--radius-md`=8px (nav-popup.html:70)      | **non** (Chat seul a des boutons-pilule 9999px ; échelle bouton à 3 valeurs en Chat)                                |
| radius cards           | `--radius-lg`=12px (`.p-card`,`.artifact-card`,`.msg-bubble`, chat.html:373,1366,1198)                                                                                                                       | `--radius-lg`=12px (node-card, template-card, modal-dialog, projects.css:40)                                                                            | `--radius-lg`=12px (`.config-card`,`.settings-group-card`,`.cache-stat-card`, sidebar.html:584,760,1210) | `.card` `--radius-lg`=12px (nav-popup.html:58)     | **oui** (12px partout)                                                                                              |
| radius inputs          | `--radius-sm`=4px (`.oh-modal-field input`, chat.html:2427) ; `--radius-lg`=12px sur `.conv-search`/`.instructions-textarea` (chat.html:972,793)                                                             | `--radius-md`=8px (`.form-input`,`.form-select`, projects.css implicite §) ; `--radius-sm` sur petits inputs canvas                                     | `--radius-md`=8px (`.form-input`,`.form-select`, sidebar.html:845,870)                                   | — (pas d'input)                                    | **non** (Chat mélange 4px et 12px ; Projects/Sidebar à 8px)                                                         |
| radius cercles/avatars | `50%` hardcodé (`.msg-avatar`,`.status-dot`,`.attach-remove`, chat.html:1170,2180,1813)                                                                                                                      | `50%` hardcodé (`.wf-dot`,`.chat-send-btn`,`.confirm-icon`, projects.css:201,449,1915) **+** `var(--radius-full)` sur `.status-dot` (projects.css:1046) | `50%` hardcodé (`.status-ring`,`.switch-slider::before`, sidebar.html:391,824)                           | —                                                  | **non** (convention `50%` vs `--radius-full` mélangée DANS Chat et Projects)                                        |
| Échelle radius définie | sm4 / md8 / lg12 / full9999 (chat.html:49-52)                                                                                                                                                                | sm4 / md8 / lg12 / full9999 (projects.css:38-41)                                                                                                        | sm4 / md8 / lg12 / full9999 (sidebar.html:63-66)                                                         | sm4 / md8 / lg12 / full9999 (nav-popup.html:26-29) | **oui** (échelle identique, conforme `design_system.md §5`, mais `xs`=4px-vs-prescrit et `xl`=16px absents partout) |

> Note d'écart au référentiel : `design_system.md §5` prescrit `0 → 4 → 6 → 8 → 12
→ 16 → 9999`. **Aucune** de nos 4 vues ne définit `--radius-xs`(4) / le 6px / `--radius-xl`(16).
> Le `--radius-sm` local vaut 4px partout (= le `xs` prescrit), donc le palier 6px
> (`--radius-sm` prescrit, usage inputs) est absent de toutes nos vues : un léger
> décalage commun au référentiel mais cohérent ENTRE vues.

### C.2 Couleur de fond

| Propriété             | Chat                                                   | Orchestrateur/Projects                                    | Sidebar                                                            | Nav-popup                                            | Cohérent ?                                                                                                        |
| --------------------- | ------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| fond deepest (racine) | `--bg-deepest` `#0a0a0a`/`#ffffff` (chat.html:21/:74)  | `--bg-deepest` `#0a0a0a`/`#ffffff` (projects.css:10/:67)  | `--oh-color-bg-deepest` `#0a0a0a`/`#ffffff` (sidebar.html:21/:90)  | `--bg` `#111111`/`#ffffff` (nav-popup.html:17/:34)   | **non** (Nav-popup dark = `#111111` = niveau « overlay », PAS `#0a0a0a` ; valeur de fond différente des 3 autres) |
| fond panel            | `--bg-panel` `#141414`/`#f7f7f7` (chat.html:22/:75)    | `--bg-panel` `#141414`/`#f7f7f7` (projects.css:11/:68)    | `--oh-color-bg-panel` `#141414`/`#f7f7f7` (sidebar.html:22/:91)    | (pas de panel distinct)                              | **oui** (3 vues identiques)                                                                                       |
| fond surface          | `--bg-surface` `#1e1e1e`/`#efefef` (chat.html:23/:76)  | `--bg-surface` `#1e1e1e`/`#efefef` (projects.css:12/:69)  | `--oh-color-bg-surface` `#1e1e1e`/`#efefef` (sidebar.html:23/:92)  | —                                                    | **oui**                                                                                                           |
| fond elevated         | `--bg-elevated` `#282828`/`#ffffff` (chat.html:24/:77) | `--bg-elevated` `#282828`/`#ffffff` (projects.css:13/:70) | `--oh-color-bg-elevated` `#282828`/`#ffffff` (sidebar.html:24/:93) | `.card` utilise `--bg`=`#111111` (nav-popup.html:56) | **partiel** (3 vues OK ; le « élevé » du Nav-popup = `#111111`, ni `#282828` ni `#0a0a0a`)                        |

> Le Nav-popup est un menu flottant (élément ÉLEVÉ). Sa surface dark `#111111`
> correspond au token `--oh-color-bg-overlay` (`#111111`, sidebar.html:25), ce qui
> est sémantiquement DÉFENDABLE pour un dropdown. Mais il n'utilise aucune des
> 5 surfaces canoniques nommées : il invente `--bg` à `#111111`. Résultat : un
> dropdown plus clair que le fond racine `#0a0a0a` des autres vues — choix non
> tracé dans la charte (le référentiel prescrit `bg-overlay #111111` pour les
> dropdowns, donc la valeur est correcte, seul le nommage diverge).

### C.3 Couleur de texte

| Propriété                | Chat                                                                                                                          | Orchestrateur/Projects                                       | Sidebar                                                                | Nav-popup                                                  | Cohérent ?                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| texte primaire           | `--text-primary` `#ececec`/`#111111` (chat.html:29/:82)                                                                       | `--text-primary` `#ececec`/`#111111` (projects.css:18/:75)   | `--oh-color-text-primary` `#ececec`/`#111111` (sidebar.html:31/:100)   | `--text` `#ececec`/`#111111` (nav-popup.html:19/:36)       | **oui** (valeurs identiques)                                                        |
| texte secondaire         | `--text-secondary` `#999999`/`#555555` (chat.html:30/:83)                                                                     | `--text-secondary` `#999999`/`#555555` (projects.css:19/:76) | `--oh-color-text-secondary` `#999999`/`#555555` (sidebar.html:32/:101) | `--text-sec` `#999999`/`#555555` (nav-popup.html:20/:37)   | **oui**                                                                             |
| texte muted              | `--text-muted` `#666666`/`#888888` (chat.html:31/:84)                                                                         | `--text-muted` `#666666`/`#888888` (projects.css:20/:77)     | `--oh-color-text-muted` `#666666`/`#888888` (sidebar.html:33/:102)     | `--text-muted` `#666666`/`#888888` (nav-popup.html:21/:38) | **oui**                                                                             |
| texte disabled           | `--text-disabled` `#444444`/`#bbbbbb` (chat.html:32/:85)                                                                      | `--text-disabled` `#444444`/`#bbbbbb` (projects.css:21/:78)  | `--oh-color-text-disabled` `#444444`/`#bbbbbb` (sidebar.html:34/:103)  | — (non défini)                                             | **partiel** (3 vues OK ; absent du Nav-popup, qui n'en a pas besoin)                |
| variables texte fantômes | `var(--text-base)` (chat.html:1622) + `var(--text-strong)` (chat.html:1631) **NON DÉFINIES** → fallback navigateur (bug réel) | —                                                            | —                                                                      | —                                                          | **non** (Chat référence 2 tokens inexistants → couleur de menu « + » non maîtrisée) |

### C.4 Couleur d'accent

| Propriété                      | Chat                                                                                                  | Orchestrateur/Projects                                       | Sidebar                                                                | Nav-popup                                                                          | Cohérent ?                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| accent primaire                | `--accent-primary` `#14b8a6`/`#0d9488` (chat.html:33/:86)                                             | `--accent-primary` `#14b8a6`/`#0d9488` (projects.css:22/:79) | `--oh-color-accent-primary` `#14b8a6`/`#0d9488` (sidebar.html:36/:105) | `--accent` `#14b8a6`/`#0d9488` (nav-popup.html:22/:39)                             | **oui** (teal canonique conforme `LOGO.md:50-51`)                                                        |
| accent hover                   | `--accent-hover` `#2dd4bf`/`#0f766e` (chat.html:34/:87)                                               | `--accent-hover` `#2dd4bf`/`#0f766e` (projects.css:23/:80)   | `--oh-color-accent-hover` `#2dd4bf`/`#0f766e` (sidebar.html:37/:106)   | — (pas d'état hover accent)                                                        | **oui** (3 vues identiques)                                                                              |
| accent active                  | `--accent-active` `#0d9488`/`#115e59` (chat.html:35/:88)                                              | `--accent-active` `#0d9488`/`#115e59` (projects.css:24/:81)  | `--oh-color-accent-active` `#0d9488`/`#115e59` (sidebar.html:38/:107)  | —                                                                                  | **oui**                                                                                                  |
| accent subtle (fond actif)     | `--accent-subtle` `rgba(20,184,166,.1)`/`rgba(13,148,136,.06)` (chat.html:36/:89)                     | idem (projects.css:25/:82)                                   | `--oh-color-accent-subtle` idem (sidebar.html:39/:108)                 | `--active-bg` `rgba(20,184,166,.1)`/`rgba(13,148,136,.08)` (nav-popup.html:23/:40) | **partiel** (dark identique ; **light diverge** : Nav-popup `.08` vs `.06` des 3 autres)                 |
| accent par-outil (interdit v2) | `HUB_TYPE_COLORS`/`HUB_FILTER_TYPES`/`PROJ_COLORS` (chat.html:6119-6145, 3312-3321) couleurs par type | champ `color` hex par template (modals.js:140-327) non rendu | absent                                                                 | absent                                                                             | **non** (Chat réintroduit des palettes par-type, contraire à `LOGO.md:22` / `brand_colors.json:328-329`) |

### C.5 Texte-sur-accent (couleur du label sur bouton teal) — DIVERGENCE NETTE

| Propriété                      | Chat                                                            | Orchestrateur/Projects                                                                 | Sidebar                                                                       | Nav-popup | Cohérent ? |
| ------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------- | ---------- |
| texte sur bouton primaire teal | `#fff` (`.btn-send`, chat.html:1690 ; `.oh-btn-primary`, :1927) | `var(--bg-deepest)` (`.btn--primary`, projects.css:1164 ; `.chat-send-btn`, :452)      | `#fff` (`.btn-update.primary`, sidebar.html:1135 ; `.btn-confirm-yes`, :1299) | —         | **non**    |
| texte sur bouton danger        | `#fff` (chat.html:651)                                          | `#fff` (`.btn--danger`, projects.css:1192) **mais** aussi `var(--bg-deepest)` ailleurs | `#fff` (`.btn-confirm-yes` = error bg, sidebar.html:1299)                     | —         | **non**    |

> **Divergence de fond, pas seulement cosmétique.** Chat et Sidebar écrivent le
> label en **blanc pur `#fff`** ; Projects écrit son bouton PRIMAIRE en
> **`var(--bg-deepest)`** (= `#0a0a0a` en dark, `#ffffff` en light) — donc en LIGHT
> mode, le label du bouton primaire teal de Projects est BLANC (`#ffffff`) sur teal
> `#0d9488` (contraste faible), tandis que le même bouton en Chat/Sidebar reste
> `#fff`. Et Projects se contredit lui-même : `.btn--danger` repasse en `#fff`
> (projects.css:1192). **Aucune vue ne dispose d'un token `--*-text-on-accent`.**
> Le référentiel n'en prescrit pas non plus (manque commun), mais l'absence crée
> deux conventions opposées entre vues + une incohérence light/dark dans Projects.

### C.6 Typographie

| Propriété                          | Chat                                                                                                     | Orchestrateur/Projects                                                                                                                  | Sidebar                                                                                                          | Nav-popup                                                                                     | Cohérent ?                                                                                                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| font-family corps (ordre du stack) | `--font-sans` = `"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif` (chat.html:53) | `--font-sans` = `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` (projects.css:50-52) | `--font` = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif` (sidebar.html:61-62) | `--font` = `-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif` (nav-popup.html:25) | **non** (4 stacks DIFFÉRENTS : Chat & Projects priorisent `"SF Pro Text"` ; Sidebar & Nav-popup priorisent `-apple-system` ; fallbacks `system-ui`/`Helvetica Neue` incohérents) |
| nom du token police                | `--font-sans` / `--font-display` / `--font-mono`                                                         | `--font-sans` / `--font-display` / `--font-mono`                                                                                        | `--font` / `--font-mono` (PAS de `--font-display`)                                                               | `--font` (mono absent)                                                                        | **non** (3 schémas de nommage)                                                                                                                                                   |
| police mono                        | `"SF Mono", "Fira Code", ui-monospace, Menlo, monospace` (chat.html:55)                                  | `"SF Mono", Menlo, ui-monospace, monospace` (projects.css:55)                                                                           | `"SF Mono", "Monaco", "Menlo", monospace` (sidebar.html:84)                                                      | (non défini)                                                                                  | **non** (3 stacks mono distincts : `Fira Code` vs `Monaco` vs ni l'un ni l'autre)                                                                                                |
| font-size body                     | 14px (`html,body`, chat.html:125)                                                                        | non défini sur body (hérité ; tailles posées par composant, projects.css:101)                                                           | non défini sur body (sidebar.html, hérité)                                                                       | non défini sur body (nav-popup, hérité)                                                       | **partiel** (seul Chat fixe 14px ; les 3 autres ne posent pas de base → la taille de référence prescrite de 14px (`typography.json:185`) n'est garantie qu'en Chat)              |
| échelle de tailles utilisée        | 9.5,10,11,12,12.5,13,14,15,17,20 px + `0.9em` (chat.html, §typo)                                         | 9,10,11,12,13,14,15,17,18 px (projects.css, §typo)                                                                                      | 11,12,13,17,24 px (sidebar.html, §typo)                                                                          | 11,13 px (nav-popup, §typo)                                                                   | **non** (4 échelles ad-hoc, valeurs « cassées » 9px, 9.5px, 12.5px ; aucune ne mappe les tokens `--oh-font-*` du référentiel)                                                    |
| tokens typo nommés                 | aucun (tailles en dur)                                                                                   | aucun (tailles en dur)                                                                                                                  | aucun (tailles en dur)                                                                                           | aucun                                                                                         | **non** (les 12 rôles `--oh-font-text-*`/`--oh-font-heading-*` de `typography.json` ne sont implémentés NULLE PART)                                                              |

### C.7 Padding / rythme (grille 8px)

| Propriété                | Chat                                                                  | Orchestrateur/Projects                                                                     | Sidebar                                                                                                              | Nav-popup                                                                 | Cohérent ?                                                                                                    |
| ------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| tokens d'espacement      | aucun token `--space-*` (tout en px brut)                             | `--space-0..8` définis (projects.css:42-49) **mais** très souvent contournés par px bruts  | `--space-1..8` définis (sidebar.html:68-74), largement utilisés + nombreux px bruts coexistants                      | aucun token (px bruts, ex. `.item` padding `8px 12px`, nav-popup.html:68) | **non** (2 vues sans tokens space, 2 avec mais inconstamment)                                                 |
| padding de carte/section | `.p-card` 14px (chat.html:372) ; `.msg-bubble` 12px 16px (:1197)      | `.node-card` `var(--space-3)`=12px (projects.css:889) ; mgmt en px bruts 20px 24px (:2237) | `.cache-stat-card` `var(--space-4)`=16px (sidebar.html:1211) ; `.setting-row` `var(--space-3) var(--space-4)` (:769) | `.card` 4px (nav-popup.html:59)                                           | **non** (paddings de conteneurs hétérogènes : 14px vs 12px vs 16px ; valeur 14px de Chat est hors grille 8px) |
| respect grille 8px       | partiel : 14px,10px,7px,5px,18px hors grille (chat.html §espacements) | partiel : 11px,7px,6px,3px,2px hors grille (projects.css §espacements)                     | partiel : 5px,6px,7px,1px,2px hors grille (sidebar.html §espacements)                                                | `8px 12px`,`10px`,`4px` (nav-popup) — 10px hors grille                    | **non** (toutes les vues violent la grille 8px « non négociable » de `manifesto.md:52`, chacune à sa façon)   |

### C.8 États de survol (hover)

| Propriété                  | Chat                                                   | Orchestrateur/Projects                       | Sidebar                                                                                                                   | Nav-popup                                                                      | Cohérent ?                                                                                                                               |
| -------------------------- | ------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| token de fond hover neutre | aucun (`--accent-subtle` ou bg-surface au cas par cas) | aucun (bg-surface/bg-overlay au cas par cas) | aucun token : `rgba(255,255,255,.05)` dark / `rgba(0,0,0,.03~.04)` light **hardcodés** (sidebar.html:273,283,362,495,500) | `--hover-bg` `rgba(255,255,255,.05)`/`rgba(0,0,0,.04)` (nav-popup.html:24/:41) | **non** (seul Nav-popup isole un token `--hover-bg` ; Sidebar code la MÊME valeur en dur ; Chat/Projects n'ont pas de convention unique) |
| hover bouton accent        | `--accent-hover` (chat.html:1706)                      | `--accent-hover` (projects.css implicite)    | `--oh-color-accent-hover` (sidebar.html:1137)                                                                             | —                                                                              | **oui** (sur l'accent, cohérent)                                                                                                         |

### C.9 États de focus

| Propriété    | Chat                                                                                   | Orchestrateur/Projects                                                                    | Sidebar                                                                                                                                          | Nav-popup                                           | Cohérent ?                                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| focus global | `outline: 2px solid var(--accent-primary)` + `outline-offset: 2px` (chat.html:140-141) | `outline: 2px solid var(--accent-primary)` + `outline-offset: 2px` (projects.css:137-138) | `.slot-btn` `outline: 1px solid` (sidebar.html:288) ; `.config-tab` `2px` `offset:-2px` (:651-652) ; inputs `box-shadow 0 0 0 3px subtle` (:859) | **AUCUN état focus** (grep négatif, nav-popup.html) | **non** (Chat/Projects = 2px outline +2px ; Sidebar mélange 1px / 2px offset négatif / ring 3px ; Nav-popup n'a pas de focus du tout — problème d'accessibilité) |

> Le référentiel prescrit : « focus = outline instantané 2px `accent-primary` »
> (`design_system.md §7.3`, cf. `02-design-system-reference.md:228`). **Seuls Chat et
> Projects** s'y conforment. La Sidebar dévie (1px sur les slots, ring box-shadow sur
> les inputs) et le Nav-popup l'OMET entièrement.

### C.10 Transitions (durée / easing)

| Propriété              | Chat                                                        | Orchestrateur/Projects                                                   | Sidebar                                                        | Nav-popup                                                                  | Cohérent ?                                                                                                    |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| easing standard        | `--ease-default` `cubic-bezier(0.4,0,0.2,1)` (chat.html:56) | `--ease-default` `cubic-bezier(0.4,0,0.2,1)` (projects.css:56)           | `--ease-default` `cubic-bezier(0.4,0,0.2,1)` (sidebar.html:50) | `ease` natif hardcodé (`.item` transition `150ms ease`, nav-popup.html:77) | **non** (Nav-popup utilise `ease` natif, pas la cubic-bezier ; les 3 autres alignés)                          |
| durée standard         | `--duration-150`=150ms (chat.html:61)                       | `--duration-150`=150ms (projects.css:60)                                 | `--duration-150`=150ms (sidebar.html:56)                       | `150ms` hardcodé (nav-popup.html:77)                                       | **partiel** (même valeur 150ms partout, mais Nav-popup en dur sans token)                                     |
| durées hors échelle    | `0.15s`,`200ms`,`300ms` hardcodés (chat.html:526,1775,2016) | `0.3s`,`0.4s` hardcodés (panneaux/canvas, projects.css:309,343,536,1094) | — (utilise les tokens)                                         | `150ms` hardcodé                                                           | **non** (Chat & Projects introduisent des durées hors token `0.3s`/`0.4s`/`300ms` que l'échelle ne nomme pas) |
| `--ease-spring` défini | oui (chat.html:59) mais jamais utilisé                      | non défini                                                               | oui (sidebar.html:53)                                          | non                                                                        | **non** (présence du token spring incohérente)                                                                |

### C.11 Ombres

| Propriété                | Chat                                                                                  | Orchestrateur/Projects                      | Sidebar                                                                                                                       | Nav-popup                            | Cohérent ?                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| échelle d'ombres définie | `--shadow-xs/sm/md/lg` (chat.html:44-47)                                              | `--shadow-xs/sm/md/lg` (projects.css:33-36) | `--shadow-xs/sm/md/lg` (sidebar.html:78-81)                                                                                   | **aucune ombre définie** (nav-popup) | **partiel** (valeurs identiques dans 3 vues ; Nav-popup n'a aucune ombre alors que c'est un menu FLOTTANT — manque une `--shadow-sm/md`) |
| valeurs d'ombre          | xs `0 1px 2px rgba(0,0,0,.2)` dark … lg `0 8px 32px rgba(0,0,0,.4)` (chat.html:44-47) | identiques (projects.css:33-36)             | identiques (sidebar.html:78-81)                                                                                               | —                                    | **oui** (les 3 vues qui en ont sont alignées)                                                                                            |
| usage réel des tokens    | xs/sm/md/lg tous utilisés (chat.html §ombres)                                         | xs/md/lg utilisés (projects.css §ombres)    | seulement xs (1×) + lg (1×) ; sm/md = dead tokens ; `.tooltip` ombre hardcodée `0 4px 12px rgba(0,0,0,.4)` (sidebar.html:438) | aucune                               | **non** (Sidebar laisse 2 tokens d'ombre morts et code une ombre ad-hoc ; Nav-popup sans ombre)                                          |

### C.12 Nommage des tokens (préfixe)

| Propriété                    | Chat                                                 | Orchestrateur/Projects                                                                                                                      | Sidebar                                                                                                                                                                                                                     | Nav-popup                    | Cohérent ?                                                                                                       |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| préfixe couleurs             | `--accent-primary`, `--bg-deepest`, `--text-primary` | identique à Chat                                                                                                                            | `--oh-color-accent-primary`, `--oh-color-bg-deepest`, `--oh-color-text-primary`                                                                                                                                             | `--accent`, `--bg`, `--text` | **non** (3 conventions ; seule la Sidebar suit le canon `--oh-color-*` de `design_system.md §11.2`)              |
| token erreur référencé en JS | `var(--error)` (défini ici, chat.html:42) → OK       | `var(--error, #ef4444)` (défini dans projects.css:31/:88) → se résout (PAS un bug) ; reste une incohérence de NOMMAGE vs `--oh-color-error` | `var(--error, #ef4444)` (sidebar.html:2849,2854,2865) → **`--error` NON DÉFINI** (le token réel est `--oh-color-error`) → fallback `#ef4444` ; en LIGHT mode bordure d'erreur `#ef4444` au lieu de `#dc2626` = **bug réel** | —                            | **non** (le même nom `--error` est valide en Chat/Projects mais cassé en Sidebar → bug light + dette de nommage) |

---

## Synthèse des divergences (priorisées)

### CRITIQUE (rompt l'unité de marque ou casse le rendu)

1. **4 systèmes de tokens parallèles, 3 conventions de nommage**
   (`--oh-*` Sidebar / `--*` Chat+Projects / `--bg`/`--text` Nav-popup). Racine de
   toute la dette : 4 sources de vérité pour une charte unique. (préambule + C.12)
2. **Bug `--error` non défini dans le JS de la Sidebar** (sidebar.html:2849,2854, 2865) → bordure d'erreur fausse en mode clair (`#ef4444` au lieu de `#dc2626`).
   (fait vérifié) (C.12)
3. **Variables `--text-base` / `--text-strong` fantômes dans Chat**
   (chat.html:1622,1631) → couleur du menu « + » livrée au fallback navigateur.
   (fait vérifié) (C.3)
4. **font-family : 4 stacks différents** (ordre `"SF Pro Text"`-first vs
   `-apple-system`-first ; mono `Fira Code` vs `Monaco` vs absent). La police de
   base — l'élément le plus visible de l'unité — n'est pas la même selon la vue.
   (C.6)
5. **Texte-sur-accent incohérent** : `#fff` (Chat, Sidebar) vs `var(--bg-deepest)`
   (Projects, qui se contredit lui-même), avec impact contraste en mode clair, et
   réintroduction de **couleurs par-outil dans Chat** (interdit v2, `LOGO.md:22`).
   (C.4, C.5)

### HAUTE (incohérence visible mais sans casse fonctionnelle)

6. **Focus states divergents** : 2px (Chat/Projects) vs 1px/ring (Sidebar) vs
   **aucun focus** (Nav-popup → accessibilité). (C.9)
7. **Radius boutons/inputs non aligné** : Chat a des boutons-pilule (9999px) et des
   inputs à 4px ET 12px ; Projects/Sidebar à 8px. (C.1)
8. **Fond du Nav-popup `#111111`** au lieu de `#0a0a0a` : dropdown plus clair que
   le fond racine des autres vues (valeur défendable pour un overlay mais nommage
   et palier hors des surfaces canoniques). (C.2)
9. **Cercles : `50%` vs `--radius-full`** mélangés à l'intérieur même de Chat et de
   Projects. (C.1)

### MOYENNE (cohérence d'implémentation / maintenabilité)

10. **Grille 8px violée partout** (14px, 10px, 7px, 11px, 9px…), chaque vue à sa
    manière ; tokens `--space-*` absents en Chat et Nav-popup. (C.7)
11. **Aucun token typographique** (`--oh-font-*` du référentiel implémenté nulle
    part) ; échelles de tailles ad-hoc avec valeurs cassées (9px, 9.5px, 12.5px).
    (C.6)
12. **Easing/durées du Nav-popup hardcodés** (`150ms ease` natif au lieu de la
    cubic-bezier) ; durées hors échelle (`0.3s`/`0.4s`) en Chat et Projects. (C.10)
13. **light-mode `--accent-subtle` du Nav-popup = `.08`** vs `.06` des 3 autres
    (micro-divergence d'opacité du fond actif). (C.4)

### BASSE (dette mineure)

14. **Ombres** : Nav-popup sans aucune ombre (menu flottant) ; Sidebar laisse
    `--shadow-sm`/`--shadow-md` morts + une ombre tooltip hardcodée. (C.11)
15. **Tokens morts incohérents entre vues** (`--ease-spring`, `--font-display`,
    `--duration-350`) présents ici, absents là. (C.6, C.10)

---

## Score de cohérence interne : **3,5 / 10**

**Justification (dérivée des faits du tableau, non d'une impression).**

Sur les ~30 lignes de propriété auditées, le verdict « Cohérent ? » se répartit
ainsi : **oui ≈ 9** (texte primaire/secondaire/muted, accent primaire/hover/active,
fonds panel/surface, radius cards, échelle radius, valeurs d'ombre) ; **partiel ≈ 6**
(fond elevated, texte disabled, accent-subtle, font-size body, durée standard,
échelle d'ombres) ; **non ≈ 15** (nommage des tokens, font-family, mono, tailles
typo, texte-sur-accent, focus, radius boutons/inputs/cercles, fond deepest/nav,
hover, easing nav, grille 8px, variables fantômes, bug `--error`, accent par-outil).

- **Ce qui sauve la note (≈ +3,5)** : les VALEURS chromatiques de base (texte,
  fonds principaux, accent teal) sont quasi identiques d'une vue à l'autre. Un
  utilisateur ne verra PAS deux teals différents ni deux gris de texte différents.
  La charte de couleur v2 est, sur le fond, respectée partout.

- **Ce qui plombe la note** : il existe **4 implémentations distinctes** de cette
  même charte, avec **3 conventions de nommage**, et la dérive est déjà concrète et
  parfois CASSANTE — le bug `--error` en clair (Sidebar), les 2 tokens fantômes
  (Chat), 4 stacks de police différents, un focus absent (Nav-popup), et la
  réintroduction de couleurs par-outil (Chat) qui contredit frontalement la v2.
  L'unité tient « par chance » (valeurs recopiées à l'identique), pas « par
  construction » (aucun fichier de tokens partagé). C'est exactement le risque que
  la valeur de marque « Unité sans uniformité » vise à éliminer.

Une cohérence « par recopie » sans source unique, assortie de bugs de rendu réels
et d'une violation explicite d'une interdiction v2, ne peut pas dépasser la moitié.
La note **3,5/10** reflète : couleurs de base bonnes (le socle existe), mais
architecture de tokens fragmentée + plusieurs cassures effectives + écarts
typographie/focus/espacement systématiques.

---

## RÉPONSE SYNTHÉTIQUE (cohérence interne)

**Score de cohérence interne : 3,5 / 10**

**Top 5 des divergences :**

1. **CRITIQUE — 4 systèmes de tokens / 3 conventions de nommage** (`--oh-*` vs `--*`
   vs `--bg`/`--text`). Aucune source de vérité partagée ; l'unité tient par recopie
   manuelle. (préambule, C.12)
2. **CRITIQUE — Bug `--error` non défini dans le JS de la Sidebar**
   (sidebar.html:2849,2854,2865) → bordure d'erreur `#ef4444` au lieu de `#dc2626`
   en mode clair.
3. **CRITIQUE — font-family divergente sur les 4 vues** : Chat & Projects priorisent
   `"SF Pro Text"`, Sidebar & Nav-popup priorisent `-apple-system` ; stacks mono
   tous différents. La police de base n'est pas uniforme.
4. **CRITIQUE — Texte-sur-accent incohérent + couleurs par-outil dans Chat** :
   `#fff` (Chat/Sidebar) vs `var(--bg-deepest)` (Projects, contradictoire en lui-même),
   et `HUB_TYPE_COLORS`/`HUB_FILTER_TYPES`/`PROJ_COLORS` (chat.html:6119-6145,3312)
   réintroduisent une teinte par type — interdit en v2 (`LOGO.md:22`).
5. **HAUTE — États de focus divergents** : 2px outline (Chat/Projects) vs 1px+ring
   (Sidebar) vs **aucun focus** (Nav-popup, problème d'accessibilité).

---

# Partie D — Cohérence inter-apps

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

## RETOUR (unification inter-apps)

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
