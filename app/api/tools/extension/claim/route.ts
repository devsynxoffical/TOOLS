import { NextResponse } from "next/server";
import { claimExtensionLaunch } from "@/lib/auth/extension-launch";

/**
 * One-time claim for the Rankmora browser extension.
 * The token is the secret — no session cookie required.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
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
