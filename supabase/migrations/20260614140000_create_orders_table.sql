-- Create orders table to store transactions
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_cost NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_method TEXT NOT NULL,
    carrier TEXT,
    tracking_number TEXT,
    shipping_label_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public access (PostgREST requests made by anon/service_role keys)
CREATE POLICY "Orders are publicly manageable"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);
