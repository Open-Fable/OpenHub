# Guide de Déploiement - Boutique SEREINA

Ce document détaille les étapes nécessaires pour mettre en ligne la boutique SEREINA et assurer son bon fonctionnement technique et SEO.

## 1. Prérequis

- Un nom de domaine (ex: `sereina-boutique.com`).
- Un hébergement web (Hébergement mutualisé, VPS, ou plateforme statique type Netlify/Vercel).
- Un accès FTP/SFTP ou une connexion GitHub pour le déploiement continu.

## 2. Structure du Projet

Le dossier de production contient :

- `index.html` : Page d'accueil.
- `boutique.html` : Catalogue des produits.
- `a-propos.html` : Histoire et valeurs de la marque.
- `produit-serum-eclat.html` : Fiche produit détaillée.
- `blog-rituel-matinal.html` : Article de blog optimisé.
- `contact.html` : Formulaire de contact.
- `css/style.css` : Feuilles de styles minifiées.
- `js/main.js` : Scripts d'interactivité.
- `assets/` : Images optimisées (WebP/JPG) et icônes.

## 3. Étapes de Déploiement

### Option A : Hébergement Statique (Recommandé : Netlify / Vercel)

1. Connectez votre compte GitHub au service.
2. Sélectionnez le dépôt contenant les fichiers.
3. Configurez le répertoire de base sur `/`.
4. Cliquez sur "Deploy". Le site sera automatiquement optimisé et servi via CDN.

### Option B : Hébergement Classique (FTP)

1. Connectez-vous à votre serveur via un client FTP (FileZilla).
2. Transférez l'intégralité du contenu du dossier `dist` vers le répertoire `public_html` ou `www`.
3. Assurez-vous que le fichier `.htaccess` (si présent) est bien copié pour la gestion des redirections.

## 4. Configuration SEO & Analytics

1. **Robots.txt & Sitemap** : Les fichiers sont présents à la racine. Vérifiez que l'URL du sitemap dans `robots.txt` correspond à votre nom de domaine final.
2. **Google Search Console** : Soumettez le fichier `sitemap.xml` pour indexation.
3. **Tracking** : Insérez votre code Google Analytics ou Plausible dans la balise `<head>` de chaque fichier HTML.

## 5. Optimisation des Performances

- Les images ont été compressées.
- Le CSS utilise des variables pour une maintenance facile.
- Pour une mise en production réelle, il est conseillé de passer les fichiers HTML dans un "minifier" pour réduire le poids de quelques Ko supplémentaires.

## 6. Support

Pour toute question technique, contactez l'équipe de développement via le canal dédié.
