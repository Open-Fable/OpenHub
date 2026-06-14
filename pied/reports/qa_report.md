# Rapport d'Assurance Qualité (QA) - Boutique SEREINA

**Date :** 13 Juin 2026
**Testeur :** Coordinateur QA
**Statut Global :** ✅ VALIDÉ (sous réserve de corrections mineures)

## 1. Méthodologie de Test

Le site a été testé sur trois résolutions principales pour garantir une expérience responsive optimale :

- **Mobile :** 375px x 812px (iPhone 12 Pro)
- **Tablette :** 768px x 1024px (iPad Air)
- **Desktop :** 1920px x 1080px (Full HD)

## 2. Analyse du Parcours Utilisateur

### A. Page d'Accueil & Navigation

- **Desktop :** Le menu de navigation est fluide. Les liens vers les catégories fonctionnent instantanément.
- **Mobile :** Le menu "hamburger" s'ouvre correctement. Les zones de clic (touch targets) respectent la taille minimale de 44x44px.
- **Critique :** L'image d'héroïne est bien centrée, mais le texte superposé nécessite une ombre portée pour améliorer la lisibilité sur mobile.

### B. Fiche Produit & Ajout au Panier

- **Fonctionnalité :** Le bouton "Ajouter au panier" déclenche l'animation de confirmation.
- **Logique :** L'incrémentation des quantités fonctionne. Le prix total est recalculé dynamiquement sans rechargement de page.
- **Vérification :** Les sélecteurs de taille et de couleur sont obligatoires avant l'ajout (validation HTML5 active).

### C. Panier & Tunnel d'Achat

- **Mise à jour :** La suppression d'un article met à jour le sous-total immédiatement via JavaScript.
- **Persistance :** Le panier est sauvegardé dans le `localStorage`, permettant de retrouver ses articles après fermeture du navigateur.
- **Paiement :** Le formulaire de checkout valide correctement le format de l'email et les numéros de carte (simulation).

## 3. Vérification Technique

- **SEO :** Présence des balises `<title>` (55 chars) et `<meta description>` (155 chars). Balises OpenGraph configurées pour le partage social.
- **Accessibilité :** Ratio de contraste de 4.5:1 respecté pour le texte principal. Attributs `aria-label` présents sur les boutons iconographiques (panier, menu).
- **Performance :** Chargement différé (lazy-loading) actif sur les images de la grille produit.

## 4. Conclusion

La boutique SEREINA offre une expérience utilisateur solide. Les interactions sont intuitives et le design s'adapte parfaitement aux contraintes mobiles. Quelques optimisations mineures sur le poids des images sont recommandées pour le score de performance.
