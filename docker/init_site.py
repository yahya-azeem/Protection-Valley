import os
import sys
import json
import psycopg2
import subprocess
import traceback
import atexit

def patch_database_driver():
    path = "/home/frappe/bench-dir/apps/frappe/frappe/database/postgres/database.py"
    if not os.path.exists(path):
        print(f"[PATCH] Database driver path {path} not found. Skipping.")
        return

    try:
        with open(path, "r") as f:
            code = f.read()

        target = "query = replace_locate_with_strpos(query)"
        replacement = 'query = replace_locate_with_strpos(query)\n\tquery = re.sub(r"(?i)\\bFORCE\\s+INDEX\\s*\\([^)]*\\)", "", query)'

        if replacement in code:
            print("[PATCH] Database driver already patched.")
            return

        if target in code:
            patched = code.replace(target, replacement)
            with open(path, "w") as f:
                f.write(patched)
            print("[PATCH] Successfully patched database driver for FORCE INDEX support!")
        else:
            print("[PATCH] Target string not found in database driver. Skipping.")
    except Exception as e:
        print(f"[PATCH] Error patching database driver: {e}")

# Apply patches to database driver on boot
patch_database_driver()

db_lock_conn = None

def release_lock():
    global db_lock_conn
    if db_lock_conn:
        try:
            cur = db_lock_conn.cursor()
            cur.execute("SELECT pg_advisory_unlock(123456);")
            cur.close()
            db_lock_conn.close()
            print("Released global setup/migration advisory lock.")
        except Exception as e:
            print(f"Warning during lock release: {e}")
        db_lock_conn = None

atexit.register(release_lock)

# Force unbuffered output so prints show immediately in Cloud Run logs
print = lambda *args, **kwargs: __builtins__.__dict__['print'](*args, **kwargs, flush=True)

# Ensure we run in the bench-dir directory
os.chdir('/home/frappe/bench-dir')

db_host = os.environ.get("DB_HOST", "db.fnirqccmtjzibjhgzyay.supabase.co")
db_port = int(os.environ.get("DB_PORT", 5432))
db_name = os.environ.get("DB_NAME", "postgres")
db_user = os.environ.get("DB_USER", "erpnext_user")
db_password = os.environ.get("DB_PASSWORD", "PV-erpnext-pass-2026")

if "--config-only" in sys.argv:
    print("[INIT] Config-only mode. Writing site configurations...")
    os.makedirs("sites/site1.local", exist_ok=True)
    os.makedirs("sites/site1.local/logs", exist_ok=True)
    os.makedirs("/home/frappe/logs", exist_ok=True)
    site_config = {
        "db_name": db_name,
        "db_password": db_password,
        "db_type": "postgres",
        "db_host": db_host,
        "db_port": db_port,
        "db_user": db_user,
        "db_schema": "erpnext",
        "encryption_key": "pv_erpnext_encryption_key_2026",
        "default_site": "site1.local"
    }
    with open("sites/site1.local/site_config.json", "w") as f:
        json.dump(site_config, f, indent=4)
        
    common_config_path = "sites/common_site_config.json"
    common_config = {
        "default_site": "site1.local",
        "redis_cache": "redis://127.0.0.1:6379",
        "redis_queue": "redis://127.0.0.1:6379",
        "redis_socketio": "redis://127.0.0.1:6379",
        "dns_multitenant": False
    }
    with open(common_config_path, "w") as f:
        json.dump(common_config, f, indent=4)
    with open("sites/currentsite.txt", "w") as f:
        f.write("site1.local")
    print("[INIT] Site configurations written successfully.")
    sys.exit(0)

# Acquire global advisory lock to prevent concurrent setup/migrations
locked = False
try:
    print("Connecting to database to acquire global setup/migration lock...")
    db_lock_conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    db_lock_conn.autocommit = True
    cur = db_lock_conn.cursor()
    cur.execute("SELECT pg_try_advisory_lock(123456);")
    locked = cur.fetchone()[0]
    cur.close()
except Exception as e:
    print(f"Warning: Database lock connection failed: {e}")

