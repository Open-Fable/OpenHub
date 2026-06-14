/**
 * SEREINA Admin Logic - Version Intégrale
 * Gère les interactions du tableau de bord, des produits et des commandes.
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("SEREINA Admin System Initialized");

  // 1. Initialisation du Graphique (si présent sur la page dashboard)
  const salesCtx = document.getElementById("salesChart");
  if (salesCtx) {
    initSalesChart(salesCtx);
  }

  // 2. Filtrage des Commandes (page orders.html)
  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      const status = e.target.value;
      const rows = document.querySelectorAll("#ordersTable tbody tr");

      rows.forEach((row) => {
        if (status === "all" || row.getAttribute("data-status") === status) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }

  // 3. Recherche de Produits (page products.html)
  const productSearch = document.getElementById("productSearch");
  if (productSearch) {
    productSearch.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const rows = document.querySelectorAll("#productsTable tbody tr");

      rows.forEach((row) => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? "" : "none";
      });
    });
  }

  // 4. Simulation de mise à jour de statut de commande
  const updateButtons = document.querySelectorAll(".update-status");
  updateButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const nextStatus = this.getAttribute("data-next");
      const row = this.closest("tr");
      const statusCell = row.querySelector(".status-pill");

      // Animation de chargement simulée
      const originalText = this.innerText;
      this.innerText = "Traitement...";
      this.disabled = true;

      setTimeout(() => {
        if (nextStatus === "Expédiée") {
          statusCell.className = "status-pill status-shipped";
        } else if (nextStatus === "Payée") {
          statusCell.className = "status-pill status-paid";
        }

        statusCell.innerText = nextStatus;
        row.setAttribute("data-status", nextStatus === "Expédiée" ? "shipped" : "paid");

        // Remplacer le bouton par un bouton de détails neutre ou le bouton suivant
        if (nextStatus === "Expédiée") {
          this.parentElement.innerHTML = '<button class="btn-ghost">Détails</button>';
        } else {
          this.innerText = "Expédier";
          this.setAttribute("data-next", "Expédiée");
          this.disabled = false;
        }

        console.log(`Commande mise à jour avec succès : ${nextStatus}`);
      }, 800);
    });
  });

  // 5. Simulation de modification de stock
  const editStockBtns = document.querySelectorAll(".edit-stock");
  editStockBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const modelName = row.cells[1].innerText;
      const currentStock = row.cells[3].innerText;

      const newStock = prompt(`Mise à jour du stock pour "${modelName}" :`, currentStock);

      if (newStock !== null && !isNaN(newStock) && newStock.trim() !== "") {
        const stockCell = row.cells[3];
        const statusCell = row.querySelector(".status-pill");

        stockCell.innerText = newStock;

        // Mise à jour visuelle du badge de statut
        const val = parseInt(newStock);
        if (val === 0) {
          statusCell.className = "status-pill status-out";
          statusCell.innerText = "Rupture";
        } else if (val < 10) {
          statusCell.className = "status-pill status-low";
          statusCell.innerText = "Stock Bas";
        } else {
          statusCell.className = "status-pill status-paid";
          statusCell.innerText = "En Stock";
        }

        console.log(`Stock mis à jour pour ${modelName} : ${val} unités.`);
      }
    });
  });
});

/**
 * Initialise le graphique des ventes avec Chart.js
 * @param {HTMLCanvasElement} ctx
 */
function initSalesChart(ctx) {
  // Données hebdomadaires simulées
  const data = {
    labels: ["07 Juin", "08 Juin", "09 Juin", "10 Juin", "11 Juin", "12 Juin", "13 Juin"],
    datasets: [
      {
        label: "Ventes Quotidiennes (€)",
        data: [4200, 3900, 5500, 4100, 6800, 7800, 10550],
        borderColor: "#c5a059",
        backgroundColor: "rgba(197, 160, 89, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#1a1a1a",
        pointBorderColor: "#c5a059",
        pointRadius: 4,
      },
    ],
  };

  new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#1a1a1a",
          titleFont: { family: "Montserrat" },
          bodyFont: { family: "Montserrat" },
          callbacks: {
            label: function (context) {
              return " " + context.parsed.y.toLocaleString() + " €";
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            font: { family: "Montserrat", size: 11 },
            callback: function (value) {
              return value + " €";
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: { family: "Montserrat", size: 11 },
          },
        },
      },
    },
  });
}
