-- Drop wholesale_price if it exists
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'product_variants' AND column_name = 'wholesale_price') THEN
    ALTER TABLE product_variants DROP COLUMN wholesale_price;
  END IF;
END $$;
