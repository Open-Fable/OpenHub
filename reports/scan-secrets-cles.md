# Rapport de scan secrets — 2026-06-12

## Résultat global : AUCUN SECRET DÉTECTÉ

## Vérifications effectuées

| Vérification                                      | Résultat                                                    |
| ------------------------------------------------- | ----------------------------------------------------------- |
| Tokens/clés API hardcodés (TS/JS/JSON)            | Aucun trouvé                                                |
| Fichiers `.env` avec valeurs réelles              | Aucun (`.env.example` présent, commenté, sans valeur)       |
| `OPENCODE_SERVER_PASSWORD` hardcodé               | Aucun (généré par session)                                  |
| Bearer tokens en dur                              | Aucun                                                       |
| Secrets dans overrides JS (`electron/overrides/`) | Aucun                                                       |
| Secrets injectés via `executeJavaScript()`        | Aucun (injection UI uniquement)                             |
| localStorage/sessionStorage avec secrets          | Aucun (utilisé pour conversations orchestrateur uniquement) |
| Secrets dans config templates/settings            | Aucun                                                       |
| URLs internes exposées avec credentials           | Aucun                                                       |

## Détails

### localStorage

`electron/projects/chat.js` utilise `localStorage` pour persister les conversations de l'orchestrateur (`openhub-orch-convs`). Aucun secret n'y est stocké.

### .env.example

Fichier de documentation uniquement. Toutes les valeurs sont commentées avec la mention explicite que les secrets passent par le Keychain macOS.

### executeJavaScript

Utilisé dans `electron/main.ts:246` pour injecter les overrides CSS/JS. Aucun secret n'est passé dans le code injecté.

## Secrets corrigés

Aucun.

## Secrets à rotation manuelle

Aucun.

## Conclusion

Le projet respecte la politique de sécurité : tous les secrets transitent par `keytar`/Keychain macOS et sont injectés en RAM via variables d'environnement au spawn des processus.
