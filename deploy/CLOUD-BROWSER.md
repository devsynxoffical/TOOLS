# Cloud browser (mobile Canva / Cloudflare tools)

Remote Chromium sessions so phones can use tools that normally need the desktop Chrome extension.

## How it works

1. User on **mobile** taps Launch on an **EXTENSION** (or **CLOUD**) tool.
2. Next.js calls `groupbuy-cloud` → `/internal/cloud-launch`.
3. Service decrypts cookies, starts Playwright Chromium, opens the tool URL.
4. User gets a `streamUrl` viewer (canvas + WebSocket screencast + touch input).

Desktop users keep the **extension** path for EXTENSION tools.

## Env (add to `/var/www/groupbuy-tools/.env`)

```bash
CLOUD_BROWSER_ENABLED=true
CLOUD_BROWSER_URL=http://127.0.0.1:4100
CLOUD_BROWSER_PUBLIC_URL=https://rankmora.io/cloud-browser
# or subdomain: https://cloud.rankmora.io
# temporary test only: http://VPS_IP:4100 (bind 0.0.0.0; close when done)
CLOUD_BROWSER_PORT=4100
CLOUD_BROWSER_BIND_HOST=127.0.0.1
CLOUD_BROWSER_MAX_SESSIONS=3
CLOUD_BROWSER_IDLE_MS=600000
CLOUD_BROWSER_TTL_MS=1800000
# Reuse session API key + encryption key
SESSION_SERVICE_API_KEY=...
SESSION_ENCRYPTION_KEY=...
DATABASE_URL=...
```

## Public URL (pick one)

**A — Path on existing site (no new DNS):** set `CLOUD_BROWSER_PUBLIC_URL=https://rankmora.io/cloud-browser`, keep bind `127.0.0.1`, add the `/cloud-browser/` location from `deploy/nginx/cloud-browser.conf.example` into the SSL `server` for `rankmora.io`, then `nginx -t && systemctl reload nginx`.

**B — Subdomain:** DNS `cloud` A → VPS, install `cloud-browser.conf.example`, Certbot, set `CLOUD_BROWSER_PUBLIC_URL=https://cloud.rankmora.io`.

**C — Temporary IP test:** `CLOUD_BROWSER_PUBLIC_URL=http://74.208.248.8:4100`, `CLOUD_BROWSER_BIND_HOST=0.0.0.0`, `ufw allow 4100/tcp`. Do not leave this open long-term.

## Install on VPS

```bash
cd /var/www/groupbuy-tools
git pull origin master
npx prisma migrate deploy
npx prisma generate
npm install --prefix apps/cloud-browser
npx playwright install chromium --with-deps --prefix apps/cloud-browser
# If --prefix does not work for playwright:
cd apps/cloud-browser && npx playwright install chromium && cd ../..
npm run build
pm2 restart ecosystem.config.js
pm2 save
```

Ubuntu packages (if Playwright install asks):

```bash
npx playwright install-deps chromium
```

## Nginx

Proxy `/cloud-browser/` (or `cloud.rankmora.io`) to `127.0.0.1:4100` with WebSocket upgrade. See `deploy/nginx/cloud-browser.conf.example`.

## Limits

- Cap concurrent sessions (`CLOUD_BROWSER_MAX_SESSIONS`) — each Chromium uses ~200–400MB RAM.
- Idle sessions close after `CLOUD_BROWSER_IDLE_MS`.
- Do not expose port 4100 publicly without auth; viewers use one-time tokens.

## Admin

- Leave Canva as **Browser extension** (desktop) — mobile auto-uses cloud when enabled.
- Or set launch mode to **Cloud browser** for always-cloud tools.
- See `deploy/LAUNCH-MODES.md`.
