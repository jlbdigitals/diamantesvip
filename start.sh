#!/bin/sh
set -e

echo "📦 Applying database schema..."
node /app/node_modules/prisma/build/index.js db push --skip-generate

echo "🌱 Running seed..."
node /app/scripts/seed-safe.js || echo "⚠️  Seed skipped"

echo "🚀 Starting server..."
exec node /app/server.js
