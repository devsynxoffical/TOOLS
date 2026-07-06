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

type RouteParams = { params: { slug: string } };

async function verifyToolAccess(userId: string, slug: string) {
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

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = await verifyToolAccess(session.user.id, params.slug);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { tool } = check;

  if (!tool.launchUrl) {
    return NextResponse.json(
      { error: "This tool does not have a launch URL configured yet" },
      { status: 503 }
    );
  }

  if (!isSessionServiceConfigured()) {
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
    return NextResponse.redirect(tool.launchUrl);
  }

  try {
    const result = await requestToolLaunch({
      userId: session.user.id,
      toolSlug: params.slug,
      userEmail: session.user.email ?? undefined,
    });
    return NextResponse.redirect(result.launchUrl);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to launch tool session";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
