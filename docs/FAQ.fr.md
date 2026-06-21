[English](FAQ.md) · **Français**

# OpenHub — FAQ

### OpenHub est-il gratuit ?

Le shell OpenHub est open-source (MIT). Mais il n'inclut aucun crédit IA : tu
utilises tes propres clés API (Anthropic, OpenAI, OpenRouter, Google ou tout fournisseur compatible OpenAI) ou des
modèles locaux via Ollama. Les coûts d'inférence sont facturés par ton provider, pas
par OpenHub.

### Ça marche sur Windows ou Linux ?

Non, macOS uniquement (macOS 14+) pour l'instant. OpenHub stocke les secrets dans un
fichier chiffré dans `~/Library/Application Support/openhub/secrets.enc`
(AES-256-GCM) et dépend de `WebContentsView` d'Electron. Un portage n'est pas prévu
à court terme.

### Où sont stockées mes clés API ?

Dans un fichier chiffré dans `~/Library/Application Support/openhub/secrets.enc`
(AES-256-GCM). Elles ne sont jamais stockées en clair, ni dans le stockage local, ni
dans les WebViews des apps. Le proxy les charge en RAM et les injecte au démarrage
des process. Les 3 apps ne reçoivent qu'un faux jeton local, jamais tes vraies
clés.

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

Pour centraliser les secrets et la configuration. Au lieu de coller tes clés dans
chacune des 3 apps, tu les saisis une fois ; le proxy (`127.0.0.1:9999`,
OpenAI-compatible, Bearer obligatoire) détient les vraies clés et route les appels
vers le bon provider. Il sert aussi de point d'injection pour la recherche web et
l'enrichissement de contexte.

### Mes apps upstream sont-elles modifiées ?

**Jamais.** OpenHub clone OpenWork, OpenCode et Open Design dans `apps/` et les laisse
intacts. Toute la personnalisation (thème, masquage de settings, features) passe par
de l'injection CSS/JS depuis `electron/overrides/`. C'est pour ça que les mises à jour upstream ne cassent rien.

### Quels providers LLM sont supportés ?

Anthropic (Claude), OpenAI (GPT), OpenRouter (multi-modèles), Ollama (local) et Google
Gemini (via OAuth). Tu peux mélanger cloud et local selon les tâches.

### C'est quoi l'orchestrateur, concrètement ?

Un moteur qui décompose un objectif en plusieurs agents spécialisés (code, design,
work, recherche, vérification) organisés en graphe de dépendances, puis enchaîne leur
exécution avec des contrôles qualité automatiques. Le résultat est un dossier de
livrables. Voir le [guide d'usage](USAGE.fr.md#4-lorchestrateur-multi-agents).

### Après une mise à jour upstream, l'interface est cassée. Que faire ?

OpenHub inclut une vérification de sélecteurs qui contrôle si les sélecteurs CSS
visés par les overrides existent toujours dans le nouveau code des apps. Si un
sélecteur a changé en amont, il faut ajuster le fichier d'override concerné dans
`electron/overrides/`. Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour le workflow
développeur complet.

### Comment contribuer ?

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour le workflow complet : fork, branche,
tests, puis pull request.

### Comment signaler un bug ou demander une fonctionnalité ?

Via les [issues GitHub](https://github.com/Open-Fable/OpenHub/issues) — des templates sont
fournis pour les bugs, les fonctionnalités et les questions.
