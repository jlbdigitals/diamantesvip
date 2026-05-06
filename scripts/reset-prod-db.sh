#!/bin/bash
set -euo pipefail

echo "Reset de DB de produccion con DB local"
echo "======================================"

if [ "$#" -lt 1 ]; then
  echo "Uso: bash scripts/reset-prod-db.sh <ssh-user@host> [container_name] [local_db_path]"
  echo "Ejemplo: bash scripts/reset-prod-db.sh root@1.2.3.4 diamantes ./data/dev.db"
  exit 1
fi

SSH_HOST="$1"
CONTAINER_NAME="${2:-diamantes}"
LOCAL_DB_PATH="${3:-./data/dev.db}"
REMOTE_DB_PATH="/app/prisma/data/dev.db"
REMOTE_TMP_DB="/tmp/diamantes-dev.db"

if [ ! -f "$LOCAL_DB_PATH" ]; then
  if [ -f "./prisma/dev.db" ]; then
    LOCAL_DB_PATH="./prisma/dev.db"
  else
    echo "No se encontro DB local en $LOCAL_DB_PATH ni en ./prisma/dev.db"
    exit 1
  fi
fi

echo "DB local: $LOCAL_DB_PATH"
echo "Contenedor remoto: $CONTAINER_NAME"
echo "Host remoto: $SSH_HOST"

echo "Verificando contenedor remoto..."
ssh "$SSH_HOST" "docker ps --format '{{.Names}}' | grep -Fx '$CONTAINER_NAME' >/dev/null"

BACKUP_FILE_REMOTE="/tmp/diamantes-backup-$(date +%Y%m%d-%H%M%S).db"
echo "Backup remoto actual: $BACKUP_FILE_REMOTE"
ssh "$SSH_HOST" "docker exec '$CONTAINER_NAME' sh -lc 'if [ -f \"$REMOTE_DB_PATH\" ]; then cp \"$REMOTE_DB_PATH\" \"$BACKUP_FILE_REMOTE\"; fi'"

echo "Subiendo DB local a $REMOTE_TMP_DB"
scp "$LOCAL_DB_PATH" "$SSH_HOST:$REMOTE_TMP_DB"

echo "Reemplazando DB dentro del contenedor"
ssh "$SSH_HOST" "docker exec '$CONTAINER_NAME' sh -lc 'mkdir -p /app/prisma/data && rm -f \"$REMOTE_DB_PATH\"'"
ssh "$SSH_HOST" "docker cp '$REMOTE_TMP_DB' '$CONTAINER_NAME:$REMOTE_DB_PATH'"
ssh "$SSH_HOST" "docker exec '$CONTAINER_NAME' sh -lc 'chown nextjs:nodejs \"$REMOTE_DB_PATH\" && chmod 664 \"$REMOTE_DB_PATH\" && ls -lah /app/prisma/data'"

echo "Reiniciando contenedor"
ssh "$SSH_HOST" "docker restart '$CONTAINER_NAME' >/dev/null"

echo "Verificando variables y archivo"
ssh "$SSH_HOST" "docker exec '$CONTAINER_NAME' sh -lc 'echo DATABASE_URL=\$DATABASE_URL; test -f \"$REMOTE_DB_PATH\" && ls -lah \"$REMOTE_DB_PATH\"'"

echo "Limpiando temporal remoto"
ssh "$SSH_HOST" "rm -f '$REMOTE_TMP_DB'"

echo ""
echo "OK: DB de produccion reemplazada completamente por la local"
echo "Si falla con code 14, revisa permisos del volumen bind en Dockploy (host path owner/uid)."
