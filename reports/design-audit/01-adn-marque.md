# 01 — ADN de marque OpenHub

> PHASE 1 de l'audit design final. Ce document assimile l'ADN de la marque
> AVANT tout jugement esthétique. Aucune valeur n'est inventée : si une
> donnée est absente, elle est notée "NON DEFINI" ou "A VERIFIER".
>
> Sources lues en entier : `fichier-de-la-marque/manifesto.md`,
> `plateforme_de_marque.md`, `audiences.md`, `ton_et_voix.md`,
> `matrice_messaging.md`, `architecture_marque.md`, `LOGO.md`, `README.md`.
>
> Auteur : direction artistique senior. Date : 2026-06-14.

---

## Mission, vision, valeurs

**Mission** (source : `plateforme_de_marque.md:13-16`)
OpenHub rassemble les meilleurs outils de création assistée par IA — code,
design, workflow — dans une interface macOS unique et fluide, pour que les
builders se concentrent sur **ce qu'ils construisent** plutôt que sur
**comment** ils le construisent. En clair : le hub efface l'infrastructure
pour laisser place à la création.

**Vision** (source : `plateforme_de_marque.md:24-27`)
Un écosystème open-source où la frontière entre coder, concevoir et
orchestrer disparaît. Chaque dev/designer accède à des agents IA puissants
sans jongler entre cinq apps, cinq terminaux et cinq clés API. "Une seule
fenêtre. Une seule config. Zéro friction."

**Valeurs** (source : `plateforme_de_marque.md:31-61`) — cinq piliers :

1. **Intégrité du source** — on ne modifie jamais le code upstream ;
   l'injection CSS/JS est "un pont, pas une prison" (`:33-37`).
2. **Unité sans uniformité** — chaque outil garde sa personnalité ; le hub
   est le liant, pas le rouleau compresseur (`:39-43`).
3. **Transparence radicale** — MIT, proxy local vérifiable, zéro télémétrie,
   secrets dans le Keychain (`:45-49`).
4. **Accessibilité technique** — pas de terminal obligatoire, pas de YAML à
   la main, configurable en 3 clics sans sacrifier les power users (`:51-55`).
5. **Qualité sans compromis** — 60 fps, guidelines macOS strictes,
   composants testés ; "l'open-source n'est pas une excuse pour le bâclage"
   (`:57-61`).

Le **manifeste** (`manifesto.md`) confirme l'esprit en quatre antithèses
fondatrices : "Nous ne fusionnons pas, nous réunissons" (`:28`), "Nous ne
suivons pas, nous contrôlons" (`:34`), "Nous ne compliquons pas, nous
clarifions" (`:41`), "Nous ne décorons pas, nous concevons" (`:47`). Le
manifeste précise aussi le crédo design : "La grille de 8px n'est pas
négociable" et "Rien n'est laid. Rien n'est gratuit. Rien n'est laissé au
hasard." (`:52`).

---

## Personnalité de marque (5 adjectifs clés)

