# Rankmora Tool Launcher (Chrome extension)

Canva and other Cloudflare-protected sites **cannot** be reverse-proxied. This extension sets authorized session cookies on the **real** tool domain in the user’s browser.

## Install (admin / power users)

1. On your Mac/PC, download the folder from the server or git repo:
   `apps/tool-launcher-extension/`
2. Chrome → `chrome://extensions`
3. Enable **Developer mode**
4. **Load unpacked** → select `tool-launcher-extension`
5. Keep the extension enabled

## Use

1. Admin: Canva tool → Launch mode = **Browser extension**
2. Admin: paste cookies → **Test session** → Alive
3. User: open Rankmora dashboard (same Chrome profile with the extension)
4. Click **Launch tool** → Canva opens on `canva.com` logged in

## Deploy note

After pulling code on the VPS:

```bash
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart groupbuy-web
```

Users install the extension on their own computers (not on the VPS).
