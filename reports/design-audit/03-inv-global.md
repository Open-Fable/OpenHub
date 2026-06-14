# 03 — Inventaire du design RÉEL : Overrides globaux injectés (notre code)

**Phase 3 de l'audit design OpenHub**
**Vue traitée :** Overrides globaux injectés dans TOUTES les WebContentsView des apps tierces.
**Fichiers analysés (lus en entier) :**

- `electron/overrides/global/theme.css` (134 lignes)
- `electron/overrides/global/layout.css` (6 lignes — vide de règles, commentaire uniquement)
- `electron/overrides/global/theme.js` (219 lignes)

**Source de marque référencée (commentaires) :** `fichier-de-la-marque/brand_colors.json`, `fichier-de-la-marque/typography.json`, `fichier-de-la-marque/design_system.md` (cités en `theme.css:6-8`, NON lus dans cette phase).

> Note méthodologique : `layout.css` est intentionnellement vide de règles CSS (commentaire `layout.css:4` : « This file is intentionally minimal — no global layout to avoid breaking apps. »). Aucune valeur design extractible.

---

## Tokens / variables CSS définies ici (`:root` et équivalents)

Tous les tokens définis ici concernent l'**animation** (easing + durations). Aucun token de couleur, de radius, d'espacement ou de typographie n'est défini sous forme de variable CSS dans ces fichiers. Les valeurs sont identiques en dark et light (définis une seule fois dans `:root`, ligne 14).

| Variable            | Valeur dark                                     | Valeur light  | Fichier:ligne |
| ------------------- | ----------------------------------------------- | ------------- | ------------- |
| `--oh-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)`                  | idem (unique) | theme.css:20  |
| `--oh-ease-in`      | `cubic-bezier(0.4, 0, 1, 1)`                    | idem (unique) | theme.css:21  |
| `--oh-ease-out`     | `cubic-bezier(0, 0, 0.2, 1)`                    | idem (unique) | theme.css:22  |
| `--oh-ease-spring`  | `cubic-bezier(0.34, 1.56, 0.64, 1)`             | idem (unique) | theme.css:23  |
| `--oh-duration-75`  | `75ms`                                          | idem (unique) | theme.css:25  |
| `--oh-duration-150` | `150ms`                                         | idem (unique) | theme.css:26  |
| `--oh-duration-250` | `250ms`                                         | idem (unique) | theme.css:27  |
| `--oh-duration-350` | `350ms`                                         | idem (unique) | theme.css:28  |
| `--oh-transition`   | `var(--oh-duration-150) var(--oh-ease-default)` | idem (unique) | theme.css:30  |

> **Aucun token `--oh-color-*`, `--oh-radius-*`, `--oh-space-*`, `--oh-font-*` n'est défini ici.** Le système de tokens `--oh-*` mentionné dans `electron/sidebar.html` (ex. `--oh-color-accent-primary:#14b8a6`) n'est PAS réutilisé dans cette vue : aucune référence `var(--oh-color-*)` n'apparaît dans ces 3 fichiers (vérifié — `A VERIFIER` côté sidebar.html, hors périmètre de cette phase).
> Les tokens d'animation définis ici (`--oh-ease-*`, `--oh-duration-*`, `--oh-transition`) ne sont **jamais consommés** dans ces mêmes fichiers (aucun `var(--oh-ease-...)` / `var(--oh-transition)` utilisé dans theme.css ni theme.js).

---

## Couleurs réellement utilisées

Toutes les couleurs sont **hardcodées** (aucune via `var(--oh-color-*)`). Regroupées par valeur distincte ; occurrences signalées.

