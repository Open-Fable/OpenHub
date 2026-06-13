# Audit des dépendances — OpenHub

**Date:** 2026-06-13
**Outil:** npm audit + npm outdated
**Résultat npm audit:** 0 vulnérabilité détectée

---

## Mises à jour appliquées (patch/minor)

| Package              | Avant   | Après   | Type        |
| -------------------- | ------- | ------- | ----------- |
| electron-builder     | 26.15.2 | 26.15.3 | patch       |
| + 7 sous-dépendances | —       | —       | patch/minor |

**Statut:** MIS À JOUR (commit `fa55591`)

---

## Mises à jour majeures restantes (À METTRE À JOUR MANUELLEMENT)

### 1. eslint 9.39.4 → 10.5.0

- **Risque:** Moyen. Breaking changes dans la config flat.
- **Migration:** Vérifier que `eslint.config.*` est compatible avec ESLint 10. Tester `npx eslint@10 .` avant de mettre à jour. Vérifier la compatibilité de `typescript-eslint`.

### 2. globals 16.5.0 → 17.6.0

- **Risque:** Faible. Lié à ESLint — mettre à jour en même temps qu'ESLint 10.
- **Migration:** `npm install globals@17` après migration ESLint.

### 3. lint-staged 15.5.2 → 17.0.7

- **Risque:** Faible-Moyen. Possible changement de comportement des globs.
- **Migration:** Lire le changelog 16.x et 17.x. Tester avec `npx lint-staged@17 --dry-run`.

### 4. typescript 5.9.3 → 6.0.3

- **Risque:** Élevé. TypeScript 6 peut introduire des changements de comportement du type checker.
- **Migration:** `npm install typescript@6` + `npx tsc --noEmit` pour vérifier. Attendre TS 6.1+ pour la stabilisation.

### 5. @types/node 22.19.21 → 25.9.3

- **Risque:** Faible. Types uniquement, pas de runtime.
- **Migration:** Mettre à jour après TypeScript 6, car les types Node 25 peuvent nécessiter TS 6+.

---

## Dépendances critiques

| Package  | Version | Statut    | Notes                                                                                           |
| -------- | ------- | --------- | ----------------------------------------------------------------------------------------------- |
| electron | 42.4.0  | OK        | Dernière version stable, à jour                                                                 |
| express  | 5.2.1   | OK        | Express 5 GA, aucune CVE connue                                                                 |
| keytar   | 7.9.0   | ATTENTION | Projet archivé. Fonctionne mais plus maintenu. Envisager migration vers `electron.safeStorage`. |

---

## Sous-dépendances à risque

Aucune vulnérabilité transitive détectée par `npm audit`.

---

## Plan de mise à jour par étapes

```
Étape 1 (immédiate)         : patches/minors ✅ fait
Étape 2 (sprint suivant)    : ESLint 10 + globals 17
Étape 3 (sprint suivant)    : lint-staged 17
Étape 4 (après stabilisation): TypeScript 6
Étape 5 (évaluation)        : remplacer keytar par safeStorage
```
