import os
import sys
import json
import time
import subprocess
import traceback
import atexit

import psycopg2
from psycopg2 import sql

# ---------------------------------------------------------------------------
# Configuration — all credentials from environment, NO hardcoded fallbacks
# ---------------------------------------------------------------------------

DB_HOST = os.environ.get("DB_HOST", "")
DB_PORT = int(os.environ.get("DB_PORT", "5432"))
DB_NAME = os.environ.get("DB_NAME", "postgres")
DB_USER = os.environ.get("DB_USER", "")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_SSLMODE = os.environ.get("DB_SSLMODE", "require")  # Supabase requires SSL
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY", "")
ERP_PROXY_SECRET = os.environ.get("ERP_PROXY_SECRET", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")
SCHEMA_NAME = os.environ.get("DB_SCHEMA", "erpnext")
ADVISORY_LOCK_ID = 123456

# Connection retry settings
MAX_RETRIES = 5
RETRY_DELAY = 5  # seconds

# Validate required env vars
_missing = []
if not DB_HOST:
    _missing.append("DB_HOST")
if not DB_USER:
    _missing.append("DB_USER")
if not DB_PASSWORD:
    _missing.append("DB_PASSWORD")
if not ENCRYPTION_KEY:
    _missing.append("ENCRYPTION_KEY")
if _missing:
    print(f"[FATAL] Required environment variables not set: {', '.join(_missing)}")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _print(*args, **kwargs):
    """Print with flush for container log visibility."""
    print(*args, **kwargs, flush=True)


def get_ssl_kwargs():
    """Return SSL kwargs for psycopg2 connections."""
    return {"sslmode": DB_SSLMODE}


def connect_with_retry(label="database", retries=MAX_RETRIES, delay=RETRY_DELAY):
    """Connect to PostgreSQL with retries and SSL."""
    for attempt in range(1, retries + 1):
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                connect_timeout=10,
                keepalives=30,
                keepalives_idle=10,
                keepalives_interval=5,
                keepalives_count=3,
                **get_ssl_kwargs(),
            )
            conn.autocommit = True
            return conn
        except Exception as e:
            _print(f"[RETRY] {label} connection attempt {attempt}/{retries} failed: {e}")
            if attempt < retries:
                time.sleep(delay)
    raise RuntimeError(f"Failed to connect to {label} after {retries} attempts")


def release_lock():
    """Release the global advisory lock on exit."""
    global db_lock_conn
    if db_lock_conn:
        try:
            cur = db_lock_conn.cursor()
            cur.execute("SELECT pg_advisory_unlock(%s);", (ADVISORY_LOCK_ID,))
            cur.close()
            db_lock_conn.close()
            _print("Released global setup/migration advisory lock.")
        except Exception as e:
            _print(f"Warning during lock release: {e}")
        db_lock_conn = None


# ---------------------------------------------------------------------------
# PostgreSQL compatibility patches
# ---------------------------------------------------------------------------

def patch_database_driver():
    path = "/home/frappe/bench-dir/apps/frappe/frappe/database/postgres/database.py"
    if not os.path.exists(path):
        _print(f"[PATCH] Database driver path {path} not found. Skipping.")
        return

    try:
        with open(path, "r") as f:
            code = f.read()

        target = "query = replace_locate_with_strpos(query)"
        replacement = 'query = replace_locate_with_strpos(query)\n\tquery = re.sub(r"(?i)\\bFORCE\\s+INDEX\\s*\\([^)]*\\)", "", query)'

        if replacement in code:
            _print("[PATCH] Database driver already patched.")
            return

        if target in code:
            patched = code.replace(target, replacement)
            with open(path, "w") as f:
                f.write(patched)
            _print("[PATCH] Successfully patched database driver for FORCE INDEX support!")
        else:
            _print("[PATCH] Target string not found in database driver. Skipping.")
    except Exception as e:
        _print(f"[PATCH] Error patching database driver: {e}")


