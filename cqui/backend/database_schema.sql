-- Schéma de base de données Solenia
-- Version : 1.0.0

-- Désactivation des contraintes pour la réinitialisation
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Catégories de produits
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Produits (Informations générales)
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. Variantes de produits (Combinaisons Taille/Couleur et Stock)
CREATE TABLE product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL, -- Stock Keeping Unit
    size VARCHAR(50),
    color VARCHAR(50),
    stock_quantity INT DEFAULT 0,
    price_override DECIMAL(10, 2), -- Prix spécifique si différent du prix de base
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. Utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Commandes
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Lignes de commande (Détails)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- Insertion des catégories initiales basées sur le catalogue
INSERT INTO categories (id, name, description) VALUES 
('cat_shoes', 'Chaussures de Bien-être', 'Chaussures conçues pour l''alignement postural et le confort longue durée.'),
('cat_insoles', 'Semelles Techniques', 'Supports plantaires avancés pour adapter vos chaussures préférées à vos besoins.');

SET FOREIGN_KEY_CHECKS = 1;
