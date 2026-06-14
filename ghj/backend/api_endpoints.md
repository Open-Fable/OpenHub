# Documentation API Solenia

Ce document répertorie les points d'entrée de l'API REST pour la plateforme Solenia. Toutes les requêtes doivent être effectuées en HTTPS et les données sont échangées au format JSON.

## 1. Authentification & Sécurité

- **Base URL** : `https://api.solenia-footwear.com/v1`
- **Auth** : Bearer Token (JWT) pour les endpoints protégés.
- **Rate Limiting** : 100 requêtes / minute par IP.

---

## 2. Catalogue Produits

### 2.1 Lister les Produits

- **Endpoint** : `GET /products`
- **Paramètres** :
  - `category` (slug) : Filtrer par catégorie.
  - `pathology` (string) : Filtrer par besoin santé.
  - `sort` (price_asc, price_desc, newest).
- **Réponse** : Liste d'objets produits simplifiés.

### 2.2 Détail d'un Produit

- **Endpoint** : `GET /products/{slug}`
- **Réponse** : Objet produit complet avec toutes ses variantes et métadonnées de santé.

---

## 3. Gestion du Panier & Commandes

### 3.1 Validation de Stock

- **Endpoint** : `POST /cart/validate`
- **Payload** : Liste de SKU et quantités.
- **Réponse** : Statut de disponibilité et prix mis à jour.

### 3.2 Création de Commande (Checkout)

- **Endpoint** : `POST /orders`
- **Auth** : Optionnel (Guest Checkout supporté).
- **Payload** : Coordonnées client, adresse de livraison, items du panier.
- **Réponse** : `order_id` et `client_secret` Stripe pour finaliser le paiement.

---

## 4. Espace Client & Admin

### 4.1 Historique des Commandes

- **Endpoint** : `GET /me/orders`
- **Auth** : Requis.
- **Réponse** : Liste des commandes passées par l'utilisateur connecté.

### 4.2 Webhooks (Paiement)

- **Endpoint** : `POST /webhooks/stripe`
- **Description** : Écoute les événements `payment_intent.succeeded` pour valider les commandes et décrémenter les stocks en temps réel.

---

## 5. Codes de Réponse

| Code | Signification                                       |
| ---- | --------------------------------------------------- |
| 200  | Succès                                              |
| 201  | Ressource créée (Commande, Client)                  |
| 400  | Requête invalide (Stock insuffisant, format erroné) |
| 401  | Non authentifié                                     |
| 404  | Ressource non trouvée                               |
| 500  | Erreur serveur interne                              |
