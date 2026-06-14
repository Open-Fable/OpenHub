# Charte Graphique & Système de Design — SEREINA

## 1. Philosophie Visuelle

"Quiet Luxury" (Luxe Silencieux). L'interface doit respirer. L'utilisation généreuse des espaces blancs (whitespace) est primordiale pour évoquer la sérénité.

## 2. Palette de Couleurs

| Nom               | Hex       | HSL            | Usage                                       |
| :---------------- | :-------- | :------------- | :------------------------------------------ |
| **Noir Profond**  | `#1A1A1A` | `0, 0%, 10%`   | Titres, texte principal, boutons primaires. |
| **Sable de Soie** | `#F5F2ED` | `38, 24%, 95%` | Fond de page, sections secondaires.         |
| **Or Mat**        | `#C5A059` | `40, 50%, 56%` | Accents, prix, survol de liens.             |
| **Blanc Pur**     | `#FFFFFF` | `0, 0%, 100%`  | Cartes produits, sections de contraste.     |
| **Gris Doux**     | `#E0DCD5` | `38, 12%, 86%` | Bordures, séparateurs.                      |

## 3. Typographies

- **Titres (H1, H2, H3) :** `Playfair Display`. Serif élégant. Fallback: `Georgia, serif`.
- **Corps de texte :** `Montserrat`. Sans-serif moderne et lisible. Fallback: `Arial, sans-serif`.
- **Boutons & Meta :** `Montserrat` (Bold, Uppercase, Letter-spacing: 1px-2px).

## 4. Échelle d'Espacement (Spacing Scale)

Basée sur une unité de 8px :

- `xs`: 8px
- `s`: 16px
- `m`: 32px
- `l`: 64px
- `xl`: 128px

## 5. Composants UI

- **Boutons :** Angles droits (0px radius) pour un aspect architectural et haut de gamme.
- **Images :** Toujours utiliser `object-fit: cover` pour maintenir les ratios.
- **Transitions :** `0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)` pour une sensation de fluidité organique.
