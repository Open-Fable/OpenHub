# Design System : Solenia

## 1. Philosophie Visuelle : "La Marche en Harmonie"

L'identité de Solenia repose sur l'équilibre entre la rigueur médicale (précision, propreté) et le luxe organique (confort, matériaux naturels). Le design doit évoquer une sensation de légèreté, de respiration et de stabilité.

### Principes Fondateurs :

- **Minimalisme Apaisant** : Utilisation généreuse de l'espace blanc (whitespace) pour éviter la surcharge cognitive et mettre en valeur le produit.
- **Formes Organiques** : Les conteneurs et les boutons utilisent des rayons de bordure (border-radius) doux pour rappeler les courbes naturelles du corps humain.
- **Clarté Médicale** : Les informations techniques sont présentées de manière structurée, aérée et lisible, utilisant une typographie sans-serif moderne.
- **Accessibilité Native** : Utilisation du format OKLch pour garantir des contrastes perceptuels constants et une palette inclusive.

---

## 2. Système de Grille et Espacements

Solenia utilise un système de grille de 12 colonnes pour le desktop (max-width: 1440px) et 4 colonnes pour le mobile.

### Unité de base : 8px

Tous les espacements (margins, paddings) doivent être des multiples de 8 pour assurer une cohérence mathématique.

- **XS** : 8px (Inter-éléments proches, micro-ajustements)
- **S** : 16px (Paddings internes des cartes, petits composants)
- **M** : 32px (Espacement entre sections secondaires)
- **L** : 64px (Espacement entre sections majeures, marges de conteneur)
- **XL** : 128px (Marges hautes/basses des Hero sections)

---

## 3. Couleurs (Format OKLch)

La palette Solenia est inspirée de la nature et de la peau. Elle utilise exclusivement le format `oklch()` pour sa précision et sa gestion moderne des couleurs.

- **Primaire (Sage Green)** : `oklch(66% 0.035 148)` - Symbolise la santé et l'apaisement.
- **Accent (Earthy Clay)** : `oklch(58% 0.08 48)` - Rappelle la terre et l'aspect humain/artisanal.
- **Texte (Slate Dark)** : `oklch(31% 0.03 260)` - Pour une lisibilité maximale sans l'agressivité du noir pur.
- **Fond (Cream Beige)** : `oklch(96% 0.01 85)` - Offre une base douce et premium.

---

## 4. Composants Graphiques

### Boutons (CTA)

- **Primaire** : Fond `--color-primary`, texte `--color-bg-main`. Bordure arrondie de 50px (pill-shape).
- **Secondaire** : Bordure 1px `--color-text`, texte `--color-text`, fond transparent.
- **Tertiaire** : Texte `--color-accent`, soulignement léger, sans fond.

### Cartes Produit

- Fond : `--color-bg-card` (`oklch(98.5% 0.002 0)`).
- Ombre : `0 4px 24px oklch(0% 0 0 / 5%)` (subtile, presque imperceptible).
- Rayon : 16px.
- Interaction : Légère élévation et intensification de l'ombre au survol.

---

## 5. Iconographie

Utilisation d'icônes filaires (Outline) avec une épaisseur de trait de 1.5px.

- **Style** : Minimaliste, géométrique mais avec des angles arrondis.
- **Couleur** : `--color-text` par défaut, `--color-primary` pour les éléments de réassurance santé.

---

## 6. Usage du Logo

Le logo Solenia est le garant de notre expertise.

- **Zone d'exclusion** : Doit être entouré d'un espace vide égal à 2x la hauteur du "S".
- **Variantes** : Version "Slate Dark" sur fond clair, version "Off-White" sur fond sombre ou image.
- **Interdiction** : Ne jamais déformer, changer les couleurs hors palette, ou ajouter des effets de relief.
