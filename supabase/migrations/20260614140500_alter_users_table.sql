-- Alter wholesale_users to add optional business/contact fields
ALTER TABLE wholesale_users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE wholesale_users ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE wholesale_users ADD COLUMN IF NOT EXISTS website TEXT;
