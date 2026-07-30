import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  authStrictIpEnabled,
  authStrictIpForAdmin,
  getClientIp,
  ipsMatch,
} from "@/lib/auth/session-security";

function normalizeHost(host: string | null): string | null {
  if (!host) return null;
  return host.split(":")[0].toLowerCase();
}

function getConfiguredAdminHost(): string | null {
  const host = process.env.ADMIN_HOST?.trim();
  return host ? host.toLowerCase() : null;
}

function isOnAdminSite(req: NextRequest): boolean {
  const host = normalizeHost(req.headers.get("host"));
  if (!host) return false;

  const configured = getConfiguredAdminHost();
  if (configured) return host === configured;

  return host.startsWith("admin.");
}

function adminBaseUrl(req: NextRequest): string {
  const configured = getConfiguredAdminHost();
  const host = normalizeHost(req.headers.get("host"));
  const adminHost = configured ?? (host?.startsWith("admin.") ? host : null);
  if (!adminHost) return req.nextUrl.origin;
  const proto =
    req.headers.get("x-forwarded-proto") ??
    req.nextUrl.protocol.replace(":", "");
  return `${proto}://${adminHost}`;
}

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

function forceReLogin(req: NextRequest, reason: string) {
  const loginPath = isOnAdminSite(req) ? "/admin/login" : "/login";
  const url = new URL(loginPath, req.url);
  url.searchParams.set("error", reason);
  const res = NextResponse.redirect(url);
  // Drop session cookies so the dead JWT cannot bounce the user back in.
  const secure = process.env.NODE_ENV === "production";
  const names = secure
    ? [
        "__Secure-next-auth.session-token",
        "next-auth.session-token",
        "__Secure-next-auth.callback-url",
        "next-auth.callback-url",
      ]
    : ["next-auth.session-token", "next-auth.callback-url"];
  for (const name of names) {
    res.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return res;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const onAdminSite = isOnAdminSite(req);
    const configuredAdminHost = getConfiguredAdminHost();

    if (path === "/admin/login") {
      if (token?.role === "ADMIN" && !token.error) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    if (configuredAdminHost && !onAdminSite && path.startsWith("/admin")) {
      const target = new URL(path + req.nextUrl.search, adminBaseUrl(req));
      return NextResponse.redirect(target);
    }

    if (onAdminSite) {
      const allowed =
        path.startsWith("/admin") ||
        path.startsWith("/api") ||
        path === "/signout" ||
        path.startsWith("/account-suspended");

      if (!allowed) {
        if (path === "/" || path === "/login" || path === "/signup") {
          return NextResponse.redirect(new URL("/admin/login", req.url));
        }
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      if (path === "/") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    const isProtected =
      path.startsWith("/dashboard") || path.startsWith("/admin");

    if (isProtected && token) {
      if (
        token.error === "SessionSuperseded" ||
        token.error === "SessionInvalid"
      ) {
        return forceReLogin(
          req,
          token.error === "SessionSuperseded" ? "sessionTaken" : "sessionExpired"
        );
      }

    if (token.status === "SUSPENDED" || token.status === "LOCKED") {
        return NextResponse.redirect(new URL("/account-suspended", req.url));
      }

      if (path.startsWith("/admin") && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Same account + different IP mid-session → block (anti account-sharing).
      const enforceIp =
        authStrictIpEnabled() &&
        (token.role !== "ADMIN" || authStrictIpForAdmin());
      if (enforceIp && typeof token.loginIp === "string" && token.loginIp) {
        const currentIp = getClientIp(req.headers);
        if (currentIp && !ipsMatch(token.loginIp, currentIp)) {
          return forceReLogin(req, "ipChanged");
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (PUBLIC_ADMIN_PATHS.includes(path)) {
          return true;
        }

        if (
          path === "/login" ||
          path === "/signup" ||
          path === "/forgot-password" ||
          path === "/reset-password" ||
          path === "/signout" ||
          path === "/account-suspended"
        ) {
          return true;
        }

        if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
          // Allow through so middleware can clear cookie + show a clear reason.
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/signout",
    "/account-suspended",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
