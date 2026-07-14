-- Enable RLS on all existing tables in the erpnext schema
DO $$
DECLARE
    r RECORD;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'erpnext') THEN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'erpnext') LOOP
            EXECUTE 'ALTER TABLE erpnext.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
        END LOOP;
    END IF;
END;
$$;
