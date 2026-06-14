# OpenHub — Défauts NON corrigés (passation pour une nouvelle conversation)

> **But de ce fichier :** liste des problèmes de l'orchestrateur multi-agents qui restent
> **ouverts**. Chaque section contient le contexte complet + un **prompt prêt à coller**.
> Tu peux ouvrir une nouvelle conversation, donner ce fichier, et copier un prompt.
> Tout doit rester **déterministe et général** (marche pour TOUT sujet, pas juste un cas).

---

## 0. Contexte global du projet (À LIRE EN PREMIER)

**OpenHub** = shell Electron (macOS) qui unifie 3 outils IA open-source derrière une sidebar
(Work, Code, Design). Il contient un **orchestrateur multi-agents** : un DAG d'agents IA qui
produisent ensemble un livrable (site web, rapport, ebook, librairie de code, étude, slides…)
dans un **workspace** (dossier de fichiers).

### Fichiers clés de l'orchestrateur

- `electron/orchestrator-runner.ts` — moteur : planification (`generatePlanningIterative`),
  exécution du DAG (`executeNodesSequence`, `executeNode`, `executeMultiTurn`), quality gate
  (`runQualityGate`), cycle correctif (`runAutoQualityLoop`, `runCorrectiveCycle`),
  extraction de fichiers (`extractAndWriteFiles`), chemin sans-verifier (`warnOnBrokenAssets`).
- `electron/orchestrator-quality.ts` — TOUS les détecteurs déterministes + le contrat `checks`.
- `electron/orchestrator-prompts.ts` — prompts de planification + règles qualité par type d'agent.
- `electron/orchestrator-quality.test.ts` — tests unitaires (pattern `mkdtemp` + `realFs`).
- `electron/orchestrator-backends/{opencode,design}-backend.ts` — backends OpenCode / Open Design.

### Principe directeur (NON NÉGOCIABLE)

**Le LLM remplit le contrat, le SYSTÈME l'impose déterministiquement.** Réduire au maximum la
dépendance au LLM (l'utilisateur emploie souvent de petits modèles — gemini-flash, deepseek-flash —
qui hallucinent). KISS / YAGNI / immutabilité (jamais muter, toujours copier). NE JAMAIS modifier
le code des 3 apps upstream (`apps/openwork`, `apps/opencode`, `apps/open-design`).

### Architecture déterministe existante (à RÉUTILISER, ne pas réinventer)

- **Détecteurs** (dans `orchestrator-quality.ts`) retournant tous le shape `ServedSiteProblem`
  `{ sourceFile: string; problem: string }` : `findBrokenAssetRefs`, `findUncodedMockups`,
  `findServedSiteProblems`, `findCssConsistencyProblems`, `findInvalidJsonFiles`,
  `findCsvColumnProblems`, `findPlaceholderDeliverables`, `findUnreferencedModules`,
  `findConsolidationShrinkage`, `findUnstyledClasses`, `validateDeclaredChecks`.
- **Helper de parcours** `collectFiles(workspaceDir, match, maxFiles?, maxDepth?)` →
  `{ rel, full }[]` (skip déjà `.`/`node_modules`/`design`).
- **Helper served-roots** `discoverServedRoots(workspaceDir)` → dossiers contenant du HTML.
- **Branchement force-fail** : dans `runQualityGate`, pousser les problèmes dans le tableau
  `servedProblems` (hérite automatiquement du force-fail `deterministicIssues` →
  `verdict.pass = … && deterministicIssues.length === 0` → déclenche le cycle correctif).
- **Branchement warning** : dans `warnOnBrokenAssets` (tableau `served`), non-bloquant.
- **Contrat `checks`** : `assign_task` accepte un paramètre `checks` (par fichier :
  `minWords`/`minItems`/`minSections`/`requiredSubstrings`/`format`), validé par `sanitizeChecks`,
  enforce par `validateDeclaredChecks`. `ChecksMap = Record<chemin, FileChecks>`.
- **Tests** : ajouter dans `orchestrator-quality.test.ts` avec `realFs.mkdtemp` + `realFs.writeFile`.

### Vérification attendue à chaque changement

