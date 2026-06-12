# Rapport de dette technique — OpenHub

**Date:** 2026-06-12
**Rapport précédent:** Aucun (premier audit)

## Score global

| Catégorie                               | Findings   | Critiques |
| --------------------------------------- | ---------- | --------- |
| Fichiers surdimensionnés (>400 lignes)  | 10         | 5         |
| Fonctions surdimensionnées (>50 lignes) | 6+         | 3         |
| Nesting excessif (>4 niveaux)           | 3 fichiers | 3         |
| Exports inutilisés                      | 11 modules | —         |
| Usage de `any`                          | 1          | 0         |
| TODO/FIXME                              | 1          | 0         |
| Duplications                            | 2 patterns | —         |
| **Total**                               | **~34**    | **11**    |

---

## 1. Fichiers surdimensionnés (>400 lignes, seuil projet)

| Fichier                            | Lignes | Statut                    |
| ---------------------------------- | ------ | ------------------------- |
| `electron/proxy/index.ts`          | 2309   | À REFACTORER MANUELLEMENT |
| `electron/main.ts`                 | 1877   | À REFACTORER MANUELLEMENT |
| `electron/orchestrator-runner.ts`  | 1675   | À REFACTORER MANUELLEMENT |
| `electron/projects/chat.js`        | 925    | À REFACTORER MANUELLEMENT |
| `electron/orchestrator-prompts.ts` | 797    | À REFACTORER MANUELLEMENT |
| `electron/projects/canvas.js`      | 680    | À REFACTORER MANUELLEMENT |
| `electron/projects/execution.js`   | 642    | À REFACTORER MANUELLEMENT |
| `electron/projects/management.js`  | 629    | À REFACTORER MANUELLEMENT |
| `electron/projects/modals.js`      | 544    | À REFACTORER MANUELLEMENT |
| `electron/project-store.ts`        | 433    | À REFACTORER MANUELLEMENT |

### Plans de découpage recommandés

**`electron/proxy/index.ts` (2309 lignes) — PRIORITÉ 1:**

- Extraire les handlers de routes en modules séparés (`proxy/routes/chat.ts`, `proxy/routes/vision.ts`, etc.)
- Extraire la logique de streaming en `proxy/streaming.ts`
- Extraire les utilitaires de validation en `proxy/validation.ts`

**`electron/main.ts` (1877 lignes) — PRIORITÉ 1:**

- Extraire `cleanSearchQuery` (301 lignes !) en `electron/search-utils.ts`
- Extraire `stopSlot`/`switchSlot` en un module slot-lifecycle
- Extraire la configuration IPC handlers en `electron/ipc-handlers.ts`
- Extraire `createWindow` en `electron/window.ts`

**`electron/orchestrator-runner.ts` (1675 lignes) — PRIORITÉ 2:**

- Séparer l'exécution des nœuds par type en sous-modules
- Extraire la logique de planification

**`electron/projects/*.js` (6 fichiers, 544-925 lignes chacun) — PRIORITÉ 3:**

- Ces fichiers sont en développement actif (tous modifiés, non commités)
- Découper après stabilisation de la feature en cours

---

## 2. Fonctions surdimensionnées (>50 lignes)

| Fichier                 | Fonction                   | Lignes | Statut                    |
| ----------------------- | -------------------------- | ------ | ------------------------- |
| `electron/main.ts:968`  | `cleanSearchQuery`         | 301    | À REFACTORER MANUELLEMENT |
| `electron/main.ts:492`  | `stopSlot`                 | 238    | À REFACTORER MANUELLEMENT |
| `electron/main.ts:356`  | `switchSlot`               | 120    | À REFACTORER MANUELLEMENT |
| `electron/main.ts:1429` | `getOpencodeBinaryVersion` | 114    | À REFACTORER MANUELLEMENT |
| `electron/main.ts:105`  | `createWindow`             | 90     | À REFACTORER MANUELLEMENT |
| `electron/main.ts:734`  | `broadcastOrchStatus`      | 58     | À REFACTORER MANUELLEMENT |

**Note:** `cleanSearchQuery` à 301 lignes est ~6x le seuil. Candidat prioritaire.

---

## 3. Nesting excessif (>4 niveaux)

| Fichier                           | Profondeur max | Statut                    |
| --------------------------------- | -------------- | ------------------------- |
| `electron/proxy/index.ts`         | 9 niveaux      | À REFACTORER MANUELLEMENT |
| `electron/orchestrator-runner.ts` | 9 niveaux      | À REFACTORER MANUELLEMENT |
| `electron/main.ts`                | 7 niveaux      | À REFACTORER MANUELLEMENT |

**Recommandation:** Utiliser des early returns et extraire les blocs imbriqués en fonctions nommées.

---

## 4. Exports inutilisés

