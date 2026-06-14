import assert from "node:assert";
import test from "node:test";
import { CartManager } from "../src/logic/cart_manager.js";
import { inventoryService } from "../src/logic/inventory_service.js";

test("CartManager - Ajout de produit et calcul du total", () => {
  const cart = new CartManager();

  // Ajout d'une chaussure à 120€
  cart.addToCart("shoe-001", 1);

  const totals = cart.calculateTotals();

  // Subtotal: 120
  // Tax (20%): 24
  // Shipping: 9.90 (car < 150)
  // Total: 153.90
  assert.strictEqual(totals.subtotal, 120.0);
  assert.strictEqual(totals.tax, 24.0);
  assert.strictEqual(totals.shipping, 9.9);
  assert.strictEqual(totals.total, 153.9);
});

test("CartManager - Frais de port gratuits au dessus du seuil", () => {
  const cart = new CartManager();

  // Ajout de 2 paires à 120€ = 240€ (> 150€)
  cart.addToCart("shoe-001", 2);

  const totals = cart.calculateTotals();

  assert.strictEqual(totals.shipping, 0);
  assert.strictEqual(totals.subtotal, 240.0);
  assert.strictEqual(totals.total, 288.0); // 240 + 48 tax
});

test("CartManager - Gestion des erreurs de stock", () => {
  const cart = new CartManager();

  // shoe-004 est en rupture de stock (0)
  assert.throws(() => {
    cart.addToCart("shoe-004", 1);
  }, /Stock insuffisant/);

  // shoe-003 a seulement 2 unités en stock
  cart.addToCart("shoe-003", 2);
  assert.throws(() => {
    cart.updateQuantity("shoe-003", 3);
  }, /Stock insuffisant/);
});

test("CartManager - Suppression et mise à jour", () => {
  const cart = new CartManager();

  cart.addToCart("shoe-001", 1);
  cart.addToCart("shoe-002", 1);

  assert.strictEqual(cart.items.length, 2);

  cart.removeFromCart("shoe-001");
  assert.strictEqual(cart.items.length, 1);
  assert.strictEqual(cart.items[0].productId, "shoe-002");

  cart.updateQuantity("shoe-002", 0); // Doit supprimer l'item
  assert.strictEqual(cart.items.length, 0);
});

test("InventoryService - Mise à jour du stock réel", () => {
  const initialStock = inventoryService.getProduct("shoe-002").stock;

  inventoryService.decrementStock("shoe-002", 2);

  const newStock = inventoryService.getProduct("shoe-002").stock;
  assert.strictEqual(newStock, initialStock - 2);

  assert.throws(() => {
    inventoryService.decrementStock("shoe-002", 100);
  }, /Stock insuffisant/);
});
