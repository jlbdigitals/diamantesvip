#!/bin/bash
set -e

echo "📦 Migrando desde contenedor actual al nuevo sistema"
echo "===================================================="

# Detectar contenedor corriendo
CONTAINER=$(docker ps -q | head -1)

if [ -z "$CONTAINER" ]; then
  echo "❌ No hay ningún contenedor corriendo. No hay nada que migrar."
  exit 1
fi

echo "📂 Contenedor encontrado: $CONTAINER"

# Crear directorio de datos
mkdir -p ./data
mkdir -p ./backups

# Extraer la base de datos
echo "⬇️  Extrayendo base de datos del contenedor..."
docker cp "$CONTAINER:/app/prisma/data/dev.db" ./data/dev.db

echo "✅ Base de datos migrada a ./data/dev.db"

# Backup por seguridad
cp ./data/dev.db "./backups/migrate-$(date +%Y%m%d-%H%M%S).db"

# Detener contenedor viejo
echo "🛑 Deteniendo contenedor viejo..."
docker stop "$CONTAINER" >/dev/null 2>&1 || true
docker rm "$CONTAINER" >/dev/null 2>&1 || true

echo ""
echo "🎉 Migración completada!"
echo "   Ahora podés hacer deploy con: bash scripts/deploy.sh"