| Élément / propriété                                       | Valeur (ou var)             | Variable CSS source           | Fichier:ligne |
| --------------------------------------------------------- | --------------------------- | ----------------------------- | ------------- |
| `:root, html, body` → `background-color` (mode clair)     | `#ffffff`                   | aucune (hardcodé)             | theme.css:37  |
| `:root, html, body` → `color` (mode clair)                | `#111111`                   | aucune (hardcodé)             | theme.css:38  |
| `html, body` → `background-color` (mode sombre)           | `#0a0a0a`                   | aucune (hardcodé)             | theme.css:52  |
| `html, body` → `color` (mode sombre)                      | `#ececec`                   | aucune (hardcodé)             | theme.css:53  |
| `::-webkit-scrollbar-track` → `background`                | `transparent`               | aucune                        | theme.css:63  |
| `::-webkit-scrollbar-thumb` → `background` (clair)        | `rgba(0, 0, 0, 0.1)`        | aucune                        | theme.css:66  |
| `::-webkit-scrollbar-thumb:hover` → `background` (clair)  | `rgba(0, 0, 0, 0.16)`       | aucune                        | theme.css:70  |
| `::-webkit-scrollbar-thumb` → `background` (sombre)       | `rgba(255, 255, 255, 0.08)` | aucune                        | theme.css:75  |
| `::-webkit-scrollbar-thumb:hover` → `background` (sombre) | `rgba(255, 255, 255, 0.14)` | aucune                        | theme.css:78  |
| `::selection` → `background` (clair)                      | `rgba(13, 148, 136, 0.15)`  | aucune (teal `#0D9488` @ 15%) | theme.css:84  |
| `::selection` → `color` (clair)                           | `#111111`                   | aucune                        | theme.css:85  |
| `::selection` → `background` (sombre)                     | `rgba(20, 184, 166, 0.25)`  | aucune (teal `#14B8A6` @ 25%) | theme.css:90  |
| `::selection` → `color` (sombre)                          | `#ffffff`                   | aucune                        | theme.css:91  |
| Drag overlay → `background`                               | `rgba(13, 148, 136, 0.06)`  | aucune (teal `#0D9488` @ 6%)  | theme.js:131  |
| Drag overlay → `border` color                             | `#0D9488` (teal)            | aucune                        | theme.js:132  |
| Drag label → `background`                                 | `rgba(0, 0, 0, 0.85)`       | aucune                        | theme.js:140  |
| Drag label → `border` color                               | `#2a2a2a`                   | aucune                        | theme.js:141  |
| Drag label → `color`                                      | `#ececec`                   | aucune                        | theme.js:142  |
| Drag label → `box-shadow` color                           | `rgba(0, 0, 0, 0.3)`        | aucune                        | theme.js:143  |

**Palette accent (teal) — formes distinctes rencontrées :**

- `#0D9488` (teal foncé) : theme.css:84 (via rgba), theme.js:131-132 — **3 occurrences**
- `#14B8A6` / `rgba(20,184,166,…)` (teal clair) : theme.css:90 — **1 occurrence**

> Les deux teals correspondent (par valeur) à l'accent de marque (`--oh-color-accent-primary:#14b8a6` mentionné dans sidebar.html), mais ils sont écrits **en dur** ici, jamais via token, et **deux nuances différentes** de teal coexistent (`#0D9488` vs `#14B8A6`).

---

## Border-radius réellement utilisés

| Élément                                         | Valeur | Fichier:ligne |
| ----------------------------------------------- | ------ | ------------- |
| `::-webkit-scrollbar-thumb`                     | `3px`  | theme.css:67  |
| Drag overlay (`dragOverlay.style.borderRadius`) | `12px` | theme.js:133  |

> Échelle observée : **2 valeurs distinctes — `3px` et `12px`**. Le label du drag overlay (theme.js:139-144) n'a **AUCUN** `border-radius` défini (NON DÉFINI), alors qu'il a un border, un background et une box-shadow — incohérence relevée plus bas.

---

## Typographie

| Élément                | Font                                                                                               | Size       | Weight     | Line-height | Fichier:ligne    |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ---------- | ---------- | ----------- | ---------------- |
| `:root, html, body`    | `"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` | NON DÉFINI | NON DÉFINI | NON DÉFINI  | theme.css:39-45  |
| `:root` (rendu police) | `-webkit-font-smoothing: antialiased` ; `-moz-osx-font-smoothing: grayscale`                       | —          | —          | —           | theme.css:16-17  |
| Drag label (theme.js)  | NON DÉFINI (hérite)                                                                                | NON DÉFINI | NON DÉFINI | NON DÉFINI  | theme.js:139-144 |

