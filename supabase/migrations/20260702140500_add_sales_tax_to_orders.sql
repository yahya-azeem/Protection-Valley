-- Add sales_tax column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sales_tax NUMERIC(10,2) NOT NULL DEFAULT 0.00;
