# Rapport d'audit — Tests manquants OpenHub

**Date:** 2026-06-12
**Couverture avant audit:** 0% (aucun test existant)
**Couverture après audit:** ~15-20% (estimée — 4 modules couverts sur ~15 critiques)
**Cible:** 80%+

---

## Tests ajoutés

### 1. `electron/notifications.test.ts` — 22 tests

| Scénario                                                  | Type     |
| --------------------------------------------------------- | -------- |
| isNotifySource — valeurs valides et invalides             | unitaire |
| isNotifyMode — valeurs valides et invalides               | unitaire |
| defaultNotifySources — valeurs par défaut, immutabilité   | unitaire |
| Mode "always" — notification systématique                 | unitaire |
| Mode "never" — aucune notification                        | unitaire |
| Mode "sound" — shell.beep sans notification visuelle      | unitaire |
| Mode "background" — focalisé vs non focalisé              | unitaire |
| Mode "other-tab" — même onglet vs différent, focus vs pas | unitaire |
| Source désactivée — pas de notification                   | unitaire |
| Fallback beep si Notification non supporté                | unitaire |
| Body personnalisé, par défaut, whitespace                 | unitaire |
| Source invalide ignorée                                   | unitaire |
| Fenêtre null en mode background                           | unitaire |

### 2. `electron/memory-store.test.ts` — 18 tests

| Scénario                                                      | Type     |
| ------------------------------------------------------------- | -------- |
| getAdvancedSimilarity — chaînes vides, matching, non liés     | unitaire |
| Pondération par longueur de mot (rareté)                      | unitaire |
| Bonus acronymes (OAUTH, JWT)                                  | unitaire |
| Bonus phrase exacte                                           | unitaire |
| Gestion accents (NFD normalization)                           | unitaire |
| getJaccardSimilarity — vides, identiques, différents, partiel | unitaire |
| Détection near-duplicates >0.7                                | unitaire |
| shouldKeepFact — rejet court, headers, génériques, micro-CSS  | unitaire |
| Acceptation faits techniques valides                          | unitaire |

### 3. `electron/keychain.test.ts` — 6 tests

| Scénario                                               | Type     |
| ------------------------------------------------------ | -------- |
| readSecret — délégation keytar, retour null            | unitaire |
| writeSecret — délégation keytar                        | unitaire |
| deleteSecret — délégation keytar                       | unitaire |
| readAllApiKeys — 7 clés en parallèle, défaut ollamaUrl | unitaire |

### 4. `electron/project-store.test.ts` — 10 tests

| Scénario                                              | Type     |
| ----------------------------------------------------- | -------- |
| Initialisation 6 projets par défaut                   | unitaire |
| getActiveProject retourne p4                          | unitaire |
| saveProject — création avec couleur par défaut        | unitaire |
| saveProject — mise à jour existant                    | unitaire |
| deleteProject — suppression + reset activeProjectId   | unitaire |
| setActiveProject — ignore id inexistant, accepte null | unitaire |
| Workflow par défaut créé au premier chargement        | unitaire |
| saveWorkflow — création nouveau workflow              | unitaire |
| deleteWorkflow — suppression                          | unitaire |

### Modification annexe

- `eslint.config.mjs` — exclusion des `*.test.ts` du linting (incompatibles avec projectService tsconfig)

---

## Matrice de couverture par module

| Module                                       | Unitaire | Intégration | E2E | Couverture estimée            |
| -------------------------------------------- | -------- | ----------- | --- | ----------------------------- |
| `electron/notifications.ts`                  | 22 tests | -           | -   | **95%**                       |
| `electron/memory-store.ts` (fonctions pures) | 18 tests | -           | -   | **70%** (I/O non couvert)     |
| `electron/keychain.ts`                       | 6 tests  | -           | -   | **90%**                       |
| `electron/project-store.ts`                  | 10 tests | -           | -   | **60%** (OrchRun non couvert) |
| `electron/cache-metrics.ts`                  | -        | -           | -   | 0%                            |
| `electron/proxy/index.ts`                    | -        | -           | -   | 0%                            |
| `electron/orchestrator-runner.ts`            | -        | -           | -   | 0%                            |
| `electron/orchestrator-prompts.ts`           | -        | -           | -   | 0%                            |
| `electron/orchestrator-llm.ts`               | -        | -           | -   | 0%                            |
| `electron/preload.ts`                        | -        | -           | -   | 0%                            |
| `electron/main.ts`                           | -        | -           | -   | 0%                            |
| `electron/proxy/vision.ts`                   | -        | -           | -   | 0%                            |