> **Font principale :** stack système Apple — `SF Pro Text` puis `SF Pro Display` en tête, fallback `-apple-system` / `BlinkMacSystemFont` / `Helvetica Neue` / `sans-serif`.
> Aucune taille (`font-size`), aucun poids (`font-weight`), aucun interlignage (`line-height`) n'est défini dans ces 3 fichiers — entièrement délégué aux apps. Le drag label n'impose ni font-size ni font-family.

---

## Espacements (padding / margin / gap)

| Élément                     | Propriété                                    | Valeur              | Fichier:ligne    |
| --------------------------- | -------------------------------------------- | ------------------- | ---------------- |
| `::-webkit-scrollbar`       | `width`                                      | `6px`               | theme.css:59     |
| `::-webkit-scrollbar`       | `height`                                     | `6px`               | theme.css:60     |
| `::-webkit-scrollbar-thumb` | `border` (épaisseur implicite)               | —                   | —                |
| Drag overlay                | `inset`                                      | `0` (plein écran)   | theme.js:130     |
| Drag overlay                | `display:flex / alignItems / justifyContent` | `center` / `center` | theme.js:135-137 |
| Drag label                  | `padding`                                    | NON DÉFINI          | theme.js:139-144 |
| Drag label                  | `margin`                                     | NON DÉFINI          | theme.js:139-144 |

> **Quasi aucun système d'espacement** : seules les dimensions de scrollbar (`6px`) et l'`inset:0` du overlay sont présentes. Pas de tokens d'espacement, pas de `gap`, pas de `padding`/`margin` numériques. Le drag label n'a aucun padding (texte collé aux bords du fond noir) — voir incohérences.

---

## Ombres, transitions, z-index

| Élément                                            | Propriété         | Valeur                                       | Fichier:ligne   |
| -------------------------------------------------- | ----------------- | -------------------------------------------- | --------------- |
| `*:hover`                                          | `box-shadow`      | `none !important` (suppression globale)      | theme.css:110   |
| `*:hover`                                          | `outline`         | `none !important`                            | theme.css:111   |
| `button/[role=button]/.btn/a:hover`                | `box-shadow`      | `none !important` (redondant avec `*:hover`) | theme.css:118   |
| `[class*="ring"/"glow"/"sparkle"]`                 | `box-shadow`      | `none !important`                            | theme.css:126   |
| `[class*="ring"/"glow"/"sparkle"]`                 | `animation`       | `none !important`                            | theme.css:125   |
| `[data-role=modal], [role=dialog]`                 | `animation`       | `none !important`                            | theme.css:132   |
| `button/[role=button]/.btn:active`                 | `opacity`         | `0.8 !important`                             | theme.css:105   |
| Drag label                                         | `box-shadow`      | `0 8px 32px rgba(0, 0, 0, 0.3)`              | theme.js:143    |
| Drag overlay                                       | `z-index`         | `999999`                                     | theme.js:130    |
| **Transitions (tokens définis mais non utilisés)** | `--oh-transition` | `150ms cubic-bezier(0.4,0,0.2,1)`            | theme.css:30    |
| **Easing tokens (non utilisés)**                   | `--oh-ease-*`     | voir tableau Tokens                          | theme.css:20-23 |
| **Durations tokens (non utilisés)**                | `--oh-duration-*` | `75/150/250/350ms`                           | theme.css:25-28 |

