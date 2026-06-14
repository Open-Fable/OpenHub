# 08 — Design tokens unifiés `--oh-*` (PROPOSITION, Phase 8)

> **Objet** : proposer un jeu COMPLET et cohérent de design tokens CSS préfixés
> `--oh-*`, destiné à devenir la **source de vérité unique** du projet OpenHub.
> Ce document est une **PROPOSITION DOCUMENTÉE**, pas un fichier CSS du projet :
> aucun fichier source n'a été modifié.
>
> **Méthode** : chaque token est justifié par une référence de marque (`01`, `02`)
> OU par une déduction logique tracée aux faits du code (`03`, `04`, `05`, `06`,
> `09`). Aucune valeur n'est inventée : les hex/durées/courbes proviennent du
> design system de référence (`02`) ou des inventaires réels. Pour chaque token :
> justification, statut **« déjà utilisé »** (la valeur existe déjà dans le code)
> vs **« à introduire »** (inexistante aujourd'hui, ou existante seulement en dur
> sans token nommé), et variante dark/light.
>
> **Convention** : `--oh-{catégorie}-{propriété}-{variante}` (`02:29`). Le mode
> par défaut adopté ici est **sombre** (`:root` = dark), conformément à l'ADN
> (« thème sombre par défaut, pas un afterthought », `01:245-247`, `02:31` notant
> que la marque définit aussi un mode clair). Le mode clair est exposé via
> `:root.light` ET `@media (prefers-color-scheme: light)` pour couvrir le suivi
> système (`02:30`) sans empêcher un forçage explicite par classe.
>
> Direction artistique senior. Date : 2026-06-14.

---

## 0. Principes directeurs (tracés)

1. **Une seule source de vérité.** Le constat racine de l'audit est la
   fragmentation : 4 systèmes de tokens parallèles pour une charte unique
   (`05:104-113`, `06:82-89`). Ce fichier remplace les `:root` locaux de
   `chat.html` (`--*` court), `projects.css` (`--*` court), `nav-popup.html`
   (`--bg`/`--text`/`--accent`) et complète `sidebar.html` (déjà `--oh-*` mais
   incomplet). Migration recommandée : incrémentale via alias (`06:88`).

2. **Valeurs conformes, nommage canonique.** L'audit montre que la palette de
   VALEURS est presque toujours bonne (~86 % correctes en valeur), mais que le
   CONTRAT de nommage `--oh-*` n'est respecté que par `sidebar.html` (`05:393-396`).
   On conserve donc les hex prescrits par `02` et on impose le préfixe `--oh-*`.

3. **On comble les manques identifiés** : token texte-sur-accent (`--oh-on-accent`,
   `06:64-71`), variantes `*-subtle` sémantiques (`06:211-218`), échelle radius
   complète avec paliers 6px et 16px (`05:316-321`, `06:97-104`), échelle
   typographique tokenisée (jamais implémentée, `05:294`, `06:166-173`), token
   `--oh-duration-500` (`05:344`), tokens de sélection/scrollbar (`06:151-158`),
   z-index (non tokenisés, valeurs en dur 5→10000 en Chat, `03:511-523`).

4. **Mode sombre = défaut.** `:root` porte le dark ; le light est un override.
   Inverse de l'implémentation actuelle (chat/projects ont le light en défaut,
   `03:33`), mais conforme à l'ADN (`01:245-247`). Les deux jeux de valeurs sont
   ceux de `02` (aucune nouvelle teinte).

---

## 1. Couleurs

> Sources hex : `02:33-94` (= `brand_colors.json`). Valeurs identiques à celles
> déjà présentes dans le code (Chat `03:37-81`, Projects `03:571-592`, Sidebar
> `03:921-941`) — seul le **nommage** `--oh-*` est nouveau hors sidebar.

### 1.1 Bloc `:root` (DARK — défaut)

```css
:root {
  /* === Fonds (background) — 02:37-41 === */
  --oh-color-bg-deepest: #0a0a0a; /* fond racine html/body */
  --oh-color-bg-panel: #141414; /* sidebar, panneaux latéraux */
  --oh-color-bg-surface: #1e1e1e; /* cartes, inputs, surfaces interactives */
  --oh-color-bg-elevated: #282828; /* modales, sheets, tooltips */
  --oh-color-bg-overlay: #111111; /* dropdowns, menus flottants */

  /* === Bordures (border) — 02:47-49 === */
  --oh-color-border-subtle: #1f1f1f; /* séparateurs discrets */
  --oh-color-border-default: #2a2a2a; /* bordures standard */
  --oh-color-border-strong: #3a3a3a; /* focus, bordures actives */

  /* === Texte (text) — 02:55-58 === */
  --oh-color-text-primary: #ececec; /* contenu principal */
  --oh-color-text-secondary: #999999; /* descriptions, labels */
  --oh-color-text-muted: #666666; /* placeholders, métadonnées */
  --oh-color-text-disabled: #444444; /* texte inactif */

  /* === Accent (teal unique — aucune couleur par outil en v2) — 02:64-68 === */
  --oh-color-accent-primary: #14b8a6;
  --oh-color-accent-hover: #2dd4bf;
  --oh-color-accent-active: #0d9488;
  --oh-color-accent-subtle: rgba(20, 184, 166, 0.1);
  --oh-color-accent-subtle-hover: rgba(20, 184, 166, 0.16);

  /* === Texte/icône SUR accent — 06:64-71 (à introduire) === */
  --oh-color-on-accent: #ffffff;

  /* === Sémantiques + variantes subtle — 02:74-76 ; subtle 03:77-81 === */
  --oh-color-success: #22c55e;
  --oh-color-success-subtle: rgba(34, 197, 94, 0.1);
  --oh-color-warning: #f59e0b;
  --oh-color-warning-subtle: rgba(245, 158, 11, 0.1);
  --oh-color-error: #ef4444;
  --oh-color-error-subtle: rgba(239, 68, 68, 0.1);

  /* === Sélection texte — 02:82 (à tokeniser) === */
  --oh-color-selection-bg: rgba(20, 184, 166, 0.25);
  --oh-color-selection-text: #ffffff;

  /* === Scrollbar — 02:83-84 (à tokeniser) === */
  --oh-color-scrollbar-thumb: rgba(255, 255, 255, 0.08);
  --oh-color-scrollbar-thumb-hover: rgba(255, 255, 255, 0.14);

  /* === Overlays de modale — 02:85-86 === */
  --oh-color-overlay-modal: rgba(0, 0, 0, 0.4);
  --oh-color-overlay-heavy: rgba(0, 0, 0, 0.6);
}
```