---

## Tests restants a ecrire (priorite)

### Priorite HAUTE

1. **Proxy Express — auth middleware** (intégration)
   - Requête sans header Authorization → 401
   - Bearer token invalide → 401
   - Bearer sessionToken valide → next()
   - Bearer "openhub-local" → next()
   - Headers browser strippés (host, origin, referer)

2. **Proxy Express — routage modèles** (unitaire)
   - `resolveRoute()` — routage vers Anthropic, OpenAI, Google, OpenRouter, Ollama
   - `buildModelList()` — filtrage par clés API disponibles
   - `modelSupportsReasoningEffort()` — détection modèles avec reasoning
   - `getFullModelCatalog()` — catalogue complet 40+ modèles

3. **Cache metrics** (unitaire)
   - `recordCacheMetric()` — ajout record, trimming >5000
   - `computeMetrics()` — calcul total, ratio, breakdown, repeat detection (80%)
   - `resetCacheMetrics()` — vidage
   - Migration old format (prompt_tokens → system_tokens)

4. **Orchestrator LLM** (unitaire, mock fetch)
   - `callLLM()` — appel simple, gestion erreurs
   - `callLLMStreaming()` — watchdog timeout, abort signal
   - `callLLMWithTools()` — tool calls parsing

5. **Project-store OrchRun** (unitaire)
   - `saveOrchRun()`, `getOrchRuns()`, `deleteOrchRun()`, `clearOrchRuns()`
   - Trimming MAX_RUNS (50)

### Priorite MOYENNE

6. **Memory-store I/O** (intégration, mock fs)
   - `addFact()` — validation, dedup Jaccard >0.7, cap 50 facts
   - `buildMemoryBlock()` — tri par pertinence, budget tokens, format XML
   - `removeFact()`, `updateFact()` — mutations immutables
   - Auto-cleanup au chargement

7. **Orchestrator prompts** (unitaire)
   - `buildWorkspaceContext()` — lecture WORKSPACE_INDEX.md, troncature 6000 chars
   - `buildDependencyContext()` — formatage dépendances, troncature résultats
   - `QUALITY_RULES` — vérification existence de chaque type d'agent

8. **Format conversion proxy** (unitaire)
   - `convertOpenAIToGemini()` — messages, images, tool calls
   - `convertGeminiChunkToOpenAI()` — streaming SSE conversion
   - Context pruning (token limit 90k, keep first 5 + last 15)

### Priorite BASSE

9. **Preload IPC** (intégration)
   - Vérification que chaque canal IPC est exposé via contextBridge
   - Validation des types de retour

10. **E2E — cycle de vie** (Playwright Electron)
    - Lancement app → sidebar visible → navigation entre slots
    - Settings → ajout clé API → vérification stockée
    - Projets → création → édition → suppression

11. **Edge cases**
    - Port 9999 occupé au démarrage proxy
    - Keychain inaccessible (keytar throw)
    - Réseau coupé pendant requête proxy (timeout)
    - Override JS ciblant sélecteur disparu

---

## Bugs detectes

Aucun bug détecté lors de cette session de tests.

---

## Recommandations

1. **Priorité immédiate:** écrire les tests du proxy Express (auth + routage) — c'est la surface d'attaque critique
2. **Extraire les fonctions pures** de `proxy/index.ts` (2239 lignes) dans des modules séparés pour faciliter le test unitaire
3. **Configurer la couverture V8** dans la CI pour suivre la progression vers 80%
4. **Ajouter un tsconfig.test.json** pour inclure les fichiers `*.test.ts` dans le type-checking