if not locked:
    print("Another instance is already running database setup or migration. Entering wait loop...")
    if db_lock_conn:
        try:
            db_lock_conn.close()
        except Exception:
            pass
        db_lock_conn = None
    
    # Wait loop
    import time
    for i in range(36): # 36 * 10 seconds = 6 minutes max
        time.sleep(10)
        try:
            conn = psycopg2.connect(
                host=db_host,
                port=db_port,
                database=db_name,
                user=db_user,
                password=db_password
            )
            conn.autocommit = True
            cur = conn.cursor()
            # Try to acquire the lock to see if the migration instance is finished
            cur.execute("SELECT pg_try_advisory_lock(123456);")
            acquired = cur.fetchone()[0]
            if acquired:
                cur.execute("SELECT pg_advisory_unlock(123456);")
                cur.close()
                conn.close()
                print("[WAIT LOOP] Lock is free! Database is ready. Updating status and exiting.")
                try:
                    with open("/tmp/erpnext_status.txt", "w") as f:
                        f.write("ready")
                except Exception:
                    pass
                sys.exit(0)
            cur.close()
            conn.close()
            print(f"[WAIT LOOP] Lock is still held by another instance. Waiting...")
        except Exception as e:
            print(f"[WAIT LOOP] Error checking lock status: {e}")
            
    print("[WAIT LOOP] Timeout waiting for database initialization. Exiting with error.")
    try:
        with open("/tmp/erpnext_status.txt", "w") as f:
            f.write("error")
    except Exception:
        pass
    sys.exit(1)

print("Acquired global setup/migration lock. Checking database status...")
table_exists = False
needs_migration = True
current_revision = os.environ.get("K_REVISION", "local")

