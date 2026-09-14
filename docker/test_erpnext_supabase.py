#!/usr/bin/env python3
"""
ERPNext ↔ Supabase PostgreSQL Integration Tests

Run these tests after deployment to verify the compatibility layer is working.
Usage:
    python3 test_erpnext_supabase.py --host DB_HOST --user DB_USER --password DB_PASSWORD

Environment variables (alternative to CLI args):
    DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSLMODE
"""

import os
import sys
import argparse
import json

try:
    import psycopg2
except ImportError:
    print("FATAL: psycopg2 not installed. Run: pip install psycopg2-binary")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Test framework
# ---------------------------------------------------------------------------

class TestResult:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []

    def ok(self, name):
        self.passed += 1
        print(f"  ✓ {name}")

    def fail(self, name, detail):
        self.failed += 1
        self.errors.append((name, detail))
        print(f"  ✗ {name}: {detail}")

    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"Results: {self.passed}/{total} passed, {self.failed} failed")
        if self.errors:
            print(f"\nFailed tests:")
            for name, detail in self.errors:
                print(f"  - {name}: {detail}")
        print(f"{'='*60}")
        return self.failed == 0


def connect(args):
    """Create a database connection with SSL."""
    return psycopg2.connect(
        host=args.host,
        port=args.port,
        database=args.dbname,
        user=args.user,
        password=args.password,
        sslmode=args.sslmode,
        connect_timeout=10,
    )


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

def test_ssl_connection(args, results):
    """Test 1: Can connect to PostgreSQL with SSL."""
    try:
        conn = connect(args)
        cur = conn.cursor()
        cur.execute("SELECT ssl_is_used();")
        ssl_used = cur.fetchone()[0]
        cur.close()
        conn.close()
        if ssl_used:
            results.ok("SSL connection established")
        else:
            results.fail("SSL connection", "Connected but SSL is NOT being used")
    except Exception as e:
        results.fail("SSL connection", str(e))


def test_erpnext_schema_exists(args, results):
    """Test 2: erpnext schema exists."""
    try:
        conn = connect(args)
        cur = conn.cursor()
        cur.execute("SELECT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'erpnext');")
        exists = cur.fetchone()[0]
        cur.close()
        conn.close()
        if exists:
            results.ok("erpnext schema exists")
        else:
            results.fail("erpnext schema exists", "Schema 'erpnext' not found")
    except Exception as e:
        results.fail("erpnext schema exists", str(e))


def test_mysql_if_functions(args, results):
    """Test 3: MySQL IF() compatibility functions exist."""
    try:
        conn = connect(args)
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*)
            FROM information_schema.routines
            WHERE routine_schema = 'erpnext'
            AND routine_name = 'if';
        """)
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        if count >= 4:
            results.ok(f"MySQL IF() functions exist ({count} overloads)")
        else:
            results.fail("MySQL IF() functions", f"Expected >= 4 overloads, found {count}")
    except Exception as e:
        results.fail("MySQL IF() functions", str(e))


def test_mysql_if_function_works(args, results):
    """Test 4: MySQL IF() function actually works."""
    try:
        conn = connect(args)
        cur = conn.cursor()
        cur.execute("SELECT erpnext.if(true, 'yes', 'no');")
        result = cur.fetchone()[0]
        cur.close()
        conn.close()
        if result == 'yes':
            results.ok("MySQL IF() function returns correct result")
        else:
            results.fail("MySQL IF() function", f"Expected 'yes', got '{result}'")
    except Exception as e:
        results.fail("MySQL IF() function", str(e))


def test_rls_enabled(args, results):
    """Test 5: RLS is enabled on erpnext tables."""
    try:
        conn = connect(args)
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*)
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE t.schemaname = 'erpnext'
            AND c.relrowsecurity = true;
        """)
        rls_count = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*)
            FROM pg_tables
            WHERE schemaname = 'erpnext'
            AND tablename != 'current_revision';
        """)
        total_count = cur.fetchone()[0]

        cur.close()
        conn.close()

        if total_count == 0:
            results.ok("RLS check skipped (no erpnext tables yet — will be created during bench install)")
        elif rls_count >= total_count:
            results.ok(f"RLS enabled on all {rls_count} erpnext tables")
        else:
            results.fail("RLS enabled", f"RLS on {rls_count}/{total_count} tables")
    except Exception as e:
        results.fail("RLS enabled", str(e))


def test_rls_policies_exist(args, results):
    """Test 6: RLS policies exist for erpnext_user."""
    try:
        conn = connect(args)
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(DISTINCT tablename)
            FROM pg_policies
            WHERE schemaname = 'erpnext'
            AND roles = '{erpnext_user}';
        """)
        policy_count = cur.fetchone()[0]
        cur.close()
        conn.close()
        if policy_count > 0:
            results.ok(f"RLS policies exist for erpnext_user on {policy_count} tables")
        else:
            results.fail("RLS policies", "No policies found for erpnext_user")
    except Exception as e:
        results.fail("RLS policies", str(e))


