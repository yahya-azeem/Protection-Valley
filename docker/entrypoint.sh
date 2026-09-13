#!/bin/bash
set -e

# ---------------------------------------------------------------------------
# ERPNext Entrypoint — VPS / Docker Compose
# Ensures migrations complete before accepting traffic.
# ---------------------------------------------------------------------------

export SITES_PATH=sites

# Initialize status file
echo "initializing" > /tmp/erpnext_status.txt

# --- Graceful shutdown ---
PIDS_TO_KILL=()

cleanup() {
    echo "[entrypoint] Received shutdown signal. Stopping processes..."
    write_status "shutting_down"
    for pid in "${PIDS_TO_KILL[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill -TERM "$pid" 2>/dev/null || true
        fi
    done
    # Wait briefly for processes to exit
    wait 2>/dev/null || true
    echo "[entrypoint] Shutdown complete."
    exit 0
}

trap cleanup SIGTERM SIGINT SIGQUIT

write_status() {
    echo "$1" > /tmp/erpnext_status.txt
}

# --- Start Redis ---
echo "Starting Redis..."
redis-server --daemonize yes

until redis-cli ping | grep -q PONG; do
    echo "Waiting for Redis..."
    sleep 1
done
echo "Redis is ready."

# --- Write site configuration (synchronous, ~0.1s) ---
echo "Writing site configurations..."
/home/frappe/bench-dir/env/bin/python -u /home/frappe/init_site.py --config-only

# --- Run migrations in the foreground (block until done) ---
echo "Running database migrations..."
write_status "migrating"
/home/frappe/bench-dir/env/bin/python -u /home/frappe/init_site.py --migrate-only
MIGRATE_EXIT=$?

if [ $MIGRATE_EXIT -ne 0 ]; then
    echo "[entrypoint] ERROR: Migration failed with exit code $MIGRATE_EXIT"
    write_status "error"
    exit 1
fi

echo "Migrations completed successfully."
write_status "workers_starting"

# --- Start background workers (after migrations are done) ---
cd /home/frappe/bench-dir

bench worker --queue default 2>&1 &
PIDS_TO_KILL+=($!)

bench worker --queue short 2>&1 &
PIDS_TO_KILL+=($!)

bench worker --queue long 2>&1 &
PIDS_TO_KILL+=($!)

bench schedule 2>&1 &
PIDS_TO_KILL+=($!)

echo "Background workers started."

# --- Start Gunicorn in the foreground ---
write_status "ready"
echo "Starting Gunicorn on port ${PORT:-8080}..."
exec env/bin/gunicorn \
    -b 0.0.0.0:${PORT:-8080} \
    wsgi:application \
    --workers 2 \
    --threads 2 \
    --timeout 120 \
    --graceful-timeout 30 \
    --access-logfile - \
    --error-logfile -
