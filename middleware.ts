import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

  // Fallback when ADMIN_HOST is unset: treat admin.<domain> as the admin portal
  return host.startsWith("admin.");
}

function adminBaseUrl(req: NextRequest): string {
  const configured = getConfiguredAdminHost();
  const host = normalizeHost(req.headers.get("host"));
  const adminHost = configured ?? (host?.startsWith("admin.") ? host : null);
  if (!adminHost) return req.nextUrl.origin;
  const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  return `${proto}://${adminHost}`;
}

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const onAdminSite = isOnAdminSite(req);
    const configuredAdminHost = getConfiguredAdminHost();

    if (path === "/admin/login") {
      if (token?.role === "ADMIN") {
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

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (token?.status === "SUSPENDED") {
      return NextResponse.redirect(new URL("/account-suspended", req.url));
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