| Module                                    | Exports inutilisés                                                                            |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `electron/keychain.ts`                    | `writeSecret`, `deleteSecret`                                                                 |
| `electron/memory-store.ts`                | `MemoryFact`, `MemoryData`, `getAdvancedSimilarity`, `getJaccardSimilarity`, `shouldKeepFact` |
| `electron/notifications.ts`               | `NotifySource`, `NOTIFY_MODES`, `NotifierDeps`, `Notifier`                                    |
| `electron/ollama-manager.ts`              | `checkOllamaModels`                                                                           |
| `electron/orchestrator-llm.ts`            | `ToolCall`                                                                                    |
| `electron/orchestrator-prompts.ts`        | `buildPlanningSystemPrompt`, `buildPlanningUserPrompt`, `NodePromptOptions`                   |
| `electron/process-manager.ts`             | `ApiKeys`                                                                                     |
| `electron/project-store.ts`               | `Workflow`, `getActiveProjectId`, `OrchRunNodeResult`, `OrchRun`                              |
| `electron/types.ts`                       | `SlotConfig`, `AppProcess`, `ProxyRoute`, `OverrideEntry`, `KeychainSecret`                   |
| `electron/orchestrator-backends/index.ts` | `BackendContext`, `BackendResult`                                                             |
| `electron/proxy/vision.ts`                | 7 exports (`VisionConfig`, `VisionZone`, etc.)                                                |

**Note:** Plusieurs de ces modules sont nouveaux (non commités). Les exports « inutilisés » peuvent être consommés par du code en cours de développement. À réévaluer après merge des features en cours.

---

## 5. Usage de `any`

| Fichier                      | Ligne | Contexte                             | Statut                                 |
| ---------------------------- | ----- | ------------------------------------ | -------------------------------------- |
| `electron/ollama-manager.ts` | 109   | `(err as any).name === "AbortError"` | Acceptable (boundary de sérialisation) |

**Résultat:** 1 seule occurrence, justifiée. Conformité excellente.

---

## 6. TODO/FIXME

| Fichier                   | Ligne | Contenu                                                         | Statut        |
| ------------------------- | ----- | --------------------------------------------------------------- | ------------- |
| `electron/proxy/index.ts` | 2290  | `// TODO: Implémenter la logique d'extraction intelligente ici` | À IMPLÉMENTER |

---

## 7. Duplications

### Pattern 1: `task-done.js` (4 fichiers)

- `electron/overrides/global/task-done.js` — factory partagée ✅
- `electron/overrides/{openwork,opencode,open-design}/task-done.js` — configs par app ✅
- **Verdict:** Bien structuré, pas de duplication réelle. Le pattern factory+config est correct.

### Pattern 2: `bridge.js` (3 fichiers)

- Chaque app a un `bridge.js` avec une logique différente
- `opencode/bridge.js` (178 lignes) — directory picker natif
- `openwork/bridge.js` (71 lignes) — polyfill desktop
- `open-design/bridge.js` (39 lignes) — sidebar trigger remover
- **Verdict:** Logiques distinctes, pas de duplication extractible.

### Pattern 3: `theme.css` (4 fichiers)

- `global/theme.css` (133 lignes) + 3 fichiers par app
- Potentielle duplication de variables CSS entre les fichiers
- **Statut:** À VÉRIFIER — audit CSS détaillé recommandé

---

## 8. Organisation

### Fichiers non référencés / orphelins

- `electron/notifications.ts` — nouveau fichier, non commité, exports marqués « inutilisés »
- `electron/orchestrator-backends/` — nouveau dossier, non commité
- `electron/orchestrator-llm.ts` — nouveau fichier, non commité
- **Verdict:** Ces fichiers font partie d'une feature en cours de développement. Pas orphelins.

### Mélange UI/business

- `electron/projects/*.js` — mélange gestion d'état, DOM manipulation, et logique métier dans les mêmes fichiers. Candidat pour une séparation model/view après stabilisation.

---

## Résumé exécutif

La dette technique principale du projet est la **taille des fichiers**. Trois fichiers TypeScript dépassent 1000 lignes (proxy 2309, main 1877, orchestrator-runner 1675) avec des fonctions allant jusqu'à 301 lignes et du nesting à 9 niveaux.

**Aucun refactor n'a été appliqué dans cet audit** car :

1. 17 fichiers ont des modifications non commitées (feature en cours)
2. 6 nouveaux fichiers non trackés sont en développement actif
3. Refactorer maintenant créerait des conflits de merge importants

### Prochaines étapes recommandées (par priorité)

1. **Après merge de la feature en cours:** découper `proxy/index.ts` et `main.ts`
2. **`cleanSearchQuery` (301 lignes):** extraction immédiate possible, fonction isolée
3. **Réduire le nesting** dans les 3 fichiers >1000 lignes via early returns
4. **Nettoyer les exports inutilisés** une fois les features mergées
5. **Implémenter le TODO** dans `proxy/index.ts:2290`
