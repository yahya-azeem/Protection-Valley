-- Enable RLS on tenants table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Drop insecure, overly permissive public policies
DROP POLICY IF EXISTS "Users are publicly manageable" ON users;
DROP POLICY IF EXISTS "Wholesale users are publicly manageable" ON wholesale_users;
DROP POLICY IF EXISTS "Customer specific prices are publicly manageable" ON customer_specific_prices;
DROP POLICY IF EXISTS "Orders are publicly manageable" ON orders;

-- Create secure policies allowing only the service_role (the backend server) access
CREATE POLICY "Service role full access on users" ON users 
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on wholesale_users" ON wholesale_users 
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on customer_specific_prices" ON customer_specific_prices 
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on orders" ON orders 
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on tenants" ON tenants 
    FOR ALL TO service_role USING (true) WITH CHECK (true);
