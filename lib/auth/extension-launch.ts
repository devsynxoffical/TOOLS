import { createHash, randomBytes } from "crypto";
import {
  decryptCookieData,
  parseCookieJson,
  type StoredCookie,
} from "@/lib/crypto/cookies";
import { prisma } from "@/lib/prisma";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function pickLaunchAccount(toolId: string) {
  const accounts = await prisma.toolAccount.findMany({
    where: {
      toolId,
      active: true,
      healthStatus: { not: "EXPIRED" },
    },
    orderBy: { createdAt: "asc" },
  });
  return accounts[0] ?? null;
}

export async function createExtensionClaimToken(params: {
  userId: string;
  toolId: string;
  toolAccountId: string;
}) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  await prisma.launchToken.create({
    data: {
      tokenHash: hashToken(token),
      userId: params.userId,
      toolId: params.toolId,
      toolAccountId: params.toolAccountId,
      expiresAt,
    },
  });
  await prisma.toolLaunchLog.create({
    data: {
      userId: params.userId,
      toolId: params.toolId,
      toolAccountId: params.toolAccountId,
    },
  });
  return { token, expiresAt };
}

export async function claimExtensionLaunch(token: string): Promise<{
  openUrl: string;
  cookies: StoredCookie[];
  toolName: string;
} | null> {
  const tokenHash = hashToken(token);
  const now = new Date();
  const updated = await prisma.launchToken.updateMany({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    data: { usedAt: now },
  });
  if (updated.count === 0) return null;

  const row = await prisma.launchToken.findUnique({ where: { tokenHash } });
  if (!row) return null;

  const [tool, account, user] = await Promise.all([
    prisma.tool.findUnique({ where: { id: row.toolId } }),
    prisma.toolAccount.findUnique({ where: { id: row.toolAccountId } }),
    prisma.user.findUnique({
      where: { id: row.userId },
      select: { status: true },
    }),
  ]);

  if (!tool?.launchUrl || !account?.active || !user || user.status === "SUSPENDED" || user.status === "LOCKED") {
    return null;
  }

  const access = await prisma.userToolAccess.findUnique({
    where: { userId_toolId: { userId: row.userId, toolId: tool.id } },
  });
  if (
    !access ||
    access.status !== "ACTIVE" ||
    (access.expiresAt && access.expiresAt < now)
  ) {
    return null;
  }

  const cookies = parseCookieJson(decryptCookieData(account.cookieDataEnc));
  return {
    openUrl: tool.launchUrl,
    cookies,
    toolName: tool.name,
  };
}
