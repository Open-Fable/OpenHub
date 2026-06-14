/**
 * @file inventory_service.ts
 * @description Gère l'état des stocks et la validation de la disponibilité des produits.
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export class InventoryService {
  private products: Map<string, Product>;

  constructor(initialProducts: Product[] = []) {
    this.products = new Map(initialProducts.map((p) => [p.id, { ...p }]));
  }

  /**
   * Vérifie si une quantité demandée est disponible en stock.
   * @throws Error si le produit n'existe pas.
   */
  public isAvailable(productId: string, quantity: number): boolean {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Produit avec l'ID ${productId} introuvable.`);
    }
    return product.stock >= quantity;
  }

  /**
   * Récupère les détails d'un produit.
   */
  public getProduct(productId: string): Product | undefined {
    const product = this.products.get(productId);
    return product ? { ...product } : undefined;
  }

  /**
   * Décrémente le stock après une validation de commande.
   * @throws Error si le stock est insuffisant ou le produit inexistant.
   */
  public decrementStock(productId: string, quantity: number): void {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Erreur de mise à jour : Produit ${productId} inexistant.`);
    }
    if (product.stock < quantity) {
      throw new Error(`Stock insuffisant pour le produit ${product.name}.`);
    }
    product.stock -= quantity;
    this.products.set(productId, product);
  }

  /**
   * Réapprovisionne le stock d'un produit.
   */
  public incrementStock(productId: string, quantity: number): void {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Erreur de mise à jour : Produit ${productId} inexistant.`);
    }
    product.stock += quantity;
    this.products.set(productId, product);
  }

  /**
   * Retourne la liste complète des produits (copie profonde).
   */
  public getAllProducts(): Product[] {
    return Array.from(this.products.values()).map((p) => ({ ...p }));
  }
}
