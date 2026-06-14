# Charte Typographique : Solenia

La typographie de Solenia doit refléter la précision scientifique et le raffinement d'une maison de luxe.

## 1. Polices de Caractères

### Police de Titrage (Headings) : _Fraunces_ ou _Lora_

- **Style** : Serif avec des empattements doux.
- **Usage** : Titres de sections (H1, H2), citations, manifestes.
- **Pourquoi** : Évoque l'héritage, le soin et le confort organique.

### Police d'Interface (UI & Body) : _Inter_

- **Style** : Sans-serif géométrique et hautement lisible.
- **Usage** : Corps de texte, boutons, navigation, données techniques.
- **Pourquoi** : Modernité, clarté médicale et excellente lisibilité sur tous les écrans.

---

## 2. Échelle Typographique (Base 16px)

| Niveau     | Taille          | Graisse        | Interlignage | Usage                                  |
| ---------- | --------------- | -------------- | ------------ | -------------------------------------- |
| **H1**     | 48px (3rem)     | SemiBold (600) | 1.1          | Titre Hero / Accueil                   |
| **H2**     | 32px (2rem)     | Medium (500)   | 1.2          | Titres de sections                     |
| **H3**     | 24px (1.5rem)   | Medium (500)   | 1.3          | Titres de cartes / sous-sections       |
| **Body L** | 18px (1.125rem) | Regular (400)  | 1.6          | Introductions / Articles               |
| **Body M** | 16px (1rem)     | Regular (400)  | 1.5          | Texte courant (Défaut)                 |
| **Body S** | 14px (0.875rem) | Regular (400)  | 1.4          | Légendes, petits détails               |
| **Button** | 16px (1rem)     | SemiBold (600) | 1            | Libellés d'action (Majuscules légères) |

---

## 3. Règles de Composition

- **Alignement** : Toujours aligné à gauche pour le corps de texte afin de faciliter la lecture. Les titres H1/H2 peuvent être centrés pour les sections "Hero".
- **Couleur** :
  - Titres : `--color-text-main` (`oklch(31% 0.03 260)`).
  - Corps de texte : `--color-text-muted` (`oklch(42% 0.03 255)`).
- **Largeur de ligne (Chiffre d'or)** : Le corps de texte ne doit jamais dépasser 75 caractères par ligne (environ 650px) pour garantir un confort de lecture optimal.
- **Espacement des lettres** :
  - Titres : -0.02em (pour un aspect plus compact et premium).
  - Boutons : +0.05em (pour améliorer la distinction des lettres).
