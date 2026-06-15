# OpenHub — FAQ

### OpenHub est-il gratuit ?

Le shell OpenHub est open-source (MIT). Mais il **n'inclut aucun crédit IA** : tu
utilises **tes propres clés API** (Anthropic, OpenAI, OpenRouter, Google) ou des
modèles locaux via Ollama. Les coûts d'inférence sont facturés par ton provider, pas
par OpenHub.

### Ça marche sur Windows ou Linux ?

Non, **macOS uniquement** (macOS 14+) pour l'instant. OpenHub dépend du Trousseau
macOS pour stocker les secrets et de `WebContentsView` d'Electron. Un portage n'est
pas prévu à court terme.

### Où sont stockées mes clés API ?

Dans le **Trousseau macOS (Keychain)**, via `keytar`. Elles ne sont jamais écrites sur
disque, ni dans le stockage local, ni dans les WebViews des apps. Le proxy local les
charge en RAM et les injecte au démarrage des process. Les 3 apps ne reçoivent qu'un
**faux jeton local**, jamais tes vraies clés.

### Où sont stockées mes données (projets, mémoire, chats) ?

Tout est local, dans ton dossier utilisateur :

| Donnée               | Emplacement                                    |
| -------------------- | ---------------------------------------------- |
| Projets              | `~/.config/openhub/projects.json`              |
| Mémoire              | `~/.config/openhub/memory.json`                |
| Config opencode      | `~/.config/opencode/opencode.json`             |
| Historique des chats | stockage local + sauvegarde fichier sur disque |

Rien n'est envoyé à un serveur OpenHub — il n'y en a pas.

### Pourquoi un proxy local sur le port 9999 ?

Pour **centraliser les secrets et la configuration**. Au lieu de coller tes clés dans
chacune des 3 apps, tu les saisis une fois ; le proxy (`127.0.0.1:9999`,
OpenAI-compatible, Bearer obligatoire) détient les vraies clés et route les appels
vers le bon provider. Il sert aussi de point d'injection pour la recherche web et
l'enrichissement de contexte.

### Mes apps upstream sont-elles modifiées ?

**Jamais.** OpenHub clone OpenWork, OpenCode et Open Design dans `apps/` et les laisse
intacts. Toute la personnalisation (thème, masquage de settings, features) passe par
de l'injection CSS/JS depuis `electron/overrides/`. C'est pour ça que les mises à jour
upstream (`npm run update:apps`) restent indolores.

### Quels providers LLM sont supportés ?

Anthropic (Claude), OpenAI (GPT), OpenRouter (multi-modèles), Ollama (local) et Google
Gemini (via OAuth). Tu peux mélanger cloud et local selon les tâches.

### C'est quoi l'orchestrateur, concrètement ?

Un moteur qui décompose un objectif en plusieurs agents spécialisés (code, design,
work, recherche, vérification) organisés en graphe de dépendances, puis enchaîne leur
exécution avec des contrôles qualité automatiques. Le résultat est un dossier de
livrables. Voir le [guide d'usage](USAGE.md#4-lorchestrateur-multi-agents).

### Après une mise à jour upstream, l'interface est cassée. Que faire ?

Lance `npm run check:selectors` : ça vérifie que les sélecteurs CSS visés par les
overrides existent toujours dans le nouveau code des apps. Si un sélecteur a changé en
amont, il faut ajuster le fichier d'override concerné dans `electron/overrides/`.

### Comment contribuer ?

Voir [CONTRIBUTING.md](../CONTRIBUTING.md). En résumé : fork, branche, tests
(`npm test`), typecheck (`npm run typecheck`), lint (`npm run lint`), puis PR.

### Comment signaler un bug ou demander une fonctionnalité ?

Via les [issues GitHub](https://github.com/1zalt/OpenHub/issues) — des templates sont
fournis pour les bugs, les fonctionnalités et les questions.
</content>
