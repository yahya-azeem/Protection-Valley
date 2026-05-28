-- Create wholesale_users table
CREATE TABLE IF NOT EXISTS wholesale_users (
    id BIGINT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT,
    role TEXT DEFAULT 'retail',
    company TEXT,
    picture TEXT,
    sales_tax_id TEXT,
    sales_tax_proof_name TEXT,
    sales_tax_proof_data TEXT,
    is_wholesale_approved BOOLEAN DEFAULT TRUE,
    google_id TEXT,
    reset_token TEXT,
    reset_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE wholesale_users ENABLE ROW LEVEL SECURITY;

-- Allow public access for SELECT, INSERT, UPDATE, DELETE (necessary since backend uses anon key)
CREATE POLICY "Wholesale users are publicly manageable"
  ON wholesale_users FOR ALL
  USING (true)
  WITH CHECK (true);
