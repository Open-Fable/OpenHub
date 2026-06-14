import { CartManager } from "../logic/cart_manager";
import { InventoryService } from "../logic/inventory_service";
import { Product, ProductVariant } from "../api/models";

/**
 * Suite de tests unitaires pour valider la logique métier du panier.
 */
async function runTestSuite() {
  console.log("🚀 Démarrage de la suite de tests du Panier...\n");

  // 1. Initialisation des données de test
  const mockProduct: Product = {
    id: 1,
    name: "Air Max Infinity",
    description: "Chaussure de sport premium",
    basePriceCents: 12000, // 120.00€
    category: "Running",
    images: ["img1.jpg"],
  };

  const mockVariant: ProductVariant = {
    id: 101,
    productId: 1,
    sku: "NIKE-AM-INF-42",
    size: "42",
    color: "Noir",
    additionalPriceCents: 500, // +5.00€
  };

  const inventory = new InventoryService([
    { variantId: 101, quantity: 5 },
    { variantId: 102, quantity: 1 },
  ]);

  const cart = new CartManager(inventory);

  try {
    // TEST 1 : Ajout simple et calcul du prix unitaire
    console.log("Test 1: Ajout d'un produit...");
    await cart.addToCart(mockProduct, mockVariant, 1);
    const items = cart.getItems();
    if (items.length !== 1) throw new Error("Le panier devrait contenir 1 article.");
    if (items[0].unitPriceCents !== 12500)
      throw new Error("Le prix unitaire calculé est incorrect.");
    console.log("✅ Réussi");

    // TEST 2 : Calcul des totaux avec frais de port
    console.log("Test 2: Calcul des totaux (sous seuil gratuité)...");
    const totals = cart.calculateTotals();
    // Sous-total: 125.00€, Port: 5.90€, Total: 130.90€
    if (totals.subtotalCents !== 12500) throw new Error("Sous-total incorrect.");
    if (totals.shippingCents !== 590)
      throw new Error("Les frais de port devraient être de 5.90€.");
    if (totals.totalCents !== 13090) throw new Error("Total TTC incorrect.");
    console.log("✅ Réussi");

    // TEST 3 : Seuil de gratuité des frais de port
    console.log("Test 3: Seuil de gratuité (>= 150€)...");
    await cart.addToCart(mockProduct, mockVariant, 1); // Total devient 250.00€
    const newTotals = cart.calculateTotals();
    if (newTotals.shippingCents !== 0)
      throw new Error("Les frais de port devraient être offerts.");
    console.log("✅ Réussi");

    // TEST 4 : Gestion des erreurs de stock
    console.log("Test 4: Tentative d'ajout au-delà du stock...");
    try {
      await cart.addToCart(mockProduct, mockVariant, 10);
      throw new Error("Le test aurait dû échouer pour stock insuffisant.");
    } catch (e: any) {
      if (!e.message.includes("Stock insuffisant")) throw e;
      console.log("✅ Réussi (Erreur capturée correctement)");
    }

    // TEST 5 : Mise à jour de quantité et suppression
    console.log("Test 5: Mise à jour de quantité...");
    await cart.updateQuantity(101, 1);
    if (cart.getItems()[0].quantity !== 1)
      throw new Error("La quantité n'a pas été mise à jour.");

    cart.removeFromCart(101);
    if (cart.getItems().length !== 0)
      throw new Error("Le panier devrait être vide après suppression.");
    console.log("✅ Réussi");

    // TEST 6 : Intégrité de l'inventaire après simulation de commande
    console.log("Test 6: Décrémentation réelle du stock...");
    await inventory.decrementStock(101, 2);
    const remainingStock = inventory.getStockLevel(101);
    if (remainingStock !== 3)
      throw new Error(`Stock restant incorrect. Attendu 3, reçu ${remainingStock}`);
    console.log("✅ Réussi");

    console.log("\n✨ TOUS LES TESTS ONT RÉUSSI AVEC SUCCÈS ✨");
  } catch (error: any) {
    console.error("\n❌ ÉCHEC D'UN TEST :");
    console.error(error.message);
    process.exit(1);
  }
}

// Exécution de la suite de tests
runTestSuite();