`npx tsc --noEmit` puis `npx tsc -p tsconfig.json` (build dist/) puis `npx vitest run`
(actuellement **218 tests, 0 échec**) puis `npx eslint <fichiers> -f stylish` (0 erreur ;
seulement des warnings `strict-boolean-expressions` préexistants).

### Ce qui est DÉJÀ corrigé (ne PAS refaire) — voir `ORCHESTRATEUR_100_AUDIT_2026-06-14.md`

Domain-agnostic (plus de biais « tout est web »), watchdog, fail-fast modèle, extracteur fusionné,
trivial-backend, contrat `checks` (minWords/minItems/minSections/CSV/JSON/placeholder),
enforcement de profondeur (relance jusqu'au volume cible + plancher de mots),
`findConsolidationShrinkage` (final trop court vs sources), `findUnstyledClasses` (CSS sans règle),
checks web étendus à tout dossier HTML (`presentation/`…).

---

## DÉFAUTS NON CORRIGÉS

### ⚠️ Preuve réelle (workspaces de test, peuvent être supprimés mais le constat tient)

- `teste/` (étude de marché VE) : `regulations_2026.md` existait en **4 versions DIFFÉRENTES**
  (md5 distincts, 1019→3339 octets) à la racine + `legal/` + `reports/` + `research/` ;
  `market_figures.md` en 3 versions ; `design_system.css` en 3 copies. + `sitemap.xml`,
  `robots.txt` (×3), `seo/robots.txt`, `package.json`, présentation web — pour un **document**.
  - `scripts/data_processor.ts` + tests TS — pour une **étude de marché**.

---

## PROBLÈME 1 — Duplication AVEC divergence (« le pire » selon l'utilisateur)

**Symptôme :** plusieurs agents écrivent le même fichier logique (même basename) à des emplacements
différents, avec des **contenus différents**. Résultat : aucune source de vérité, incohérence
(ex : 4 versions de `regulations_2026.md`). Aucun détecteur ne le voit aujourd'hui.

**Prompt à coller :**

```
Dans le repo OpenHub (lis d'abord ORCHESTRATEUR_TODO_NON_CORRIGE.md §0 pour le contexte et les
conventions), ajoute un détecteur déterministe `findDivergentDuplicates(workspaceDir)` dans
electron/orchestrator-quality.ts qui retourne des ServedSiteProblem.

Objectif : repérer les fichiers de MÊME basename présents à ≥2 emplacements (hors design/,
node_modules, dotdirs) dont le CONTENU DIVERGE (hash différent). C'est le défaut le plus grave
remonté par l'utilisateur (ex: regulations_2026.md en 4 versions différentes).

Exigences :
- Réutilise le helper collectFiles. Groupe par basename (insensible casse). Pour chaque groupe de
  ≥2 fichiers, compare le contenu (normalise les fins de ligne/espaces avant hash). Si ≥2 contenus
  distincts → un problème par groupe, listant les chemins et leurs tailles.
- Garde-fous anti-faux-positifs : EXCLUS les basenames légitimement multiples (index.html,
  styles.css, package.json, README.md, robots.txt, sitemap.xml, __init__.py, mod.ts, etc.) — ces
  fichiers existent normalement dans plusieurs served roots. Concentre-toi sur les fichiers de
  CONTENU (.md, .json, .csv, .txt) hors served roots. Cap ~30 problèmes.
- Sévérité : commence en WARNING (branché dans warnOnBrokenAssets), PAS force-fail, car un même
  basename divergent peut parfois être légitime (versions par section). Documente le compromis.
- Message clair : "fichier dupliqué avec contenus divergents : a/x.md (N1 o), b/x.md (N2 o) — une
  seule source de vérité, supprime/fusionne les copies".
- Branche-le dans warnOnBrokenAssets (orchestrator-runner.ts) ET ajoute des tests unitaires
  (orchestrator-quality.test.ts, pattern mkdtemp) : 2 copies divergentes → flag ; 2 copies
  identiques → 0 ; index.html en double → 0 (exclu).
- Vérifie : tsc --noEmit, build, vitest run (0 échec), eslint (0 erreur).
```

---

## PROBLÈME 2 — Fichiers éparpillés (même contenu dans 3+ dossiers)

**Symptôme :** le MÊME contenu (ou quasi) écrit à la racine + `research/` + `reports/` + `legal/`.
Différent du Problème 1 : ici le contenu peut être identique mais dispersé sans logique. Les agents
ne coordonnent pas les chemins. Recoupe partiellement le Problème 1 — peut être le même détecteur
avec un volet « copies identiques redondantes ».

**Prompt à coller :**

```
Dans le repo OpenHub (lis ORCHESTRATEUR_TODO_NON_CORRIGE.md §0), étends le détecteur de duplication
(Problème 1) ou ajoute un volet : signaler aussi les fichiers de contenu IDENTIQUES présents dans
3+ emplacements différents (éparpillement). Le souci : les agents écrivent le même livrable à la
racine + research/ + reports/ + legal/, sans source de vérité unique.
- Warning non-bloquant. Réutilise collectFiles + le groupement par basename.
- Garde-fous identiques au Problème 1 (exclure index.html/styles.css/package.json/README, etc.).
- Idéalement, le vrai fix est en amont : dans le prompt de planification (orchestrator-prompts.ts),
  ajoute une consigne FORTE "chaque livrable a UN emplacement canonique ; n'écris pas le même
  contenu dans plusieurs dossiers ; déclare le bon chemin dans expected_files". Fais les deux
  (détecteur + prompt).
- Tests + vérif (tsc/build/vitest/eslint).
```

---

## PROBLÈME 3 — Scaffolding web inutile pour un document/données

**Symptôme :** pour une étude de marché ou un guide (livrable = document), l'orchestrateur produit
quand même `sitemap.xml`, `robots.txt` (parfois ×3), `seo/robots.txt`, `package.json`, une
présentation web complète. Reste du biais web. Pollue le livrable.

**Prompt à coller :**

```
Dans le repo OpenHub (lis ORCHESTRATEUR_TODO_NON_CORRIGE.md §0), ajoute un détecteur déterministe
`findUnwantedWebScaffolding(workspaceDir)` dans orchestrator-quality.ts (retourne ServedSiteProblem).

Objectif : signaler le scaffolding web (sitemap.xml, robots.txt, seo/, package.json de site,
manifest.json) quand le livrable N'EST PAS un vrai site web — c.-à-d. quand le workspace ne contient
pas de vraie page HTML servie substantielle. Détermine "pas un site" déterministiquement : aucun
dossier served-root (discoverServedRoots) avec un index.html/page HTML non-triviale, OU la majorité
des livrables sont des .md/.json/.csv (document/données).

Exigences :
- Warning non-bloquant (le but est de nettoyer, pas de bloquer un run utile). Le scaffolding n'est
  pas "faux" en soi, juste hors-sujet pour un document.
- Garde-fous : si un VRAI site HTML existe (served root avec pages réelles), NE rien signaler
  (sitemap/robots sont alors légitimes).
- En complément amont : renforce le prompt de planification (orchestrator-prompts.ts) — "n'assigne
  PAS de SEO/sitemap/robots/package.json si le livrable est un document/rapport/données sans
  interface web".
- Branche dans warnOnBrokenAssets. Tests (mkdtemp : workspace .md-only avec sitemap.xml → flag ;
  workspace avec public/index.html réel + sitemap.xml → 0). Vérif tsc/build/vitest/eslint.
```

---

## PROBLÈME 4 — Code/agents tangentiels (sur-déclenchement de la couverture)

**Symptôme :** pour une étude de marché, le bloc de couverture « DONNÉES/ANALYSE » du prompt de
planification a fait créer un agent code qui écrit `scripts/data_processor.ts` + `validate_data.ts`

- tests TS — non demandés, hors-sujet. La couverture par domaine sur-déclenche.

**Prompt à coller :**

```
Dans le repo OpenHub (lis ORCHESTRATEUR_TODO_NON_CORRIGE.md §0), le bloc "COUVERTURE OBLIGATOIRE
SELON LE DOMAINE" de buildIterativePlanningSystemPrompt (orchestrator-prompts.ts) fait parfois
sur-produire : pour une étude de marché (document), il crée un agent code avec scripts + tests TS
non demandés ("données/analyse" interprété trop largement).

Corrige au niveau du PROMPT (pas de détecteur ici — c'est un problème de cadrage de planification) :
- Reformule le bloc "SI DONNÉES/ANALYSE" pour distinguer "analyse de données = livrable technique
  avec code" VS "document qui contient des chiffres/tableaux" (où des .md/.csv suffisent, sans
  scripts/tests). Le code/scripts ne doit être assigné QUE si l'utilisateur demande explicitement
  un traitement programmatique reproductible.
- Principe général à renforcer dans le prompt : "NE crée QUE les agents/livrables réellement
  nécessaires au livrable demandé. Pas de scaffolding (tests, scripts, SEO, maquettes) si la
  demande ne l'implique pas. Moins d'agents parasites = meilleure cohérence."
- Vérifie que orchestrator-prompts.test.ts passe toujours (il check la présence des 5 rôles).
- tsc/build/vitest/eslint.
```

---

## PROBLÈME 5 — Biais web résiduel (agent design pour un livrable texte)

**Symptôme :** pour un guide de nutrition (texte), un agent `design` a produit
`maquette_page_type.html` + `style_guide.css`. Mineur, mais inutile. Réduit par les Rank 3/4
(prompt) mais pas garanti — un planificateur peut encore spinner un agent design.

**Prompt à coller :**

```
Dans le repo OpenHub (lis ORCHESTRATEUR_TODO_NON_CORRIGE.md §0), renforce le cadrage anti-biais-web
pour qu'un agent "design" (Open Design = maquettes web HTML/CSS) ne soit JAMAIS assigné quand le
livrable n'a pas d'interface (guide texte, rapport, ebook, données).

- Au niveau du prompt de planification (orchestrator-prompts.ts) : règle explicite "design = SI ET
  SEULEMENT SI le livrable final est un site/app web ou une UI. Pour un document/rapport/guide,
  N'assigne PAS d'agent design ; le rendu se fait en .md (ou un seul HTML simple via un agent work
  si une mise en forme est demandée), pas via une maquette."
- Optionnel : check déterministe léger en warning — si des fichiers mockups/*.html ou un agent
  design ont produit des artefacts ALORS que le reste du workspace est purement documentaire
  (.md/.json/.csv, aucun site servi réel), signaler "agent design inutile pour un livrable texte".
- Tests + tsc/build/vitest/eslint.
```

---

## PROBLÈME 6 (ARCHI, gros) — Exécution séquentielle / parallélisme

**Symptôme :** l'exécution est strictement séquentielle (un nœud après l'autre). Un ebook 12
chapitres / wiki multi-articles prend somme(durées) au lieu de max(durées). **DANGEREUX à
paralléliser tel quel** : `executeNode` mute un état GLOBAL `setActiveProject(node.id)` et le proxy
route les instructions par requête via `getActiveProject()` → une course corromprait les system
prompts.

