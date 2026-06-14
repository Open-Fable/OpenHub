/**
 * @file cart_manager.ts
 * @description Logique métier du panier d'achat : ajout, suppression et calculs financiers.
 */

import { InventoryService, Product } from "./inventory_service";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export class CartManager {
  private items: Map<string, CartItem> = new Map();
  private readonly TAX_RATE = 0.2; // TVA 20%
  private readonly SHIPPING_FLAT_RATE = 10.0;
  private readonly FREE_SHIPPING_THRESHOLD = 150.0;

  constructor(private inventoryService: InventoryService) {}

  /**
   * Ajoute un produit au panier avec vérification des stocks.
   */
  public addToCart(productId: string, quantity: number): void {
    if (quantity <= 0) throw new Error("La quantité doit être supérieure à zéro.");

    const product = this.inventoryService.getProduct(productId);
    if (!product) throw new Error("Produit introuvable.");

    const currentItem = this.items.get(productId);
    const totalRequestedQuantity = (currentItem?.quantity || 0) + quantity;

    if (!this.inventoryService.isAvailable(productId, totalRequestedQuantity)) {
      throw new Error(`Stock insuffisant pour ${product.name}.`);
    }

    this.items.set(productId, {
      product,
      quantity: totalRequestedQuantity,
    });
  }

  /**
   * Met à jour la quantité d'un article existant.
   */
  public updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    if (!this.inventoryService.isAvailable(productId, newQuantity)) {
      throw new Error("Stock insuffisant pour cette mise à jour.");
    }

    const item = this.items.get(productId);
    if (!item) throw new Error("L'article n'est pas dans le panier.");

    item.quantity = newQuantity;
    this.items.set(productId, item);
  }

  /**
   * Supprime un article du panier.
   */
  public removeFromCart(productId: string): void {
    this.items.delete(productId);
  }

  /**
   * Calcule les totaux du panier avec précision au centime.
   */
  public calculateTotals(): CartTotals {
    let subtotal = 0;

    this.items.forEach((item) => {
      subtotal += item.product.price * item.quantity;
    });

    // Arrondi pour éviter les erreurs de virgule flottante IEEE 754
    subtotal = Math.round(subtotal * 100) / 100;

    const shipping =
      subtotal >= this.FREE_SHIPPING_THRESHOLD || subtotal === 0
        ? 0
        : this.SHIPPING_FLAT_RATE;

    const tax = Math.round(subtotal * this.TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    return { subtotal, tax, shipping, total };
  }

  /**
   * Retourne les articles du panier.
   */
  public getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Vide le panier.
   */
  public clear(): void {
    this.items.clear();
  }
}
