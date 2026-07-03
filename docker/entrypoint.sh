#!/bin/bash
set -e

# Start local Redis in the background
redis-server --daemonize yes

# Wait for Redis to start
until redis-cli ping | grep -q PONG; do
  echo "Waiting for Redis to start..."
  sleep 1
done
echo "Redis is ready!"

cd /home/frappe/bench-dir

# Start Frappe background worker processes
./env/bin/bench worker --queue default &
./env/bin/bench worker --queue short &
./env/bin/bench worker --queue long &

# Start Frappe schedule worker
./env/bin/bench schedule &

# Start Gunicorn web server in the foreground, bound to the Cloud Run PORT
exec ./env/bin/gunicorn -b 0.0.0.0:${PORT:-8080} frappe.app:application --workers 1 --threads 2 --timeout 120
