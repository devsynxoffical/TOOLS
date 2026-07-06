# Production activation checklist

Use this after deploying to the VPS to verify every feature works.

## 1. Environment (`.env`)

| Variable | Example (IP-only VPS) |
|----------|----------------------|
| `DATABASE_URL` | `postgresql://...@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?connection_limit=1` |
| `NEXTAUTH_URL` | `http://74.208.248.8` |
| `NEXTAUTH_SECRET` | random 32+ chars |
| `SESSION_ENCRYPTION_KEY` | random 32+ chars (same on web + session) |
| `SESSION_SERVICE_API_KEY` | random string |
| `SESSION_SERVICE_URL` | `http://127.0.0.1:4000` |
| `SESSION_SERVICE_PUBLIC_URL` | `http://74.208.248.8/session` |
| `USE_MOCK_DATA` | unset or `false` |

## 2. Deploy

```bash
cd /var/www/groupbuy-tools
git pull origin master
SKIP_SEED=1 ./deploy/deploy-app.sh
cp deploy/nginx/ip-only.conf /etc/nginx/sites-available/groupbuy-ip
ln -sf /etc/nginx/sites-available/groupbuy-ip /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

Health checks should return HTTP 200:
- `curl http://127.0.0.1:3000/api/health`
- `curl http://127.0.0.1:4000/health`

## 3. Admin setup (first login)

Login: `admin@platform.com` / `Admin@1234`

1. **Settings** (`/admin/settings`) — set WhatsApp number, payment instructions, real bank accounts (replace seed placeholder).
2. **Tools** (`/admin/tools`) — confirm prices and **Launch URL** for each tool.
3. **Tool accounts** (`/admin/tools/[id]/accounts`) — paste browser cookie JSON for each tool you want to proxy-launch.
4. **Plans** (`/admin/plans`) — optional bundles for manual subscription assignment.

## 4. End-to-end test flows

### User signup & login
- [ ] Sign up at `/signup`
- [ ] Login at `/login`
- [ ] Dashboard loads at `/dashboard`

### Buy tool (manual payment)
- [ ] Open `/pricing` → pick a tool → `/dashboard/buy/[slug]`
- [ ] Select bank, upload screenshot, submit order
- [ ] Order appears at `/dashboard/orders` as PENDING
- [ ] Admin approves at `/admin/payments`
- [ ] User sees tool on dashboard with ACTIVE access

### Request tools
- [ ] User opens `/dashboard/request-tools` (sidebar link)
- [ ] Selects tools + submits request
- [ ] Admin sees request on `/admin/tools` → Review & assign

### Launch tool
- [ ] User clicks **Launch tool** on dashboard
- [ ] Redirects via session service (`/session/go/...`) when accounts configured
- [ ] Tool opens logged in via cookie proxy

### Admin user management
- [ ] Create user at `/admin/users`
- [ ] Assign plan subscription at `/admin/users/[id]`
- [ ] Grant/revoke individual tools

## 5. Known limitations

- **Payment screenshots** stored locally in `public/uploads/payments/` — persist across deploys on same VPS; back up if rebuilding server.
- **No Stripe** — all payments are manual bank transfer + admin approval.
- **Tool launch** requires admin to add cookie accounts per tool; without them launch returns 503.
- **Domain + SSL** — use `deploy/nginx/groupbuy.conf.template` when you have a domain; update `NEXTAUTH_URL` and `SESSION_SERVICE_PUBLIC_URL`.
