-- Alter wholesale_users to add a custom discount rate (defaulting to 30%)
ALTER TABLE wholesale_users ADD COLUMN IF NOT EXISTS wholesale_discount NUMERIC(5,4) DEFAULT 0.3000;

-- Create customer_specific_prices table to hold variant-specific custom prices
CREATE TABLE IF NOT EXISTS customer_specific_prices (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES wholesale_users(id) ON DELETE CASCADE,
    variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    custom_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, variant_id)
);

-- Enable RLS
ALTER TABLE customer_specific_prices ENABLE ROW LEVEL SECURITY;

-- Allow public manageability of customer_specific_prices since the backend runs with anon key/policies
CREATE POLICY "Customer specific prices are publicly manageable"
  ON customer_specific_prices FOR ALL
  USING (true)
  WITH CHECK (true);
