/**
 * SEREINA - Passerelle de Paiement Sécurisée (Simulation)
 * Gère l'intégration avec les processeurs de paiement externes.
 */

class PaymentGateway {
  constructor() {
    this.transactionLogs = [];
  }

  /**
   * Valide le format des données de carte bancaire.
   * @param {Object} cardDetails - Détails de la carte (number, expiry, cvv)
   */
  validateCardDetails(cardDetails) {
    const { number, expiry, cvv } = cardDetails;

    // 1. Algorithme de Luhn pour le numéro de carte
    if (!this._luhnCheck(number)) {
      throw new Error("Numéro de carte invalide (Échec Luhn).");
    }

    // 2. Validation de la date d'expiration (MM/YY)
    const [month, year] = expiry.split("/").map((v) => parseInt(v, 10));
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      throw new Error("La carte est expirée.");
    }

    // 3. Validation CVV (3 ou 4 chiffres)
    if (!/^\d{3,4}$/.test(cvv)) {
      throw new Error("Code CVV invalide.");
    }

    return true;
  }

  /**
   * Simule un traitement de transaction avec délai réseau.
   * @param {number} amountCents - Montant en centimes
   * @param {Object} cardDetails - Détails de la carte
   */
  async processPayment(amountCents, cardDetails) {
    console.log(
      `[PAYMENT] Initialisation de la transaction pour ${amountCents / 100}€...`,
    );

    try {
      this.validateCardDetails(cardDetails);

      // Simulation d'un délai réseau aléatoire (1.5s à 3s)
      const delay = Math.floor(Math.random() * 1500) + 1500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Simulation de refus de paiement aléatoire (5% de chance)
      if (Math.random() < 0.05) {
        throw new Error("Transaction refusée par la banque émettrice.");
      }

      const transactionId = `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      this._logTransaction(transactionId, amountCents, "SUCCESS");

      return {
        success: true,
        transactionId,
        message: "Paiement approuvé.",
      };
    } catch (error) {
      this._logTransaction(null, amountCents, "FAILED", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Algorithme de Luhn pour vérifier la validité d'un numéro de carte.
   * @private
   */
  _luhnCheck(num) {
    let arr = (num + "")
      .split("")
      .reverse()
      .map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
      (acc, val, i) =>
        i % 2 !== 0 ? acc + val : acc + (val * 2 > 9 ? val * 2 - 9 : val * 2),
      0,
    );
    sum += lastDigit;
    return sum % 10 === 0;
  }

  /**
   * Journalise les transactions sans stocker de données sensibles.
   * @private
   */
  _logTransaction(id, amount, status, error = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      transactionId: id,
      amountCents: amount,
      status: status,
      error: error,
    };
    this.transactionLogs.push(logEntry);
    console.log(
      `[PAYMENT LOG] ${status}: ${id || "N/A"} - ${amount / 100}€ ${error ? `(${error})` : ""}`,
    );
  }
}

module.exports = { PaymentGateway };
