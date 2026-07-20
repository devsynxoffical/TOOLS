# Session proxy rollout

Hardened cookie/session reverse proxy for GroupBuy Tools.

## What changed

- Encrypted cookie accounts with **Alive / Expired / Unknown** health checks
- Hashed one-time launch tokens (atomic consume)
- Persistent `ProxySession` rows with mid-session access re-check + revoke
- Hard concurrent-user limits (no silent overload)
- HTTPS upstream allowlists + private IP blocking
- Multi-method proxy + same-host `Location` rewrite
- Optional per-tool hosts: `semrush.tools.yourdomain.com`
- Session service listens on `127.0.0.1` only

## VPS commands

```bash
cd /var/www/groupbuy-tools
git pull origin master
npx prisma migrate deploy
npm install
npm install --prefix apps/session-service
# Important: generate BOTH web + session-service Prisma clients
npx prisma generate
npm run build
pm2 restart ecosystem.config.js
```

`prisma generate` writes clients into:
- `node_modules/@prisma/client` (Next.js)
- `apps/session-service/node_modules/.prisma/client` (session service)

If you skip generate, the session service can crash with “@prisma/client did not initialize yet” or missing `proxySession`.

Add to `.env` (see `deploy/env.production.example`):

```
SESSION_SERVICE_URL=http://127.0.0.1:4000
SESSION_SERVICE_PUBLIC_URL=https://session.rankmora.io
SESSION_TOOLS_BASE_DOMAIN=tools.rankmora.io
SESSION_SERVICE_API_KEY=...
SESSION_ENCRYPTION_KEY=...
```

DNS: `A` record `*.tools` → VPS. TLS: wildcard cert via DNS-01 (see `PRODUCTION-CHECKLIST.md`).

## Admin ops

1. Set tool Launch URL (HTTPS).
2. Paste cookies → **Test session**.
3. Launch only when status is **Alive**.
4. Refresh cookies when **Expired**.
5. Keep max concurrent users low.

Compatibility is best-effort per vendor. Do not store passwords.