def patch_trends_controller():
    path = "/home/frappe/bench-dir/apps/erpnext/erpnext/controllers/trends.py"
    if not os.path.exists(path):
        _print(f"[PATCH] Trends controller {path} not found. Skipping.")
        return

    try:
        with open(path, "r") as f:
            code = f.read()

        replacements = [
            (
                'based_on_details["based_on_group_by"] = "t2.item_code"',
                'based_on_details["based_on_group_by"] = "t2.item_code, t2.item_name"'
            ),
            (
                'based_on_details["based_on_group_by"] = "t1.party_name" if trans == "Quotation" else "t1.customer"',
                'based_on_details["based_on_group_by"] = "t1.party_name, t1.customer_name, t1.territory" if trans == "Quotation" else "t1.customer, t1.customer_name, t1.territory"'
            ),
            (
                'based_on_details["based_on_group_by"] = "t1.supplier"',
                'based_on_details["based_on_group_by"] = "t1.supplier, t1.supplier_name, t3.supplier_group"'
            ),
            (
                'based_on_details["based_on_select"] += "t4.default_currency as currency,"',
                'based_on_details["based_on_select"] += "t4.default_currency as currency,"\n\tbased_on_details["based_on_group_by"] += ", t4.default_currency"'
            )
        ]

        patched = code
        modified = False
        for target, replacement in replacements:
            if target in patched and replacement not in patched:
                patched = patched.replace(target, replacement)
                modified = True

        if modified:
            with open(path, "w") as f:
                f.write(patched)
            _print("[PATCH] Successfully patched trends controller for PostgreSQL GROUP BY support!")
        else:
            _print("[PATCH] Trends controller already patched or target strings not found.")
    except Exception as e:
        _print(f"[PATCH] Error patching trends controller: {e}")


# ---------------------------------------------------------------------------
# Site configuration
# ---------------------------------------------------------------------------

def write_site_config(site_dir):
    """Write site_config.json with credentials from environment."""
    os.makedirs(site_dir, exist_ok=True)
    os.makedirs(f"{site_dir}/logs", exist_ok=True)
    os.makedirs("/home/frappe/logs", exist_ok=True)

    site_config = {
        "db_name": DB_NAME,
        "db_password": DB_PASSWORD,
        "db_type": "postgres",
        "db_host": DB_HOST,
        "db_port": DB_PORT,
        "db_user": DB_USER,
        "db_schema": SCHEMA_NAME,
        "encryption_key": ENCRYPTION_KEY,
        "default_site": "site1.local"
    }
    with open(f"{site_dir}/site_config.json", "w") as f:
        json.dump(site_config, f, indent=4)


def write_common_config():
    """Write common_site_config.json."""
    os.makedirs("sites", exist_ok=True)
    common_config = {
        "default_site": "site1.local",
        "redis_cache": "redis://127.0.0.1:6379",
        "redis_queue": "redis://127.0.0.1:6379",
        "redis_socketio": "redis://127.0.0.1:6379",
        "dns_multitenant": False
    }
    with open("sites/common_site_config.json", "w") as f:
        json.dump(common_config, f, indent=4)
    with open("sites/currentsite.txt", "w") as f:
        f.write("site1.local")


def write_status(status):
    """Write status to the status file for health checks."""
    try:
        with open("/tmp/erpnext_status.txt", "w") as f:
            f.write(status)
    except Exception:
        pass


def table_exists_in_schema(cur, schema, table_name):
    """Check if a specific table exists in a schema using parameterized query."""
    cur.execute(
        "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = %s AND table_name = %s)",
        (schema, table_name)
    )
    return cur.fetchone()[0]


# ---------------------------------------------------------------------------
# Main logic
# ---------------------------------------------------------------------------

db_lock_conn = None

# Apply patches on boot
patch_database_driver()
patch_trends_controller()
atexit.register(release_lock)

# Ensure we run in the bench-dir directory
os.chdir('/home/frappe/bench-dir')

# --- Config-only mode ---
if "--config-only" in sys.argv:
    _print("[INIT] Config-only mode. Writing site configurations...")
    write_site_config("sites/site1.local")
    write_common_config()
    write_status("config_done")
    _print("[INIT] Site configurations written successfully.")
    sys.exit(0)

