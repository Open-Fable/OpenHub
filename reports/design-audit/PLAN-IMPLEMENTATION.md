# Plan d'implémentation — Refonte design OpenHub

> Découpage du `RAPPORT-FINAL.md` en phases livrables **une par une**. Chaque phase
> est autonome, vérifiable, et ordonnée par dépendance + risque croissant.
> Source des corrections : `06-corrections-code-propre.md` (25 corrections),
> `08-design-tokens.md` (104 tokens), `09-etats-interactions.md` (11 points),
> `07-unification-overrides.md` (apps tierces).
>
> Mécanisme confirmé : les 4 vues internes sont chargées par `loadFile` depuis
> `electron/` (`main.ts:152,417,483,525`), chacune avec son `<style>` inline.
> → La source unique de tokens sera un CSS partagé `<link>`é dans les 4 fichiers.
>
> Date : 2026-06-14.
>
> **Nature du document :** découpage par PHASES. Le détail exhaustif (valeurs
> cibles, `fichier:ligne`, alternatives, sélecteurs) reste dans `06`/`07`/`08`/`09` —
> chaque phase y renvoie explicitement. Couverture vérifiée par relecture intégrale :
> `06` (25 corrections) → P1-P7 ; `08` (104 tokens) → P1 ; `09` (11 points) → P4+P7 ;
> `07` (3 apps) → P8. Aucun item actionnable laissé de côté.

---

## Audit du plan — revue sécurité / architecture / bugs (vérifié sur le code réel)

> Revue adversariale du plan confrontée au code. 5 problèmes trouvés ; le #1 était bloquant.

