# Audit des dependances — OpenHub

**Date:** 2026-06-12
**Outil:** npm audit + npm outdated
**Resultat npm audit:** 0 vulnerabilites

---

## Mises a jour appliquees (patch/minor)

| Package           | Avant    | Apres    | Type  |
| ----------------- | -------- | -------- | ----- |
| electron          | 42.3.3   | 42.4.0   | patch |
| electron-builder  | 26.15.0  | 26.15.2  | patch |
| prettier          | 3.8.3    | 3.8.4    | patch |
| typescript-eslint | 8.60.1   | 8.61.0   | minor |
| @types/node       | 22.19.19 | 22.19.21 | patch |

**Statut:** MIS A JOUR (commit `39a7444`)

---

## Mises a jour majeures restantes (A METTRE A JOUR MANUELLEMENT)

### 1. eslint 9.39.4 -> 10.4.1

- **Risque:** Moyen. Breaking changes dans la config flat.
- **Migration:** Verifier que `eslint.config.*` est compatible avec ESLint 10. Tester `npx eslint@10 .` avant de mettre a jour. Consulter le guide de migration ESLint 10.

### 2. globals 16.5.0 -> 17.6.0

- **Risque:** Faible. Lie a ESLint — mettre a jour en meme temps qu'ESLint 10.
- **Migration:** `npm install globals@17` apres migration ESLint.

### 3. lint-staged 15.5.2 -> 17.0.7

- **Risque:** Faible-Moyen. Possible changement de comportement des globs.
- **Migration:** Lire le changelog 16.x et 17.x. Tester avec `npx lint-staged@17 --dry-run`.

### 4. typescript 5.9.3 -> 6.0.3

- **Risque:** Moyen-Eleve. TypeScript 6 peut introduire des changements de comportement du type checker.
- **Migration:** `npm install typescript@6` + `npx tsc --noEmit` pour verifier la compatibilite. Corriger les erreurs de type eventuelles.

### 5. @types/node 22.x -> 25.x

- **Risque:** Faible. Les types Node 25 ajoutent des definitions mais cassent rarement.
- **Migration:** Mettre a jour apres TypeScript 6, car les types Node recents peuvent necessiter TS 6+.

---

## Dependances critiques

| Package  | Version | Statut    | Notes                                                                                                                                                               |
| -------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| electron | 42.4.0  | OK        | Derniere version stable                                                                                                                                             |
| express  | 5.1.0   | OK        | Express 5 stable, aucune CVE connue                                                                                                                                 |
| keytar   | 7.9.0   | ATTENTION | Derniere version, mais le projet est en mode maintenance (archive). Electron 42 compatible via node-gyp rebuild. Surveiller une alternative (electron safeStorage). |

---

## Sous-dependances a risque

Aucune vulnerabilite transitive detectee par `npm audit`.

---

## Recommandations

1. **Court terme:** Les patches appliques aujourd'hui suffisent.
2. **Moyen terme (1-2 mois):** Migrer ESLint 10 + globals 17 + lint-staged 17 ensemble.
3. **Long terme:** Evaluer le remplacement de `keytar` par `electron.safeStorage` (API native Electron, pas de dependance native).
4. **TypeScript 6:** Attendre la stabilisation (6.1+) avant migration en production.

---

## Plan de mise a jour par etapes

```
Etape 1 (immediate)     : patches/minors ✅ fait
Etape 2 (sprint suivant): ESLint 10 + globals 17
Etape 3 (sprint suivant): lint-staged 17
Etape 4 (apres stabilisation): TypeScript 6
Etape 5 (evaluation)    : remplacer keytar par safeStorage
```
