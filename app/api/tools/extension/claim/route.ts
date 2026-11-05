import { NextResponse } from "next/server";
import { claimExtensionLaunch } from "@/lib/auth/extension-launch";

export const MIN_EXTENSION_VERSION = "1.4.1";

export function compareSemver(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

/**
 * One-time claim for the Rankmora browser extension.
 * The token is the secret — no session cookie required.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const version = typeof body.version === "string" ? body.version.trim() : "";

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  // Reject outdated extensions (previous versions no longer work)
  if (!version || compareSemver(version, MIN_EXTENSION_VERSION) < 0) {
    return NextResponse.json(
      {
        error: `Your Rankmora Tool Launcher extension (${version || "outdated"}) must be updated to version ${MIN_EXTENSION_VERSION} to launch tools securely.`,
        code: "EXTENSION_UPDATE_REQUIRED",
        requiredVersion: MIN_EXTENSION_VERSION,
        installedVersion: version || "unknown",
      },
      { status: 426 }
    );
  }

  const result = await claimExtensionLaunch(token);
  if (!result) {
    return NextResponse.json(
      {
        error:
          "Launch link expired or invalid. Click Launch again from the dashboard.",
      },
      { status: 410 }
    );
  }

  return NextResponse.json({
    openUrl: result.openUrl,
    toolName: result.toolName,
    cookies: result.cookies.map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path || "/",
      secure: c.secure !== false,
      httpOnly: Boolean(c.httpOnly),
      sameSite: normalizeSameSite(c.sameSite),
      ...(c.expirationDate ? { expirationDate: c.expirationDate } : {}),
    })),
  });
}

function normalizeSameSite(
  value?: string
): "no_restriction" | "lax" | "strict" | "unspecified" {
  const v = (value || "").toLowerCase();
  if (v === "no_restriction" || v === "none") return "no_restriction";
  if (v === "lax") return "lax";
  if (v === "strict") return "strict";
  return "unspecified";
}
