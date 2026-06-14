/**
 * SOLENIA - Storage Manager
 * Gestion de la persistance des données du panier dans le LocalStorage.
 */

const STORAGE_KEY = "solenia_cart_data_v1";

export const storageManager = {
  /**
   * Sauvegarde l'état actuel du panier.
   * @param {Array} cart - Le tableau d'objets représentant le panier.
   */
  save: (cart) => {
    try {
      const serializedCart = JSON.stringify(cart);
      localStorage.setItem(STORAGE_KEY, serializedCart);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier Solenia:", error);
    }
  },

  /**
   * Charge le panier depuis le stockage local.
   * @returns {Array} - Le panier stocké ou un tableau vide.
   */
  load: () => {
    try {
      const serializedCart = localStorage.getItem(STORAGE_KEY);
      return serializedCart ? JSON.parse(serializedCart) : [];
    } catch (error) {
      console.error("Erreur lors du chargement du panier Solenia:", error);
      return [];
    }
  },

  /**
   * Réinitialise le panier.
   */
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier Solenia:", error);
    }
  },
};
