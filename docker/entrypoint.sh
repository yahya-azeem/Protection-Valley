#!/bin/bash
set -e

# Export SITES_PATH globally so all processes (Gunicorn, workers, scheduler, migrations) use it
export SITES_PATH=sites

# Initialize setup status file
echo "initializing" > /tmp/erpnext_status.txt

# Start local Redis in the background
redis-server --daemonize yes

# Wait for Redis to start
until redis-cli ping | grep -q PONG; do
  echo "Waiting for Redis to start..."
  sleep 1
done
echo "Redis is ready!"

# Run config writer in the foreground (takes 0.1s)
echo "Writing site configurations..."
/home/frappe/bench-dir/env/bin/python -u /home/frappe/init_site.py --config-only

# Start migrations and background workers in the background
(
  echo "Running background migrations..."
  /home/frappe/bench-dir/env/bin/python -u /home/frappe/init_site.py --migrate-only
  echo "Migrations completed/skipped. Starting background workers..."
  cd /home/frappe/bench-dir
  /usr/local/bin/bench worker --queue default 2>&1 &
  /usr/local/bin/bench worker --queue short 2>&1 &
  /usr/local/bin/bench worker --queue long 2>&1 &
  /usr/local/bin/bench schedule 2>&1 &
) &

# Start Gunicorn web server in the foreground, bound to the Cloud Run PORT
cd /home/frappe/bench-dir
echo "Starting Gunicorn..."
exec env/bin/gunicorn -b 0.0.0.0:${PORT:-8080} wsgi:application --workers 1 --threads 2 --timeout 600
