-- =============================================================================
-- SQL SCRIPT: Inisialisasi Database dan Tabel untuk Aplikasi CRUD Go
-- =============================================================================

-- 1. Buat Database (Jalankan ini saat terhubung ke postgres default / postgres maintenance db)
--    Contoh di terminal: psql -U postgres -c "CREATE DATABASE crud_db;"
CREATE DATABASE crud_db;

-- Hubungkan ke database crud_db sebelum menjalankan query di bawah:
-- Di psql: \c crud_db;

-- 2. Buat Tabel "products"
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indeks untuk optimasi pencarian nama produk
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- 4. Trigger Function untuk otomatis memperbarui updated_at saat baris di-UPDATE
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_products_timestamp ON products;
CREATE TRIGGER trigger_update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- 5. Data Awal (Dummy / Seed Data)
INSERT INTO products (name, description, price, stock) VALUES
('Laptop Gaming ASUS ROG', 'Laptop spesifikasi tinggi untuk editing dan gaming', 18500000.00, 10),
('Mechanical Keyboard TKL', 'Keyboard mekanikal dengan switch red dan RGB', 750000.00, 25),
('Wireless Mouse Ergonomis', 'Mouse nirkabel dengan sensor presisi tinggi', 350000.00, 50),
('Monitor 27 Inch 144Hz', 'Monitor IPS Full HD refresh rate 144Hz', 2800000.00, 15)
ON CONFLICT DO NOTHING;
