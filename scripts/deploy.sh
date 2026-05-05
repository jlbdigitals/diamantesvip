#!/bin/bash
set -e

echo "🚀 Deploy Diamantes VIP"
echo "======================="

# Backup automático antes de deploy
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

if [ -f "./data/dev.db" ]; then
  BACKUP_FILE="$BACKUP_DIR/dev-$(date +%Y%m%d-%H%M%S).db"
  cp ./data/dev.db "$BACKUP_FILE"
  echo "💾 Backup creado: $BACKUP_FILE"
fi

# Build e inicio
echo "🔨 Build de la nueva imagen..."
docker-compose up --build -d

echo ""
echo "✅ Deploy completado!"
echo "   URL: http://$(curl -s ifconfig.me):3000"
echo ""
docker-compose logs --tail 10 app
