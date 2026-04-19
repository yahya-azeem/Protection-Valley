-- Products table: one row per grouped product
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  model_number TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product variants: one row per specific SKU/size/color/pack combo
CREATE TABLE IF NOT EXISTS product_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL DEFAULT '',
  ebay_item_id TEXT,
  original_name TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  size TEXT,
  color TEXT,
  pack_quantity INTEGER NOT NULL DEFAULT 1,
  texture TEXT,
  image_url TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_ebay_id ON product_variants(ebay_item_id);

-- Enable Row Level Security (Supabase best practice)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key can read products)
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Product variants are publicly readable"
  ON product_variants FOR SELECT
  USING (true);

-- Service role can do everything (for backend/seeding)
CREATE POLICY "Service role full access on products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on variants"
  ON product_variants FOR ALL
  USING (auth.role() = 'service_role');
