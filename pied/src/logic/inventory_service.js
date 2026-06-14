/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} stock
 */

/**
 * Service de gestion de l'inventaire des chaussures.
 * Simule une base de données de produits et gère les niveaux de stock.
 */
class InventoryService {
  constructor() {
    /** @type {Map<string, Product>} */
    this.products = new Map([
      ["shoe-001", { id: "shoe-001", name: "Air Max Runner", price: 120.0, stock: 10 }],
      ["shoe-002", { id: "shoe-002", name: "Classic Leather", price: 85.5, stock: 5 }],
      ["shoe-003", { id: "shoe-003", name: "Sport Pro Z", price: 150.0, stock: 2 }],
      ["shoe-004", { id: "shoe-004", name: "Urban Street", price: 65.0, stock: 0 }],
    ]);
  }

  /**
   * Vérifie si un produit est disponible en quantité suffisante.
   * @param {string} productId
   * @param {number} requestedQuantity
   * @returns {boolean}
   * @throws {Error} Si le produit n'existe pas.
   */
  isAvailable(productId, requestedQuantity) {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Produit avec l'ID ${productId} introuvable.`);
    }
    if (requestedQuantity <= 0) {
      throw new Error("La quantité demandée doit être supérieure à zéro.");
    }
    return product.stock >= requestedQuantity;
  }

  /**
   * Récupère les détails d'un produit.
   * @param {string} productId
   * @returns {Product}
   */
  getProduct(productId) {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Produit avec l'ID ${productId} introuvable.`);
    }
    return { ...product };
  }

  /**
   * Décrémente le stock après une commande validée.
   * @param {string} productId
   * @param {number} quantity
   */
  decrementStock(productId, quantity) {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Produit avec l'ID ${productId} introuvable.`);
    }
    if (product.stock < quantity) {
      throw new Error(`Stock insuffisant pour le produit ${product.name}.`);
    }
    product.stock -= quantity;
    this.products.set(productId, product);
  }

  /**
   * Réapprovisionne le stock (ex: annulation de commande).
   * @param {string} productId
   * @param {number} quantity
   */
  incrementStock(productId, quantity) {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Produit avec l'ID ${productId} introuvable.`);
    }
    product.stock += quantity;
    this.products.set(productId, product);
  }
}

export const inventoryService = new InventoryService();
