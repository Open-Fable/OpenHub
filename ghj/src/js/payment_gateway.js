/**
 * SOLENIA - Payment Gateway Interface
 * Gestion sécurisée des transactions et validation des moyens de paiement.
 * Conformité : Algorithme de Luhn & Validation temporelle.
 */

export const paymentGateway = {
  /**
   * Valide un numéro de carte via l'algorithme de Luhn.
   * @param {string} cardNumber - Le numéro de carte (chiffres uniquement).
   * @returns {boolean}
   */
  validateLuhn: (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  },

  /**
   * Valide la date d'expiration (format MM/YY).
   * @param {string} expiry - Date d'expiration.
   * @returns {boolean}
   */
  validateExpiry: (expiry) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiry)) return false;

    const [month, year] = expiry.split("/").map((n) => parseInt(n));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  },

  /**
   * Simule l'envoi sécurisé des données à une API de paiement (Stripe Simulation).
   * @param {Object} paymentData - { cardNumber, expiry, cvv, holderName, amountCents }
   * @returns {Promise<Object>}
   */
  processPayment: async (paymentData) => {
    const { cardNumber, expiry, cvv, amountCents } = paymentData;

    // Validation stricte avant simulation d'envoi
    if (!paymentGateway.validateLuhn(cardNumber)) {
      throw new Error("Numéro de carte invalide.");
    }
    if (!paymentGateway.validateExpiry(expiry)) {
      throw new Error("Date d'expiration invalide ou passée.");
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      throw new Error("Code CVV invalide.");
    }

    console.log(
      `[Solenia Gateway] Initialisation de la transaction pour ${amountCents / 100}€...`,
    );

    // Simulation de latence réseau
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation de succès (95% de réussite pour la démo)
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
          resolve({
            status: "success",
            transactionId: `SOL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
          });
        } else {
          reject(new Error("La transaction a été refusée par la banque émettrice."));
        }
      }, 2000);
    });
  },
};
