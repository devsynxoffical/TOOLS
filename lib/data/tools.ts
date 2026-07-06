import { AccessStatus, SubStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/config";
import { mockStore } from "@/lib/mock/store";

export async function getAllTools() {
  if (isMockMode()) {
    return [...mockStore.tools];
  }
  return prisma.tool.findMany({ orderBy: { name: "asc" } });
}

export async function getActiveToolsForPricing() {
  if (isMockMode()) {
    return [...mockStore.tools]
      .filter((t) => t.active && t.pricePkr > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return prisma.tool.findMany({
    where: { active: true, pricePkr: { gt: 0 } },
    orderBy: { name: "asc" },
  });
}

export async function getToolBySlug(slug: string) {
  if (isMockMode()) {
    return mockStore.tools.find((t) => t.slug === slug) ?? null;
  }

  return prisma.tool.findUnique({ where: { slug } });
}

export async function getUserToolAccess(userId: string) {
  if (isMockMode()) {
    return mockStore.toolAccess
      .filter((a) => a.userId === userId)
      .map((a) => ({
        ...a,
        tool: mockStore.tools.find((t) => t.id === a.toolId)!,
      }));
  }

  return prisma.userToolAccess.findMany({
    where: { userId },
    include: { tool: true },
    orderBy: { grantedAt: "desc" },
  });
}

export type UserSubscriptionView = {
  id: string;
  status: SubStatus;
  startedAt: Date | null;
  expiresAt: Date | null;
  notes: string | null;
  plan: {
    id: string;
    name: string;
    pricePkr: number;
    durationDays: number;
    tools: { tool: { id: string; name: string; slug: string } }[];
  } | null;
};

export async function getUserSubscription(
  userId: string
): Promise<UserSubscriptionView | null> {
  if (isMockMode()) {
    const sub = [...mockStore.subscriptions]
      .filter((s) => s.userId === userId && s.status !== "CANCELED")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (!sub) return null;

    const plan = sub.planId
      ? mockStore.plans.find((p) => p.id === sub.planId)
      : null;

    return {
      id: sub.id,
      status: sub.status,
      startedAt: sub.startedAt,
      expiresAt: sub.expiresAt,
      notes: sub.notes,
      plan: plan
        ? {
            id: plan.id,
            name: plan.name,
            pricePkr: plan.pricePkr,
            durationDays: plan.durationDays,
            tools: plan.toolIds.map((toolId) => ({
              tool: mockStore.tools.find((t) => t.id === toolId)!,
            })),
          }
        : null,
    };
  }

  const sub = await prisma.subscription.findFirst({
    where: { userId, status: { not: "CANCELED" } },
    orderBy: { createdAt: "desc" },
    include: {
      plan: { include: { tools: { include: { tool: true } } } },
    },
  });

  if (!sub) return null;

  return {
    id: sub.id,
    status: sub.status,
    startedAt: sub.startedAt,
    expiresAt: sub.expiresAt,
    notes: sub.notes,
    plan: sub.plan
      ? {
          id: sub.plan.id,
          name: sub.plan.name,
          pricePkr: sub.plan.pricePkr,
          durationDays: sub.plan.durationDays,
          tools: sub.plan.tools,
        }
      : null,
  };
}

export async function getAllSubscriptions() {
  if (isMockMode()) {
    return mockStore.subscriptions
      .map((sub) => {
        const user = mockStore.users.find((u) => u.id === sub.userId)!;
        const plan = sub.planId
          ? mockStore.plans.find((p) => p.id === sub.planId)
          : null;
        return { ...sub, user, plan };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return prisma.subscription.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      plan: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export type ToolAccessWithTool = {
  id: string;
  status: AccessStatus;
  grantedAt: Date;
  expiresAt: Date | null;
  source: string;
  tool: { id: string; name: string; slug: string; description: string | null };
};