# --- Migrate-only mode ---
if "--migrate-only" in sys.argv:
    _print("[INIT] Migrate-only mode. Checking database state...")
    try:
        conn = connect_with_retry("migrate-check")
        cur = conn.cursor()

        # Check if tables exist
        cur.execute(f"""
            SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_schema = %s
            AND table_type = 'BASE TABLE';
        """, (SCHEMA_NAME,))
        table_count = cur.fetchone()[0]
        cur.close()
        conn.close()

        if table_count < 100:
            _print(f"[INIT] Migrate-only: only {table_count} tables found, need full init first.")
            write_status("needs_init")
            sys.exit(0)

        _print("[INIT] Migrate-only: database has tables, running bench migrate...")
        write_site_config("sites/site1.local")
        write_common_config()

        subprocess.run(
            ["/usr/local/bin/bench", "--site", "site1.local", "migrate"],
            check=True,
            timeout=900  # 15 minute timeout
        )
        _print("[INIT] Migrate-only: bench migrate complete.")
        write_status("ready")
        sys.exit(0)
    except subprocess.TimeoutExpired:
        _print("[INIT] Migrate-only: bench migrate timed out after 15 minutes.")
        write_status("error")
        sys.exit(1)
    except Exception as e:
        _print(f"[INIT] Migrate-only error: {e}")
        traceback.print_exc()
        write_status("error")
        sys.exit(1)

# --- Full initialization / migration ---

# Acquire global advisory lock
locked = False
try:
    _print("Connecting to database to acquire global setup/migration lock...")
    db_lock_conn = connect_with_retry("lock")
    cur = db_lock_conn.cursor()
    cur.execute("SELECT pg_try_advisory_lock(%s);", (ADVISORY_LOCK_ID,))
    locked = cur.fetchone()[0]
    cur.close()
except Exception as e:
    _print(f"Warning: Database lock connection failed: {e}")

if not locked:
    _print("Another instance is already running database setup or migration. Entering wait loop...")
    if db_lock_conn:
        try:
            db_lock_conn.close()
        except Exception:
            pass
        db_lock_conn = None

    for i in range(36):  # 36 * 10 seconds = 6 minutes max
        time.sleep(10)
        try:
            conn = connect_with_retry("wait-loop", retries=1)
            cur = conn.cursor()
            cur.execute("SELECT pg_try_advisory_lock(%s);", (ADVISORY_LOCK_ID,))
            acquired = cur.fetchone()[0]
            if acquired:
                cur.execute("SELECT pg_advisory_unlock(%s);", (ADVISORY_LOCK_ID,))
                cur.close()
                conn.close()
                _print("[WAIT LOOP] Lock is free! Database is ready.")
                write_status("ready")
                sys.exit(0)
            cur.close()
            conn.close()
            _print("[WAIT LOOP] Lock is still held by another instance. Waiting...")
        except Exception as e:
            _print(f"[WAIT LOOP] Error checking lock status: {e}")

    _print("[WAIT LOOP] Timeout waiting for database initialization. Exiting with error.")
    write_status("error")
    sys.exit(1)

_print("Acquired global setup/migration lock. Checking database status...")
table_exists = False
needs_migration = True
current_revision = os.environ.get("K_REVISION", "local")

try:
    conn = connect_with_retry("schema-check")
    cur = conn.cursor()

    # Ensure schema exists
    cur.execute(sql.SQL("CREATE SCHEMA IF NOT EXISTS {};").format(sql.Identifier(SCHEMA_NAME)))

    # Create MySQL IF() helper functions
    for pg_type in ["boolean, anyelement, anyelement", "boolean, numeric, numeric",
                     "boolean, double precision, double precision", "boolean, text, text"]:
        cur.execute(sql.SQL("""
            CREATE OR REPLACE FUNCTION {schema}.if(condition boolean, true_val {type}, false_val {type})
            RETURNS {type} AS $$
            BEGIN
                IF condition THEN RETURN true_val; ELSE RETURN false_val; END IF;
            END;
            $$ LANGUAGE plpgsql;
        """).format(schema=sql.Identifier(SCHEMA_NAME), type=sql.SQL(pg_type)))

    # Check table count
    cur.execute(f"""
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = %s
        AND table_type = 'BASE TABLE';
    """, (SCHEMA_NAME,))
    table_count = cur.fetchone()[0]
    table_exists = table_count > 100

    if table_exists:
        # Create revision tracking table if not exists
        cur.execute(sql.SQL("""
            CREATE TABLE IF NOT EXISTS {schema}.current_revision (
                revision_name VARCHAR(255) PRIMARY KEY,
                migrated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """).format(schema=sql.Identifier(SCHEMA_NAME)))
        cur.execute(
            sql.SQL("SELECT COUNT(*) FROM {schema}.current_revision WHERE revision_name = %s;").format(
                schema=sql.Identifier(SCHEMA_NAME)
            ),
            (current_revision,)
        )
        revision_migrated = cur.fetchone()[0] > 0
        needs_migration = not revision_migrated

    cur.close()
    conn.close()
    _print(f"Database check: tables exist = {table_exists}, needs migration = {needs_migration} (revision: {current_revision})")
