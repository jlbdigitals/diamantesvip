#!/bin/bash
set -e

echo "📤 Subiendo DB local a producción"
echo "================================"

# Configuración - CAMBIA ESTO:
SSH_HOST="tu-usuario@tu-ip-ec2"  # ej: ec2-user@3.85.123.45
CONTAINER_NAME="diamantes"        # o el nombre de tu contenedor
DB_LOCAL="./prisma/dev.db"
DB_REMOTE="/app/prisma/data/dev.db"

# Verificar que existe la DB local
if [ ! -f "$DB_LOCAL" ]; then
  echo "❌ No existe $DB_LOCAL"
  exit 1
fi

echo "📦 DB local: $DB_LOCAL ($(du -h $DB_LOCAL | cut -f1))"

# 1. Subir la DB al servidor
DB_TEMP="/tmp/diamantes-dev.db"
echo "⬆️  Subiendo al servidor..."
scp "$DB_LOCAL" "$SSH_HOST:$DB_TEMP"

# 2. Copiar al contenedor y reiniciar
echo "📂 Copiando al contenedor Docker..."
ssh "$SSH_HOST" "
  docker cp $DB_TEMP $CONTAINER_NAME:$DB_REMOTE && \
  docker restart $CONTAINER_NAME && \
  echo '✅ Contenedor reiniciado' && \
  docker logs --tail 5 $CONTAINER_NAME
"

# Limpiar
ssh "$SSH_HOST" "rm $DB_TEMP" 2>/dev/null || true

echo ""
echo "🎉 Listo! La producción tiene tu DB local completa."
echo "   URL: http://$(echo $SSH_HOST | cut -d@ -f2):3000"
