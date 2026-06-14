# Guide de Déploiement - Boutique Solenia

Ce document détaille les étapes pour mettre en ligne la boutique Solenia en environnement de production.

## 1. Pré-requis

- Un nom de domaine (ex: `solenia-boutique.com`).
- Un compte sur une plateforme d'hébergement (Vercel, Netlify ou AWS Amplify pour le frontend).
- Un serveur ou service Serverless pour le backend (Heroku, DigitalOcean App Platform, ou Google Cloud Functions).

## 2. Configuration du Frontend (Static/JS)

Le frontend est situé dans le dossier `public/`.

1. **Hébergement :** Connectez votre dépôt Git à **Vercel** ou **Netlify**.
2. **Répertoire racine :** Sélectionnez `public/`.
3. **Variables d'environnement :**
   - `NEXT_PUBLIC_API_URL` : URL de votre backend final.
   - `STRIPE_PUBLIC_KEY` : Votre clé publique Stripe.

## 3. Configuration du Backend (Python)

Le processeur de commande se trouve dans `backend/order_processor.py`.

1. **Environnement :** Utilisez un environnement Python 3.9+.
2. **Installation :** `pip install flask flask-cors` (ou le framework choisi).
3. **Sécurité :** Assurez-vous que les variables d'environnement suivantes sont configurées :
   - `STRIPE_SECRET_KEY` : Clé secrète de paiement.
   - `CSRF_SECRET` : Clé pour la génération des jetons.

## 4. SEO Technique & Meta Tags

Avant la mise en ligne, vérifiez que chaque page HTML (index, products, checkout) contient les balises **Open Graph** suivantes dans le `<head>` :
