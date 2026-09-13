-- ---------------------------------------------------------------------------
-- Enable RLS on all existing tables in the erpnext schema, and create
-- permissive policies so that erpnext_user can read/write.
--
-- SECURITY MODEL:
--   - RLS is enabled (defense-in-depth: blocks anonymous access via PostgREST)
--   - "erpnext_user" gets full SELECT/INSERT/UPDATE/DELETE on erpnext.* tables
--   - This migration is idempotent: IF NOT EXISTS + CREATE IF NOT EXISTS
-- ---------------------------------------------------------------------------

DO $$
DECLARE
    r RECORD;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'erpnext') THEN
        RAISE NOTICE 'erpnext schema does not exist yet. Skipping RLS setup.';
        RETURN;
    END IF;

    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'erpnext' LOOP
        -- Enable RLS (safe to call multiple times)
        EXECUTE 'ALTER TABLE erpnext.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';

        -- Drop existing permissive policies for erpnext_user to avoid duplicates
        EXECUTE 'DROP POLICY IF EXISTS erpnext_user_all ON erpnext.' || quote_ident(r.tablename) || ';';

        -- Create a single permissive policy granting erpnext_user full access
        EXECUTE format(
            'CREATE POLICY erpnext_user_all ON erpnext.%I FOR ALL TO erpnext_user USING (true) WITH CHECK (true)',
            r.tablename
        );
    END LOOP;

    RAISE NOTICE 'RLS enabled and erpnext_user policies created for all erpnext schema tables.';
END;
$$;

-- Also grant USAGE on the schema so erpnext_user can resolve table names
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'erpnext') THEN
        GRANT USAGE ON SCHEMA erpnext TO erpnext_user;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA erpnext TO erpnext_user;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA erpnext TO erpnext_user;
    END IF;
END;
$$;
