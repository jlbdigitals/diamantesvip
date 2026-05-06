#!/bin/bash
set -euo pipefail

echo "Deploy + reset DB + healthcheck"
echo "==============================="

if [ "$#" -lt 1 ]; then
  echo "Uso: bash scripts/deploy-reset-health.sh <ssh-user@host> [container_name] [local_db_path] [app_url]"
  echo "Ejemplo: bash scripts/deploy-reset-health.sh root@1.2.3.4 diamantes ./data/dev.db https://diamantesvip.com"
  exit 1
fi

SSH_HOST="$1"
CONTAINER_NAME="${2:-diamantes}"
LOCAL_DB_PATH="${3:-./data/dev.db}"
APP_URL="${4:-}"

if [ ! -f "$LOCAL_DB_PATH" ] && [ -f "./prisma/dev.db" ]; then
  LOCAL_DB_PATH="./prisma/dev.db"
fi

if [ ! -f "$LOCAL_DB_PATH" ]; then
  echo "No se encontro DB local en $LOCAL_DB_PATH ni en ./prisma/dev.db"
  exit 1
fi

echo "1) Build y deploy remoto"
ssh "$SSH_HOST" "cd /app && docker compose up -d --build"

echo "2) Reset de DB remota desde local"
bash "scripts/reset-prod-db.sh" "$SSH_HOST" "$CONTAINER_NAME" "$LOCAL_DB_PATH"

echo "3) Healthcheck contenedor y Prisma"
ssh "$SSH_HOST" "docker ps --format '{{.Names}} {{.Status}}' | grep -E '^$CONTAINER_NAME '"
ssh "$SSH_HOST" "docker logs --tail 25 '$CONTAINER_NAME'"
ssh "$SSH_HOST" "docker exec '$CONTAINER_NAME' sh -lc 'test -f /app/prisma/data/dev.db && ls -lah /app/prisma/data/dev.db'"

if [ -n "$APP_URL" ]; then
  echo "4) Healthcheck HTTP: $APP_URL"
  curl -fsSL "$APP_URL" >/dev/null
  echo "HTTP OK"
else
  echo "4) Healthcheck HTTP omitido (sin app_url)"
fi

echo ""
echo "OK: Deploy + reset DB + healthcheck completado"
