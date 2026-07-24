# Launch modes (desktop vs mobile)

Rankmora supports multiple ways to open third-party tools. Phones cannot install Chrome extensions, so Cloudflare-heavy tools (Canva, Grammarly, Quillbot) need a different path on mobile.

## Modes

| Mode | Desktop | Mobile | Best for |
|------|---------|--------|----------|
| **PROXY** | Session reverse proxy | Same (works) | Semrush, Moz, Ahrefs, most SEO tools |
| **EXTENSION** | Rankmora Chrome launcher injects cookies on the real domain | Not available without cloud | Canva / Cloudflare sites on desktop |
| **CLOUD** | Remote Chromium streamed to the browser | Same (works) | Canva-like tools when mobile is required |
| **DIRECT** | Opens launch URL only (no login) | Same | Rare / external portals |

## Hybrid policy (recommended)

| Device | PROXY tools | EXTENSION tools (Canva, …) |
|--------|-------------|----------------------------|
| Desktop Chrome | PROXY | EXTENSION (launcher) |
| Phone / tablet | PROXY | **CLOUD** if cloud-browser is enabled; otherwise “use desktop” CTA |

Admin tip: keep Canva as **Browser extension**. With `CLOUD_BROWSER_*` env set, mobile users automatically get a cloud session; desktop users keep the extension.

## Mobile-OK vs desktop-only

- **Mobile-OK:** any tool with launch mode **PROXY** or **CLOUD** (or EXTENSION + cloud browser configured).
- **Desktop-only:** **EXTENSION** when cloud browser is off / at capacity.

Show this to users via the dashboard banner and Launch button copy.

## Ops checklist

1. PROXY tools: cookies Alive, Test session, `SESSION_SERVICE_*` healthy.
2. EXTENSION tools: desktop users install launcher (`/dashboard/extension`).
3. CLOUD (mobile Canva): enable cloud-browser (see `deploy/CLOUD-BROWSER.md`), restart PM2 `groupbuy-cloud`.
4. Never store or show vendor passwords.
