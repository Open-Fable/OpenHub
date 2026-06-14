/**
 * SOLENIA - Unified Application Logic
 * Brand: Solenia
 */

// Storage Manager
const STORAGE_KEY = "solenia_cart_v1";
const storageManager = {
  save: (cart) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Solenia Storage Error", e);
    }
  },
  load: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  },
};

// Cart Logic
const ECO_TAX_CENTS = 40;
const SHIPPING_THRESHOLD_CENTS = 10000;
const FLAT_SHIPPING_CENTS = 1000;

let cart = storageManager.load();

const cartLogic = {
  addItem: (product, quantity = 1) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    storageManager.save(cart);
    updateUI();
  },
  getTotals: () => {
    const subtotal = cart.reduce((s, i) => s + i.priceCents * i.quantity, 0);
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const shipping =
      subtotal >= SHIPPING_THRESHOLD_CENTS || count === 0 ? 0 : FLAT_SHIPPING_CENTS;
    const total = subtotal + count * ECO_TAX_CENTS + shipping;
    return {
      subtotal: (subtotal / 100).toFixed(2),
      total: (total / 100).toFixed(2),
      count,
    };
  },
};

function updateUI() {
  const totals = cartLogic.getTotals();
  const cartCountElements = document.querySelectorAll(".cart-count");
  cartCountElements.forEach((el) => {
    el.textContent = totals.count;
    el.style.display = totals.count > 0 ? "inline" : "none";
  });
}

document.addEventListener("DOMContentLoaded", updateUI);
