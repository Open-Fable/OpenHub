/**
 * Modèle de données Product pour Solenia
 * Définit la structure d'un produit complet avec ses variantes.
 */

class Product {
  /**
   * @param {Object} data - Données brutes issues de la DB
   */
  constructor(data) {
    this.id = data.id;
    this.category_id = data.category_id;
    this.name = data.name;
    this.tagline = data.tagline;
    this.description = data.description;
    this.price = parseFloat(data.base_price || data.price);
    this.image_url = data.image_url;
    this.variants = data.variants || []; // Liste d'objets Variant
  }

  /**
   * Valide si les données d'un produit sont complètes pour la création
   * @param {Object} p - Objet produit à tester
   * @returns {Boolean}
   */
  static validate(p) {
    return !!(p.id && p.name && p.category_id && p.price > 0);
  }

  /**
   * Formate le produit pour l'affichage frontal (JSON)
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tagline: this.tagline,
      description: this.description,
      price: this.price,
      category: this.category_id,
      image: this.image_url,
      variants: this.variants.map((v) => ({
        sku: v.sku,
        size: v.size,
        color: v.color,
        inStock: v.stock_quantity > 0,
        stock: v.stock_quantity,
      })),
    };
  }
}

module.exports = Product;