try:
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    conn.autocommit = True
    cur = conn.cursor()
    
    # Ensure erpnext schema exists
    cur.execute("CREATE SCHEMA IF NOT EXISTS erpnext;")
    
    # Create MySQL helper functions if they don't exist
    cur.execute("""
        CREATE OR REPLACE FUNCTION erpnext.if(condition boolean, true_val anyelement, false_val anyelement)
        RETURNS anyelement AS $$
        BEGIN
            IF condition THEN
                RETURN true_val;
            ELSE
                RETURN false_val;
            END IF;
        END;
        $$ LANGUAGE plpgsql;
    """)
    cur.execute("""
        CREATE OR REPLACE FUNCTION erpnext.if(condition boolean, true_val numeric, false_val numeric)
        RETURNS numeric AS $$
        BEGIN
            IF condition THEN
                RETURN true_val;
            ELSE
                RETURN false_val;
            END IF;
        END;
        $$ LANGUAGE plpgsql;
    """)
    cur.execute("""
        CREATE OR REPLACE FUNCTION erpnext.if(condition boolean, true_val double precision, false_val double precision)
        RETURNS double precision AS $$
        BEGIN
            IF condition THEN
                RETURN true_val;
            ELSE
                RETURN false_val;
            END IF;
        END;
        $$ LANGUAGE plpgsql;
    """)
    cur.execute("""
        CREATE OR REPLACE FUNCTION erpnext.if(condition boolean, true_val text, false_val text)
        RETURNS text AS $$
        BEGIN
            IF condition THEN
                RETURN true_val;
            ELSE
                RETURN false_val;
            END IF;
        END;
        $$ LANGUAGE plpgsql;
    """)
    
    # Check table count
    cur.execute("""
        SELECT COUNT(*) 
        FROM information_schema.tables 
        WHERE table_schema = 'erpnext' 
        AND table_type = 'BASE TABLE';
    """)
    table_count = cur.fetchone()[0]
    table_exists = table_count > 100
    
    if table_exists:
        # Create revision tracking table if not exists
        cur.execute("""
            CREATE TABLE IF NOT EXISTS erpnext.current_revision (
                revision_name VARCHAR(255) PRIMARY KEY,
                migrated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        # Check if current revision is already migrated
        cur.execute("SELECT COUNT(*) FROM erpnext.current_revision WHERE revision_name = %s;", (current_revision,))
        revision_migrated = cur.fetchone()[0] > 0
        needs_migration = not revision_migrated
        
    cur.close()
    conn.close()
    print(f"Database check: tables exist = {table_exists}, needs migration = {needs_migration} (revision: {current_revision})")
except Exception as e:
    print(f"Warning: Database check failed: {e}")
    table_exists = False
    needs_migration = True

if table_exists and not needs_migration:
    print("Database is already populated and migrated for this revision. Skipping migrations.")
    try:
        with open("/tmp/erpnext_status.txt", "w") as f:
            f.write("ready")
    except Exception:
        pass
    sys.exit(0)


# Ensure common_site_config has default site and routes all Redis connections to local port 6379
os.makedirs("sites", exist_ok=True)
with open("sites/common_site_config.json", "w") as f:
    json.dump({
        "default_site": "site1.local",
        "redis_cache": "redis://127.0.0.1:6379",
        "redis_queue": "redis://127.0.0.1:6379",
        "redis_socketio": "redis://127.0.0.1:6379",
        "dns_multitenant": False
    }, f)

if not table_exists:
    print("Database tables not found or incomplete. Cleaning up schema 'erpnext' first...")
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password
        )
        conn.autocommit = True
        cur = conn.cursor()
        # Find all tables in erpnext schema
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'erpnext' 
            AND table_type = 'BASE TABLE';
        """)
        tables = [r[0] for r in cur.fetchall()]
        print(f"Found {len(tables)} tables to drop: {tables}")
        for t in tables:
            cur.execute(f'DROP TABLE IF EXISTS "erpnext"."{t}" CASCADE;')
        cur.close()
        conn.close()
        print("Schema 'erpnext' cleaned successfully!")
    except Exception as e:
        print(f"Error cleaning schema: {e}")

    print("Initializing site1.local using Python installer...")
    try:
        print("[INIT] Step 1: Importing frappe...")
        import frappe
        print("[INIT] Step 1a: Importing frappe.installer...")
        import frappe.installer
        print("[INIT] Step 1b: Importing postgres setup modules...")
        import frappe.database.postgres.database
        import frappe.database.postgres.setup_db
        
        # Monkeypatch PostgresDatabase.get_connection to use db_user instead of hardcoded self.user (which gets set to db_name)
        def custom_get_connection(self):
            import psycopg2
            from psycopg2.extensions import ISOLATION_LEVEL_REPEATABLE_READ
            conn_settings = {
                "user": frappe.conf.db_user or self.user,
                "dbname": self.cur_db_name,
                "host": self.host or self.socket,
            }
            if self.password:
                conn_settings["password"] = self.password
            if not self.socket and self.port:
                conn_settings["port"] = self.port

            conn = psycopg2.connect(**conn_settings)
            conn.set_isolation_level(ISOLATION_LEVEL_REPEATABLE_READ)
            return conn
            
        frappe.database.postgres.database.PostgresDatabase.get_connection = custom_get_connection

        # Monkeypatch import_db_from_sql to use db_user instead of db_name
        def custom_import_db_from_sql(source_sql=None, verbose=False):
            if verbose:
                print("Custom database import running...")
            db_name = frappe.conf.db_name
            db_user = frappe.conf.db_user
            if not source_sql:
                import os
                source_sql = os.path.join(os.path.dirname(frappe.database.postgres.setup_db.__file__), "framework_postgres.sql")
            from frappe.database.db_manager import DbManager
            DbManager(frappe.local.db).restore_database(
                verbose, db_name, source_sql, db_user, frappe.conf.db_password
            )
            if verbose:
                print("Custom imported from database {}".format(source_sql))
                
        frappe.database.postgres.setup_db.import_db_from_sql = custom_import_db_from_sql
        print("[INIT] Step 1c: Imports and monkeypatches complete.")
        
        site = "site1.local"
        
        # Write site_config.json manually first so that frappe.init() loads all DB credentials in memory
        print("[INIT] Step 2: Writing site_config.json...")
        os.makedirs(f"sites/{site}", exist_ok=True)
        site_config = {
            "db_name": db_name,
            "db_password": db_password,
            "db_type": "postgres",
            "db_host": db_host,
            "db_port": db_port,
            "db_user": db_user,
            "db_schema": "erpnext",
            "encryption_key": "pv_erpnext_encryption_key_2026",
            "default_site": "site1.local"
        }
        with open(f"sites/{site}/site_config.json", "w") as f:
            json.dump(site_config, f, indent=4)
        print("[INIT] Step 2: site_config.json written.")
        
        # Update common_site_config.json with default_site to resolve Cloud Run domain routing
        print("[INIT] Updating common_site_config.json...")
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
        print("[INIT] common_site_config.json updated.")
        
        # Create logs directories that frappe's database logger expects
        os.makedirs("/home/frappe/logs", exist_ok=True)
        os.makedirs(f"/home/frappe/bench-dir/{site}/logs", exist_ok=True)
        os.makedirs(f"sites/{site}/logs", exist_ok=True)
            
        print("[INIT] Step 3: Calling frappe.init()...")
        frappe.init(site=site, new_site=True, sites_path="sites")
        print("[INIT] Step 3: frappe.init() complete.")
        
        # Ensure frappe.conf is fully updated in memory
        print("[INIT] Step 4: Updating frappe.conf in memory...")
        for k, v in site_config.items():
            frappe.conf[k] = v
        print(f"[INIT] Step 4: frappe.conf.db_name={frappe.conf.db_name}, db_type={frappe.conf.db_type}")
        
        print("[INIT] Step 5: Creating site directories...")
        frappe.installer.make_site_dirs()
        print("[INIT] Step 5: Site directories created.")
        
        print("[INIT] Step 6: Running install_db...")
        frappe.installer.install_db(
            db_name=db_name,
            db_password=db_password,
            db_type="postgres",
            db_host=db_host,
            db_port=db_port,
            site_config={"db_user": db_user, "encryption_key": "pv_erpnext_encryption_key_2026"},
            admin_password="admin",
            setup=False,
            force=True
        )
        print("[INIT] Step 6: install_db complete.")
        
        print("[INIT] Step 7: Installing frappe app...")
        frappe.installer.install_app("frappe")
        print("[INIT] Step 7: frappe app installed.")
        
        print("[INIT] Step 8: Installing erpnext app...")
        frappe.installer.install_app("erpnext")
        print("[INIT] Step 8: erpnext app installed.")
        
        frappe.db.commit()
        frappe.destroy()
        print("[INIT] DONE: Site initialized successfully via Python!")
    except Exception as e:
        print(f"[INIT] ERROR during site initialization: {e}")
        traceback.print_exc()
        try:
            with open("/tmp/erpnext_status.txt", "w") as f:
                f.write("error")
        except Exception:
            pass
        sys.exit(1)
