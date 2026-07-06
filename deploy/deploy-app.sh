#!/usr/bin/env bash
# Deploy / update GroupBuy Tools on the VPS.
# Run from the project root (e.g. /var/www/groupbuy-tools).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found. Copy deploy/env.production.example to .env first."
  exit 1
fi

echo "==> Installing dependencies..."
npm ci
npm run session:install

echo "==> Prisma generate + migrate..."
npx prisma generate
npx prisma migrate deploy

if [[ "${SKIP_SEED:-}" != "1" ]]; then
  echo "==> Seeding database (set SKIP_SEED=1 to skip)..."
  npm run db:seed || echo "Seed skipped or already applied."
fi

echo "==> Building Next.js..."
npm run build

echo "==> Restarting PM2..."
if pm2 describe groupbuy-web &>/dev/null; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
fi

pm2 save

echo ""
echo "Deploy complete."
pm2 status
