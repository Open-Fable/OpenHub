# Manifeste du Bundle de Production — SEREINA

Ce document liste tous les fichiers inclus dans le déploiement final.

## Architecture des Fichiers

- `/` (Racine)
  - `index.html` : Page d'accueil optimisée SEO.
  - `shop.html` : Catalogue produits.
  - `product-detail.html` : Fiche produit détaillée.
  - `checkout.html` : Tunnel de paiement sécurisé.
  - `confirmation.html` : Page de succès.
  - `robots.txt` : Configuration indexation.
  - `sitemap.xml` : Plan du site pour Google.
  - `STYLEGUIDE.md` : Référentiel design.
  - `deployment_guide.md` : Documentation technique.

- `/assets`
  - `/css/main.css` : Styles globaux minifiés.
  - `/js/main.js` : Logique frontend et sécurité.
  - `/img/` : Assets graphiques (logo, produits, og-images).

- `/src/logic` (Backend simulé)
  - `order_processor.js` : Logique métier sécurisée.
  - `payment_gateway.js` : Interface Stripe.

## Optimisations Appliquées

1. **SEO :** Balises Meta uniques, JSON-LD Schema.org, structure Hn hiérarchique.
2. **Performance :** Lazy-loading sur les images, CSS critique inline (simulé), pas de dépendances externes lourdes.
3. **Sécurité :** Sanitisation des entrées, protection contre la manipulation de prix, conformité PCI-DSS (via Stripe).
4. **Accessibilité :** Landmarks ARIA, contrastes élevés (Noir/Sable), attributs alt descriptifs.
