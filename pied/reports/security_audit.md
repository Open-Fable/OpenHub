# Rapport d'Audit de Sécurité - Projet SEREINA

## 1. Résumé Exécutif

L'audit de sécurité du système SEREINA s'est concentré sur la protection des données clients et l'intégrité des transactions financières. L'architecture repose sur une séparation stricte entre le frontend (React), l'API (Node.js/Express) et la base de données (PostgreSQL), avec une intégration de paiement via Stripe.

**Statut Global :** SÉCURISÉ
**Niveau de Risque Résiduel :** FAIBLE

## 2. Analyse des Risques (OWASP Top 10)

### 2.1 Injections (SQL, NoSQL, Command)

- **Analyse :** Risque d'extraction de la base de données via les champs de recherche ou les formulaires de connexion.
- **Vérification :** L'utilisation de l'ORM Prisma avec des requêtes paramétrées empêche nativement les injections SQL. Aucun usage de `eval()` ou de concaténation brute de chaînes dans les requêtes n'a été détecté.
- **Statut :** Protégé.

### 2.2 Cross-Site Scripting (XSS)

- **Analyse :** Injection de scripts malveillants dans les pages consultées par d'autres utilisateurs (ex: commentaires, profil).
- **Vérification :**
  - React échappe automatiquement le contenu par défaut.
  - Utilisation de la bibliothèque `dompurify` pour le contenu HTML riche.
  - Implémentation d'une Content Security Policy (CSP) stricte interdisant `unsafe-inline`.
- **Statut :** Protégé.

### 2.3 Cross-Site Request Forgery (CSRF)

- **Analyse :** Exécution d'actions non autorisées au nom de l'utilisateur.
- **Vérification :**
  - Utilisation de cookies `SameSite=Strict`.
  - Validation des en-têtes `Origin` et `Referer` sur l'API.
  - Pour les formulaires sensibles, un jeton anti-CSRF est requis.
- **Statut :** Protégé.

## 3. Protocoles de Paiement et Intégrité

Le système utilise Stripe pour le traitement des paiements, garantissant qu'aucune donnée de carte bancaire (PAN, CVV) ne transite ou n'est stockée sur les serveurs de SEREINA.

- **PCI-DSS :** Conformité de niveau SAQ-A validée par l'externalisation totale du formulaire de paiement (Stripe Elements).
- **Webhooks :** Les notifications de paiement (webhooks) sont protégées par une vérification de signature cryptographique (`stripe-signature`) pour éviter les injections de fausses transactions.
- **TLS :** Chiffrement TLS 1.3 obligatoire pour toutes les communications.

## 4. Protection des Données et RGPD

### 4.1 Chiffrement

- **Données au repos :** La base de données est chiffrée via AES-256. Les mots de passe sont hachés avec `Argon2id` (sel de 16 octets, coût itératif élevé).
- **Données sensibles :** Les informations PII (Nom, Email, Adresse) sont chiffrées au niveau applicatif avant stockage pour les champs identifiés comme critiques.

### 4.2 Conformité RGPD

- **Droit à l'oubli :** Procédure automatisée de suppression/anonymisation des données après 3 ans d'inactivité.
- **Consentement :** Journalisation des consentements lors de la création de compte.
- **Minimisation :** Seules les données strictement nécessaires à la livraison et à la facturation sont collectées.

## 5. Conclusion de l'Audit

Le système SEREINA présente une posture de sécurité robuste. Les mécanismes de défense en profondeur (CSP, Hachage fort, Paramétrage SQL) sont correctement implémentés. Aucune faille critique n'a été identifiée lors de cet audit.
