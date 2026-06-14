# Protocole de Sécurité des Paiements - SEREINA

Ce document détaille les mesures de sécurité implémentées dans le tunnel de paiement de la plateforme SEREINA pour garantir l'intégrité des données et la protection des utilisateurs.

## 1. Protection des Données Bancaires

- **Non-persistance des données sensibles** : Les numéros de carte (PAN), dates d'expiration et CVV ne sont jamais stockés dans nos bases de données. Ils sont transmis via des canaux sécurisés directement au processeur de paiement.
- **Validation côté client et serveur** :
  - Utilisation de l'**Algorithme de Luhn** pour valider la structure des numéros de carte avant toute tentative de transaction.
  - Vérification stricte des formats (Regex) et des dates de validité.
- **Tokenisation (Simulation)** : Le système est conçu pour intégrer des solutions comme Stripe Elements, où les données sensibles sont remplacées par un jeton (token) unique, limitant la surface d'attaque PCI DSS.

## 2. Sécurité des Transactions

- **Validation des montants** : Le montant total est recalculé côté serveur juste avant l'appel à la passerelle de paiement pour éviter toute manipulation frauduleuse du prix dans le navigateur.
- **Vérification de l'inventaire** : Un "double-check" des stocks est effectué immédiatement avant le débit pour éviter les ventes à découvert en cas de forte affluence.
- **Idempotence** : Chaque demande de paiement génère un identifiant unique pour éviter les doubles débits en cas de rafraîchissement de page ou de latence réseau.

## 3. Mesures Contre les Attaques Communes

- **Protection CSRF (Cross-Site Request Forgery)** : Toutes les requêtes de paiement doivent inclure un jeton anti-CSRF valide généré par la session utilisateur.
- **Sanitisation des entrées** : Toutes les données fournies par l'utilisateur (adresses, noms) sont nettoyées pour prévenir les injections SQL et les attaques XSS.
- **Journalisation sécurisée** : Les logs de transaction (`payment_gateway.js`) n'enregistrent que les statuts, les montants et les IDs de transaction anonymisés. Aucune donnée permettant d'identifier une carte n'apparaît dans les journaux.

## 4. Conformité et Standards

- **HTTPS/TLS** : Toutes les communications entre le client, le serveur et la passerelle de paiement doivent impérativement transiter par des protocoles TLS 1.2+ avec chiffrement fort.
- **PCI DSS Level 1** : L'architecture simule une conformité au niveau le plus élevé en externalisant le traitement lourd de la donnée bancaire à des experts certifiés.

---

_Dernière mise à jour : 13 Juin 2026_
