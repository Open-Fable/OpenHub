/**
 * Modèles de données pour le catalogue et le panier.
 * Utilise des centimes (integers) pour éviter les erreurs de précision en virgule flottante.
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  basePriceCents: number;
  category: string;
  images: string[];
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  size: string;
  color: string;
  additionalPriceCents: number;
}

export interface CartItem {
  variantId: number;
  productId: number;
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceCents: number;
}

export interface CartTotals {
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface StockItem {
  variantId: number;
  quantity: number;
}