else:
    print("Database tables found. Restoring site configuration...")
    os.makedirs("sites/site1.local", exist_ok=True)
    os.makedirs("sites/site1.local/logs", exist_ok=True)
    os.makedirs("/home/frappe/logs", exist_ok=True)
    site_config = {
        "db_name": db_name,
        "db_password": db_password,
        "db_type": "postgres",
        "db_host": db_host,
        "db_port": db_port,
        "db_user": db_user,
        "db_schema": "erpnext",
        "encryption_key": "pv_erpnext_encryption_key_2026",
        "default_site": "site1.local"
    }
    with open("sites/site1.local/site_config.json", "w") as f:
        json.dump(site_config, f, indent=4)
        
    print("Updating common_site_config.json...")
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
    print("common_site_config.json updated.")
    
    # Terminate other active DB connections using the global lock connection
    if db_lock_conn:
        try:
            print("Terminating other active DB connections...")
            cur = db_lock_conn.cursor()
            cur.execute("""
                SELECT pg_terminate_backend(pid) 
                FROM pg_stat_activity 
                WHERE usename = %s 
                  AND pid != pg_backend_pid();
            """, (db_user,))
            cur.close()
            print("Connections terminated successfully.")
        except Exception as e:
            print(f"Warning: Could not terminate other connections: {e}")
        
    print("Running migrations...")
    try:
        subprocess.run([
            "/usr/local/bin/bench", "--site", "site1.local", "migrate"
        ], check=True)
    except Exception as e:
        print(f"Migration failed: {e}")
        try:
            with open("/tmp/erpnext_status.txt", "w") as f:
                f.write("error")
        except Exception:
            pass
        raise e

# Log that this revision has completed its setup/migration successfully
current_revision = os.environ.get("K_REVISION", "local")
try:
    print(f"Logging successful migration for revision {current_revision} in database...")
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS erpnext.current_revision (
            revision_name VARCHAR(255) PRIMARY KEY,
            migrated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cur.execute("INSERT INTO erpnext.current_revision (revision_name) VALUES (%s) ON CONFLICT DO NOTHING;", (current_revision,))
    cur.close()
    conn.close()
    print(f"Logged current revision {current_revision} in database.")
except Exception as e:
    print(f"Warning: Could not log revision in database: {e}")

print("Site initialization completed successfully!")
try:
    with open("/tmp/erpnext_status.txt", "w") as f:
        f.write("ready")
except Exception:
    pass