**Prompt à coller :**

```
Dans le repo OpenHub (lis ORCHESTRATEUR_TODO_NON_CORRIGE.md §0), conçois (PLAN d'abord, puis
implémentation) la parallélisation de l'exécution du DAG. PRÉREQUIS BLOQUANT à régler en premier :
aujourd'hui executeNode (orchestrator-runner.ts) appelle setActiveProject(node.id) (état GLOBAL) et
le proxy (electron/proxy/index.ts) route les instructions par requête via getActiveProject(). Donc
paralléliser sans router l'identité du projet PAR REQUÊTE = course = mauvais system prompt injecté
par nœud = sorties corrompues.

Étapes :
1) Router l'identité du projet par requête (le proxy a déjà des tokens packés projectId vers
   l.1915-1932 — réutilise ce mécanisme) au lieu de l'état global setActiveProject/getActiveProject.
2) Transformer resolveDAG en VAGUES (algorithme de Kahn par niveaux) : chaque vague = nœuds dont
   toutes les dépendances sont terminées.
3) Exécuter chaque vague avec un pool de concurrence BORNÉ (max 3-4, pour respecter les limites
   provider/proxy). Conserver la sémantique skip/error entre vagues.
Sévérité : medium (latence, pas correction). Fais un PLAN détaillé avant de coder, c'est risqué.
```