### 1.2 Bloc LIGHT

```css
:root.light,
@media (prefers-color-scheme: light) {
  :root:not(.dark) {
    /* Fonds — 02:37-41 */
    --oh-color-bg-deepest: #ffffff;
    --oh-color-bg-panel: #f7f7f7;
    --oh-color-bg-surface: #efefef;
    --oh-color-bg-elevated: #ffffff;
    --oh-color-bg-overlay: #f2f2f2;

    /* Bordures — 02:47-49 */
    --oh-color-border-subtle: #e8e8e8;
    --oh-color-border-default: #e0e0e0;
    --oh-color-border-strong: #cccccc;

    /* Texte — 02:55-58 */
    --oh-color-text-primary: #111111;
    --oh-color-text-secondary: #555555;
    --oh-color-text-muted: #888888;
    --oh-color-text-disabled: #bbbbbb;

    /* Accent — 02:64-68 */
    --oh-color-accent-primary: #0d9488;
    --oh-color-accent-hover: #0f766e;
    --oh-color-accent-active: #115e59;
    --oh-color-accent-subtle: rgba(13, 148, 136, 0.06);
    --oh-color-accent-subtle-hover: rgba(13, 148, 136, 0.1);

    /* Sur accent — constant (06:68) */
    --oh-color-on-accent: #ffffff;

    /* Sémantiques — 02:74-76 ; subtle 03:77-81 (canal light) */
    --oh-color-success: #16a34a;
    --oh-color-success-subtle: rgba(22, 163, 74, 0.08);
    --oh-color-warning: #d97706;
    --oh-color-warning-subtle: rgba(217, 119, 6, 0.08);
    --oh-color-error: #dc2626;
    --oh-color-error-subtle: rgba(220, 38, 38, 0.08);

    /* Sélection — 02:82 */
    --oh-color-selection-bg: rgba(13, 148, 136, 0.15);
    --oh-color-selection-text: #111111;

    /* Scrollbar — 02:83-84 */
    --oh-color-scrollbar-thumb: rgba(0, 0, 0, 0.1);
    --oh-color-scrollbar-thumb-hover: rgba(0, 0, 0, 0.16);

    /* Overlays — 02:85-86 */
    --oh-color-overlay-modal: rgba(0, 0, 0, 0.1);
    --oh-color-overlay-heavy: rgba(0, 0, 0, 0.2);
  }
}
```

> **Note d'implémentation** : la double déclaration (`:root.light` + media query
> ciblant `:root:not(.dark)`) permet le suivi système (`02:30`) tout en autorisant
> un forçage explicite `.light`/`.dark`, ce qui résout aussi le besoin d'aligner
> les overrides sur `[data-theme]` plutôt que sur `@media` seul (`07:528-533`).

### 1.3 Justification & statut — couleurs

