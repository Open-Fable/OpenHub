/**
 * @file cart_tests.ts
 * @description Tests unitaires pour valider la logique du panier et de l'inventaire.
 */

import { InventoryService, Product } from "../src/logic/inventory_service";
import { CartManager } from "../src/logic/cart_manager";

// Mock de données
const mockProducts: Product[] = [
  { id: "SHOE-001", name: "Air Max Pro", price: 120.0, stock: 5, category: "Running" },
  { id: "SHOE-002", name: "Classic Leather", price: 85.5, stock: 2, category: "Casual" },
  { id: "SHOE-003", name: "Flip Flops", price: 15.0, stock: 10, category: "Summer" },
];

function runTests() {
  console.log("🚀 Démarrage des tests unitaires...");

  const inventory = new InventoryService(mockProducts);
  const cart = new CartManager(inventory);

  try {
    // Test 1: Ajout simple et calcul sous-total
    console.log("Test 1: Ajout d'un produit...");
    cart.addToCart("SHOE-001", 1);
    let totals = cart.calculateTotals();
    if (totals.subtotal !== 120.0)
      throw new Error(`Sous-total incorrect: ${totals.subtotal}`);
    if (totals.shipping !== 10.0)
      throw new Error("Les frais de port devraient être de 10€");
    console.log("✅ Test 1 réussi.");

    // Test 2: Seuil de livraison gratuite
    console.log("Test 2: Livraison gratuite (seuil 150€)...");
    cart.addToCart("SHOE-002", 1); // 120 + 85.50 = 205.50
    totals = cart.calculateTotals();
    if (totals.subtotal !== 205.5)
      throw new Error("Sous-total incorrect après 2ème ajout");
    if (totals.shipping !== 0)
      throw new Error("La livraison devrait être gratuite > 150€");
    console.log("✅ Test 2 réussi.");

    // Test 3: Gestion des stocks (Erreur attendue)
    console.log("Test 3: Tentative d'ajout au-delà du stock...");
    try {
      cart.addToCart("SHOE-002", 5); // Stock est de 2, on en a déjà 1
      throw new Error("Le test aurait dû échouer pour stock insuffisant");
    } catch (e: any) {
      if (e.message.includes("Stock insuffisant")) {
        console.log("✅ Test 3 réussi (Erreur capturée correctement).");
      } else {
        throw e;
      }
    }

    // Test 4: Calcul des taxes (20%)
    console.log("Test 4: Vérification de la TVA...");
    cart.clear();
    cart.addToCart("SHOE-003", 2); // 30.00€
    totals = cart.calculateTotals();
    // 30 * 0.20 = 6.00
    if (totals.tax !== 6.0)
      throw new Error(`TVA incorrecte: ${totals.tax} au lieu de 6.00`);
    console.log("✅ Test 4 réussi.");

    // Test 5: Mise à jour de quantité
    console.log("Test 5: Mise à jour de quantité...");
    cart.updateQuantity("SHOE-003", 5);
    if (cart.getItems()[0].quantity !== 5)
      throw new Error("La quantité n'a pas été mise à jour");
    console.log("✅ Test 5 réussi.");

    // Test 6: Décrémentation réelle du stock (Simulation commande)
    console.log("Test 6: Simulation de validation de commande...");
    const items = cart.getItems();
    items.forEach((item) => {
      inventory.decrementStock(item.product.id, item.quantity);
    });
    const updatedProduct = inventory.getProduct("SHOE-003");
    if (updatedProduct?.stock !== 5)
      throw new Error("Le stock n'a pas été décrémenté correctement");
    console.log("✅ Test 6 réussi.");

    console.log("\n✨ TOUS LES TESTS ONT RÉUSSI !");
  } catch (error: any) {
    console.error(`\n❌ ÉCHEC DU TEST : ${error.message}`);
    process.exit(1);
  }
}

// Exécution des tests
runTests();
