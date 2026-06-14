# 05 — PHASE 5 / Partie C : Cohérence interne entre nos vues

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

## RÉPONSE SYNTHÉTIQUE (demandée)

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
   </content>
   </invoke>