| Token                              | Valeur dark             | Valeur light           | Justification                                                                                                                                           | Statut                                                                                                                                                  |
| ---------------------------------- | ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--oh-color-bg-deepest`            | `#0A0A0A`               | `#FFFFFF`              | Fond icône macOS `#0A0A0A` (`01:245`), prescrit `02:37`                                                                                                 | Déjà utilisé (Chat `03:39`, Projects `03:571`, Sidebar `03:921`) ; **Nav-popup à aligner** (dark `#111111`, `03:18`, `06:106`)                          |
| `--oh-color-bg-panel`              | `#141414`               | `#F7F7F7`              | Prescrit `02:38`                                                                                                                                        | Déjà utilisé (`03:40,572,922`)                                                                                                                          |
| `--oh-color-bg-surface`            | `#1E1E1E`               | `#EFEFEF`              | Prescrit `02:39`                                                                                                                                        | Déjà utilisé (`03:41,573,923`)                                                                                                                          |
| `--oh-color-bg-elevated`           | `#282828`               | `#FFFFFF`              | Prescrit `02:40`                                                                                                                                        | Déjà utilisé code propre (`03:42,574,924`) ; non mappé dans overrides (`05:225`)                                                                        |
| `--oh-color-bg-overlay`            | `#111111`               | `#F2F2F2`              | Prescrit `02:41` ; cible sémantique correcte pour le dropdown Nav-popup (`06:110`)                                                                      | Déjà utilisé (`03:43,575,925`)                                                                                                                          |
| `--oh-color-border-subtle`         | `#1F1F1F`               | `#E8E8E8`              | Prescrit `02:47`                                                                                                                                        | Déjà utilisé (`03:49,576,926`)                                                                                                                          |
| `--oh-color-border-default`        | `#2A2A2A`               | `#E0E0E0`              | Prescrit `02:48`                                                                                                                                        | Déjà utilisé (`03:50,577,927`)                                                                                                                          |
| `--oh-color-border-strong`         | `#3A3A3A`               | `#CCCCCC`              | Prescrit `02:49`                                                                                                                                        | Défini mais dead en Chat (`05:234`) ; à réactiver pour focus/bordures actives                                                                           |
| `--oh-color-text-primary`          | `#ECECEC`               | `#111111`              | Prescrit `02:55` ; `#ECECEC` = teinte logo sur fond sombre (`01:184`)                                                                                   | Déjà utilisé (`03:57,579,929`)                                                                                                                          |
| `--oh-color-text-secondary`        | `#999999`               | `#555555`              | Prescrit `02:56`                                                                                                                                        | Déjà utilisé (`03:58,580,930`)                                                                                                                          |
| `--oh-color-text-muted`            | `#666666`               | `#888888`              | Prescrit `02:57`                                                                                                                                        | Déjà utilisé (`03:59,581,931`) ; **résout** le chevron Projects figé `#888888` (`06:253-260`)                                                           |
| `--oh-color-text-disabled`         | `#444444`               | `#BBBBBB`              | Prescrit `02:58`                                                                                                                                        | Déjà utilisé (`03:60,582,932`)                                                                                                                          |
| `--oh-color-accent-primary`        | `#14B8A6`               | `#0D9488`              | Accent teal de marque (`01:183`, `LOGO.md:50-51`), prescrit `02:64`                                                                                     | **Déjà utilisé partout** (point fort, `05:249`) — y compris 3 apps via overrides (`04:38,106,136`)                                                      |
| `--oh-color-accent-hover`          | `#2DD4BF`               | `#0F766E`              | Prescrit `02:65`                                                                                                                                        | Déjà utilisé (`03:67,584,934`)                                                                                                                          |
| `--oh-color-accent-active`         | `#0D9488`               | `#115E59`              | Prescrit `02:66`                                                                                                                                        | Déjà utilisé (`03:68,585,935`)                                                                                                                          |
| `--oh-color-accent-subtle`         | `rgba(20,184,166,.10)`  | `rgba(13,148,136,.06)` | Prescrit `02:67`                                                                                                                                        | Déjà utilisé (`03:69,586,936`) ; **résout** Nav-popup `.08` hors charte (`06:268-275`)                                                                  |
| `--oh-color-accent-subtle-hover`   | `rgba(20,184,166,.16)`  | `rgba(13,148,136,.10)` | Prescrit `02:68`                                                                                                                                        | Déjà utilisé (`03:70,587,937`)                                                                                                                          |
| `--oh-color-on-accent`             | `#FFFFFF`               | `#FFFFFF`              | Constant : le teal `#0D9488`/`#14B8A6` porte un contraste suffisant avec le blanc (`06:68`) ; comble l'absence de token texte-sur-accent (`09:240-246`) | **À introduire** — aujourd'hui `#fff` en dur (Chat ≥9×, `03:180`) OU `var(--bg-deepest)` (Projects, `06:65`) ; deux conventions opposées (`05:152-154`) |
| `--oh-color-success`               | `#22C55E`               | `#16A34A`              | Prescrit `02:74`                                                                                                                                        | Déjà utilisé (`03:76,588,939`)                                                                                                                          |
| `--oh-color-success-subtle`        | `rgba(34,197,94,.10)`   | `rgba(22,163,74,.08)`  | Présent en Chat (`03:77`) et Projects (`05:215`)                                                                                                        | Déjà utilisé (Chat) ; **à généraliser** (absent ailleurs)                                                                                               |
| `--oh-color-warning`               | `#F59E0B`               | `#D97706`              | Prescrit `02:75`                                                                                                                                        | Déjà utilisé (`03:78,590,940`)                                                                                                                          |
| `--oh-color-warning-subtle`        | `rgba(245,158,11,.10)`  | `rgba(217,119,6,.08)`  | Présent en Chat (`03:79`)                                                                                                                               | Déjà utilisé (Chat) ; à généraliser                                                                                                                     |
| `--oh-color-error`                 | `#EF4444`               | `#DC2626`              | Prescrit `02:76`                                                                                                                                        | **Bug réel à corriger** : JS référence `--error` inexistant → `#ef4444` faux en light (Sidebar `06:46-53`, Projects `05:261`)                           |
| `--oh-color-error-subtle`          | `rgba(239,68,68,.10)`   | `rgba(220,38,38,.08)`  | Présent en Chat (`03:80`) et Projects (`06:215`)                                                                                                        | Déjà utilisé (Chat/Projects) ; **résout** `.btn-ollama.cancel:hover` `#f87171` hors token (`06:211-218`)                                                |
| `--oh-color-selection-bg`          | `rgba(20,184,166,.25)`  | `rgba(13,148,136,.15)` | Prescrit `02:82`                                                                                                                                        | **À tokeniser** — aujourd'hui hardcodé Chat + Global (`06:151-158`)                                                                                     |
| `--oh-color-selection-text`        | `#FFFFFF`               | `#111111`              | Prescrit `02:82`                                                                                                                                        | À tokeniser (idem)                                                                                                                                      |
| `--oh-color-scrollbar-thumb`       | `rgba(255,255,255,.08)` | `rgba(0,0,0,.10)`      | Prescrit `02:84`                                                                                                                                        | **À tokeniser** — valeurs exactes mais hardcodées partout (`05:270`)                                                                                    |
| `--oh-color-scrollbar-thumb-hover` | `rgba(255,255,255,.14)` | `rgba(0,0,0,.16)`      | Prescrit `02:84`                                                                                                                                        | À tokeniser (idem)                                                                                                                                      |
| `--oh-color-overlay-modal`         | `rgba(0,0,0,.40)`       | `rgba(0,0,0,.10)`      | Prescrit `02:85`                                                                                                                                        | Déjà utilisé sous le nom `--overlay-modal` (`03:91,598`) — **renommer** vers `--oh-color-overlay-modal` (`05:271`)                                      |
| `--oh-color-overlay-heavy`         | `rgba(0,0,0,.60)`       | `rgba(0,0,0,.20)`      | Prescrit `02:86`                                                                                                                                        | **À introduire** — token « heavy » prescrit mais absent du code (`05:272`)                                                                              |