---

## PROBLÈME 7 — Propagation amont→aval limitée au texte de chat (backends)

**Symptôme :** pour les nœuds backend (OpenCode/Open Design), le contexte transmis aux nœuds aval
(`buildDependencyContext`) ne contient que le TEXTE de chat (« j'ai créé X, Y, Z »), pas le CONTENU
réel des fichiers écrits sur disque (schéma DB, contrat OpenAPI, données). Casse la fidélité
amont→aval pour le repli pur-LLM (executeSingleCall). Gain limité car OpenCode lit déjà le workspace
via ses outils.

**Prompt à coller :**

```
Dans le repo OpenHub (lis ORCHESTRATEUR_TODO_NON_CORRIGE.md §0), améliore la propagation amont→aval.
Aujourd'hui buildDependencyContext (orchestrator-prompts.ts) n'injecte que executionResults.get(depId)
(texte de chat), pas le contenu des fichiers réellement écrits par les dépendances backend.

- Réutilise readDiskEvidence(workspaceDir, expectedFilesMap[depId]) (existe dans orchestrator-runner.ts,
  cappé 4000/16000 octets) pour injecter le contenu réel des fichiers d'une dépendance dans le contexte
  de l'agent aval — PRIORITAIREMENT pour le repli pur-LLM (executeSingleCall) qui n'a aucun accès disque.
- Il faut passer workspaceDir + expectedFilesMap à buildDependencyContext (aujourd'hui il ne les reçoit
  pas). Cap strict (réutilise MAX_PER_FILE/MAX_TOTAL) pour éviter le gonflement de contexte ; vérifie le
  cumul avec depContext + workspaceContext déjà passés à buildNodeUserPrompt.
- Ne pas dupliquer pour OpenCode (qui lit déjà ${workspaceDir}/** via ses outils) — cible le pur-LLM.
- Tests + tsc/build/vitest/eslint.
```

---

## PROBLÈME 8 — Rendu réel du site (page blanche / erreur JS invisible)

**Symptôme :** les checks site sont 100% statiques (regex). Une page blanche causée par du JS, une
erreur console, une image cachée par `display:none` = invisibles. Playwright EST dans le repo mais
en **devDependency** → élaguée au packaging → indisponible dans l'app packagée (marche en dev).
Décision utilisateur précédente : pas de Playwright pour l'instant. À reconsidérer si besoin.

**Prompt à coller :**

```
Dans le repo OpenHub (lis ORCHESTRATEUR_TODO_NON_CORRIGE.md §0), ajoute un rendu headless OPTIONNEL
et BEST-EFFORT (jamais bloquant) pour vérifier que les pages servies s'affichent vraiment.
Contrainte clé : @playwright/test est une devDependency, élaguée au packaging → indisponible dans
l'app packagée. Donc :
- Charger Playwright via import() dynamique dans un try/catch ; si absent → ne rien faire (skip
  silencieux). NE PAS l'ajouter aux dependencies de prod sans en discuter (poids/packaging).
- Pour chaque page servie (discoverServedRoots), ouvrir headless (timeout 5s, max ~8 pages),
  capturer les erreurs console + vérifier que le body a du contenu visible (pas une page blanche).
- Sévérité : WARNING uniquement. Branché dans warnOnBrokenAssets, jamais en force-fail (flakiness +
  dépendance non garantie).
- Tests minimaux + vérif. Documente clairement que ça ne marche qu'en dev.
```

---

## Ordre de priorité conseillé

1. **Problème 1** (duplicats divergents) — « le pire » selon l'utilisateur, déterministe, isolé.
2. **Problème 3** (anti-scaffolding web) + **Problème 4/5** (cadrage planif) — réduisent la pollution.
3. **Problème 2** (éparpillement) — recoupe le 1.
4. **Problème 7** (propagation disque) — qualité amont→aval.
5. **Problème 6** (parallélisme) — gros chantier archi, à planifier sérieusement.
6. **Problème 8** (rendu réel) — optionnel, contrainte de packaging.

Tout en **déterministe + général** (jamais spécifique à un sujet), avec tests, et
`tsc/build/vitest/eslint` verts à chaque étape.
