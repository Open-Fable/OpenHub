# Design System : SEREINA

Ce document constitue la référence unique pour l'identité visuelle et l'expérience utilisateur de la marque SEREINA. Il définit les règles de conception pour garantir une cohérence absolue entre les produits physiques (chaussures et semelles) et l'interface numérique.

## 1. Philosophie de Design

L'esthétique de SEREINA est guidée par le concept de "Luxe Thérapeutique". Le design doit inspirer la confiance médicale tout en conservant l'élégance d'une maison de mode haut de gamme.

- **Respiration :** L'espace blanc n'est pas du vide, c'est un composant structurel. Il permet à l'utilisateur de se concentrer sur l'essentiel : le confort et la technologie.
- **Fluidité :** Les courbes des composants rappellent l'anatomie humaine et le mouvement naturel de la marche.
- **Crédibilité :** L'utilisation de typographies structurées et de grilles rigoureuses souligne l'expertise podologique.

## 2. Palette de Couleurs (Conformité WCAG AA/AAA)

La palette chromatique est conçue pour apaiser l'œil et évoquer des matériaux naturels et durables.

| Rôle           | Nom                | Hex       | Usage Principal                                       |
| :------------- | :----------------- | :-------- | :---------------------------------------------------- |
| **Primaire**   | Vert Sauge Profond | `#4A5D50` | Identité forte, titres, boutons d'action principaux.  |
| **Secondaire** | Beige Sable        | `#E5D3B3` | Fonds de sections, séparateurs, accents organiques.   |
| **Accent**     | Terre d'Ombre      | `#8C7355` | Éléments interactifs, liens, survol, détails de cuir. |
| **Texte**      | Anthracite Doux    | `#2D3436` | Lisibilité maximale pour le corps de texte.           |
| **Fond**       | Crème de Soie      | `#F9F7F2` | Fond de page principal pour une ambiance chaleureuse. |
| **Surface**    | Blanc Pur          | `#FFFFFF` | Cartes produits, champs de saisie, zones de focus.    |

## 3. Typographie

Le contraste entre une Serif classique et une Sans-Serif moderne crée l'équilibre entre tradition et innovation.

- **Titres (Headings) :** _Playfair Display_
  - **Style :** Semi-bold (600).
  - **Usage :** H1 à H3. Évoque l'autorité et le raffinement.
  - **Tracking :** -1% pour les grands titres afin de resserrer l'impact visuel.
- **Corps de texte (Body) :** _Montserrat_
  - **Style :** Regular (400) pour la lecture longue, Medium (500) pour les interfaces.
  - **Usage :** Paragraphes, labels, boutons, navigation.
  - **Line-height :** 1.6 pour une lisibilité optimale.

## 4. Système de Grille et Espacement

Basé sur un module de **4px** pour une précision mathématique.

- **Échelle d'espacement :**
  - `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 40px | `xxl`: 64px | `huge`: 128px
- **Grille Desktop :** 12 colonnes, gouttière de 24px, marges latérales de 80px minimum.
- **Grille Mobile :** 4 colonnes, gouttière de 16px, marges latérales de 20px.

## 5. Composants UI (Bibliothèque de Composants)

### 5.1 Boutons & Interactions

- **Bouton Primaire :** Fond `--color-primary`, texte `--color-bg`. Coins arrondis 8px. Padding : 12px 32px.
  - _Hover :_ Translation vers le haut de 2px + assombrissement (`#3A4A40`).
- **Bouton Secondaire :** Bordure 1.5px `--color-primary`, texte `--color-primary`, fond transparent.
  - _Hover :_ Fond `--color-primary`, texte `--color-bg`.
- **Bouton Ghost :** Texte `--color-accent`, soulignement discret de 1px. Utilisé pour les actions secondaires comme "En savoir plus".

### 5.2 Cartes (Cards)

- **Carte Produit :**
  - Fond : `#FFFFFF`.
  - Bordure : 1px solid `--color-secondary`.
  - Ombre : `0 4px 20px rgba(74, 93, 80, 0.05)`.
  - Image : Ratio 4:5, fond gris très clair (`#F2F2F2`) pour détourer le produit.
- **Carte Article (Blog) :**
  - Image en haut, contenu avec padding `lg` (24px).
  - Tag de catégorie en Montserrat Bold 10px, majuscules.

### 5.3 Formulaires & Saisie

