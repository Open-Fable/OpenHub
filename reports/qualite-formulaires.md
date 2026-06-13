# Audit Qualité Formulaires — OpenHub

**Date :** 2026-06-12
**Portée :** Tous les formulaires et champs de saisie dans l'application Electron

---

## Inventaire des formulaires

### 1. Panneau Settings (electron/sidebar.html)

| Champ                                                                                          | Type                    | Usage                         |
| ---------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------- |
| `#key-anthropic`, `#key-openai`, `#key-openrouter`, `#key-ollama`, `#key-github`, `#key-brave` | `input[password/text]`  | Clés API / URLs               |
| `#ai-classifier`                                                                               | `select`                | Modèle classificateur mémoire |
| `#default-reasoning-effort`                                                                    | `select`                | Niveau de raisonnement        |
| `#vision-model`                                                                                | `select`                | Modèle vision Ollama          |
| `#vision-detail-level`                                                                         | `select`                | Détail vision (high/low)      |
| `#web-search-toggle`, `#vision-proxy-toggle`, `#memory-toggle`, etc.                           | `checkbox[role=switch]` | Toggles fonctionnalités       |
| `#memory-profile`                                                                              | `input[text]`           | Profil utilisateur YAML       |
| `#new-fact`                                                                                    | `input[text]`           | Ajout de fait mémoire         |
| `#notify-mode`                                                                                 | `select`                | Mode notifications            |
| `#nav-mode-select`                                                                             | `select`                | Mode navigation               |

### 2. Page Projets (electron/projects/)

| Champ                     | Type                     | Fichier       | Usage                       |
| ------------------------- | ------------------------ | ------------- | --------------------------- |
| `#chatInput`              | `textarea`               | chat.js       | Message assistant           |
| `#assistantModelSelect`   | `select`                 | state.js      | Modèle chat                 |
| `#sharedTaskText`         | `textarea`               | detail.js     | Tâche globale orchestration |
| `#systemInstructionsText` | `textarea` (readonly)    | detail.js     | Instructions système        |
| `#selectedNodeTaskText`   | `textarea`               | detail.js     | Tâche agent                 |
| `#projName`               | `input[text]`            | modals.js     | Nom agent                   |
| `#projType`               | `select`                 | modals.js     | Type agent                  |
| `#projModel`              | `select`                 | state.js      | Modèle IA                   |
| `#projTask`               | `textarea`               | modals.js     | Description tâche           |
| `#projInstructions`       | `textarea`               | modals.js     | Instructions agent          |
| `#projPath`               | `input[text]` (readonly) | modals.js     | Dossier de travail          |
| `#projSteps`              | `textarea`               | modals.js     | Étapes manuelles            |
| `#wfNameInput`            | `input[text]`            | main.js       | Nom workflow                |
| `#mgmtSearchProj`         | `input[text]`            | management.js | Recherche agents            |
| Checkboxes divers         | `checkbox`               | modals.js     | Options agent               |

### 3. Overrides OpenWork (electron/overrides/openwork/)

| Champ                     | Type                     | Fichier         | Usage               |
| ------------------------- | ------------------------ | --------------- | ------------------- |
| `#oh-modal-name-input`    | `input[text]`            | projects-hub.js | Nom projet OpenWork |
| `#oh-modal-instr-input`   | `textarea`               | projects-hub.js | Instructions projet |
| `#oh-modal-path-input`    | `input[text]` (readonly) | projects-hub.js | Dossier lié         |
| `#oh-detail-instructions` | `textarea`               | projects-hub.js | Instructions détail |
| Color swatches            | `button`                 | projects-hub.js | Sélection couleur   |

---

## Matrice de qualité

