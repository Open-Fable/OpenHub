const express = require("express");
const router = express.Router();
const Product = require("./models/Product");

/**
 * Note : Dans une application réelle, nous utiliserions un pool de connexion
 * à une base de données (ex: mysql2, pg, ou un ORM comme Sequelize).
 * Pour cet exemple, nous simulons l'interface d'accès aux données.
 */

// --- ROUTES ---

/**
 * @route   GET /api/products
 * @desc    Récupérer tous les produits (avec filtre optionnel par catégorie)
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    // Logique de filtrage simulée
    // SQL : SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id
    // if (category) query += " WHERE p.category_id = ?"

    console.log(`Récupération des produits. Filtre catégorie : ${category || "aucun"}`);

    // Simulation de réponse
    const mockProducts = [
      { id: "SH-001", name: "Solenia Aura", category_id: "cat_shoes", price: 165.0 },
      { id: "IN-001", name: "Ergo-Active Pro", category_id: "cat_insoles", price: 65.0 },
    ];

    res.status(200).json({
      success: true,
      count: mockProducts.length,
      data: mockProducts,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur lors de la récupération des produits.",
      });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Récupérer un produit spécifique avec ses variantes et son stock
 */
router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  // Validation basique de l'ID
  if (!productId || productId.length < 3) {
    return res
      .status(400)
      .json({ success: false, message: "Format d'ID produit invalide." });
  }

  try {
    // Logique simulée : Récupération du produit + Jointure sur product_variants
    // SQL : SELECT * FROM products WHERE id = productId;
    // SQL : SELECT * FROM product_variants WHERE product_id = productId;

    console.log(`Récupération du produit ID: ${productId}`);

    // Simulation de données trouvées
    const foundProduct = new Product({
      id: productId,
      name: "Solenia Aura",
      category_id: "cat_shoes",
      base_price: 165.0,
      tagline: "La marche urbaine réinventée.",
      variants: [
        { sku: "SH001-G-38", size: "38", color: "Gris Nuage", stock_quantity: 12 },
        { sku: "SH001-G-39", size: "39", color: "Gris Nuage", stock_quantity: 0 },
      ],
    });

    if (!foundProduct) {
      return res.status(404).json({ success: false, message: "Produit non trouvé." });
    }

    res.status(200).json({
      success: true,
      data: foundProduct.toJSON(),
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la récupération du détail produit.",
      });
  }
});

/**
 * @route   POST /api/products (Admin uniquement dans un cas réel)
 * @desc    Ajouter un nouveau produit
 */
router.post("/", async (req, res) => {
  const productData = req.body;

  if (!Product.validate(productData)) {
    return res.status(400).json({
      success: false,
      message: "Données manquantes : id, name, category_id et price sont obligatoires.",
    });
  }

  try {
    // Logique d'insertion DB ici
    res.status(201).json({
      success: true,
      message: "Produit créé avec succès.",
      data: productData,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de la création du produit." });
  }
});

module.exports = router;
