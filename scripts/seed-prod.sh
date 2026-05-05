#!/bin/bash
set -e

echo "🌱 Seed seguro - Agregando nuevas escorts (sin borrar datos)"
echo "============================================================"

DB_PATH="$(pwd)/data/dev.db"

if [ ! -f "$DB_PATH" ]; then
  echo "❌ No se encontró la base de datos en $DB_PATH"
  echo "   ¿Ya hiciste el primer deploy? Corre primero: bash scripts/migrate-from-container.sh"
  exit 1
fi

echo "📂 Base de datos: $DB_PATH"

# Ejecutar seed-safe.js en un contenedor temporal de Node
docker run --rm \
  -v "$(pwd)/data:/work/data" \
  -v "$(pwd)/prisma:/work/prisma" \
  -v "$(pwd)/scripts/seed-safe.js:/work/seed-safe.js" \
  -w /work \
  node:20-alpine sh -c "
    apk add --no-cache openssl >/dev/null 2>&1
    npm init -y >/dev/null 2>&1
    npm install @prisma/client@5.22.0 bcryptjs prisma@5.22.0 >/dev/null 2>&1
    npx prisma generate --schema=prisma/schema.prisma >/dev/null 2>&1
    DATABASE_URL='file:/work/data/dev.db' node seed-safe.js
  "

echo ""
echo "✅ Seed completado. Reiniciando contenedor..."
docker-compose restart app
echo "   Listo!"
