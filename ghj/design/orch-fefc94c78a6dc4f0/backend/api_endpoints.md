# Solenia API - Endpoints & Security

## Authentification

- `POST /api/v1/auth/login`: Authentification client/admin.
- `POST /api/v1/auth/refresh`: Renouvellement de token.

## Tunnel de Paiement (Checkout)

- `POST /api/v1/checkout/intent`: Création d'une intention de paiement (Validation des entrées requise).
- `POST /api/v1/checkout/confirm`: Confirmation de transaction.
- `GET /api/v1/checkout/status/{order_id}`: Vérification du statut (Protection IDOR requise).

## Inventaire

- `GET /api/v1/products`: Liste des produits.
- `GET /api/v1/inventory/alerts`: Seuils de stock critique (Admin uniquement).

## Sécurité des Données

- Validation stricte des entrées pour le tunnel de paiement.
- Redaction des PII dans les logs de transaction.
- Protection contre les injections SQL via ORM paramétré.