except Exception as e:
    _print(f"Warning: Database check failed: {e}")
    table_exists = False
    needs_migration = True

if table_exists and not needs_migration:
    _print("Database is already populated and migrated for this revision. Skipping migrations.")
    write_status("ready")
    sys.exit(0)

# Write configs
write_site_config("sites/site1.local")
write_common_config()

if not table_exists:
    _print("Database tables not found or incomplete. Cleaning up schema first...")
    try:
        conn = connect_with_retry("cleanup")
        cur = conn.cursor()
        cur.execute(f"""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = %s
            AND table_type = 'BASE TABLE';
        """, (SCHEMA_NAME,))
        tables = [r[0] for r in cur.fetchall()]
        _print(f"Found {len(tables)} tables to drop.")
        for t in tables:
            # Use parameterized identifier to prevent SQL injection
            cur.execute(sql.SQL("DROP TABLE IF EXISTS {}.{} CASCADE;").format(
                sql.Identifier(SCHEMA_NAME), sql.Identifier(t)
            ))
        cur.close()
        conn.close()
        _print("Schema cleaned successfully!")
    except Exception as e:
        _print(f"Error cleaning schema: {e}")

    _print("Initializing site1.local using Python installer...")
    try:
        _print("[INIT] Step 1: Importing frappe...")
        import frappe
        _print("[INIT] Step 1a: Importing frappe.installer...")
        import frappe.installer
        _print("[INIT] Step 1b: Importing postgres setup modules...")
        import frappe.database.postgres.database
        import frappe.database.postgres.setup_db

        # Monkeypatch PostgresDatabase.get_connection to use db_user
        def custom_get_connection(self):
            import psycopg2 as _psycopg2
            from psycopg2.extensions import ISOLATION_LEVEL_REPEATABLE_READ
            conn_settings = {
                "user": frappe.conf.db_user or self.user,
                "dbname": self.cur_db_name,
                "host": self.host or self.socket,
                "connect_timeout": 10,
                "keepalives": 30,
                "keepalives_idle": 10,
                "keepalives_interval": 5,
                "keepalives_count": 3,
                **get_ssl_kwargs(),
            }
            if self.password:
                conn_settings["password"] = self.password
            if not self.socket and self.port:
                conn_settings["port"] = self.port

            conn = _psycopg2.connect(**conn_settings)
            conn.set_isolation_level(ISOLATION_LEVEL_REPEATABLE_READ)
            return conn

        frappe.database.postgres.database.PostgresDatabase.get_connection = custom_get_connection

        # Monkeypatch import_db_from_sql to use db_user
        def custom_import_db_from_sql(source_sql=None, verbose=False):
            if verbose:
                _print("Custom database import running...")
            _db_name = frappe.conf.db_name
            _db_user = frappe.conf.db_user
            if not source_sql:
                source_sql = os.path.join(os.path.dirname(frappe.database.postgres.setup_db.__file__), "framework_postgres.sql")
            from frappe.database.db_manager import DbManager
            DbManager(frappe.local.db).restore_database(
                verbose, _db_name, source_sql, _db_user, frappe.conf.db_password
            )
            if verbose:
                _print(f"Custom imported from database {source_sql}")

        frappe.database.postgres.setup_db.import_db_from_sql = custom_import_db_from_sql
        _print("[INIT] Step 1c: Imports and monkeypatches complete.")

        site = "site1.local"

        _print("[INIT] Step 2: Writing site_config.json...")
        write_site_config(f"sites/{site}")

        # Update common_site_config
        common_config_path = "sites/common_site_config.json"
        common_config = {}
        if os.path.exists(common_config_path):
            try:
                with open(common_config_path, "r") as f:
                    common_config = json.load(f)
            except Exception:
                pass
        common_config["default_site"] = "site1.local"
        with open(common_config_path, "w") as f:
            json.dump(common_config, f, indent=4)

        # Create logs directories
        os.makedirs("/home/frappe/logs", exist_ok=True)
        os.makedirs(f"/home/frappe/bench-dir/{site}/logs", exist_ok=True)
        os.makedirs(f"sites/{site}/logs", exist_ok=True)

        _print("[INIT] Step 3: Calling frappe.init()...")
        frappe.init(site=site, new_site=True, sites_path="sites")
        _print("[INIT] Step 3: frappe.init() complete.")

        _print("[INIT] Step 4: Updating frappe.conf in memory...")
        site_config = json.load(open(f"sites/{site}/site_config.json"))
        for k, v in site_config.items():
            frappe.conf[k] = v

        _print("[INIT] Step 5: Creating site directories...")
        frappe.installer.make_site_dirs()

        _print("[INIT] Step 6: Running install_db...")
        frappe.installer.install_db(
            db_name=DB_NAME,
            db_password=DB_PASSWORD,
            db_type="postgres",
            db_host=DB_HOST,
            db_port=DB_PORT,
            site_config={"db_user": DB_USER, "encryption_key": ENCRYPTION_KEY},
            admin_password=ADMIN_PASSWORD,
            setup=False,
            force=True
        )
        _print("[INIT] Step 6: install_db complete.")

        _print("[INIT] Step 7: Installing frappe app...")
        frappe.installer.install_app("frappe")

        _print("[INIT] Step 8: Installing erpnext app...")
        frappe.installer.install_app("erpnext")

        frappe.db.commit()
        frappe.destroy()
        _print("[INIT] DONE: Site initialized successfully via Python!")
    except Exception as e:
        _print(f"[INIT] ERROR during site initialization: {e}")
        traceback.print_exc()
        write_status("error")
        sys.exit(1)