def test_erpnext_user_permissions(args, results):
    """Test 7: erpnext_user has USAGE on erpnext schema."""
    try:
        conn = connect(args)
        cur = conn.cursor()
        cur.execute("""
            SELECT has_schema_privilege('erpnext_user', 'erpnext', 'USAGE');
        """)
        has_usage = cur.fetchone()[0]
        cur.close()
        conn.close()
        if has_usage:
            results.ok("erpnext_user has USAGE on erpnext schema")
        else:
            results.fail("erpnext_user permissions", "erpnext_user does not have USAGE on erpnext schema")
    except Exception as e:
        results.fail("erpnext_user permissions", str(e))


def test_connection_resilience(args, results):
    """Test 8: Multiple connections succeed (pool simulation)."""
    try:
        conns = []
        for i in range(5):
            conn = connect(args)
            cur = conn.cursor()
            cur.execute("SELECT 1")
            cur.fetchone()
            cur.close()
            conns.append(conn)
        for conn in conns:
            conn.close()
        results.ok("5 concurrent connections succeeded")
    except Exception as e:
        results.fail("Connection resilience", str(e))


def test_force_index_patch(args, results):
    """Test 9: FORCE INDEX patch is present in database driver."""
    path = "/home/frappe/bench-dir/apps/frappe/frappe/database/postgres/database.py"
    if not os.path.exists(path):
        results.ok("FORCE INDEX patch check skipped (not in container)")
        return
    try:
        with open(path, "r") as f:
            code = f.read()
        if "re.sub" in code and "FORCE" in code and "INDEX" in code:
            results.ok("FORCE INDEX patch present in database driver")
        else:
            results.fail("FORCE INDEX patch", "Patch marker not found in database.py")
    except Exception as e:
        results.fail("FORCE INDEX patch", str(e))


def test_trends_patch(args, results):
    """Test 10: trends.py GROUP BY patch is present."""
    path = "/home/frappe/bench-dir/apps/erpnext/erpnext/controllers/trends.py"
    if not os.path.exists(path):
        results.ok("trends.py patch check skipped (not in container)")
        return
    try:
        with open(path, "r") as f:
            code = f.read()
        if "t2.item_code, t2.item_name" in code:
            results.ok("trends.py GROUP BY patch present")
        else:
            results.fail("trends.py patch", "Expected 't2.item_code, t2.item_name' not found")
    except Exception as e:
        results.fail("trends.py patch", str(e))


def test_revision_tracking_table(args, results):
    """Test 11: current_revision tracking table exists."""
    try:
        conn = connect(args)
        cur = conn.cursor()
        cur.execute("""
            SELECT EXISTS(
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'erpnext'
                AND table_name = 'current_revision'
            );
        """)
        exists = cur.fetchone()[0]
        cur.close()
        conn.close()
        if exists:
            results.ok("current_revision tracking table exists")
        else:
            results.fail("current_revision table", "Table not found (may be created during first init)")
    except Exception as e:
        results.fail("current_revision table", str(e))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="ERPNext ↔ Supabase PostgreSQL Integration Tests")
    parser.add_argument("--host", default=os.environ.get("DB_HOST", ""))
    parser.add_argument("--port", type=int, default=int(os.environ.get("DB_PORT", "5432")))
    parser.add_argument("--dbname", default=os.environ.get("DB_NAME", "postgres"))
    parser.add_argument("--user", default=os.environ.get("DB_USER", ""))
    parser.add_argument("--password", default=os.environ.get("DB_PASSWORD", ""))
    parser.add_argument("--sslmode", default=os.environ.get("DB_SSLMODE", "require"))
    args = parser.parse_args()

    if not args.host or not args.user or not args.password:
        print("ERROR: DB_HOST, DB_USER, and DB_PASSWORD are required.")
        print("Set them via environment variables or --host/--user/--password flags.")
        sys.exit(1)

    print(f"ERPNext ↔ Supabase PostgreSQL Integration Tests")
    print(f"Target: {args.host}:{args.port}/{args.dbname} (sslmode={args.sslmode})")
    print(f"{'='*60}\n")

    results = TestResult()

    tests = [
        test_ssl_connection,
        test_erpnext_schema_exists,
        test_mysql_if_functions,
        test_mysql_if_function_works,
        test_rls_enabled,
        test_rls_policies_exist,
        test_erpnext_user_permissions,
        test_connection_resilience,
        test_force_index_patch,
        test_trends_patch,
        test_revision_tracking_table,
    ]

    for test_fn in tests:
        test_fn(args, results)

    success = results.summary()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
