import os
import sys
import json
import psycopg2
import subprocess

# Ensure we run in the bench-dir directory
os.chdir('/home/frappe/bench-dir')

db_host = "db.fnirqccmtjzibjhgzyay.supabase.co"
db_port = 5432
db_name = "postgres"
db_user = "erpnext_user"
db_password = "PV-erpnext-pass-2026"

print("Checking database tables...")
try:
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    cur = conn.cursor()
    # Check if tabUser table exists in erpnext schema
    cur.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'erpnext' 
            AND table_name = 'tabuser'
        );
    """)
    table_exists = cur.fetchone()[0]
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error connecting to database: {e}")
    sys.exit(1)

# Ensure common_site_config has default site
os.makedirs("sites", exist_ok=True)
with open("sites/common_site_config.json", "w") as f:
    json.dump({"default_site": "site1.local"}, f)

if not table_exists:
    print("Database tables not found. Initializing site1.local...")
    subprocess.run([
        "/home/frappe/bench-dir/env/bin/bench", "new-site", "site1.local",
        "--db-type", "postgres",
        "--db-host", db_host,
        "--db-port", str(db_port),
        "--db-name", db_name,
        "--db-user", db_user,
        "--db-password", db_password,
        "--admin-password", "admin",
        "--no-setup-db",
        "--force"
    ], check=True)
    
    print("Installing ERPNext app...")
    subprocess.run([
        "/home/frappe/bench-dir/env/bin/bench", "--site", "site1.local", "install-app", "erpnext"
    ], check=True)
else:
    print("Database tables found. Restoring site configuration...")
    os.makedirs("sites/site1.local", exist_ok=True)
    site_config = {
        "db_name": db_name,
        "db_password": db_password,
        "db_type": "postgres",
        "db_host": db_host,
        "db_port": db_port,
        "db_user": db_user,
        "encryption_key": "pv_erpnext_encryption_key_2026",
        "default_site": "site1.local"
    }
    with open("sites/site1.local/site_config.json", "w") as f:
        json.dump(site_config, f, indent=4)
        
    print("Running migrations...")
    subprocess.run([
        "/home/frappe/bench-dir/env/bin/bench", "--site", "site1.local", "migrate"
    ], check=True)

print("Site initialization completed successfully!")