> **Couleurs explicitement EXCLUES** (suppressions v2 à ne JAMAIS réintroduire,
> `02:88-94`, `01:218-225`) : accents par-outil (`accent-work/-code/-design/-chat/
-projects`), `--oh-color-info` (bleu `#3B82F6`), `shadow-glow` (glow violet),
> violet v1 `#7B67EE`. Les 3 palettes par-type de Chat (`PROJ_COLORS`,
> `HUB_TYPE_COLORS`, `HUB_FILTER_TYPES`) sont à supprimer (`06:73-80`) : aucune
> n'est tokenisée ici, la différenciation de type doit passer par la FORME/icône.

---

## 2. Typographie

> Familles : `02:107-108`. Échelle texte : `02:119-130`. Échelle mono : `02:136-139`.
> **Écart majeur comblé** : aucune échelle typo n'est tokenisée aujourd'hui — toutes
> les tailles sont en dur, parfois cassées (9.5px, 12.5px en JS, `05:294,410`).
> Statut global de cette section : **à introduire** (sauf familles, partiellement
> présentes). Valeurs reprises strictement de `02` (aucune taille inventée).

### 2.1 Familles, graisses, line-heights de base

```css
:root {
  /* Familles — 02:107-109 */
  --oh-font-sans:
    "SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue",
    sans-serif;
  --oh-font-mono: "SF Mono", "Menlo", "Monaco", "Courier New", monospace;
  --oh-font-rounded: "SF Pro Rounded", "SF Pro Text", -apple-system, sans-serif;

  /* Graisses — 02:107 (400/500/600/700) */
  --oh-font-weight-normal: 400;
  --oh-font-weight-medium: 500;
  --oh-font-weight-semibold: 600;
  --oh-font-weight-bold: 700;

  /* Line-heights nommés — dérivés de l'échelle 02:119-130 */
  --oh-line-height-tight: 1.2; /* display/headings larges */
  --oh-line-height-snug: 1.3; /* headings */
  --oh-line-height-normal: 1.4; /* texte xs/sm */
  --oh-line-height-relaxed: 1.5; /* corps base/md */
  --oh-line-height-loose: 1.6; /* mono/blocs de code */
}
```

### 2.2 Échelle texte (sizes) et rôles composites

```css
:root {
  /* Tailles brutes — base 14px, min 11px (02:113) */
  --oh-font-size-xs: 11px; /* 02:119 */
  --oh-font-size-sm: 13px; /* 02:120 */
  --oh-font-size-base: 14px; /* 02:121 (taille de base) */
  --oh-font-size-md: 15px; /* 02:122 */
  --oh-font-size-lg: 17px; /* 02:123 */
  --oh-font-size-xl: 20px; /* 02:127 heading-lg / 02:128 heading-xl=24 */

  /* Headings — 02:124-128 */
  --oh-font-size-heading-xs: 13px; /* uppercase, ls 0.03em (02:124) */
  --oh-font-size-heading-sm: 15px; /* 02:125 */
  --oh-font-size-heading-md: 17px; /* 02:126 */
  --oh-font-size-heading-lg: 20px; /* 02:127 */
  --oh-font-size-heading-xl: 24px; /* 02:128 */

  /* Display — 02:129-130 */
  --oh-font-size-display-sm: 28px; /* ls -0.01em (02:129) */
  --oh-font-size-display-md: 34px; /* ls -0.01em (02:130) */

  /* Mono — 02:136-139 */
  --oh-font-size-mono-xs: 11px; /* lh 1.5 (02:136) */
  --oh-font-size-mono-sm: 13px; /* lh 1.6 (02:137) */
  --oh-font-size-mono-base: 14px; /* lh 1.6 (02:138) */
  --oh-font-size-mono-md: 15px; /* lh 1.6 (02:139) */

  /* Letter-spacing — seuls 4 rôles ont un ls explicite (02:259) */
  --oh-letter-spacing-xs: 0.01em; /* text-xs (02:119) */
  --oh-letter-spacing-heading: 0.03em; /* heading-xs uppercase (02:124) */
  --oh-letter-spacing-display: -0.01em; /* display-sm/md (02:129-130) */
}
```

### 2.3 Justification & statut — typographie

| Token                          | Valeur                         | Justification                                                  | Statut                                                                                                                                    |
| ------------------------------ | ------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `--oh-font-sans`               | stack SF Pro Text → sans-serif | Stack exacte prescrite `02:107` ; typo native macOS (`01:268`) | **Présent mais divergent** : 4 stacks différents selon la vue (`06:115-122`) ; `projects.css:50-52` est déjà exact (`06:119`) — à unifier |
| `--oh-font-mono`               | stack SF Mono → monospace      | Prescrit `02:108`                                              | Présent mais 3 stacks (Fira Code/Monaco/absent, `06:175-182`) — à unifier                                                                 |
| `--oh-font-rounded`            | stack SF Pro Rounded           | Optionnel, prescrit `02:109`                                   | **À introduire** (jamais déclaré, `05:288`) — facultatif                                                                                  |
| `--oh-font-weight-*`           | 400/500/600/700                | Graisses prescrites `02:107`                                   | Déjà utilisées en dur (500/600/700, `03:354`) — à tokeniser                                                                               |
| `--oh-line-height-*`           | 1.2 → 1.6                      | Dérivés des line-heights de l'échelle `02:119-139`             | Déjà utilisés en dur (1.3/1.4/1.5/1.55/1.6, `03:354`) — à tokeniser                                                                       |
| `--oh-font-size-xs..xl`        | 11/13/14/15/17/20px            | Tailles prescrites `02:119-127`                                | **À introduire** — aujourd'hui en dur, hors échelle (9.5/12.5px cassés, `05:410`)                                                         |
| `--oh-font-size-heading-*`     | 13/15/17/20/24px               | Prescrit `02:124-128`                                          | À introduire                                                                                                                              |
| `--oh-font-size-display-sm/md` | 28/34px                        | Prescrit `02:129-130`                                          | À introduire (jamais utilisé, même `--font-display` est dead, `03:352`)                                                                   |
| `--oh-font-size-mono-*`        | 11/13/14/15px                  | Prescrit `02:136-139`                                          | À introduire (tailles mono en dur, `05:295`)                                                                                              |
| `--oh-letter-spacing-*`        | 0.01 / 0.03 / -0.01em          | Les 4 seuls ls explicites prescrits (`02:259`)                 | À introduire                                                                                                                              |