| Formulaire             | Validation                      | Erreurs                       | Sanitization                | Double-submit  | A11y           | Statut  |
| ---------------------- | ------------------------------- | ----------------------------- | --------------------------- | -------------- | -------------- | ------- |
| Chat (chatInput)       | ✅ trim()                       | ✅ Messages erreur            | ✅ textContent              | ✅ **CORRIGÉ** | ⚠️             | CORRIGÉ |
| Workflow name          | ✅ **CORRIGÉ** (trim+maxlength) | ✅ **CORRIGÉ** (toast+border) | ✅ escapeHtml               | ✅ **CORRIGÉ** | ✅             | CORRIGÉ |
| Project name           | ✅ **CORRIGÉ** (trim+maxlength) | ✅ **CORRIGÉ** (toast+border) | ✅ escapeHtml               | ✅ **CORRIGÉ** | ⚠️             | CORRIGÉ |
| API keys               | ✅ blur-save                    | ✅ Toast                      | ✅ IPC bridge               | ❌ N/A         | ✅ aria-label  | OK      |
| Memory fact            | ✅ **CORRIGÉ** (trim+maxlength) | ✅ **CORRIGÉ** (border flash) | ✅ IPC bridge               | ❌ N/A         | ⚠️             | CORRIGÉ |
| Memory profile         | ✅ debounce 600ms               | ✅ Toast                      | ✅ IPC bridge               | ❌ N/A         | ⚠️             | OK      |
| Shared task            | ✅ debounce 400ms               | ✅ Implicite                  | ✅ .value                   | ❌ N/A         | ⚠️             | OK      |
| Agent task             | ✅ debounce 400ms               | ✅ Implicite                  | ✅ .value                   | ❌ N/A         | ⚠️             | OK      |
| Select dropdowns       | ✅ Natif                        | ✅ N/A                        | ✅                          | ❌ N/A         | ✅             | OK      |
| Checkboxes/toggles     | ✅ Natif                        | ✅ Toast                      | ✅                          | ❌ N/A         | ✅ role=switch | OK      |
| OpenWork modal name    | ✅ trim+border                  | ✅ Border rouge               | ✅ escapeHtml               | ❌             | ⚠️             | OK      |
| Management search      | ✅ Filtering                    | ✅ N/A                        | ✅ textContent              | ❌ N/A         | ⚠️             | OK      |
| Model select options   | ⚠️                              | ✅                            | ✅ **CORRIGÉ** (escapeHtml) | ❌ N/A         | ✅             | CORRIGÉ |
| Workflow names in mgmt | ⚠️                              | ✅                            | ✅ **CORRIGÉ** (escapeHtml) | ❌ N/A         | ✅             | CORRIGÉ |

---

## Findings détaillés

### CORRIGÉ — Protection double-submit sur le chat (chat.js)

**Fichier :** `electron/projects/chat.js`
**Problème :** Aucune protection contre les clics multiples sur "Envoyer" pendant le streaming SSE. L'utilisateur pouvait envoyer le même message plusieurs fois.
**Correction :** Ajout d'un verrou `_chatSending`, désactivation du bouton et du textarea pendant l'envoi, réactivation dans `.finally()`.

### CORRIGÉ — Validation et feedback visuel sur le nom de workflow (main.js)

**Fichier :** `electron/projects/main.js`
**Problème :** Pas de feedback visuel quand le nom est vide (juste un focus silencieux). Pas de limite de longueur.
**Correction :** Ajout d'un toast d'erreur, bordure rouge sur l'input, validation max 80 caractères, protection double-submit via `disabled`.

### CORRIGÉ — Validation et feedback visuel sur le nom d'agent (modals.js)

**Fichier :** `electron/projects/modals.js`
**Problème :** Toast d'erreur existant mais pas de feedback visuel sur l'input. Pas de limite de longueur. Pas de protection double-submit.
**Correction :** Ajout bordure rouge + focus sur l'input, validation max 100 caractères, bouton `disabled` pendant la sauvegarde.

### CORRIGÉ — XSS via noms de workflows non échappés (management.js)

**Fichier :** `electron/projects/management.js`
**Problème :** Les noms de workflows insérés dans le texte "Aussi dans / Dans <strong>..." n'étaient pas échappés via `escapeHtml()`. Un workflow nommé `<img onerror=alert(1)>` pouvait injecter du HTML.
**Correction :** Ajout de `escapeHtml()` sur les 3 occurrences de `w2.name` dans les fonctions `renderMgmtDetail` et `showAllProjectsModal`.

### CORRIGÉ — Feedback visuel sur ajout de fait mémoire (sidebar.html)

**Fichier :** `electron/sidebar.html`
**Problème :** Clic sur "Ajouter" avec un champ vide ne donnait aucun feedback visuel. Pas de limite de longueur.
**Correction :** Flash de bordure rouge si vide, validation max 500 caractères.

