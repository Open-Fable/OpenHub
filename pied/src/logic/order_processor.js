/**
 * Processeur de commande côté serveur (Simulation Node.js)
 * Intègre les corrections de sécurité de l'audit.
 */

class OrderProcessor {
  constructor(db, paymentGateway) {
    this.db = db;
    this.paymentGateway = paymentGateway;
  }

  /**
   * Valide et traite une commande
   */
  async processOrder(cartItems, customerInfo, paymentToken) {
    // 1. Sanitisation (Protection XSS/Injection)
    const sanitizedInfo = this._sanitize(customerInfo);

    // 2. Recalcul du prix (Protection contre la fraude au prix)
    const totalAmount = await this._calculateTotal(cartItems);

    // 3. Traitement du paiement via Gateway sécurisée
    const paymentResult = await this.paymentGateway.charge(paymentToken, totalAmount);

    if (paymentResult.status === "succeeded") {
      // 4. Enregistrement en DB via requêtes paramétrées (Protection SQLi)
      const order = await this.db.orders.create({
        data: {
          customerId: sanitizedInfo.email,
          amount: totalAmount,
          status: "PAID",
          transactionId: paymentResult.id,
        },
      });
      return { success: true, orderId: order.id };
    }

    throw new Error("Échec du paiement");
  }

  _sanitize(data) {
    const clean = {};
    for (let key in data) {
      if (typeof data[key] === "string") {
        // Supprime les balises HTML pour éviter XSS
        clean[key] = data[key].replace(/<[^>]*>?/gm, "");
      } else {
        clean[key] = data[key];
      }
    }
    return clean;
  }

  async _calculateTotal(items) {
    // Simulation de récupération des prix réels en DB
    const prices = { "elixir-serenite": 8500 }; // en centimes
    return items.reduce((sum, item) => sum + (prices[item] || 0), 0);
  }
}

module.exports = OrderProcessor;
