import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
  type CDPSession,
} from "playwright";
import type { WebSocket as WsSocket } from "ws";
import type { StoredCookie } from "./db.js";

export type CloudSession = {
  id: string;
  token: string;
  userId: string;
  toolId: string;
  toolAccountId: string;
  openUrl: string;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  cdp: CDPSession | null;
  createdAt: number;
  lastActiveAt: number;
  expiresAt: number;
  sockets: Set<WsSocket>;
};

const sessions = new Map<string, CloudSession>();

function maxSessions() {
  const n = Number(process.env.CLOUD_BROWSER_MAX_SESSIONS ?? "3");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 3;
}

function idleMs() {
  const n = Number(process.env.CLOUD_BROWSER_IDLE_MS ?? String(10 * 60 * 1000));
  return Number.isFinite(n) && n > 0 ? n : 10 * 60 * 1000;
}

function ttlMs() {
  const n = Number(process.env.CLOUD_BROWSER_TTL_MS ?? String(30 * 60 * 1000));
  return Number.isFinite(n) && n > 0 ? n : 30 * 60 * 1000;
}

function cookieDomainFromUrl(openUrl: string, cookieDomain?: string) {
  if (cookieDomain) return cookieDomain;
  try {
    const host = new URL(openUrl).hostname;
    const parts = host.split(".");
    if (parts.length >= 2) return `.${parts.slice(-2).join(".")}`;
    return host;
  } catch {
    return undefined;
  }
}

export function sessionCount() {
  return sessions.size;
}

export function getSessionByToken(token: string) {
  return sessions.get(token) ?? null;
}

export async function destroySession(token: string) {
  const s = sessions.get(token);
  if (!s) return;
  sessions.delete(token);
  for (const sock of Array.from(s.sockets)) {
    try {
      sock.close();
    } catch {
      /* ignore */
    }
  }
  try {
    await s.browser.close();
  } catch {
    /* ignore */
  }
}

export async function createCloudSession(params: {
  token: string;
  userId: string;
  toolId: string;
  toolAccountId: string;
  openUrl: string;
  cookies: StoredCookie[];
}): Promise<CloudSession> {
  if (sessions.size >= maxSessions()) {
    throw new Error(
      `Cloud browser at capacity (${maxSessions()} sessions). Try again later or use desktop Chrome.`
    );
  }

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1280,800",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });

  const playwrightCookies = params.cookies
    .filter((c) => typeof c.name === "string" && typeof c.value === "string")
    .map((c) => {
      let domain = c.domain?.trim();
      if (!domain) {
        domain = cookieDomainFromUrl(params.openUrl);
      }
      if (!domain) return null;
      if (!domain.startsWith(".")) {
        // Prefer host-only for exact hosts; apex gets leading dot for subdomains.
        const host = domain.replace(/^www\./, "");
        domain = host.includes(".") ? `.${host}` : host;
      }
      return {
        name: c.name,
        value: c.value,
        domain,
        path: c.path && c.path.startsWith("/") ? c.path : "/",
        secure: c.secure !== false,
        httpOnly: Boolean(c.httpOnly),
        expires:
          typeof c.expirationDate === "number" && c.expirationDate > Date.now() / 1000
            ? Math.floor(c.expirationDate)
            : undefined,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  if (playwrightCookies.length > 0) {
    await context.addCookies(playwrightCookies);
  }

  const page = await context.newPage();
  await page.goto(params.openUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });

  const now = Date.now();
  const session: CloudSession = {
    id: params.token,
    token: params.token,
    userId: params.userId,
    toolId: params.toolId,
    toolAccountId: params.toolAccountId,
    openUrl: params.openUrl,
    browser,
    context,
    page,
    cdp: null,
    createdAt: now,
    lastActiveAt: now,
    expiresAt: now + ttlMs(),
    sockets: new Set(),
  };

  sessions.set(params.token, session);
  return session;
}

export function touchSession(session: CloudSession) {
  session.lastActiveAt = Date.now();
}

export async function attachScreencast(
  session: CloudSession,
  ws: WsSocket
) {
  touchSession(session);
  session.sockets.add(ws);

  if (!session.cdp) {
    session.cdp = await session.page.context().newCDPSession(session.page);
    await session.cdp.send("Page.startScreencast", {
      format: "jpeg",
      quality: 60,
      maxWidth: 1280,
      maxHeight: 800,
      everyNthFrame: 1,
    });

    session.cdp.on("Page.screencastFrame", async (frame) => {
      const payload = JSON.stringify({
        type: "frame",
        data: frame.data,
        sessionId: frame.sessionId,
        metadata: frame.metadata,
      });
      for (const sock of Array.from(session.sockets)) {
        if (sock.readyState === sock.OPEN) {
          sock.send(payload);
        }
      }
      try {
        await session.cdp?.send("Page.screencastFrameAck", {
          sessionId: frame.sessionId,
        });
      } catch {
        /* ignore */
      }
    });
  }

  ws.on("message", async (raw) => {
    touchSession(session);
    let msg: {
      type?: string;
      x?: number;
      y?: number;
      button?: string;
      text?: string;
      key?: string;
      code?: string;
      deltaY?: number;
    };
    try {
      msg = JSON.parse(String(raw));
    } catch {
      return;
    }
    if (!session.cdp) return;

    try {
      if (msg.type === "mousedown" || msg.type === "mouseup" || msg.type === "mousemove") {
        await session.cdp.send("Input.dispatchMouseEvent", {
          type:
            msg.type === "mousedown"
              ? "mousePressed"
              : msg.type === "mouseup"
                ? "mouseReleased"
                : "mouseMoved",
          x: msg.x ?? 0,
          y: msg.y ?? 0,
          button: (msg.button as "left" | "none") || "left",
          clickCount: 1,
        });
      } else if (msg.type === "wheel") {
        await session.cdp.send("Input.dispatchMouseEvent", {
          type: "mouseWheel",
          x: msg.x ?? 0,
          y: msg.y ?? 0,
          deltaX: 0,
          deltaY: msg.deltaY ?? 0,
        });
      } else if (msg.type === "keydown" || msg.type === "keyup") {
        await session.cdp.send("Input.dispatchKeyEvent", {
          type: msg.type === "keydown" ? "keyDown" : "keyUp",
          text: msg.text,
          key: msg.key,
          code: msg.code,
        });
      } else if (msg.type === "char" && msg.text) {
        await session.cdp.send("Input.dispatchKeyEvent", {
          type: "char",
          text: msg.text,
        });
      }
    } catch {
      /* ignore input errors */
    }
  });

  ws.on("close", () => {
    session.sockets.delete(ws);
  });
}

export function startJanitor() {
  setInterval(() => {
    const now = Date.now();
    const idle = idleMs();
    for (const [token, s] of Array.from(sessions.entries())) {
      if (now > s.expiresAt || now - s.lastActiveAt > idle) {
        void destroySession(token);
      }
    }
  }, 30_000).unref();
}
