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

echo "==> Ensuring upload directories..."
mkdir -p public/uploads/payments
chmod 755 public/uploads/payments

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
echo "==> Health checks..."
WEB_OK=$(curl -sf -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health || echo "000")
SESSION_OK=$(curl -sf -o /dev/null -w "%{http_code}" http://127.0.0.1:4000/health || echo "000")
echo "  groupbuy-web:     HTTP ${WEB_OK}"
echo "  groupbuy-session: HTTP ${SESSION_OK}"

if [[ "$WEB_OK" != "200" ]]; then
  echo "WARN: Web app health check failed. Run: pm2 logs groupbuy-web --lines 50"
fi
if [[ "$SESSION_OK" != "200" ]]; then
  echo "WARN: Session service health check failed. Run: pm2 logs groupbuy-session --lines 50"
fi

echo ""
echo "Deploy complete."
pm2 status
