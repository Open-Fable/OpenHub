/**
 * SEREINA - Frontend Logic
 * Gestion du catalogue et du panier
 */

const PRODUCTS = [
  {
    id: 1,
    name: "L'Urbaine Sereine",
    price: 149.0,
    category: "Ville & Bureau",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800",
    description: "Cuir Nappa pleine fleur, soutien plantaire invisible.",
  },
  {
    id: 2,
    name: "La Flâneuse",
    price: 129.0,
    category: "Casual & Week-end",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800",
    description: "Mocassin souple avec technologie d'absorption des chocs.",
  },
  {
    id: 3,
    name: "L'Ambassadrice",
    price: 189.0,
    category: "Cérémonie",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800",
    description: "Escarpin ergonomique, cambrure étudiée pour 12h de confort.",
  },
  {
    id: 4,
    name: "Le Derby Horizon",
    price: 159.0,
    category: "Ville & Bureau",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800",
    description: "Design classique, semelle intérieure orthopédique amovible.",
  },
];

// --- Gestion du Panier ---

let cart = JSON.parse(localStorage.getItem("sereina_cart")) || [];

function saveCart() {
  localStorage.setItem("sereina_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (product) {
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} a été ajouté au panier.`);
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCartPage();
}

function updateQuantity(productId, delta) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      renderCartPage();
    }
  }
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }
}

// --- Rendu des Pages ---

function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  const featured = document.getElementById("featured-products");

  const target = grid || featured;
  if (!target) return;

  const productsToShow = featured ? PRODUCTS.slice(0, 3) : PRODUCTS;

  target.innerHTML = productsToShow
    .map(
      (product) => `
        <div class="card fade-in">
            <a href="product_detail.html">
                <img src="${product.image}" alt="${product.name}" style="height: 300px; width: 100%; object-fit: cover;">
            </a>
            <div class="p-6">
                <p class="text-xs text-muted uppercase tracking-widest mb-2">${product.category}</p>
                <h3 class="mb-2">${product.name}</h3>
                <p class="text-sm text-muted mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-primary">${product.price.toFixed(2)} €</span>
                    <button class="btn btn-outline btn-sm" onclick="addToCart(${product.id})">Ajouter</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function renderCartPage() {
  const container = document.getElementById("cart-items-container");
  const emptyMsg = document.getElementById("empty-cart-msg");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "";
    emptyMsg.style.display = "block";
    updateSummary(0);
    return;
  }

  emptyMsg.style.display = "none";
  container.innerHTML = cart
    .map(
      (item) => `
        <div class="flex gap-6 mb-8 pb-8 border-bottom" style="border-bottom: 1px solid var(--neutral-200);">
            <img src="${item.image}" alt="${item.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: var(--radius-sm);">
            <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg">${item.name}</h3>
                    <button class="btn btn-ghost p-0 text-muted hover-text-error" onclick="removeFromCart(${item.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <p class="text-sm text-muted mb-4">Pointure: 39</p>
                <div class="flex justify-between items-center">
                    <div class="flex items-center border rounded">
                        <button class="p-2 hover-bg-neutral-100" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="px-4 font-bold">${item.quantity}</span>
                        <button class="p-2 hover-bg-neutral-100" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span class="font-bold">${(item.price * item.quantity).toFixed(2)} €</span>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  updateSummary(subtotal);
}

function updateSummary(subtotal) {
  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} €`;
  if (totalEl) totalEl.textContent = `${subtotal.toFixed(2)} €`;
}

// --- Initialisation ---

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCatalog();
  renderCartPage();

  // Gestion du bouton "Ajouter au panier" sur la page produit
  const addBtn = document.querySelector("[data-add-to-cart]");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const id = parseInt(addBtn.getAttribute("data-product-id"));
      addToCart(id);
    });
  }
});
