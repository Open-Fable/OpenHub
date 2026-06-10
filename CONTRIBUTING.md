# Contribuer a OpenHub

Merci de vouloir contribuer ! Voici comment participer.

## Prerequis

- macOS 14+
- Node.js 22+
- Git

## Setup local

```bash
git clone https://github.com/1zalt/OpenHub.git
cd OpenHub
bash scripts/setup.sh
npm run dev
```

## Workflow

1. **Fork** le repo et cree une branche depuis `main`
2. **Installe** les dependances avec `bash scripts/setup.sh`
3. **Fais tes changements** — touche uniquement ce qui est necessaire
4. **Verifie** : `npm run typecheck && npm run lint && npm test`
5. **Teste** manuellement dans Electron (`npm run dev`)
6. **Ouvre une PR** avec une description claire

## Regles

- **Ne modifie jamais le code source des apps upstream** (`apps/`). Toute personnalisation passe par `electron/overrides/`.
- **Pas de secrets dans le code.** Les cles API passent par le macOS Keychain.
- **Commits conventionnels :** `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- **TypeScript strict.** Pas de `any` sauf aux frontieres de serialisation.
- **Fichiers < 400 lignes, fonctions < 50 lignes.**

## Signaler un bug

Utilise le template [Bug Report](https://github.com/1zalt/OpenHub/issues/new?template=bug_report.yml).

## Proposer une fonctionnalite

Utilise le template [Feature Request](https://github.com/1zalt/OpenHub/issues/new?template=feature_request.yml).

## Licence

En contribuant, tu acceptes que tes contributions soient sous licence [MIT](LICENSE).