> **Une seule ombre réelle** appliquée : `0 8px 32px rgba(0,0,0,0.3)` (drag label, theme.js:143).
> **Un seul z-index** : `999999` (drag overlay, theme.js:130).
> Les tokens de transition/easing/duration sont **déclarés mais jamais consommés** dans ces fichiers (aucune propriété `transition:` n'utilise `var(--oh-transition)`).
> Politique globale agressive : suppression de TOUTES les `box-shadow`/`outline` au hover via `*:hover` (theme.css:109-112) et suppression d'animations sur `ring/glow/sparkle` + dialogs.

---

## Incohérences internes détectées

1. **Tokens d'animation morts (définis, jamais utilisés).** `--oh-ease-default/in/out/spring`, `--oh-duration-75/150/250/350`, `--oh-transition` sont déclarés (theme.css:20-30) mais aucune règle de ces fichiers ne les consomme. Code décoratif inerte. (theme.css:20-30 vs reste du fichier)

2. **Tokens `--oh-*` de marque NON réutilisés ; couleurs 100 % hardcodées.** Alors que `sidebar.html` expose `--oh-color-accent-primary:#14b8a6`, cette vue n'utilise aucune `var(--oh-color-*)`. Tout l'accent teal est écrit en dur (theme.css:84, theme.js:131-132). Le contrat « système de tokens » n'est pas respecté ici.

3. **Deux nuances de teal pour le même rôle « accent ».** `#0D9488` (theme.css:84, theme.js:131-132) coexiste avec `#14B8A6` (theme.css:90). En mode clair la sélection et l'overlay utilisent `#0D9488` ; en mode sombre la sélection passe à `#14B8A6`. Choix possiblement intentionnel (dark vs light) mais **non tokenisé**, donc fragile et incohérent avec le token unique de marque.

4. **Drag overlay vs drag label : radius incohérent.** L'overlay a `border-radius:12px` (theme.js:133) mais le label interne n'a **AUCUN** `border-radius` (theme.js:139-144) alors qu'il porte un border, un background opaque et une box-shadow → coins carrés sur une carte qui devrait être arrondie. Incohérence visuelle directe.

5. **Drag label sans padding ni typographie.** Le label (theme.js:139-144) définit background/border/color/box-shadow/texte mais **aucun `padding`, aucun `font-size`, aucun `font-family`** → texte collé aux bords, taille de police héritée non maîtrisée.

6. **Échelle de border-radius incohérente / non systématisée.** Deux valeurs sans relation (`3px` scrollbar theme.css:67 ; `12px` overlay theme.js:133), aucune échelle commune, aucun token radius.

7. **Règle `*:hover` trop large (collatéraux).** `*:hover { box-shadow:none !important; outline:none !important }` (theme.css:109-112) supprime aussi les **outlines de focus au survol**, ce qui peut nuire à l'accessibilité (focus-visible masqué) — et rend redondante la règle `button…:hover` (theme.css:114-119).

8. **Bloc de règle vide.** Le sélecteur `button, [role="button"], .btn, a { }` (theme.css:96-100) est vide → résidu mort.

9. **Mode clair vs sombre : valeurs neutres non symétriques/non tokenisées.** Fond clair `#ffffff`/texte `#111111` (theme.css:37-38) vs fond sombre `#0a0a0a`/texte `#ececec` (theme.css:52-53). Aucune relation tokenisée ; valeurs en dur des deux côtés, dupliquées avec les scrollbars (`rgba(0,0,0,*)` vs `rgba(255,255,255,*)`).

10. **`layout.css` totalement vide de règles** (layout.css:1-6) : présent dans le système d'overrides mais n'apporte aucune valeur design (signalé, non un défaut en soi).

---

## Tableau récapitulatif des valeurs DISTINCTES (par catégorie)

- **Couleurs neutres :** `#ffffff`, `#111111`, `#0a0a0a`, `#ececec`, `#2a2a2a`, `transparent` + alphas `rgba(0,0,0,0.1/0.16/0.3/0.85)`, `rgba(255,255,255,0.08/0.14)`.
- **Accent teal :** `#0D9488` (×3), `#14B8A6`/`rgba(20,184,166,…)` (×1), `rgba(13,148,136,0.06/0.15)`.
- **Border-radius :** `3px`, `12px`.
- **Dimensions :** scrollbar `6px`, overlay `inset:0`, z-index `999999`.
- **Ombre :** `0 8px 32px rgba(0,0,0,0.3)` (unique).
- **Font :** stack Apple `SF Pro Text/Display → -apple-system → BlinkMacSystemFont → Helvetica Neue → sans-serif` (unique). Aucune size/weight/line-height.
- **Animation tokens :** 4 easings + 4 durations + 1 transition (tous inutilisés).