1. **[BLOQUANT — corrigé] CSP bloque le `<link>` de la Phase 1 dans 3 vues sur 4.**
   `chat.html`, `sidebar.html`, `nav-popup.html` ont `style-src 'unsafe-inline'` **sans `'self'`**
   (HTML ligne 6) → un `<link rel="stylesheet">` externe y serait **refusé par la CSP**.
   Seul `projects.html` a `style-src 'self' 'unsafe-inline'` (d'où son `<link projects/projects.css>` qui marche).
   **Correctif intégré en Phase 1** : ajouter `'self'` au `style-src` des 3 fichiers (= aligner sur `projects.html`),
   OU injecter les tokens via `webContents.insertCSS()` depuis le main (contourne la CSP, déjà utilisé `main.ts:260`).

2. **[Architecture] `copy-assets.sh` ne copie pas les dossiers automatiquement.** Il copie chaque fichier
   nommément. Un nouveau `electron/shared/` ne serait **pas** embarqué dans le build prod → styles cassés en prod.
   Correctif : soit ajouter un `cp -r electron/shared dist/electron/shared`, soit **co-localiser** `oh-tokens.css`
   dans `electron/overrides/` (déjà copié par `cp -r overrides`). Recommandé : `electron/shared/` + ligne de copie explicite.

3. **[Bug de cascade] « Aliaser » = supprimer les blocs `:root` light ET dark de chaque vue.** Le thème est piloté
   **à 100 % par `@media (prefers-color-scheme)`** — aucun toggle manuel, aucun `nativeTheme.themeSource`, aucune
   classe `.light/.dark`/`data-theme` dans les vues internes (vérifié). Si on ajoute le `<link>` mais qu'on laisse
   les `:root` light+dark inline de la vue, ils **écrasent** les tokens partagés (cascade : `<style>` après `<link>`).
   → Phase 1 doit remplacer les définitions de tokens par vue par des alias, et laisser `oh-tokens.css` porter la
   bascule light/dark via `prefers-color-scheme`. Le bloc `:root.light`/`.dark` de `08` est **inerte aujourd'hui**
   (pas de toggle de classe) — à garder pour un futur réglage manuel, ou à retirer.

4. **[Cohérence/sécurité] CSP divergentes entre les 4 vues** (`style-src 'self'` seulement dans projects ;
   `connect-src`/`img-src` présents dans chat/sidebar/projects mais absents de nav-popup ; `img-src ... blob:`
   seulement dans projects). À **harmoniser** pendant la Phase 1 (une CSP unique et cohérente pour les vues internes).

5. **[Sécurité — PRÉ-EXISTANT, hors périmètre design] `script-src 'unsafe-inline'` dans les 4 vues.**
   Faiblesse XSS classique (autorise tout script inline). Risque pratique faible ici (les vues ne chargent que du
   HTML local de confiance), mais un audit sécurité le signale. **Non causé par ce plan** ; durcissement séparé
   (nonces/hashes sur les scripts inline) — vérifier si déjà suivi dans `reports/audit-securite-global.md`.
   ⚠️ Ne pas mélanger avec le refactor design.

**Ce qui est SÛR dans le plan (vérifié) :** les 4 vues respectent `contextIsolation:true` + `sandbox:true` +
`nodeIntegration:false` (`main.ts:105-128,209-213`) — aucune phase n'y touche. Aucune phase n'introduit de secret,
de chemin disque dans le bridge, ni n'affaiblit l'isolation. Le `<link>` CSS local n'affecte pas le sandbox (CSS ≠ script).

---

## Tableau de bord

| #   | Phase                                                     | Risque       | Dépend de | Statut                                                                                                                                                                                                                                                          |
| --- | --------------------------------------------------------- | ------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Fondation : source unique de tokens `--oh-*`              | Faible\*     | —         | ✅ Fait (2026-06-14)                                                                                                                                                                                                                                            |
| 2   | Bugs de rendu (variables fantômes + couleur d'erreur)     | Faible       | 1         | ✅ Fait (2026-06-14)                                                                                                                                                                                                                                            |
| 3   | Texte-sur-accent unifié (`--oh-on-accent`)                | Moyen        | 1         | ✅ Fait (2026-06-14)                                                                                                                                                                                                                                            |
| 4   | Accessibilité & états interactifs                         | Faible/Moyen | 1         | ✅ Fait (2026-06-14) — focus CRITIQUES, disabled tokenisé, aria-live `#activityFeed` ; cibles 44px = conforme AA 24×24, AAA non imposé (desktop pointeur)                                                                                                       |
| 5   | Géométrie : échelle radius + cohérence des formes         | Moyen        | 1         | ✅ Fait (2026-06-14) — cercles `50%`→`--oh-radius-full` ; échelle 6/16px dispo. Inputs→6px NON forcé (déjà 8px cohérent), pilules→8px reporté (subjectif, revue visuelle)                                                                                       |
| 6   | Couleur : défragmentation + suppression couleurs par-type | Moyen/Élevé  | 1         | ✅ Fait (2026-06-14) — HUB_TYPE_COLORS + dots filtres neutralisés (icônes différencient), sélection & btn-ollama tokenisés. PROJ_COLORS (picker user) CONSERVÉ par décision. data-URI chevron/status & drag-overlay JS : laissés (cosmétique, contexte injecté) |
| 7   | Typo, espacement, mouvement & finitions                   | Moyen        | 1         | 🟡 Partiel (2026-06-14) — sans/mono déjà unifiés (P1), bug contraste toast corrigé, nav-popup (easing/ombre/reduced-motion), sidebar (iteration-count/tooltip). Tokenisation typo/espacement/z-index & pilules : reportées (diffus, revue visuelle)             |
| 8   | Apps tierces via overrides (track séparé)                 | Élevé        | —         | 🟡 Partiel (2026-06-14) — OpenWork: radius natifs + SF Pro ; OpenCode: radius natifs. Typo OpenCode différée (éditeur de code, risqué à l'aveugle) ; Open-Design: bug cascade dark devenu sans objet (themeSource=dark). ⚠️ VÉRIF RUNTIME requise               |

\* Faible **si** migration incrémentale par alias, sans inversion du thème par défaut (voir décision en Phase 1).

**Règle de vérification commune à chaque phase :** `npm run typecheck` + `npm run lint` + `npm test` verts, puis contrôle visuel manuel en thème **sombre ET clair** sur les vues touchées. Aucune régression visuelle non intentionnelle.

---

## Phase 1 — Fondation : source unique de tokens `--oh-*`

**Objectif :** une seule source de vérité pour toute la charte, **zéro changement visuel**. Résout la cause racine (4 systèmes de tokens parallèles, `06:82-89`) et débloque toutes les phases suivantes.

**Contenu (ordre d'exécution) :**

1. **Pré-requis CSP (sinon tout est bloqué — voir Audit #1).** Aligner le `style-src` de `chat.html`, `sidebar.html`, `nav-popup.html` sur `'self' 'unsafe-inline'` (comme `projects.html:6`). Profiter pour **harmoniser les 4 CSP** (Audit #4). _Alternative si on refuse de toucher la CSP : injecter `oh-tokens.css` via `webContents.insertCSS()` dans le main (`main.ts:260`), qui contourne la CSP._
2. Créer `electron/shared/oh-tokens.css` à partir de `08-design-tokens.md` (104 tokens). La bascule light/dark **doit** se faire via `@media (prefers-color-scheme)` (seul mécanisme réel ici — Audit #3), pas via un `:root` dark figé. Le bloc `:root.light/.dark` est facultatif (inerte tant qu'il n'y a pas de toggle manuel).
3. **Build :** ajouter `cp -r "$ROOT/electron/shared" "$ROOT/dist/electron/shared"` à `scripts/copy-assets.sh` (Audit #2 — sinon absent en prod).
4. `<link rel="stylesheet" href="shared/oh-tokens.css">` dans les 4 HTML (chemin relatif, OK avec `loadFile`).
5. **Migrer par alias** : dans chaque vue, **supprimer les blocs `:root` light ET dark inline** définissant les tokens, et les remplacer par un alias unique (ex. `--accent-primary: var(--oh-color-accent-primary)`) — pour que les ~centaines de règles existantes (`var(--accent-primary)`, etc.) marchent sans réécriture. Ne PAS laisser coexister les anciens blocs (ils écraseraient les tokens — Audit #3).
6. Les ~53 tokens nouveaux sont déclarés et **disponibles**, pas encore consommés.

**Fichiers :** `electron/shared/oh-tokens.css` (nouveau) ; `chat.html`, `sidebar.html`, `nav-popup.html`, `projects.html` (CSP + `<link>` + suppression des `:root` locaux) ; `scripts/copy-assets.sh`.

**⚠️ Décision à acter :** la proposition `08` met le **dark en `:root` par défaut**, alors que Chat/Projects ont le **light en `:root`** (`03:33`). Comme la bascille réelle passe par `prefers-color-scheme`, le rendu suit l'OS dans les deux cas → **zéro changement visuel si `oh-tokens.css` reproduit `prefers-color-scheme`**. L'inversion du « défaut nu » vers dark (alignement ADN) est cosmétique et reportable (Phase 7).

**Vérification :** rendu strictement identique avant/après en OS clair ET sombre (les 4 vues) ; **vérifier en DevTools qu'aucune erreur CSP `Refused to load the stylesheet` n'apparaît** ; `npm run build` puis lancer le bundle pour confirmer que `dist/electron/shared/oh-tokens.css` est bien présent et chargé. Bénéfice immédiat : « tokens morts incohérents » (`06:244-251`) et `--accent-subtle` `.08`→`.06` (`06:268`) résolus mécaniquement.

---

## Phase 2 — Bugs de rendu CRITIQUES (variables fantômes + couleur d'erreur)

**Objectif :** corriger les 2 bugs de rendu réels confirmés. Rapide, faible risque, fort impact (fiabilité).

**Contenu :**

- `electron/sidebar.html:2849,2854,2865` — `var(--error, #ef4444)` → `var(--oh-color-error)` (bordure d'erreur correcte en clair = `#dc2626`). `06:46-53`.
- `electron/chat.html:1622,1631` — `var(--text-base)` / `var(--text-strong)` → `var(--oh-color-text-primary)` (menu « + » lisible). `06:55-62`.

**Vérification :** en thème clair, bordure d'erreur Sidebar = `#dc2626` ; libellé du menu « + » Chat = bonne couleur en dark ET light.

---

## Phase 3 — Texte-sur-accent unifié (`--oh-on-accent`)

**Objectif :** une seule convention de couleur de texte/icône sur fond accent. `06:64-71`.

**Contenu :**

- Remplacer `#fff` (Chat `chat.html:690,1690,1816,1927` ; Sidebar `:1135,1299`) et `var(--bg-deepest)` (Projects `projects.css:452,1164,2044`) par `var(--oh-color-on-accent)`.

**⚠️ Décision à acter (le rapport et la maquette divergent) :** `08` propose `--oh-on-accent: #ffffff` constant. Or sur le teal **clair** du mode sombre (`#14b8a6`), le blanc a un contraste faible — le motif de **Projects** (`var(--bg-deepest)`, qui s'inverse avec le thème : texte sombre sur teal clair / texte clair sur teal foncé) est plus accessible. **Recommandation : `--oh-on-accent = var(--oh-color-bg-deepest)`** et aligner Chat/Sidebar sur Projets, plutôt que l'inverse. À trancher avant exécution.

**Risque :** Moyen — touche tous les boutons primaires/danger des 3 vues. Vérifier le contraste de chaque bouton en dark ET light.

---

## Phase 4 — Accessibilité & états interactifs

**Objectif :** lever les 2 blocages a11y CRITIQUES + homogénéiser les états. `09`, `06:124-131`.

**Contenu :**

- **CRITIQUE** — Nav-popup : ajouter `:focus-visible` (outline 2px accent + offset) sur les `<button class="item">` (`nav-popup.html:123-147`). `09:53-57`.
- **CRITIQUE** — Projects : substitut de focus visible sur `input/textarea/select` (`projects.css:140-143`) — `box-shadow` ring teal au lieu de `outline:none` nu. `09:45`.
- **HAUTE** — Unifier l'épaisseur/offset de focus (2px partout) sur Sidebar (`sidebar.html:288,651,859`). `06:124-131`.
- **HAUTE** — `:disabled` : une seule opacité tokenisée (au lieu de 0.4/0.45/0.5) + couvrir `.btn--primary`/`.btn-icon`. `09:59-63`.
- **HAUTE** — Projects : `aria-live`/`role` sur les changements d'état erreur/succès des nœuds. `09:95-98`.
- **MOYENNE** — cibles interactives ≥ 44×44 px (`.btn-send`, `.btn-icon`, `.slot-btn`, `.item`). `09:224-236`.

**Vérification :** tabulation clavier visible sur les 4 vues ; lecteur d'écran annonce les états Projects ; cibles tactiles conformes.

---

## Phase 5 — Géométrie : échelle radius + cohérence des formes

**Objectif :** échelle radius complète et appliquée. `06:97-104,133-149`, `08:362-390`.

**Contenu :**

- Auditer chaque usage de `--radius-sm`(4px) : inputs → `--oh-radius-sm` (6px) ; tags/badges → `--oh-radius-xs` (4px).
- Chat : boutons pilule non justifiés → `--oh-radius-md` (8px) ; inputs 4px/12px → `--oh-radius-sm` (6px). Distinguer bouton-icône circulaire (légitimement `full`) du bouton-texte pilule. `06:133-140`.
- Cercles `50%` → `var(--oh-radius-full)` (Chat `:1170,2180,1816` ; Projects `:201,449,1915`). `06:142-149`.
- Réserver `16px` (`--oh-radius-xl`) aux grandes modales.

**Risque :** Moyen (visuel). Vérifier parité visuelle hors corrections géométriques voulues.

---

## Phase 6 — Couleur : défragmentation + suppression couleurs par-type (v2)

**Objectif :** une enveloppe mono-accent conforme v2 ; éliminer les hex hardcodés restants. C'est la phase la plus invasive (refactor JS).

**Contenu :**

- **CRITIQUE** — Chat : supprimer `PROJ_COLORS` (`:3312`), `HUB_TYPE_COLORS` (`:6119`), `HUB_FILTER_TYPES` (`:6137`). Différenciation de type par la **forme/icône**, pas la couleur ; état actif = accent unique. **Tâche dédiée** : retracer chaque usage JS avant suppression. `06:73-80`.
- Sélection texte teal hardcodée → `var(--oh-color-selection-bg/-text)` (Chat `:132,136` ; Global `theme.css:84,90`). `06:151-158`.
- `.btn-ollama.cancel:hover` → `var(--oh-color-error-subtle)` (`sidebar.html:1196`). `06:211-218`.
- Drag overlay JS teal hardcodé → lire les tokens (`theme.js:131-132`). `06:277-284`.
- Chevron Projects `#888888` et statuts SVG `%2314B8A6` figés → `mask-image` + `background-color` token. `06:253-260,286-293`.

**Risque :** Moyen/Élevé (logique JS). Vérifier qu'aucune logique métier ne dépend de la couleur comme clé.

---

## Phase 7 — Typo, espacement, mouvement & finitions

**Objectif :** consommer les tokens restants ; rythme typo/espacement/mouvement régulier. Chantiers diffus, à mener **vue par vue avec relecture visuelle**.

**Contenu :**

- Typo : remplacer les tailles/graisses/line-heights en dur par `--oh-font-*` ; corriger les valeurs cassées (9.5px, 12.5px) ; unifier la stack `sans` (4→1) et `mono` (3→1, retirer Fira Code). `06:115-122,166-182`.
- Espacement : tokens `--oh-space-*` en Chat/Nav-popup ; ramener les paddings hors grille (5/7/10/14/18px) au palier 8px le plus proche. `06:235-242`, `09:162-176`.
- Mouvement : durées en dur → `--oh-duration-*` (+ `500ms`) ; Nav-popup easing `ease` → `--oh-ease-default` ; `prefers-reduced-motion` pour Nav-popup ; `animation-iteration-count:1` manquant dans le bloc reduced-motion Sidebar ; harmoniser les durées d'animation feedback (shimmer `1.5s`/`1.8s`, spin `1.8s`/`2s` → valeur unique). `06:184-200`, `09:79-80,100-102,131-152`.
- Ombres/surfaces : Nav-popup `--oh-shadow-sm` + fond via `--oh-color-bg-overlay` ; tooltip Sidebar → `--oh-shadow-md`. `06:106-113,202-209,226-233`.
- z-index : remplacer les valeurs en dur (5→10000) par `--oh-z-*`. `08:484-520`.
- Contraste (limite AA) : `--text-muted` dark (`#666666` sur `#0a0a0a` ≈ 4.2:1) est sous le seuil 4.5:1 pour du texte courant. Réserver `muted` aux placeholders/métadonnées ; vérifier qu'aucun texte de lecture normale ne l'utilise. Valeur prescrite par la marque → à traiter comme limitation connue, pas à dévier sans décision. `09:247-250`.
- **(Optionnel ici)** inversion du thème par défaut vers **dark** (alignement ADN), si actée en Phase 1.
- Breakpoints responsive : noter l'incohérence (900/700/640/480 vs 680/720 vs 600) ; harmonisation optionnelle. `09:182-200`.

**Risque :** Moyen (diffus). Faire par petits lots vérifiables.

---

## Phase 8 — Apps tierces via overrides (track séparé)

**Objectif :** rapprocher OpenWork / OpenCode / Open-Design de la charte **sans toucher `apps/`**. `07`. À faire indépendamment des phases 1-7 (cible les `electron/overrides/<app>/theme.css`).

**Contenu :**

- **OpenWork** : (a) radius générique via variables natives `--dls-radius` 8px / `--dls-radius-lg` 12px / `--radius` 0.5rem ; (b) radius des classes à valeur en dur `.ow-soft-card`/`.ow-soft-shell` (12px) et `.ow-button-primary` (pilule→8px) par override de classe `!important` (RISQUÉ, hors `check-selectors.sh`) ; (c) forcer SF Pro sur `html,body` (+ exclure le mono) ; (d) réparer les overlays projets `.oh-*` (déclarer tokens dark+light, poser le radius en littéral — ne pas dépendre de `var(--radius-lg,12px)` intercepté à ~7,2px). `07:100-204`.
- **OpenCode** : (a) `--radius-xs..xl` resserrés (4/6/8/8/12px) ; (b) radius hardcodé restant ciblé par `data-component` quand il existe ; (c) forcer SF Pro **en excluant explicitement** code/terminal/`[class*="mono"]` ; (d) durcir les correctifs layout `xl:`/`z-25` en les ré-ancrant sur `data-component`, définir ou retirer `--main-left` (`theme.css:295`). `07:216-357`.
- **Open-Design** : (a) `--radius-sm` inputs 6px→4px (littéral, ne pas compter sur le fallback) ; (b) cartes/dialogs en valeurs réelles `--radius`/`--radius-lg` (pas `var(--radius-md)` absent) ; (c) **sortir le bloc dark de `@media` vers `[data-theme="dark"]`** (corrige le thème clair cassé) ; (d) fonds via variables `--bg-*`, classes produit `.entry-*` documentées comme fragiles. `07:361-489`.

**Gotchas transversaux (`07:502-557`) :** ne JAMAIS s'appuyer sur le fallback de `var(--x, défaut)` quand la variable existe nativement (elle l'intercepte) ; prioriser variables natives puis `data-*`/`aria`/`role`/`#id` ; aligner les scopes thème sur `[data-theme="dark"]` ; toujours déclarer tokens dark ET light (pas de fallback dark figé) ; minimiser `!important` ; étendre les `theme.css` existants, ne jamais dupliquer la charte.

**Gap résiduel noté :** la propagation des **transitions/ombres** aux apps tierces (axe 4/10, `07:43-44`) n'a pas de stratégie dédiée dans `07` — à traiter au cas par cas via variables natives si elles existent.

**Risque :** Élevé — sélecteurs tierces fragiles, certains hors radar de `check-selectors.sh` (qui ne matche que `[data-*]`/`#id`/`[role]`/`[aria-*]`, `scripts/check-selectors.sh:11`). **Lancer `npm run check:selectors` après**, et re-vérifier manuellement après chaque `npm run update:apps`.

**Non unifiable (voir annexe `RAPPORT-FINAL.md` + `07:206-212,349-357,491-498`) :** radius hardcodé sans variable ni sélecteur sémantique (OpenCode), boutons pilule/cartes OpenWork si `.ow-soft-*` renommés, collapse de rail / `workspace-tabs-chrome` Open-Design, typo des zones de code (volontairement laissée en mono).

---

## Ordre d'exécution recommandé

`1 → 2 → 3 → 4 → 5 → 6 → 7`, puis `8` (indépendant, peut se faire en parallèle d'un autre track).
La Phase 1 est le prérequis de 2-7. Les phases 2, 3, 4 sont les plus rentables (bugs réels + a11y bloquante). La Phase 6 est la plus risquée (refactor JS) — à isoler.
