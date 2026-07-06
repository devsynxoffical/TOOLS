import { decryptCookieData, parseCookieJson } from "@/lib/crypto/cookies";
import { isMockMode } from "@/lib/config";
import { mockStore } from "@/lib/mock/store";
import { prisma } from "@/lib/prisma";

export type ToolAccountView = {
  id: string;
  toolId: string;
  label: string;
  maxConcurrentUsers: number;
  active: boolean;
  lastVerifiedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  cookieCount?: number;
};

export async function getToolAccounts(toolId: string): Promise<ToolAccountView[]> {
  if (isMockMode()) {
    return mockStore.toolAccounts
      .filter((a) => a.toolId === toolId)
      .map(({ cookieDataEnc, ...rest }) => ({
        ...rest,
        cookieCount: safeCookieCount(cookieDataEnc),
      }));
  }

  const rows = await prisma.toolAccount.findMany({
    where: { toolId },
    orderBy: { createdAt: "asc" },
  });

  return rows.map(({ cookieDataEnc, ...rest }) => ({
    ...rest,
    cookieCount: safeCookieCount(cookieDataEnc),
  }));
}

function safeCookieCount(enc: string): number {
  try {
    return parseCookieJson(decryptCookieData(enc)).length;
  } catch {
    return 0;
  }
}

export async function getActiveAccountCount(toolId: string): Promise<number> {
  if (isMockMode()) {
    return mockStore.toolAccounts.filter((a) => a.toolId === toolId && a.active)
      .length;
  }
  return prisma.toolAccount.count({ where: { toolId, active: true } });
}