> **Note** : les autres rôles (text-sm/base/md, heading-sm/md/lg/xl) ont un
> letter-spacing hérité `normal` (`02:259`) — aucun token dédié, c'est volontaire.

---

## 3. Espacement (grille 8px)

> Grille de base 8px « non négociable » (`01:261`, `manifesto.md:52`). Échelle
> prescrite `02:149-159`. La grille est aujourd'hui violée (paddings 5/7/10/14/18px,
> `09:162-176`) et les tokens space absents en Chat/Nav-popup (`06:235-242`).

```css
:root {
  --oh-space-0: 0; /* 02:149 — collé */
  --oh-space-1: 4px; /* 02:150 — micro (icône + texte) */
  --oh-space-2: 8px; /* 02:151 — interne standard */
  --oh-space-3: 12px; /* 02:152 — composant compact */
  --oh-space-4: 16px; /* 02:153 — composant standard */
  --oh-space-5: 20px; /* 02:154 — modal/carte */
  --oh-space-6: 24px; /* 02:155 — entre sections */
  --oh-space-8: 32px; /* 02:156 — layout large */
  --oh-space-10: 40px; /* 02:157 — séparation majeure */
  --oh-space-12: 48px; /* 02:158 — padding de page */
  --oh-space-16: 64px; /* 02:159 — section héro / largeur sidebar (02:163) */
}
```

### 3.1 Justification & statut — espacement

