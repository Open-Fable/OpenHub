# Liste des Anomalies et Améliorations - SEREINA

Ce document répertorie les points critiques et les suggestions d'amélioration identifiés lors de l'audit QA.

## 1. Erreurs Critiques (CRITICAL)

### Bug #01 : Problème de mise à jour du panier sur Safari Mobile

- **Description :** Le bouton "Ajouter au panier" ne déclenche pas la mise à jour visuelle du compteur dans le header sur les anciennes versions de Safari (iOS 14).
- **Impact :** L'utilisateur pense que l'action a échoué.
- **Correction :**
