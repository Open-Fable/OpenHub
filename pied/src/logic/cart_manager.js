import { inventoryService } from "./inventory_service.js";

/**
 * @typedef {Object} CartItem
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 */

/**
 * @typedef {Object} CartTotals
 * @property {number} subtotal - Prix HT
 * @property {number} tax - Montant de la taxe
 * @property {number} shipping - Frais de port
 * @property {number} total - Prix TTC final
 */

const TAX_RATE = 0.2; // 20% TVA
const SHIPPING_FLAT_RATE = 9.9;
const SHIPPING_FREE_THRESHOLD = 150.0;

/**
 * Gère la logique métier du panier d'achat.
 */
export class CartManager {
  constructor() {
    /** @type {CartItem[]} */
    this.items = [];
  }

  /**
   * Ajoute un produit au panier.
   * @param {string} productId
   * @param {number} quantity
   */
  addToCart(productId, quantity) {
    if (quantity <= 0) throw new Error("La quantité doit être positive.");

    const product = inventoryService.getProduct(productId);

    if (!inventoryService.isAvailable(productId, quantity)) {
      throw new Error(`Stock insuffisant pour ${product.name}.`);
    }

    const existingItem = this.items.find((item) => item.productId === productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (!inventoryService.isAvailable(productId, newQuantity)) {
        throw new Error(`Impossible d'ajouter plus de ${product.name}. Stock limité.`);
      }
      existingItem.quantity = newQuantity;
    } else {
      this.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      });
    }
  }

  /**
   * Supprime un produit du panier.
   * @param {string} productId
   */
  removeFromCart(productId) {
    const index = this.items.findIndex((item) => item.productId === productId);
    if (index === -1) {
      throw new Error("Produit non présent dans le panier.");
    }
    this.items.splice(index, 1);
  }

  /**
   * Met à jour la quantité d'un produit existant.
   * @param {string} productId
   * @param {number} newQuantity
   */
  updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.items.find((i) => i.productId === productId);
    if (!item) throw new Error("Produit introuvable dans le panier.");

    if (!inventoryService.isAvailable(productId, newQuantity)) {
      throw new Error("Stock insuffisant pour cette mise à jour.");
    }

    item.quantity = newQuantity;
  }

  /**
   * Calcule les totaux du panier avec précision.
   * @returns {CartTotals}
   */
  calculateTotals() {
    const subtotal = this.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const tax = subtotal * TAX_RATE;

    let shipping = 0;
    if (subtotal > 0 && subtotal < SHIPPING_FREE_THRESHOLD) {
      shipping = SHIPPING_FLAT_RATE;
    }

    const total = subtotal + tax + shipping;

    return {
      subtotal: this._round(subtotal),
      tax: this._round(tax),
      shipping: this._round(shipping),
      total: this._round(total),
    };
  }

  /**
   * Arrondi précis à deux décimales pour éviter les erreurs de flottants.
   * @param {number} value
   * @returns {number}
   * @private
   */
  _round(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  /**
   * Vide le panier.
   */
  clear() {
    this.items = [];
  }
}
