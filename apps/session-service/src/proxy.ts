import type { ServerResponse, IncomingMessage } from "http";
import httpProxy from "http-proxy";
import { decryptCookiesToHeader } from "./crypto.js";

export type ProxySession = {
  id: string;
  toolSlug: string;
  upstream: string;
  cookieHeader: string;
  userId: string;
  expiresAt: number;
};

const sessions = new Map<string, ProxySession>();

export function createProxySession(session: Omit<ProxySession, "expiresAt">) {
  const full: ProxySession = {
    ...session,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000,
  };
  sessions.set(session.id, full);
  return full;
}

export function getProxySession(id: string | undefined): ProxySession | null {
  if (!id) return null;
  const session = sessions.get(id);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(id);
    return null;
  }
  return session;
}

export function buildCookieHeader(cookieDataEnc: string): string {
  return decryptCookiesToHeader(cookieDataEnc);
}

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: true,
  xfwd: true,
});

proxy.on("proxyRes", (proxyRes) => {
  const headers = proxyRes.headers;
  delete headers["set-cookie"];
  delete headers["content-security-policy"];
  delete headers["x-frame-options"];
});

export function proxyRequest(
  req: IncomingMessage,
  res: ServerResponse,
  session: ProxySession,
  targetPath: string
) {
  const upstream = new URL(session.upstream);
  const target = `${upstream.origin}${targetPath}${req.url?.includes("?") ? "?" + req.url.split("?")[1] : ""}`;

  req.headers.cookie = session.cookieHeader;
  req.headers.host = upstream.host;
  delete req.headers["accept-encoding"];

  proxy.web(req, res, { target, changeOrigin: true }, (err) => {
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end(`Proxy error: ${err?.message ?? "unknown"}`);
    }
  });
}

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (session.expiresAt < now) sessions.delete(id);
  }
}, 5 * 60 * 1000);
