import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function pickToolAccount(toolId: string) {
  const accounts = await prisma.toolAccount.findMany({
    where: { toolId, active: true },
    orderBy: { createdAt: "asc" },
  });

  if (accounts.length === 0) return null;

  const windowStart = new Date(Date.now() - 30 * 60 * 1000);

  for (const account of accounts) {
    const activeSessions = await prisma.toolLaunchLog.count({
      where: {
        toolAccountId: account.id,
        createdAt: { gte: windowStart },
      },
    });
    if (activeSessions < account.maxConcurrentUsers) {
      return account;
    }
  }

  return accounts[0];
}

export async function createLaunchToken(params: {
  userId: string;
  toolId: string;
  toolAccountId: string;
  token: string;
  expiresAt: Date;
}) {
  return prisma.launchToken.create({ data: params });
}

export async function consumeLaunchToken(token: string) {
  const row = await prisma.launchToken.findUnique({ where: { token } });
  if (!row) return null;
  if (row.usedAt) return null;
  if (row.expiresAt < new Date()) return null;

  await prisma.launchToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });

  return row;
}

export async function logLaunch(params: {
  userId: string;
  toolId: string;
  toolAccountId: string;
}) {
  return prisma.toolLaunchLog.create({ data: params });
}

export async function cleanupExpiredTokens() {
  await prisma.launchToken.deleteMany({
    where: { expiresAt: { lt: new Date(Date.now() - 60 * 60 * 1000) } },
  });
}
