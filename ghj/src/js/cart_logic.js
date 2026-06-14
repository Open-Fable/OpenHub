/**
 * SOLENIA - Cart Logic
 * Fonctions métier pour la gestion du panier et des calculs financiers.
 */

import { storageManager } from "./storage_manager.js";

// Configuration des frais et taxes
const ECO_TAX_CENTS = 40; // 0,40€ par article
const SHIPPING_THRESHOLD_CENTS = 10000; // Livraison gratuite dès 100€
const FLAT_SHIPPING_CENTS = 1000; // 10€ de frais de port sinon
const TAX_RATE = 0.2; // TVA 20% incluse

let cart = storageManager.load();

export const cartLogic = {
  /**
   * Ajoute un produit au panier avec vérification des stocks.
   * @param {Object} product - Données de base du produit.
   * @param {Object} variant - Variante spécifique (taille/couleur).
   * @param {number} quantity - Quantité souhaitée.
   * @returns {Object} - Résultat de l'opération { success: boolean, message: string }.
   */
  addItem: (product, variant, quantity = 1) => {
    // Vérification du stock
    if (variant.stock_quantity < quantity) {
      return { success: false, message: "Stock insuffisant pour cette variante." };
    }

    const existingItemIndex = cart.findIndex((item) => item.variantId === variant.id);

    if (existingItemIndex > -1) {
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      if (variant.stock_quantity < newQuantity) {
        return { success: false, message: "Limite de stock atteinte pour cet article." };
      }
      cart[existingItemIndex].quantity = newQuantity;
    } else {
      cart.push({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variantLabel: `${variant.size} - ${variant.color}`,
        priceCents: Math.round((product.base_price + variant.additional_price) * 100),
        quantity: quantity,
        imageUrl: product.images?.[0]?.url || "",
      });
    }

    storageManager.save(cart);
    return { success: true, message: "Article ajouté au panier." };
  },

  /**
   * Retire un article du panier.
   * @param {string} variantId - ID de la variante à supprimer.
   */
  removeItem: (variantId) => {
    cart = cart.filter((item) => item.variantId !== variantId);
    storageManager.save(cart);
  },

  /**
   * Met à jour la quantité d'un article.
   */
  updateQuantity: (variantId, newQuantity, maxStock) => {
    if (newQuantity <= 0) {
      cartLogic.removeItem(variantId);
      return;
    }

    if (newQuantity > maxStock) {
      return { success: false, message: "Stock maximum atteint." };
    }

    const item = cart.find((i) => i.variantId === variantId);
    if (item) {
      item.quantity = newQuantity;
      storageManager.save(cart);
    }
    return { success: true };
  },

  /**
   * Calcule le récapitulatif financier complet.
   * @returns {Object} - Totaux formatés.
   */
  getTotals: () => {
    const subtotalCents = cart.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    );
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const ecoTaxCents = itemCount * ECO_TAX_CENTS;

    const shippingCents =
      subtotalCents >= SHIPPING_THRESHOLD_CENTS || itemCount === 0
        ? 0
        : FLAT_SHIPPING_CENTS;

    const totalCents = subtotalCents + ecoTaxCents + shippingCents;
    const taxCents = Math.round(totalCents - totalCents / (1 + TAX_RATE));

    return {
      subtotal: (subtotalCents / 100).toFixed(2),
      ecoTax: (ecoTaxCents / 100).toFixed(2),
      shipping: (shippingCents / 100).toFixed(2),
      tax: (taxCents / 100).toFixed(2),
      total: (totalCents / 100).toFixed(2),
      count: itemCount,
    };
  },

  getCart: () => [...cart],

  clear: () => {
    cart = [];
    storageManager.clear();
  },
};
