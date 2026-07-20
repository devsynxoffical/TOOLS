import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import { mockStore } from "@/lib/mock/store";
import { prisma } from "@/lib/prisma";
import {
  isSessionServiceConfigured,
  requestToolLaunch,
} from "@/lib/session-service/client";
import { expireStaleAccessRecords } from "@/lib/access/maintenance";
import {
  createExtensionClaimToken,
  pickLaunchAccount,
} from "@/lib/auth/extension-launch";

type RouteParams = { params: { slug: string } };

async function verifyToolAccess(userId: string, slug: string) {
  await expireStaleAccessRecords();

  if (isMockMode()) {
    const tool = mockStore.tools.find((t) => t.slug === slug && t.active);
    if (!tool) return { ok: false as const, error: "Tool not found", status: 404 };

    const access = mockStore.toolAccess.find(
      (a) =>
        a.userId === userId &&
        a.toolId === tool.id &&
        a.status === "ACTIVE" &&
        (!a.expiresAt || a.expiresAt > new Date())
    );
    if (!access) {
      return { ok: false as const, error: "You do not have access to this tool", status: 403 };
    }
    return { ok: true as const, tool };
  }

  const tool = await prisma.tool.findUnique({ where: { slug } });
  if (!tool || !tool.active) {
    return { ok: false as const, error: "Tool not found", status: 404 };
  }

  const access = await prisma.userToolAccess.findUnique({
    where: { userId_toolId: { userId, toolId: tool.id } },
  });

  if (
    !access ||
    access.status !== "ACTIVE" ||
    (access.expiresAt && access.expiresAt < new Date())
  ) {
    return { ok: false as const, error: "You do not have access to this tool", status: 403 };
  }

  return { ok: true as const, tool };
}

function wantsJson(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("format") === "json") return true;
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("application/json");
}

function successResponse(launchUrl: string, asJson: boolean) {
  if (asJson) {
    return NextResponse.json({ mode: "PROXY", launchUrl });
  }
  return NextResponse.redirect(launchUrl);
}

export async function GET(request: Request, { params }: RouteParams) {
  const asJson = wantsJson(request);
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.status === "SUSPENDED") {
    return NextResponse.json(
      { error: "Your account is suspended" },
      { status: 403 }
    );
  }

  const check = await verifyToolAccess(session.user.id, params.slug);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { tool } = check;
  const launchMode =
    "launchMode" in tool && tool.launchMode
      ? (tool.launchMode as "PROXY" | "EXTENSION" | "DIRECT")
      : "PROXY";

  if (!tool.launchUrl) {
    return NextResponse.json(
      { error: "This tool does not have a launch URL configured yet" },
      { status: 503 }
    );
  }

  if (launchMode === "DIRECT") {
    if (asJson) {
      return NextResponse.json({ mode: "DIRECT", launchUrl: tool.launchUrl });
    }
    return NextResponse.redirect(tool.launchUrl);
  }

  if (launchMode === "EXTENSION") {
    if (isMockMode()) {
      return NextResponse.json(
        {
          error:
            "Extension launch requires the live database. Disable mock mode.",
        },
        { status: 503 }
      );
    }

    const account = await pickLaunchAccount(tool.id);
    if (!account) {
      return NextResponse.json(
        {
          error:
            "No active tool account with valid cookies. Admin must add cookies and Test session.",
        },
        { status: 503 }
      );
    }

    const claim = await createExtensionClaimToken({
      userId: session.user.id,
      toolId: tool.id,
      toolAccountId: account.id,
    });

    return NextResponse.json({
      mode: "EXTENSION",
      claimToken: claim.token,
      openUrl: tool.launchUrl,
      expiresAt: claim.expiresAt.toISOString(),
      installHint:
        "Install the Rankmora Tool Launcher Chrome extension, then click Launch again.",
    });
  }

  // PROXY mode
  if (!isSessionServiceConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Session service is not configured. Tool launch is unavailable until SESSION_SERVICE_* env vars are set.",
        },
        { status: 503 }
      );
    }

    if (isMockMode()) {
      const hasAccount = mockStore.toolAccounts.some(
        (a) => a.toolId === tool.id && a.active
      );
      if (!hasAccount) {
        return NextResponse.json(
          {
            error:
              "No tool account configured. Admin must add cookies under Admin → Tools → Accounts.",
          },
          { status: 503 }
        );
      }
    }

    return successResponse(tool.launchUrl, asJson);
  }

  try {
    const result = await requestToolLaunch({
      userId: session.user.id,
      toolSlug: params.slug,
      userEmail: session.user.email ?? undefined,
    });
    return successResponse(result.launchUrl, asJson);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to launch tool session";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