- **Inputs :** Hauteur 48px, bordure `--color-secondary`, fond `--color-white`.
- **Focus State :** Bordure `--color-primary`, halo de 3px avec 10% d'opacité.
- **Messages d'erreur :** Texte en `#D63031`, icône d'avertissement 14px.

### 5.4 Navigation & Feedback

- **Header :** Hauteur 80px. Effet de flou (Glassmorphism) : `backdrop-filter: blur(10px)` sur fond Crème à 90% d'opacité.
- **Méga-Menu :** Apparition en fondu (fade-in). Organisation par colonnes : "Collections", "Technologies", "Conseils".
- **Toasts :** Notifications flottantes en bas à gauche. Style minimaliste, fond blanc, bordure gauche colorée (Vert pour succès, Rouge pour erreur).

## 6. Assets Visuels & Identité Graphique

L'identité visuelle de SEREINA doit être immédiatement reconnaissable par sa clarté et son élégance. Chaque asset visuel doit respecter les principes de symétrie et de douceur.

### 6.1 Logotype

- **Construction :** Le mot "SEREINA" utilise un espacement de lettres (letter-spacing) de 0.15em pour renforcer l'aspect premium.
- **Symbole :** Une courbe organique en forme de "S" stylisé, évoquant à la fois une onde de choc amortie et la cambrure d'une voûte plantaire.
- **Zone d'exclusion :** Un espace vide égal à la hauteur de la lettre "S" doit entourer le logo en permanence.

### 6.2 Iconographie (Style "Serein-Lines")

- **Concept :** Icônes en trait (outline) uniquement.
- **Spécifications :** Épaisseur de trait de 1.5px, terminaisons arrondies (round caps/joins).
- **Grille d'icône :** Dessinées sur une matrice de 24x24px.
- **Set technique :**
  - _Amorti :_ Trois lignes horizontales souples.
  - _Légèreté :_ Une plume stylisée aux traits discontinus.
  - _Respirabilité :_ Trois flèches courbes ascendantes en pointillés.
  - _Éco-conception :_ Une feuille nervurée simplifiée.

### 6.3 Style Photographique (Art Direction)

La photographie doit traduire la sensation de "marcher sur un nuage".

- **Lumière :** Utilisation exclusive de la lumière naturelle. Ombres douces et longues (ambiance fin de journée ou matinée).
- **Composition :** Règle des tiers respectée avec beaucoup d'espace négatif. Le produit est souvent excentré pour laisser respirer l'image.
- **Sujets :**
  - _Lifestyle :_ Pieds en mouvement dans des environnements sereins (parcs urbains épurés, intérieurs minimalistes en bois clair).
  - _Technique :_ Gros plans macro sur les textures (cuir pleine fleur, mesh recyclé, structure alvéolaire de la semelle).
- **Traitement :** Légère désaturation des couleurs vives, renforcement des tons terreux et des blancs crémeux.

## 7. Motion Design (Transitions)

Le mouvement sur le site doit être "amorti", à l'image de nos semelles.

- **Durée de base :** 300ms.
- **Easing :** `cubic-bezier(0.4, 0, 0.2, 1)` (Standard Smooth).
- **Parallaxe :** Très léger sur les images de héros (amplitude max 20px) pour créer de la profondeur sans causer de cinétose.

## 8. Accessibilité & Performance

- **Sémantique :** Utilisation des rôles ARIA pour les menus complexes et les états de chargement.
- **Contraste :** Vérification systématique via l'algorithme APCA pour garantir la lisibilité sur tous les écrans.
- **Images :** Chargement différé (lazy-loading) systématique. Formats WebP pour le web, AVIF pour les navigateurs compatibles.

## 9. Manifeste des Assets (Production-Ready)

Liste des fichiers sources à utiliser pour l'intégration :

1.  `logo_sereina_primary.svg` : Logo principal Vert Sauge.
2.  `logo_sereina_white.svg` : Version pour fonds sombres/images.
3.  `hero_horizon_lifestyle.webp` : Image d'accueil (Sneakers Horizon en situation).
4.  `tech_sole_explosion.webp` : Vue éclatée 3D de la semelle Serein-Flex.
5.  `icon_set_v1.svg` : Planche complète des icônes de navigation et techniques.
6.  `texture_grain_overlay.png` : Texture de grain subtile pour les arrière-plans (opacité 2%).
7.  `video_comfort_loop.mp4` : Boucle vidéo ralentie (slow-motion) de la compression de la semelle.

---

_Dernière mise à jour : 13 Juin 2026_
_Version : 1.5.0_
