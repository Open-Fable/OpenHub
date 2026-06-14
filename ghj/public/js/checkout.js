/**
 * SOLENIA - Checkout Logic
 * Gère la validation du formulaire, le calcul dynamique et l'envoi au backend.
 */

document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkout-form");
  const payButton = document.querySelector(".btn-pay");

  // Simulation de données panier (normalement récupérées du localStorage)
  const cart = [{ id: "sl-urb-01", name: "L'Urbaine Solenia", price: 1450, quantity: 1 }];

  /**
   * Met à jour l'affichage du récapitulatif
   */
  function updateSummary() {
    const listContainer = document.getElementById("cart-items-list");
    const totalDisplay = document.getElementById("final-total");

    let subtotal = 0;
    listContainer.innerHTML = "";

    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
      const line = document.createElement("div");
      line.className = "summary-line";
      line.innerHTML = `<span>${item.name} x${item.quantity}</span><span>${item.price.toFixed(2)} €</span>`;
      listContainer.appendChild(line);
    });

    totalDisplay.textContent = `${subtotal.toFixed(2)} €`;
  }

  /**
   * Gestion de la soumission
   */
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Animation de chargement
    payButton.disabled = true;
    payButton.textContent = "Traitement en cours...";

    const formData = new FormData(checkoutForm);
    const orderData = {
      customer: Object.fromEntries(formData.entries()),
      cart: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
      brand: "Solenia",
    };

    try {
      // Simulation d'appel API vers le backend Python
      const response = await fetch("/api/v1/order/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      // Pour la démo, on simule un succès après 1.5s
      setTimeout(() => {
        window.location.href =
          "confirmation.html?order=SOL-" +
          Math.random().toString(36).substr(2, 9).toUpperCase();
      }, 1500);
    } catch (error) {
      console.error("Erreur Solenia Checkout:", error);
      alert("Une erreur est survenue lors du traitement. Veuillez réessayer.");
      payButton.disabled = false;
      payButton.textContent = "Confirmer le paiement";
    }
  });

  updateSummary();
});
