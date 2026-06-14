-- ==========================================================================
-- SOLENIA DATABASE SCHEMA
-- Système de gestion des commandes et du catalogue
-- ==========================================================================

-- Extension pour les UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des Clients
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des Produits
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL, -- Prix en cents pour éviter les erreurs de flottants
    stock_quantity INTEGER DEFAULT 0,
    category VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des Commandes
CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY, -- Format SOL-XXXXXX
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, shipped, cancelled
    total_amount_cents INTEGER NOT NULL,
    shipping_address JSONB NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison Commandes / Produits
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(20) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price_cents INTEGER NOT NULL
);

-- Index pour la performance
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_products_category ON products(category);
