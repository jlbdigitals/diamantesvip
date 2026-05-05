#!/bin/bash
set -e

echo "🚀 Deploy Diamantes VIP - Preservando datos + Seed seguro"
echo "=========================================================="

# Config
CONTAINER_NAME="diamantes"
IMAGE_NAME="diamantes:latest"
PORT="3000"

# Detectar contenedor actual
OLD_CONTAINER=$(docker ps -q --filter "ancestor=$IMAGE_NAME" --filter "status=running" | head -1)
if [ -z "$OLD_CONTAINER" ]; then
  OLD_CONTAINER=$(docker ps -q --filter "status=running" | head -1)
fi

if [ -z "$OLD_CONTAINER" ]; then
  echo "⚠️  No hay contenedor corriendo. Se hará deploy desde cero."
  OLD_CONTAINER=""
fi

# 1. Backup DB actual
if [ -n "$OLD_CONTAINER" ]; then
  echo "📦 Haciendo backup de la base de datos actual..."
  BACKUP_FILE="./backup-$(date +%Y%m%d-%H%M%S).db"
  docker cp "$OLD_CONTAINER:/app/prisma/data/dev.db" "$BACKUP_FILE"
  echo "✅ Backup guardado: $BACKUP_FILE"
else
  echo "⚠️  No hay contenedor para backupar"
fi

# 2. Build nueva imagen
echo "🔨 Build de la nueva imagen Docker..."
docker build -t "$IMAGE_NAME" .

# 3. Si hay backup, seedearlo con seed-safe.js
if [ -n "$BACKUP_FILE" ] && [ -f "$BACKUP_FILE" ]; then
  echo "🌱 Ejecutando seed seguro sobre el backup..."
  
  # Crear entorno temporal para correr seed-safe.js
  TEMP_DIR=$(mktemp -d)
  cp "$BACKUP_FILE" "$TEMP_DIR/dev.db"
  cp prisma/schema.prisma "$TEMP_DIR/"
  cp scripts/seed-safe.js "$TEMP_DIR/"
  
  # Ejecutar en contenedor temporal de Node
  docker run --rm \
    -v "$TEMP_DIR:/work" \
    -w /work \
    node:20-alpine sh -c "
      apk add --no-cache openssl >/dev/null 2>&1
      npm init -y >/dev/null 2>&1
      npm install @prisma/client@5.22.0 bcryptjs prisma@5.22.0 >/dev/null 2>&1
      npx prisma generate --schema=schema.prisma >/dev/null 2>&1
      DATABASE_URL='file:/work/dev.db' node seed-safe.js
    "
  
  echo "✅ Seed completado en backup"
fi

# 4. Detener y eliminar contenedor viejo
if [ -n "$OLD_CONTAINER" ]; then
  echo "🛑 Deteniendo contenedor antiguo..."
  docker stop "$OLD_CONTAINER" >/dev/null 2>&1 || true
  docker rm "$OLD_CONTAINER" >/dev/null 2>&1 || true
fi

# 5. Iniciar nuevo contenedor
echo "🚀 Iniciando nuevo contenedor..."
docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT:3000" \
  --restart unless-stopped \
  "$IMAGE_NAME"

# 6. Si teníamos backup seedeado, copiarlo al nuevo contenedor
if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
  echo "📂 Restaurando base de datos con datos preservados + nuevos seeds..."
  sleep 2
  docker cp "$TEMP_DIR/dev.db" "$CONTAINER_NAME:/app/prisma/data/dev.db"
  docker restart "$CONTAINER_NAME" >/dev/null 2>&1
  rm -rf "$TEMP_DIR"
fi

echo ""
echo "🎉 Deploy completado!"
echo "   Contenedor: $CONTAINER_NAME"
echo "   Puerto: $PORT"
echo ""

# Mostrar logs
echo "📋 Últimos logs:"
docker logs --tail 15 "$CONTAINER_NAME"