| Token           | Valeur | Justification                                        | Statut                                                                                                     |
| --------------- | ------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `--oh-space-0`  | 0      | `02:149`                                             | Déjà utilisé en dur                                                                                        |
| `--oh-space-1`  | 4px    | `02:150`                                             | Déjà défini (Sidebar `--space-1`, Projects ; `03:958,603`) ; **à introduire** en Chat/Nav-popup (`06:237`) |
| `--oh-space-2`  | 8px    | `02:151`                                             | Idem                                                                                                       |
| `--oh-space-3`  | 12px   | `02:152`                                             | Idem                                                                                                       |
| `--oh-space-4`  | 16px   | `02:153`                                             | Idem                                                                                                       |
| `--oh-space-5`  | 20px   | `02:154`                                             | Idem                                                                                                       |
| `--oh-space-6`  | 24px   | `02:155`                                             | Idem                                                                                                       |
| `--oh-space-8`  | 32px   | `02:156`                                             | Idem (Sidebar va jusqu'à `--space-8`, `03:958`)                                                            |
| `--oh-space-10` | 40px   | `02:157`                                             | **À introduire** — échelle locale tronquée s'arrête à 32px (`05:301`)                                      |
| `--oh-space-12` | 48px   | `02:158`                                             | À introduire (idem)                                                                                        |
| `--oh-space-16` | 64px   | `02:159` ; largeur sidebar prescrite 64px (`02:163`) | À introduire                                                                                               |

> **Note** : l'échelle saute volontairement 7/9/11/13/14/15 (`02:264`) — ce n'est
> pas un manque. Les valeurs hors grille relevées (5/7/10/14/18px, `09:163`)
> doivent être ramenées au palier le plus proche (`06:239`).

---

## 4. Border-radius (CRITIQUE)

> Échelle prescrite `0 → 4 → 6 → 8 → 12 → 16 → 9999px` (`02:182`). Le code propre
> n'implémente que `0/4/8/12/9999` : **paliers 6px et 16px manquants**, et le
> nommage est décalé (code `--radius-sm`=4px ≠ marque `radius-sm`=6px ; le 4px de
> marque s'appelle `radius-xs`) (`05:316-321`, `06:97-104`). Valeurs identiques
> dark/light.

```css
:root {
  --oh-radius-none: 0; /* 02:174 — pleine largeur */
  --oh-radius-xs: 4px; /* 02:175 — badges, tags, code-inline */
  --oh-radius-sm: 6px; /* 02:176 — inputs, petits boutons, list-item */
  --oh-radius-md: 8px; /* 02:177 — boutons, cartes, dropdowns, slot, toast */
  --oh-radius-lg: 12px; /* 02:178 — modales, panels */
  --oh-radius-xl: 16px; /* 02:179 — grandes modales, sheets */
  --oh-radius-full: 9999px; /* 02:180 — pills, avatars, toggles, progress */
}
```

### 4.1 Justification & statut — radius

| Token              | Valeur | Justification                                        | Statut                                                                                                                |
| ------------------ | ------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `--oh-radius-none` | 0      | `02:174`                                             | Déjà utilisé en dur (`05:308`)                                                                                        |
| `--oh-radius-xs`   | 4px    | `02:175` — vocabulaire d'arrondis du logo (`01:250`) | Déjà utilisé mais **mal nommé** `--radius-sm` aujourd'hui (`05:309`) ; pour badges/tags                               |
| `--oh-radius-sm`   | 6px    | `02:176`                                             | **À introduire** — palier 6px absent partout (`05:310`) ; pour inputs (cohérent avec Open-Design natif 6px, `04:155`) |
| `--oh-radius-md`   | 8px    | `02:177`                                             | Déjà utilisé (`05:311`) — boutons standard (résout les pilules de bouton Chat, `06:133-140`)                          |
| `--oh-radius-lg`   | 12px   | `02:178`                                             | Déjà utilisé partout cartes/modales (cohérent, `05:312`, `05:488`)                                                    |
| `--oh-radius-xl`   | 16px   | `02:179`                                             | **À introduire** — palier 16px absent du code (`05:313`) ; pour grandes modales/sheets                                |
| `--oh-radius-full` | 9999px | `02:180`                                             | Déjà défini ; mais souvent contourné par `50%` en dur (avatars/dots, `06:142-149`) — à généraliser                    |

> **Synthèse radius** : les deux paliers à INTRODUIRE sont `--oh-radius-sm` (6px)
> et `--oh-radius-xl` (16px). Le renommage `--radius-sm`(4px) → `--oh-radius-xs`
> impose d'auditer chaque usage : inputs → `--oh-radius-sm` (6px), tags/badges →
> `--oh-radius-xs` (4px) (`06:104`). Les cercles passent de `50%` à
> `--oh-radius-full` (`06:146`).

---

## 5. Ombres

> Ombres purement structurelles (noir alpha neutre) ; `shadow-glow` supprimé v2
> (`02:188`, `01:206`). Valeurs prescrites `02:193-196`. Statut : valeurs déjà
> présentes (Chat/Projects/Sidebar) mais sous le nom `--shadow-*` (`05:327-330`).

```css
:root {
  /* DARK — 02:193-196 (colonne dark) */
  --oh-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.2);
  --oh-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.24);
  --oh-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.28);
  --oh-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
}

:root.light,
@media (prefers-color-scheme: light) {
  :root:not(.dark) {
    /* LIGHT — 02:193-196 (colonne light) */
    --oh-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
    --oh-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
    --oh-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
    --oh-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
}
```

### 5.1 Justification & statut — ombres

| Token            | Dark              | Light   | Justification                  | Statut                                                                                                         |
| ---------------- | ----------------- | ------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `--oh-shadow-xs` | `0 1px 2px /.20`  | `…/.04` | `02:193` — cartes, inputs      | Déjà utilisé (`03:87,594,965`) ; renommage `--shadow-xs`→`--oh-shadow-xs`                                      |
| `--oh-shadow-sm` | `0 2px 8px /.24`  | `…/.06` | `02:194` — dropdowns, tooltips | Déjà défini ; **dead en Sidebar** à réactiver (`05:328`) ; à appliquer au Nav-popup (sans ombre, `06:226-233`) |
| `--oh-shadow-md` | `0 4px 16px /.28` | `…/.08` | `02:195` — modales, sheets     | Déjà utilisé ; **résout** tooltip Sidebar hardcodé `0 4px 12px` (`06:202-209`)                                 |
| `--oh-shadow-lg` | `0 8px 32px /.40` | `…/.12` | `02:196` — modales larges      | Déjà utilisé (`03:90,597,968`)                                                                                 |

> **Note de traçabilité** : l'exemple `0.45` (`design_system.md:1129`) ne
> correspond à aucune colonne ; valeur faisant foi = tableaux `02:193-196` /
> JSON (`02:198-200`). Ignoré ici.

---

## 6. Transitions / animations

> Courbes `02:212-215`, durées `02:221-225`. Valeurs déjà présentes (Chat/Sidebar)
> mais nommage `--ease-*`/`--duration-*` hors `--oh-*` sauf Global (`05:336-345`).
> Le palier `--oh-duration-500` est absent du code (`05:344`).

```css
:root {
  /* Courbes d'interpolation — 02:212-215 */
  --oh-ease-default: cubic-bezier(0.4, 0, 0.2, 1); /* standard */
  --oh-ease-in: cubic-bezier(0.4, 0, 1, 1); /* entrées */
  --oh-ease-out: cubic-bezier(0, 0, 0.2, 1); /* sorties */
  --oh-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* rebond léger */

  /* Durées — 02:221-225 (fast → slow) */
  --oh-duration-75: 75ms; /* micro (hover, press) */
  --oh-duration-150: 150ms; /* standard (couleur, opacité) */
  --oh-duration-250: 250ms; /* apparition/disparition (fade) */
  --oh-duration-350: 350ms; /* modales, transitions de page */
  --oh-duration-500: 500ms; /* transitions majeures (rare) */

  /* Raccourcis sémantiques — règles 02:227-229 */
  --oh-transition-fast: var(--oh-duration-75) var(--oh-ease-default);
  --oh-transition-normal: var(--oh-duration-150) var(--oh-ease-default);
  --oh-transition-slow: var(--oh-duration-350) var(--oh-ease-default);
}
```

### 6.1 Justification & statut — transitions

| Token               | Valeur                           | Justification                               | Statut                                                                                  |
| ------------------- | -------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `--oh-ease-default` | `cubic-bezier(0.4,0,0.2,1)`      | `02:212`                                    | Déjà utilisé (omniprésent, `03:114`) ; **résout** Nav-popup `ease` natif (`06:193-200`) |
| `--oh-ease-in`      | `cubic-bezier(0.4,0,1,1)`        | `02:213`                                    | Déjà utilisé (`03:115`)                                                                 |
| `--oh-ease-out`     | `cubic-bezier(0,0,0.2,1)`        | `02:214`                                    | Déjà utilisé (animations d'entrée, `03:116`)                                            |
| `--oh-ease-spring`  | `cubic-bezier(0.34,1.56,0.64,1)` | `02:215` — toggle/curseurs                  | Défini mais **dead** (Chat/Global, `05:339`) — conserver, disponible                    |
| `--oh-duration-75`  | 75ms                             | `02:221`                                    | Déjà utilisé (`03:118`)                                                                 |
| `--oh-duration-150` | 150ms                            | `02:222`                                    | Déjà utilisé ; **résout** `0.15s` en dur (`06:184-191`)                                 |
| `--oh-duration-250` | 250ms                            | `02:223`                                    | Déjà utilisé (`03:121`)                                                                 |
| `--oh-duration-350` | 350ms                            | `02:224`                                    | Défini mais dead en Chat (`05:343`) — conserver                                         |
| `--oh-duration-500` | 500ms                            | `02:225`                                    | **À introduire** — absent ; `0.3s`/`0.4s` en dur en Projects à remapper (`06:184-191`)  |
| `--oh-transition-*` | composites                       | Règles hover ≤150ms / page 350ms (`02:227`) | À introduire — facilite la migration des transitions en dur                             |

> **Note** : `--duration-200` (200ms) existe dans le code hors référence
> (`05:345`). Non retenu ici (non prescrit) ; à décider de ramener à 150/250
> (`06:191`). `prefers-reduced-motion` reste obligatoire (`02:229`, `09:131-152`)
> — règle CSS, pas un token.

---

## 7. Z-index

> **Non prescrits comme tokens par `02`** (`02:263`) ; le design system cite une
> grille 500/1000/1100/2000 en dur dans les recettes de composants. Le code réel
> utilise des valeurs disparates : Chat 5/10/50/100/101/500/1000/10000
> (`03:511-523`), Projects overlay 10000 (`04:81`). **Statut global : à introduire**
> (tokens inexistants). Échelle dérivée des usages réels, ordonnée par couche.

```css
:root {
  --oh-z-base: 0; /* contenu normal */
  --oh-z-sticky: 10; /* éléments collants (resize-handle Chat, 03:514) */
  --oh-z-dropdown: 100; /* menus contextuels, more-dropdown (03:516-518) */
  --oh-z-popup: 500; /* dropdowns de sélection (03:520) ; grille DS 500 (02:263) */
  --oh-z-overlay: 1000; /* overlays de panneau, modal-overlay (03:521) */
  --oh-z-modal: 1100; /* modales au-dessus des overlays (grille DS, 02:263) */
  --oh-z-tooltip: 2000; /* tooltips au-dessus de tout (grille DS, 02:263) */
  --oh-z-toast: 10000; /* notifications, toast-wrap (03:523 ; hub overlay 04:81) */
}
```

### 7.1 Justification & statut — z-index

| Token             | Valeur | Justification                                                                   | Statut                       |
| ----------------- | ------ | ------------------------------------------------------------------------------- | ---------------------------- |
| `--oh-z-base`     | 0      | Couche de base                                                                  | À introduire                 |
| `--oh-z-sticky`   | 10     | `.conv-resize-handle` z=10 (`03:514`)                                           | À introduire (valeur réelle) |
| `--oh-z-dropdown` | 100    | `.hub-ctx-menu`/`.more-dropdown` z=100 (`03:516-518`)                           | À introduire (valeur réelle) |
| `--oh-z-popup`    | 500    | `.dropdown` z=500 (`03:520`) + grille DS 500 (`02:263`)                         | À introduire                 |
| `--oh-z-overlay`  | 1000   | `.modal-overlay` z=1000 (`03:521`) + grille DS 1000 (`02:263`)                  | À introduire                 |
| `--oh-z-modal`    | 1100   | Grille DS 1100 (`02:263`) — modale au-dessus de l'overlay                       | À introduire                 |
| `--oh-z-tooltip`  | 2000   | Grille DS 2000 (`02:263`)                                                       | À introduire                 |
| `--oh-z-toast`    | 10000  | `.oh-toast-wrap` z=10000 (`03:523`), `#oh-projects-hub-overlay` 10000 (`04:81`) | À introduire (valeur réelle) |

> **Note** : les valeurs intermédiaires brutes 5/50/101 (`03:513,515,519`) sont à
> remapper sur le palier voisin (`--oh-z-sticky`/`--oh-z-dropdown`). Choix de
> couches déduit des usages réels recoupés avec la grille DS, pas inventé.

---

## 8. Récapitulatif — comptage et tokens à INTRODUIRE

### 8.1 Comptage total des tokens proposés

| Catégorie         | Tokens proposés |
| ----------------- | --------------- |
| Couleurs (1)      | 29              |
| Typographie (2)   | 33              |
| Espacement (3)    | 11              |
| Border-radius (4) | 7               |
| Ombres (5)        | 4               |
| Transitions (6)   | 12              |
| Z-index (7)       | 8               |
| **TOTAL**         | **104 tokens**  |

> Détail couleurs (29) : 5 bg + 3 border + 4 text + 5 accent + 1 on-accent +
> 6 sémantiques (3 base + 3 subtle) + 2 sélection + 2 scrollbar + 2 overlays.
> Détail typo (33) : 3 familles + 4 weights + 5 line-heights + 6 sizes texte +
> 5 headings + 2 display + 4 mono + 3 letter-spacing + 1 (transition vers rôles)…
> = 3+4+5+6+5+2+4+3 = **32 tokens nommés** ; le 33e est le rôle composite
> letter-spacing implicite — comptage prudent : **32 à 33**.
> (Comptage typo retenu = 33 en incluant `--oh-font-rounded` optionnel.)

### 8.2 Liste des tokens à INTRODUIRE (inexistants aujourd'hui)

> « Inexistant » = aucun token nommé ne porte cette valeur dans le code propre
> actuel (la valeur peut exister en dur sans token, ou ne pas exister du tout).
> Source de chaque manque indiquée.

**Couleurs (8 à introduire) :**

1. `--oh-color-on-accent` — texte/icône sur accent ; aujourd'hui `#fff` en dur ou `var(--bg-deepest)` (`06:64-71`, `09:240`)
2. `--oh-color-overlay-heavy` — overlay lourd prescrit mais absent (`05:272`)
3. `--oh-color-selection-bg` — sélection hardcodée, jamais tokenisée (`06:151-158`)
4. `--oh-color-selection-text` — idem (`02:82`)
5. `--oh-color-scrollbar-thumb` — valeur en dur partout, jamais tokenisée (`05:270`)
6. `--oh-color-scrollbar-thumb-hover` — idem (`05:270`)
7. `--oh-color-success-subtle` / `--oh-color-warning-subtle` / `--oh-color-error-subtle` — présents seulement en Chat/Projects, à généraliser comme tokens canoniques (`03:77-81`, `06:215`)

> (Note : `--oh-color-error` existe en valeur mais le bug `--error` non défini le
> rend inopérant en JS — correction, pas introduction, `06:46-53`.)

**Typographie (toute l'échelle — ~28 à introduire) :** 8. `--oh-font-rounded` — famille optionnelle jamais déclarée (`05:288`) 9. `--oh-font-weight-normal/medium/semibold/bold` (4) — graisses en dur (`03:354`) 10. `--oh-line-height-tight/snug/normal/relaxed/loose` (5) — lh en dur (`03:354`) 11. `--oh-font-size-xs/sm/base/md/lg/xl` (6) — tailles en dur, hors échelle (`05:294`) 12. `--oh-font-size-heading-xs/sm/md/lg/xl` (5) — jamais tokenisé (`05:294`) 13. `--oh-font-size-display-sm/md` (2) — jamais utilisé (`03:352`) 14. `--oh-font-size-mono-xs/sm/base/md` (4) — tailles mono en dur (`05:295`) 15. `--oh-letter-spacing-xs/heading/display` (3) — jamais tokenisé (`02:259`)

**Espacement (3 à introduire) :** 16. `--oh-space-10` (40px) — échelle locale tronquée à 32px (`05:301`) 17. `--oh-space-12` (48px) — idem 18. `--oh-space-16` (64px) — idem (= largeur sidebar prescrite, `02:163`)

> (Note : `--oh-space-0..8` existent déjà nommés en Sidebar/Projects mais sont
> ABSENTS de Chat/Nav-popup — généralisation requise, `06:235-242`.)

**Border-radius (2 à introduire) :** 19. `--oh-radius-sm` (6px) — palier 6px absent partout (`05:310`) 20. `--oh-radius-xl` (16px) — palier 16px absent partout (`05:313`)

> (Note : renommage `--radius-sm`(4px) → `--oh-radius-xs`(4px) = correction de
> nommage, pas introduction de valeur, `06:97-104`.)

**Transitions (1 à introduire + 3 composites) :** 21. `--oh-duration-500` (500ms) — palier absent ; `0.3s`/`0.4s` en dur à remapper (`05:344`, `06:184`) 22. `--oh-transition-fast` / `--oh-transition-normal` / `--oh-transition-slow` (3) — raccourcis sémantiques nouveaux (facilitent la migration ; `02:227`)

**Z-index (8 à introduire — catégorie entièrement nouvelle) :** 23. `--oh-z-base/sticky/dropdown/popup/overlay/modal/tooltip/toast` (8) — aucun token z-index n'existe ; valeurs en dur 5→10000 (`02:263`, `03:511-523`)

> **Total tokens à INTRODUIRE : ~53** (8 couleurs + ~28 typo + 3 space + 2 radius
>
> - 4 transitions + 8 z-index). Les ~51 restants existent déjà en VALEUR dans le
>   code (sous d'autres noms `--*`/`--oh-*`) et ne nécessitent qu'un **renommage/
>   unification** vers le canon `--oh-*` (`05:393-396`, `06:82-89`).

---

## 9. Notes de cohérence et limites

- **Mode par défaut inversé vs code actuel.** Chat/Projects ont aujourd'hui le
  LIGHT en `:root` par défaut (`03:33`). Cette proposition met le DARK par défaut
  (ADN `01:245-247`). Migration : déplacer les valeurs dark du `@media dark` vers
  `:root`, et les valeurs light vers `:root.light`/media light. Impact nul sur le
  rendu macOS (suit `prefers-color-scheme`), mais aligne le défaut sur la marque.

- **Tokens non couverts ici (volontaire).** Opacités disabled (0.4/0.45/0.5 →
  à unifier, `09:60-63`), hauteurs de bouton (28/34/42px), tailles d'icône
  (18/24px) : ce sont des **dimensions de composant**, non prescrites comme tokens
  par `02:263`. Recommandation séparée : si on les tokenise, suivre la même
  convention `--oh-size-*`. Hors périmètre de la charte de base demandée.

- **Apps tierces.** Ces tokens `--oh-*` pilotent les vues internes ; les overrides
  d'apps tierces consomment leurs propres variables natives (`07`). Les overlays
  `.oh-*` injectés dans OpenWork doivent déclarer ces tokens dark+light à `:root`
  pour cesser de dépendre de fallbacks dark figés (`07:163-177`).

- **Aucune valeur inventée.** Tous les hex/durées/courbes/tailles proviennent de
  `02` (= `brand_colors.json`/`typography.json`/`design_system.md`) ou d'usages
  réels relevés en `03`/`04`. Les seuls choix DÉDUITS (et signalés comme tels)
  sont : le découpage des couches z-index (déduit des usages + grille DS), les
  noms de line-heights et de transitions composites (dérivés de l'échelle), et la
  valeur `--oh-color-on-accent: #FFFFFF` (justifiée par le contraste, `06:68`).

---

_Fin du document — Phase 8. PROPOSITION documentée. Aucun fichier source modifié ;
seul ce fichier a été écrit dans `reports/design-audit/`._
