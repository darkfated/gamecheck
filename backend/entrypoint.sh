#!/bin/sh
set -eu

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"

echo "Waiting for Postgres at ${DB_HOST}:${DB_PORT} (user=${DB_USER})..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
  printf '.'
  sleep 1
done

echo
echo "Postgres is ready."

exec /app/server