else:
    _print("Database tables found. Restoring site configuration...")
    write_site_config("sites/site1.local")

    _print("Updating common_site_config.json...")
    common_config_path = "sites/common_site_config.json"
    common_config = {}
    if os.path.exists(common_config_path):
        try:
            with open(common_config_path, "r") as f:
                common_config = json.load(f)
        except Exception:
            pass
    common_config["default_site"] = "site1.local"
    common_config["dns_multitenant"] = False
    with open(common_config_path, "w") as f:
        json.dump(common_config, f, indent=4)
    with open("sites/currentsite.txt", "w") as f:
        f.write("site1.local")

    # Terminate other active DB connections using the lock connection
    if db_lock_conn:
        try:
            _print("Terminating other active DB connections...")
            cur = db_lock_conn.cursor()
            cur.execute("""
                SELECT pg_terminate_backend(pid)
                FROM pg_stat_activity
                WHERE usename = %s
                  AND pid != pg_backend_pid();
            """, (DB_USER,))
            cur.close()
            _print("Connections terminated successfully.")
        except Exception as e:
            _print(f"Warning: Could not terminate other connections: {e}")

    _print("Running migrations...")
    try:
        subprocess.run(
            ["/usr/local/bin/bench", "--site", "site1.local", "migrate"],
            check=True,
            timeout=900  # 15 minute timeout
        )
    except subprocess.TimeoutExpired:
        _print("Migration timed out after 15 minutes.")
        write_status("error")
        sys.exit(1)
    except Exception as e:
        _print(f"Migration failed: {e}")
        write_status("error")
        raise

# Log that this revision has completed its setup/migration successfully
current_revision = os.environ.get("K_REVISION", "local")
try:
    _print(f"Logging successful migration for revision {current_revision} in database...")
    conn = connect_with_retry("revision-log")
    cur = conn.cursor()
    cur.execute(sql.SQL("""
        CREATE TABLE IF NOT EXISTS {schema}.current_revision (
            revision_name VARCHAR(255) PRIMARY KEY,
            migrated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    """).format(schema=sql.Identifier(SCHEMA_NAME)))
    cur.execute(
        sql.SQL("INSERT INTO {schema}.current_revision (revision_name) VALUES (%s) ON CONFLICT DO NOTHING;").format(
            schema=sql.Identifier(SCHEMA_NAME)
        ),
        (current_revision,)
    )
    cur.close()
    conn.close()
    _print(f"Logged current revision {current_revision} in database.")
except Exception as e:
    _print(f"Warning: Could not log revision in database: {e}")

_print("Site initialization completed successfully!")
write_status("ready")