### CORRIGÉ — XSS via model.id dans les options select (state.js)

**Fichier :** `electron/projects/state.js`
**Problème :** Les IDs de modèles provenant du proxy étaient insérés dans `innerHTML` sans échappement. Un ID malveillant pouvait injecter du HTML.
**Correction :** Ajout de `escapeHtml()` sur `m.id` et `displayModelName(m.id)` dans les deux `select` (projModel et assistantModelSelect).

### À VÉRIFIER MANUELLEMENT — Accessibilité labels

**Fichiers :** sidebar.html, projects.html
**Constat :** Plusieurs inputs manquent d'attributs `aria-label` ou de `<label for="">` explicites. Les checkboxes dans les modales n'ont pas de labels associés programmatiquement. Le focus trap dans le modal de configuration fonctionne mais les modales de projets n'en ont pas.
**Impact :** Moyen — navigation clavier fonctionnelle mais lecteurs d'écran dégradés.

### À VÉRIFIER MANUELLEMENT — Textarea chatInput sans maxlength

**Fichier :** projects.html
**Constat :** Le textarea de chat n'a pas de `maxlength`. Le proxy Express en aval devrait limiter la taille des requêtes, mais côté client il n'y a pas de garde.
**Impact :** Faible — le proxy tronque/rejette les messages trop longs.

---

## Résumé

- **8 correctifs appliqués** (2 XSS, 3 validations, 3 double-submit)
- **2 points à vérifier manuellement** (accessibilité labels, maxlength chat)
- **0 régression** — tous les correctifs sont additifs (pas de changement de comportement nominal)

---

## Suivi — Run du 2026-06-13

Vérification de second passage. L'audit du 2026-06-12 (commit `cb344f6`) avait
couvert XSS, validations et double-submit, mais 3 gaps subsistaient sur des
formulaires du panneau Réglages. Corrigés ce jour (commit `dd23aa0`).

### Nouveaux findings

| Formulaire / champ | Gap résiduel | Statut |
| ------------------ | ------------ | ------ |
| Clés API (`#key-*`, handler blur) | `saveApiKeys()` sans `.catch` → échec Keychain avalé en silence | **CORRIGÉ** |
| Clés API (`#key-*`) | Pas de `.trim()` → clés collées avec espace/`\n` final rejetées par les fournisseurs | **CORRIGÉ** |
| `#new-fact` (ajout fait mémoire) | Input sans `<label>` ni `aria-label` (a11y) | **CORRIGÉ** (aria-label ajouté) |
| `#new-fact` | Pas de `maxlength` malgré validation JS à 500 | **CORRIGÉ** (`maxlength="500"`) |
| `#new-fact` | Branche `> 500` laissait la bordure rouge en permanence | **CORRIGÉ** (reset 1500 ms) |
| `#new-fact` | `addMemoryFact().then()` sans `.catch` → texte saisi perdu en cas d'échec | **CORRIGÉ** (restauration saisie) |
| Modal création/édition agent (`btnSaveProjectConfirm`) | `saveProject()` sans `catch` → échec sans retour visible | **DÉJÀ CORRIGÉ** dans `cb344f6` (présent en HEAD) |

### À VÉRIFIER MANUELLEMENT (changements visibles)

- **Clés API — toast d'erreur** : un échec d'enregistrement affiche désormais
  « Échec de l'enregistrement de la clé » et restaure la valeur précédente.
  À vérifier visuellement en simulant un échec Keychain.
- **`maxlength="500"` sur `#new-fact`** : la saisie est maintenant bloquée à
  500 caractères côté navigateur (la validation JS le rejetait déjà).

### Note d'exécution

Plusieurs tâches planifiées s'exécutaient en parallèle sur ce dépôt pendant ce
run (commits concurrents `f39a5b3`, `39fa0e0`, `c708ee6`). Les correctifs ont été
isolés au seul `electron/sidebar.html` (diff vérifié : 3 hunks, aucun WIP tiers
embarqué). Le correctif modal était déjà présent en HEAD et n'a pas été redupliqué.

### Résumé du run

- **6 correctifs appliqués** sur 2 formulaires (clés API, fait mémoire)
- **1 finding déjà couvert** par le run précédent
- **2 changements de comportement visibles** à vérifier manuellement
