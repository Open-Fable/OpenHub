# Orchestrateur OpenHub — Audit complet & passage « hors-web à 100 % »

**Date :** 2026-06-14
**Méthode :** audit multi-agents (6 sous-systèmes analysés en parallèle → 54 problèmes
relevés → 28 critiques/élevés vérifiés de façon adversariale → 21 confirmés réels →
synthèse priorisée). Puis implémentation des correctifs et vérification (174 tests, 0 erreur lint).

---

## 1. Réponse directe : « est-ce que ça va réussir tout ça ? »

**Avant ces correctifs : NON, pas à 100 %.** L'outil était excellent pour **un site web**
mais tout le reste était « partiel », et deux cas étaient carrément cassés.

La cause racine unique : **toute la chaîne supposait que le livrable est un site web**
(prompts de planification, rôles d'agent, mandat de fidélité, règles qualité, et surtout
les garde-fous déterministes 100 % HTML/CSS). Pour un rapport, une librairie, des slides
ou des données, l'outil partait sur un pipeline web parasite et n'avait aucun filet qualité.

### Verdict par cas d'usage

| Cas d'usage                              | Avant                    | Après correctifs                                                            |
| ---------------------------------------- | ------------------------ | --------------------------------------------------------------------------- |
| Site web (vitrine/app)                   | ✅ yes                   | ✅ yes                                                                      |
| Rapport de recherche                     | ⚠️ partial               | ✅ yes                                                                      |
| Ebook structuré                          | ⚠️ partial               | ✅ yes                                                                      |
| Business plan (+CSV/données)             | ⚠️ partial               | ✅ yes                                                                      |
| Librairie de code + tests                | ⚠️ partial               | ✅ yes                                                                      |
| Outil CLI                                | ⚠️ partial               | ✅ yes                                                                      |
| API REST                                 | ⚠️ partial               | ✅ yes (cf. limite #6 pour la fidélité amont→aval pure-LLM)                 |
| Slides / présentation                    | ⚠️ partial               | ✅ yes (texte) — pas de rendu visuel natif (open-design ne fait que du web) |
| Scénario de jeu + dialogues              | ⚠️ partial               | ✅ yes                                                                      |
| Plan de cours + exercices                | ⚠️ partial               | ✅ yes                                                                      |
| Campagne marketing                       | ⚠️ partial               | ✅ yes                                                                      |
| Base de connaissances / wiki             | ⚠️ partial               | ✅ yes (séquentiel — cf. limite #11 pour la vitesse)                        |
| CV + lettre                              | ⚠️ partial               | ✅ yes                                                                      |
| Recettes + plan repas                    | ⚠️ partial               | ✅ yes                                                                      |
| Analyse de données + graphiques          | ❌ no                    | ✅ yes (JSON validé, couverture imposée, watchdog corrigé)                  |
| Config sans clé (Anthropic/OpenAI seule) | ❌ no (run 100 % échoué) | ✅ erreur claire au lieu d'un échec opaque                                  |

> « yes » = l'outil est maintenant **structurellement** capable de bien faire ce cas.
> La qualité finale dépend encore du modèle choisi, mais les garde-fous ne le sabotent plus.

---

## 2. Causes racines identifiées (audit)

1. **Hypothèse « tout livrable = site web »** câblée partout (planification, rôles,
   mandat de fidélité, ASSET_POLICY, QUALITY_RULES) — aucune conditionnalité au domaine.
2. **Garde-fous qualité déterministes exclusivement HTML/CSS** : hors-web, le quality
   gate dégénérait en une seule opinion LLM qui passait par défaut si le JSON ne parsait pas.
3. **Défauts « fail-open »** : modèle par défaut payant/inexistant, watchdog 120 s
   inférieur aux timeouts backend, extracteur qui abandonne des formats, nœud backend
   ayant écrit des fichiers jugé « trivial » puis écrasé.
4. **Couverture obligatoire uniquement pour le web** → plans/livrables non-web incomplets
   non détectés.
5. **Exécution strictement séquentielle** reposant sur un état global « active project »
   unique — empêche la parallélisation (latence) ; verrou archi à lever avant tout parallélisme.

---

## 3. Correctifs IMPLÉMENTÉS (9 / 12)

Tous compilés (`dist/`), 174 tests verts, 0 erreur lint.

### ✅ Rank 1 — Fail-fast quand aucun modèle n'est configuré _(était : run 100 % échoué)_

- **Fichiers :** `electron/orchestrator-runner.ts`, `electron/proxy/index.ts`
- Le runner lève désormais une erreur claire (« Aucun modèle utilisable configuré… »)
  avant tout appel LLM si ni l'orchestrateur ni aucun agent n'a de modèle.
- Le proxy renvoie une erreur explicite quand un modèle `fournisseur/modèle`
  (ex: `deepseek/deepseek-chat`) est demandé **sans clé OpenRouter**, au lieu de
  retomber silencieusement sur Ollama avec un id inexistant (→ 404 opaque).

### ✅ Rank 2 — Watchdog LLM : budget « premier token » séparé _(était : gros livrables tués)_

- **Fichier :** `electron/orchestrator-llm.ts`
- `callLLMStreaming` distingue maintenant un **budget premier-token généreux**
  (jusqu'à 10 min en reasoning effort `high`/`max`, sinon 3 min) d'un **budget
  inter-chunk** plus court (le `timeoutMs` d'origine). Un modèle qui « réfléchit »
  longtemps avant d'émettre n'est plus tué avant de produire quoi que ce soit.

### ✅ Rank 3 — Mandat de fidélité conditionnel _(était : prompt 100 % maquettes injecté partout)_

- **Fichier :** `electron/orchestrator-prompts.ts` (`buildDependencyContext`)
- Le long mandat « CODE TOUTES LES PAGES mockups/\*.html, cart→checkout→confirmation,
  tokens.css, classes CSS, <img> » n'est injecté **que si des artefacts web existent
  réellement** (dépendance de type `design`, ou dont le résultat contient un fichier
  `.html`/`.css`). Sinon → **mandat neutre** (« réutilise fidèlement contrats/données/
  décisions, ne réinvente pas ») sans aucun vocabulaire web.
- Couvre aussi le cycle correctif (même chemin).

### ✅ Rank 4 — Planification agnostique au domaine + couverture non-web _(était : pipeline web forcé)_

- **Fichier :** `electron/orchestrator-prompts.ts` (`buildIterativePlanningSystemPrompt`, `TYPE_ROLE_HINTS`)
- Suppression du « l'agent code doit **TOUJOURS** dépendre de design » → dépendances
  établies **selon les livrables réels**.
- Le bloc « IMPORTANCE DE L'AGENT DESIGN / 500+ lignes par page » est désormais cadré
  comme un **exemple de pipeline web**, pas la norme.
- Rôles reformulés neutres : `work` = contenu/données (+ web si pertinent), `design` =
  maquettes web **uniquement si interface**, `code` = livrable fonctionnel (app/lib/API/
  CLI/scripts/données).
- **Nouveaux blocs de couverture obligatoire par domaine** (symétriques au bloc web) :
  Librairie/CLI/API → tests + README + exemples ; Document long → table des matières +
  N sections + longueur min + sources ; Données/analyse → fichiers valides + script +
  graphiques + interprétation ; Présentation → N slides + notes ; Marketing → cohérence
  cross-canal.

### ✅ Rank 5 — Garde-fous déterministes format-agnostiques _(était : zéro filet hors-web)_

- **Fichiers :** `electron/orchestrator-quality.ts` (`findInvalidJsonFiles`), `electron/orchestrator-runner.ts`
- Nouveau détecteur déterministe : **tout `*.json` produit doit parser** (sinon issue
  bloquante). Ignore `*.artifact.json` et le dossier `design/`.
- **Les `expected_files` manquants force-fail désormais le quality gate** (le contrat
  générique le plus important), attribués à l'agent propriétaire pour un triage correct.
- Branché dans le quality gate **et** dans le chemin sans-verifier (`warnOnBrokenAssets`).
- Tests unitaires ajoutés.

### ✅ Rank 7 — QUALITY*RULES.code : add-on non-web *(était : SEO/panier imposés à une librairie)\_

- **Fichier :** `electron/orchestrator-prompts.ts`
- Ajout d'un bloc conditionnel « SI TU PRODUIS UNE LIBRAIRIE / CLI / API / DES DONNÉES
  (PAS un site web) — IGNORE les règles HTML/CSS/SEO » avec les exigences propres
  (API documentée, tests réels, README, point d'entrée CLI, endpoints fonctionnels,
  données valides). Les blocs SEO restent conditionnels comme avant.

### ✅ Rank 8 — Un nœud backend qui a écrit des fichiers n'est jamais « trivial » _(corruption de livrable)_

- **Fichiers :** `electron/orchestrator-backends/{types,opencode-backend,design-backend}.ts`, `electron/orchestrator-runner.ts`
- `BackendResult` expose maintenant `filesWritten`. OpenCode renvoie le nb de fichiers
  réellement changés sur disque ; Open Design le nb d'artefacts exportés.
- La gate « trivial » ne relance/écrase plus un nœud qui a produit des fichiers mais
  renvoyé un court résumé de chat (ex: « Créé 6 fichiers »).

### ✅ Rank 9 — Fusion des 3 extracteurs de fichiers _(perte silencieuse de fichiers)_

- **Fichier :** `electron/orchestrator-runner.ts` (`extractAndWriteFiles`)
- Les 3 parseurs de format (` ```filepath: `, `**Fichier:**`, `// filepath:`)
  s'exécutent maintenant **tous**, avec **déduplication par chemin résolu**
  (first-writer-wins). Un modèle qui mélange les formats ne perd plus ses fichiers.

### ✅ Rank 10 — Health-gate du daemon Open Design (:7456) _(maquettes silencieusement non utilisées)_

- **Fichier :** `electron/process-manager.ts`
- `startOpenDesign` attend désormais la santé **du daemon API (:7456) ET** du frontend
  web (:3456) avant de marquer le slot prêt. Fini le cas où, à froid, le nœud `design`
  retombait sur du HTML LLM inline au lieu des maquettes Open Design itérées.

---

## 4. Correctifs RECOMMANDÉS mais NON implémentés (3 / 12) — avec rationale

Ces trois-là ont été **délibérément différés** (risque/plumbing/cosmétique). Ils sont
documentés ici avec l'emplacement exact pour une prochaine itération.

### ⏸ Rank 6 — Propager le contenu disque des dépendances backend (medium)

- **Pourquoi différé :** OpenCode lit déjà le workspace via ses outils ; le gain réel
  est limité au repli pur-LLM. Plomberie (passer `workspaceDir` + `expectedFilesMap` à
  `buildDependencyContext`).
- **Quoi faire :** réutiliser `readDiskEvidence(workspaceDir, expectedFilesMap[depId])`
  dans `buildDependencyContext` (cappé via `MAX_PER_FILE`/`MAX_TOTAL`) pour injecter le
  contenu réel des fichiers amont (schéma→code, données→analyse) plutôt que le seul
  texte de chat. Fichiers : `orchestrator-prompts.ts`, `orchestrator-runner.ts`.

### ⏸ Rank 11 — Exécution parallèle par vagues (medium) — **DANGEREUX sans prérequis**

- **Pourquoi différé :** `executeNode` mute un **état global unique** (`setActiveProject`),
  et le proxy route les instructions par requête via `getActiveProject()`. Paralléliser
  sans router le projet **par requête** = course = mauvais system prompt injecté =
  **sorties corrompues**.
- **Quoi faire (dans l'ordre) :** (1) router l'identité du projet **par requête** (le proxy
  a déjà des tokens packés `projectId`) au lieu de l'état global ; (2) ensuite seulement,
  transformer `resolveDAG` en vagues (Kahn) et exécuter chaque vague avec un pool borné
  (concurrence 3-4). Gain : un ebook 12 chapitres / wiki multi-articles passe de
  somme(durées) à max(durées).

### ⏸ Rank 12 — Distinguer en UI « skipped (dep error) » vs « skipped (dep skipped) » (cosmétique)

- **Pourquoi différé :** purement lisibilité ; ne change pas le comportement. Le vrai
  « mode dégradé » (continuer malgré une dépendance manquante) est volontairement
  **non implémenté** car il casserait le mandat de fidélité d'un nœud aval privé de sa
  source. À n'envisager qu'en opt-in explicite par dépendance.

---

## 5. Comment exploiter les orchestrateurs à 100 % (guide pratique)

### a) Configuration minimale fiable

- **Choisis un modèle** sur l'orchestrateur OU sur au moins un agent. Sinon le run
  s'arrête désormais avec un message clair (au lieu d'échouer en silence).
- Pour Gemini : connecte-toi (`opencode auth login`) et, pour les longs runs, configure
  `GEMINI_CLIENT_ID`/`GEMINI_CLIENT_SECRET` (`.env`) pour le refresh auto du token.
- Modèle `fournisseur/modèle` (deepseek/…) ⇒ il **faut** une clé OpenRouter.

### b) Décris le livrable, pas le pipeline

Le planificateur est maintenant agnostique : dis **ce que tu veux** (« une librairie TS
de validation avec tests et README », « un rapport de marché en 6 sections avec sources »,
« une analyse de données avec CSV + graphiques + interprétation »). N'ajoute un agent
`design` que si tu veux **réellement** une interface web.

### c) Utilise `expected_files` comme contrat

C'est le levier qualité le plus puissant et **générique**. Liste les fichiers attendus
(`.py`, `.md`, `.csv`, `.json`, `.html`…). Un fichier manquant **force désormais** une
correction automatique, quel que soit le domaine.

### d) Mets un agent `verifier`

Le cycle qualité complet (gate + correction auto) ne tourne pleinement qu'avec un agent
de type `verifier` lié. Sans lui, tu n'as que l'avertissement déterministe de fin de run.

### e) Donne des critères MESURABLES

« 10 produits », « ≥ 500 mots/section », « couverture tests > 80 % », « 12 slides ».
Les termes vagues seuls (« complet », « pro ») sont insuffisants.

### f) Sois patient sur les gros livrables

L'exécution est séquentielle (cf. limite #11). Un livrable à 12 nœuds prend
somme(durées). Le watchdog tolère maintenant les modèles lents au démarrage.

---

## 6. Validation

- **Typecheck :** `npx tsc --noEmit` → OK
- **Build :** `npx tsc -p tsconfig.json` → OK (dist/ à jour)
- **Tests :** `npx vitest run` → **174 passed / 0 failed** (3 nouveaux tests pour `findInvalidJsonFiles`)
- **Lint :** 0 erreur (warnings préexistants `strict-boolean-expressions` uniquement)
- **Détecteurs vérifiés sur un vrai workspace** : `findInvalidJsonFiles` (JSON cassé,
  ignore `.artifact.json` + `design/`), mandat neutre vs web (tests existants verts).

> **Important :** redémarre l'app Electron pour charger le nouveau `dist/`.

---

## 7. Récap des fichiers modifiés cette session

| Fichier                                                                     | Nature du changement                                                                                       |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `electron/orchestrator-llm.ts`                                              | watchdog premier-token (Rank 2)                                                                            |
| `electron/orchestrator-runner.ts`                                           | fail-fast modèle (1), filesWritten/trivial (8), fusion extracteurs (9), JSON+expected_files force-fail (5) |
| `electron/orchestrator-quality.ts`                                          | `findInvalidJsonFiles` (5)                                                                                 |
| `electron/orchestrator-prompts.ts`                                          | mandat conditionnel (3), planif agnostique + couverture (4), add-on non-web (7)                            |
| `electron/proxy/index.ts`                                                   | erreur explicite modèle `/` sans OpenRouter (1)                                                            |
| `electron/process-manager.ts`                                               | health-gate daemon design (10)                                                                             |
| `electron/orchestrator-backends/{types,opencode-backend,design-backend}.ts` | `filesWritten` (8)                                                                                         |
| `electron/orchestrator-quality.test.ts`                                     | tests `findInvalidJsonFiles`                                                                               |

---

## 8. Couche qualité DÉTERMINISTE — « le LLM remplit le contrat, le système l'impose »

Ajout d'une couche pour **réduire la dépendance au LLM** : avec un petit modèle (gemini-flash,
deepseek-flash) qui hallucine, le jugement LLM ne suffit pas. Désormais le contrat est
**machine-vérifiable** — le LLM le _remplit_, le système le _vérifie_ sans LLM.

### Couche 1 — contrat déclaré par le planificateur

Nouveau paramètre `checks` sur `assign_task` (par fichier) : `minWords`, `minItems` (tableau JSON),
`minSections` (titres `##/###`), `requiredSubstrings`, `format` (json/csv/md). Le planificateur les
**dérive des critères chiffrés de la demande** (« 12 produits » → `minItems:12`, « 8 chapitres » →
`minSections:8`). `validateDeclaredChecks` les **vérifie déterministiquement** et **force-fail** →
correction auto, attribuée à l'agent propriétaire du fichier. Sécurisé par `sanitizeChecks`
(mêmes gardes de chemin que `expected_files`, clamps durs).

### Couche 2 — socle TOUJOURS actif (filet pour modèles faibles, sans aucune déclaration)

- `findCsvColumnProblems` → **bloquant** : colonnes CSV incohérentes (respecte les guillemets).
- `findPlaceholderDeliverables` → **bloquant avec garde-fous** : livrable texte (.md/.txt/.csv/.json/.rst)
  quasi-vide ou avec placeholder (Lorem ipsum, [à compléter]…). Jamais sur du code (`// TODO` ignoré),
  garde de densité (un long document citant « lorem ipsum » une fois n'est pas bloqué).
- `findUnreferencedModules` → **avertissement seulement** : module .js/.ts jamais référencé (backend
  mort). Exclut points d'entrée/tests/dist. Risque de faux positifs trop élevé pour bloquer.

### Garantie clé

Le **fallback JSON** (modèle sans tool-calling) renvoie `checks:{}` → la Couche 2 prend le relais
intégralement. Donc **même sans contrat déclaré et même avec un modèle faible**, les CSV cassés, les
fichiers vides et les placeholders sont gatés déterministiquement. `MAX_AUTO_QUALITY_LOOPS` reste 2.

### Validation

188 tests passent (14 nouveaux : `sanitizeChecks`, `validateDeclaredChecks`, `findCsvColumnProblems`,
`findPlaceholderDeliverables` dont anti-faux-positifs `.js`/densité, `findUnreferencedModules`).
Typecheck + build + lint OK.

| Fichier                                 | Changement                                                                                                                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `electron/orchestrator-quality.ts`      | types `FileChecks`/`ChecksMap`, `sanitizeChecks`, `validateDeclaredChecks`, `findCsvColumnProblems`, `findPlaceholderDeliverables`, `findUnreferencedModules`, helpers `collectFiles`/`countCsvColumns` |
| `electron/orchestrator-runner.ts`       | schéma `checks` (PLANNING_TOOLS), `checksMap` (plomberie), branchement force-fail + warning, `agentOwning`                                                                                              |
| `electron/orchestrator-prompts.ts`      | bloc « CONTRAT DE VÉRIFICATION (checks) » dans le prompt de planification                                                                                                                               |
| `electron/orchestrator-quality.test.ts` | 14 tests unitaires                                                                                                                                                                                      |

---

## 9. v2 — Profondeur du contenu & qualité du site (enforcement, pas avertissement)

Tests réels (`/sport`, `/teste`, captures `/sport-screen`) : le système **détectait** les défauts
(« 2000/4000 mots », « final = squelette », « CSS incohérent ») mais ne faisait que des **warnings**.
La v2 transforme la détection en **enforcement**.

### Contenu (le « trop court »)

- **A1** — `enforceDeliverables` relance maintenant l'agent quand le **volume cible** (minWords/
  minSections/minItems) n'est pas atteint, pas seulement sur fichier manquant (`buildContentShortfallPrompt`).
- **A2** — `executeMultiTurn` **continue tant que le nombre de mots cible n'est pas atteint** (ne
  s'arrête plus dès que le LLM dit « complet »). `targetWords` threadé jusqu'au multi-tour.
- **A3** — `deriveFloorChecks` : **plancher de ~400 mots** auto pour les livrables prose (.md/.txt,
  hors reports/audit) même si le planificateur ne déclare rien. Après relances non abouties →
  **avertir en gardant le meilleur** (anti-boucle sur petits modèles).
- **A4** — prompt : **un sous-agent par chapitre** (chacun avec son `minWords`) + consolidation qui
  INCLUT le contenu intégral. Nouveau check **`findConsolidationShrinkage`** (final < 80% de la
  somme des sources → force-fail). Vérifié : `/sport` final 1049 mots vs ~4892 → flaggé.

### Site (moche/buggé)

- **B1** — les checks web tournent désormais sur **tout dossier contenant du HTML** (helper
  `discoverServedRoots`), plus seulement `public/`/`dist/`. Vérifié : `/teste/presentation/`
  (qui échappait à tout) est maintenant scanné.
- **B2** — nouveau check **`findUnstyledClasses`** : classes HTML sans règle CSS (symptôme « CSS pas
  lié/non stylé »), avec garde-fous (utilitaires/états JS ignorés ; force-fail seulement si ≥3 classes
  et ≥30% orphelines et aucune feuille framework).
- Décision : **pas de Playwright** (devDep élaguée au packaging) → checks 100% statiques.

### Validation v2

218 tests (0 échec), 0 erreur lint, build OK. Détecteurs confirmés sur `/sport` (consolidation) et
`/teste` (presentation/). Limite honnête : sans rendu réel, une page blanche causée par du JS reste
invisible — mais B1+B2 attrapent le CSS non lié/non appliqué.
