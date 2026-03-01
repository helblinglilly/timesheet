#!/bin/sh
set -e

PB_DATA_DIR="${PB_DATA_DIR:-/pb/pb_data}"

# ── Start PocketBase (with embedded migrations) in the background ─────────────
# Using pb_setup instead of pocketbase directly so that Go migrations are
# automatically applied on serve, and the running process has the correct
# collections state from the moment it is ready.
echo "[entrypoint] Starting PocketBase..."
/pb/pb_setup serve --http=0.0.0.0:8080 --dir="$PB_DATA_DIR" &
PB_PID=$!

# ── Wait for PocketBase to be ready ──────────────────────────────────────────
echo "[entrypoint] Waiting for PocketBase to become ready..."
for i in $(seq 1 30); do
  if wget -qO- http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "[entrypoint] PocketBase is ready."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "[entrypoint] ERROR: PocketBase did not become ready in time." >&2
    kill "$PB_PID"
    exit 1
  fi
  sleep 1
done

# ── Start Next.js in the foreground ──────────────────────────────────────────
echo "[entrypoint] Starting Next.js..."
exec node /app/server.js
