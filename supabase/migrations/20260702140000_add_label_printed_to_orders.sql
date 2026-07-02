-- Add fields to track if an order's shipping label has been printed and archived
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_label_printed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_label_printed_at TIMESTAMPTZ;
