/**
 * SEREINA Paris - Main Logic
 * Gestion du panier, des animations et des formulaires
 */

document.addEventListener("DOMContentLoaded", () => {
  initCart();
  initSmoothScroll();
  initFormValidation();
});

// --- GESTION DU PANIER ---
function initCart() {
  let cart = JSON.parse(localStorage.getItem("sereina_cart")) || [];
  updateCartUI(cart);

  // Ajout au panier
  const addButtons = document.querySelectorAll(".btn-add-cart");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const product = {
        id: e.target.dataset.id,
        name: e.target.dataset.name,
        price: parseFloat(e.target.dataset.price),
        qty: 1,
      };
      addToCart(product);
    });
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("sereina_cart")) || [];
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("sereina_cart", JSON.stringify(cart));
  updateCartUI(cart);
  alert(`${product.name} a été ajouté à votre rituel.`);
}

function updateCartUI(cart) {
  const counts = document.querySelectorAll(".cart-count");
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  counts.forEach((el) => (el.textContent = totalItems));
}

// --- NAVIGATION ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// --- FORMULAIRES ---
function initFormValidation() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const email = form.querySelector('input[type="email"]');
      if (email && !validateEmail(email.value)) {
        e.preventDefault();
        alert("Veuillez entrer une adresse email valide.");
      }
    });
  });
}

function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}