Source primaire : `ton_et_voix.md:13-19` (table "Si OpenHub était une
personne") complétée par les attributs de `plateforme_de_marque.md:108-114`.

1. **Calme** — "Ne crie pas, n'utilise pas d'emojis en rafale"
   (`ton_et_voix.md:17`). Renforcé par le spectre "Sérieux 60% / Léger 40%"
   (`ton_et_voix.md:49-54`) : on peut être léger, jamais au détriment de la
   clarté.

2. **Directe** — "Va à l'essentiel, pas de jargon inutile"
   (`ton_et_voix.md:16`) ; principe éditorial "Une idée par phrase"
   (`ton_et_voix.md:60-67`) et "Verbes d'action, pas noms abstraits"
   (`ton_et_voix.md:69-76`).

3. **Élégante / raffinée** — attribut "Élégant : Beau, fluide, pensé dans
   les détails — macOS-native" (`plateforme_de_marque.md:112`) ; manifeste :
   "Nous ne décorons pas. Nous concevons." (`manifesto.md:47`).

4. **Fiable** — "Dit ce qu'elle fait, fait ce qu'elle dit"
   (`ton_et_voix.md:18`) ; attribut "Fiable : Stable, prévisible, sans
   surprise" (`plateforme_de_marque.md:113`).

5. **Ouverte / transparente** — "Partage ses sources, reconnaît ses limites"
   (`ton_et_voix.md:19`) ; valeur "Transparence radicale"
   (`plateforme_de_marque.md:45-49`) ; attribut "Libre"
   (`plateforme_de_marque.md:114`).

Contre-personnalité explicite (ce que la marque N'EST PAS,
`ton_et_voix.md:21-26`) : pas "cool/fun" (on fait un outil, pas une
startup), pas "corporate" (pas de "synergy/leverage/ecosystem"), pas
"mystique" (pas de "magic/revolutionary/game-changing"), pas "agressive"
(on ne descend jamais les concurrents).

---

## Public cible et leurs attentes

Trois segments techniques mais non uniformes
(source : `audiences.md:15-19`) :

| Segment                           | Poids V1 | Priorité | Source                 |
| --------------------------------- | -------- | -------- | ---------------------- |
| Thomas — dev full-stack solo      | 45%      | Critique | `audiences.md:23-69`   |
| Léa — designer technique          | 30%      | Haute    | `audiences.md:72-119`  |
| Karim — tech lead / petite équipe | 25%      | Moyenne  | `audiences.md:122-168` |

**Thomas (dev solo)** — souffre du contexte-switching ("12 apps ouvertes",
"Cmd+Tab cauchemar", `audiences.md:47`) et de la config éparpillée ("3 clés
différentes", `:48`). Attend "une seule fenêtre", "configure une fois",
"léger, natif, une vraie app Mac" (`:55-58`). Émotions cibles aux moments
clés : "C'est déjà prêt ?", "3 clics et c'est bon", "Fluide, instantané",
"Rien n'a cassé" (`:62-68`).

**Léa (designer technique)** — a peur du terminal et de l'environnement de
dev (`audiences.md:97-104`). Attend une app qui marche sans toucher au
terminal, code et design côte à côte, et surtout : "C'est beau. Je peux le
montrer à d'autres designers **sans m'excuser du look**" (`:110`). Risque
de perte majeur : "Aspect brut / technique", "Interface intimidante"
(`:116-118`). C'est le persona le plus exigeant sur l'esthétique.

**Karim (tech lead)** — évalue pour l'équipe : veut une seule install, une
config centralisée, savoir où vont les données, et pouvoir auditer le code
(`audiences.md:154-158`). Risque de perte : "Encore un wrapper ?", "Opacité
du proxy" (`:162-167`).

**Carte d'empathie commune** (`audiences.md:187-224`) — tous pensent : "Je
veux créer, pas configurer" ; "la puissance de l'IA sans la complexité de
l'infra" ; "chaque friction est une perte". Gains recherchés : **Fluidité,
Contrôle, Élégance, Temps** (`:218-224`).

**Non-audiences V1** (`audiences.md:171-181`) : Windows/Linux, grand public
non-tech, grandes orgs (50+ devs), designer pur zéro-code, mobile. Le design
ne doit donc PAS chercher à séduire le grand public ni à se "grand-publiser".

---

## Message principal que l'UI doit transmettre

**Promesse / Big Idea** (sources convergentes :
`manifesto.md:84`, `plateforme_de_marque.md:90`, `matrice_messaging.md:10`) :

> **"Une fenêtre. Trois outils. Zéro friction."**

Décliné en ce que l'utilisateur doit RESSENTIR en 5 minutes
(`plateforme_de_marque.md:92-96`) :

- "J'ai tout sous les yeux, sans changer de fenêtre." (unité)
- "J'ai configuré une seule fois, tout fonctionne." (zéro friction)
- "Mes données restent chez moi, je comprends ce qui se passe." (contrôle)

Et ce qu'il ne doit JAMAIS ressentir (`plateforme_de_marque.md:98-102`) :
"Je ne sais pas quel outil utilise quoi", "Encore un truc à configurer ?",
"Où sont passées mes clés API ?".

Les **4 piliers de la message house** que l'UI matérialise
(`matrice_messaging.md:162-166`) : **Unité, Contrôle, Respect, Fluidité.**

---

## Ce que le design DOIT évoquer

Synthèse traçable de toutes les sources :

- **Une fenêtre macOS native, pas une app Electron générique** — "macOS-
  native", "respect strict des guidelines macOS", "léger, natif"
  (`plateforme_de_marque.md:59-61,112` ; `audiences.md:58`).
  Référence explicite : interface "inspirée de l'app native Claude macOS"
  (`README.md:4`, `:8`).
- **L'unité par la forme, pas par l'uniformité** — un thème commun qui lie
  sans gommer ; chaque outil garde sa personnalité
  (`plateforme_de_marque.md:39-43`).
- **Calme, clarté, respiration** — le vide central du logo = "zéro friction,
  l'espace libéré pour ce que l'utilisateur crée" (`LOGO.md:21`). La grille
  8px structure tout (`manifesto.md:52`).
- **Intentionnalité totale** — "Chaque animation, chaque espacement, chaque
  ombre a une raison d'être" (`manifesto.md:49-52`). "Rien n'est gratuit."
- **Confiance et contrôle** — l'UI doit donner le sentiment que l'utilisateur
  est maître (Keychain, proxy local, pas de cloud obligatoire)
  (`manifesto.md:36-39` ; pilier Contrôle `matrice_messaging.md:164`).
- **Fluidité** — 60 fps, transitions instantanées entre slots, "ton contexte
  est préservé" (`plateforme_de_marque.md:59` ; `audiences.md:66`).
- **Trois entités égales** — Work, Code, Design ; "aucun n'est privilégié,
  aucun n'est déformé" (`LOGO.md:16`).
- **Ouverture / transparence** — "l'ouverture en haut" du logo = open-source,
  rien n'est scellé (`LOGO.md:19`).
- **Beauté assumée** — le design doit être suffisamment soigné pour que Léa
  le montre "sans s'excuser du look" (`audiences.md:110`).

**Repères chromatiques et géométriques tracés dans la marque :**

- Accent unique **teal `#14B8A6`** (`LOGO.md:50`), variantes
  `#0D9488` (light, `:51`) et `#ECECEC` (sur fond sombre, `:50`).
- Fond sombre de l'icône macOS `#0A0A0A` (`LOGO.md:56`), mono `#111111`
  (`:52`).
- Géométrie au **nombre d'or** (φ = 1,618) : ratio extérieur/intérieur = φ,
  extrémités rondes `stroke-linecap: round` (`LOGO.md:28-44`). Le radius et
  l'iconographie de l'UI devraient hériter de ce vocabulaire d'arrondis.
- NOTE : la palette UI complète (`--oh-*`, ex. `--oh-color-accent-primary`)
  est définie hors des 8 fichiers lus — voir `brand_colors.json`,
  `typography.json`, `design_system.md` et `electron/sidebar.html`.
  Cohérence à VERIFIER en phase ultérieure.

---

## Ce que le design NE DOIT PAS évoquer

- **Pas de "startup cool/fun"** ni d'emojis en rafale (`ton_et_voix.md:17,23`).
- **Pas de "corporate"** : pas de jargon "synergy/leverage/ecosystem"
  (`ton_et_voix.md:24`).
- **Pas de "mystique/hype"** : ni "magic", ni "révolutionnaire", ni
  "game-changing" (`ton_et_voix.md:25` ; `matrice_messaging.md:151`).
- **Pas d'agressivité** : on ne descend jamais les concurrents
  (`ton_et_voix.md:26`).
- **Pas de décoration gratuite** : aucune animation/ombre/espacement sans
  raison (`manifesto.md:47-52`).
- **Pas l'impression d'une app Electron lourde, brute ou non-native** —
  c'est précisément la frustration de Thomas et le risque de perte de Léa
  (`audiences.md:50,116`).
- **Pas de fragmentation visuelle** : l'utilisateur ne doit jamais se sentir
  perdu entre les outils ("Je ne sais pas quel outil utilise quoi",
  `plateforme_de_marque.md:100`).
- **Pas de friction de configuration ressentie** ("Encore un truc à
  configurer ?", `plateforme_de_marque.md:101`).
- **Pas de superlatifs visuels ("le plus incroyable")** — la qualité se
  prouve, ne s'annonce pas (`ton_et_voix.md:78-82`).
- **Spécifique logo (interdits durs, `LOGO.md:75-83`)** : jamais déformer/
  étirer/pivoter la marque (ouverture toujours en haut) ; jamais fermer les
  respirations ni relier les segments ; jamais colorer les segments
  différemment ; **jamais le violet v1 `#7B67EE` (purgé en v2)** ; jamais
  rien dans le vide central ; jamais d'ombre portée, dégradé ou contour sur
  le logo.
- **Pas de couleur-par-outil** : la v2 a abandonné l'idée d'une teinte par
  app ; l'unité passe par la forme et un accent teal unique (`LOGO.md:22`).

---

## Critères de jugement (actionnables pour l'audit design)

Liste de contrôle concrète pour évaluer plus tard si le design "colle" à la
marque. Chaque critère est testable.

### A. Couleur & accent

1. L'accent primaire doit être le **teal `#14B8A6`** (dark) / `#0D9488`
   (light) ; vérifier que `--oh-color-accent-primary` correspond
   (`LOGO.md:50-51`).
2. **Aucune trace de violet `#7B67EE`** (v1 purgée) nulle part dans l'UI ou
   les overrides (`LOGO.md:80`).
3. **Pas de couleur dédiée par slot** (Work/Code/Design ne doivent pas avoir
   chacun leur teinte de marque) — l'unité passe par la forme (`LOGO.md:22`).
4. Contrastes WCAG : viser AA minimum sur texte/éléments graphiques, en
   cohérence avec les ratios documentés (teal/`#0A0A0A` = 6,5:1 ;
   `#ECECEC`/`#0A0A0A` = 17,4:1) (`LOGO.md:85-88`).
5. Le fond sombre de référence est très sombre (`#0A0A0A`/`#111111`) : le
   thème sombre est le défaut, pas un afterthought (`manifesto.md:51` ;
   `LOGO.md:52,56`).

### B. Forme, radius & géométrie

6. Le **radius et l'iconographie** doivent traduire le vocabulaire du logo :
   extrémités/arrondis cohérents avec `stroke-linecap: round` et l'esprit
   φ (`LOGO.md:36-44`). A VERIFIER contre le design system.
7. Les **icônes de slots** sont des icônes stylisées de l'icon set OpenHub
   (grid/code/layers), **pas** les logos originaux des outils
   (`architecture_marque.md:49-59`).
8. Présence de **respiration / vide** comme élément de design intentionnel
   (le vide central du logo = zéro friction) — densité maîtrisée, pas
   d'entassement (`LOGO.md:21`).

### C. Espacement & rythme

9. Tout l'espacement doit s'aligner sur une **grille de 8px**
   (non négociable, `manifesto.md:52`).
10. Chaque espacement/ombre/animation doit avoir une justification ; pas de
    décoration gratuite (`manifesto.md:49-52`).

### D. Typographie

11. Typographie **système macOS (SF Pro)** privilégiée pour le sentiment
    natif (`ton_et_voix.md:80` ; `manifesto.md:52`). Détail à VERIFIER dans
    `typography.json`.

### E. Sensation native macOS & fluidité

12. L'UI doit donner le sentiment d'une **app Mac native**, pas d'un wrapper
    Electron générique (`README.md:4` ; `audiences.md:58,116`).
13. Transitions/animations à **60 fps**, switch entre slots instantané et
    sans perte de contexte ressentie (`plateforme_de_marque.md:59` ;
    `audiences.md:66`).

### F. Unité sans uniformité

14. Le shell (sidebar, nav-popup, settings, chat, orchestrateur) doit former
    une **enveloppe visuellement cohérente** ; les vues internes codées par
    nous partagent les mêmes tokens (`plateforme_de_marque.md:39-43`).
15. Le shell **ne déforme pas** l'identité des apps tierces ; il les habille
    via thème commun sans gommer leur personnalité (`manifesto.md:30-32` ;
    `ton_et_voix.md:243-250`).

### G. Confiance & contrôle (design émotionnel)

16. L'UI doit rendre **visible et rassurant** le contrôle utilisateur
    (statut proxy local, clés Keychain, pas de cloud) sans anxiogéner
    (`manifesto.md:36-39` ; `audiences.md:166`).
17. Les **empty states** disent ce que l'utilisateur peut faire, jamais ce
    qui manque ; ton calme et orienté action (`ton_et_voix.md:142-149`).

### H. Ton visuel & retenue

18. **Zéro emoji en rafale**, zéro élément "fun/hype/corporate" dans l'UI
    (`ton_et_voix.md:17,23-25`).
19. Beauté assez soignée pour être montrable "sans s'excuser du look"
    (test Léa, `audiences.md:110`).
20. **Trois entités égales** : aucun slot visuellement privilégié ou
    déformé par rapport aux autres (`LOGO.md:16`).

### I. Logo & marque

21. Logo OpenHub = **seul logo visible** dans l'UI (favicon, dock, splash) ;
    pas de logos upstream (`architecture_marque.md:43-47`).
22. Respect strict des interdits logo (ouverture en haut, respirations
    ouvertes, segments non reliés, pas d'ombre/dégradé/contour)
    (`LOGO.md:75-83`).
23. Zone de protection du logo respectée (~62 % du diamètre, le vide fait
    partie du logo) (`LOGO.md:62-66`).

---

## Notes de traçabilité / à vérifier en phases suivantes

- Le système de tokens UI `--oh-*` cité dans le brief n'est PAS défini dans
  les 8 fichiers de marque lus ; il vit dans `brand_colors.json`,
  `typography.json`, `design_system.md` et `electron/sidebar.html`.
  **Cohérence tokens ↔ marque : A VERIFIER.**
- Licences OpenWork et OpenDesign : "À vérifier" dans la source elle-même
  (`architecture_marque.md:96,98`). Hors périmètre design mais noté.
- Le design system détaillé (`design_system.md`, 41 Ko) n'entrait pas dans
  la liste de lecture de la Phase 1 ; il sera la référence visuelle de la
  phase suivante.
