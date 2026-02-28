#!/bin/sh
set -e

PB_DATA_DIR="${PB_DATA_DIR:-/pb/pb_data}"

# ── Start PocketBase in the background ───────────────────────────────────────
echo "[entrypoint] Starting PocketBase..."
/pb/pocketbase serve --http=0.0.0.0:8080 --dir="$PB_DATA_DIR" &
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

# ── Run migrations (idempotent - safe to run on every startup) ────────────────
echo "[entrypoint] Running migrations..."
/pb/pb_setup migrate up --dir="$PB_DATA_DIR"
echo "[entrypoint] Migrations complete."

# ── Start Next.js in the foreground ──────────────────────────────────────────
echo "[entrypoint] Starting Next.js..."
exec node /app/server.js
