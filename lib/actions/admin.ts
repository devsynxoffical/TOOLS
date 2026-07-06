"use server";

import { AccessSource } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import { mockId, mockStore } from "@/lib/mock/store";
import { isDemoAccountEmail } from "@/lib/demo-accounts";
import { prisma } from "@/lib/prisma";
import { getCatalogEntry, slugifyToolName } from "@/lib/tools/catalog";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

function syncMockPlanToolAccess(
  userId: string,
  planId: string,
  expiresAt: Date,
  source: AccessSource = "PLAN"
) {
  const plan = mockStore.plans.find((p) => p.id === planId);
  if (!plan) return;

  for (const toolId of plan.toolIds) {
    const existing = mockStore.toolAccess.find(
      (a) => a.userId === userId && a.toolId === toolId
    );
    if (existing) {
      existing.status = "ACTIVE";
      existing.source = source;
      existing.grantedAt = new Date();
      existing.expiresAt = expiresAt;
    } else {
      mockStore.toolAccess.push({
        id: mockId("access"),
        userId,
        toolId,
        status: "ACTIVE",
        grantedAt: new Date(),
        expiresAt,
        source,
      });
    }
  }
}

function revokeMockPlanToolAccess(userId: string, planId: string) {
  const plan = mockStore.plans.find((p) => p.id === planId);
  if (!plan) return;

  for (const toolId of plan.toolIds) {
    const access = mockStore.toolAccess.find(
      (a) =>
        a.userId === userId &&
        a.toolId === toolId &&
        a.source === "PLAN"
    );
    if (access) access.status = "REVOKED";
  }
}

export async function activateSubscription(
  userId: string,
  planId: string,
  expiresAtISO: string,
  notes?: string
) {
  await requireAdmin();

  const expiresAt = new Date(expiresAtISO);
  if (Number.isNaN(expiresAt.getTime())) {
    throw new Error("Invalid expiry date");
  }

  if (isMockMode()) {
    const plan = mockStore.plans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    let sub = mockStore.subscriptions
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (!sub) {
      sub = {
        id: mockId("sub"),
        userId,
        planId,
        status: "PENDING",
        startedAt: null,
        expiresAt: null,
        createdAt: new Date(),
        notes: null,
      };
      mockStore.subscriptions.push(sub);
    }

    sub.planId = planId;
    sub.status = "ACTIVE";
    sub.startedAt = new Date();
    sub.expiresAt = expiresAt;
    sub.notes = notes?.trim() || sub.notes;

    syncMockPlanToolAccess(userId, planId, expiresAt);

    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/users");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/subscription");
    return { success: true };
  }

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: { tools: true },
  });
  if (!plan) throw new Error("Plan not found");

  const existing = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const startedAt = new Date();
  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        planId,
        status: "ACTIVE",
        startedAt,
        expiresAt,
        notes: notes?.trim() || existing.notes,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: "ACTIVE",
        startedAt,
        expiresAt,
        notes: notes?.trim() || null,
      },
    });
  }

  for (const { toolId } of plan.tools) {
    await prisma.userToolAccess.upsert({
      where: { userId_toolId: { userId, toolId } },
      update: {
        status: "ACTIVE",
        source: "PLAN",
        grantedAt: startedAt,
        expiresAt,
      },
      create: {
        userId,
        toolId,
        status: "ACTIVE",
        source: "PLAN",
        grantedAt: startedAt,
        expiresAt,
      },
    });
  }

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/subscription");
  return { success: true };
}

export async function cancelSubscription(userId: string, subscriptionId: string) {
  await requireAdmin();

  if (isMockMode()) {
    const sub = mockStore.subscriptions.find(
      (s) => s.id === subscriptionId && s.userId === userId
    );
    if (!sub) throw new Error("Subscription not found");

    sub.status = "CANCELED";
    if (sub.planId) {
      revokeMockPlanToolAccess(userId, sub.planId);
    }

    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/subscription");
    return { success: true };
  }

  const sub = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId },
    include: { plan: { include: { tools: true } } },
  });
  if (!sub) throw new Error("Subscription not found");

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: "CANCELED" },
  });

  if (sub.plan) {
    for (const { toolId } of sub.plan.tools) {
      await prisma.userToolAccess.updateMany({
        where: { userId, toolId, source: "PLAN" },
        data: { status: "REVOKED" },
      });
    }
  }

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/subscription");
  return { success: true };
}

export async function toggleUserStatus(userId: string) {
  await requireAdmin();

  if (isMockMode()) {
    const user = mockStore.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    if (user.status === "ACTIVE" && isDemoAccountEmail(user.email)) {
      throw new Error("Demo accounts cannot be suspended.");
    }
    user.status = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { status: user.status };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  if (user.status === "ACTIVE" && isDemoAccountEmail(user.email)) {
    throw new Error("Demo accounts cannot be suspended.");
  }
  const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { status: newStatus };
}

export async function grantToolAccess(userId: string, toolId: string) {
  await requireAdmin();

  if (isMockMode()) {
    const existing = mockStore.toolAccess.find(
      (a) => a.userId === userId && a.toolId === toolId
    );
    if (existing) {
      existing.status = "ACTIVE";
      existing.source = "MANUAL";
      existing.grantedAt = new Date();
      existing.expiresAt = null;
    } else {
      mockStore.toolAccess.push({
        id: mockId("access"),
        userId,
        toolId,
        status: "ACTIVE",
        grantedAt: new Date(),
        expiresAt: null,
        source: "MANUAL",
      });
    }
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/dashboard");
    return { success: true };
  }

  await prisma.userToolAccess.upsert({
    where: { userId_toolId: { userId, toolId } },
    update: {
      status: "ACTIVE",
      source: "MANUAL",
      grantedAt: new Date(),
      expiresAt: null,
    },
    create: { userId, toolId, status: "ACTIVE", source: "MANUAL" },
  });
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function revokeToolAccess(userId: string, toolId: string) {
  await requireAdmin();

  if (isMockMode()) {
    const access = mockStore.toolAccess.find(
      (a) => a.userId === userId && a.toolId === toolId
    );
    if (access) access.status = "REVOKED";
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/dashboard");
    return { success: true };
  }

  await prisma.userToolAccess.updateMany({
    where: { userId, toolId },
    data: { status: "REVOKED" },
  });
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function savePlan(data: {
  id?: string;
  name: string;
  description: string;
  pricePkr: number;
  durationDays: number;
  active: boolean;
  toolIds: string[];
}) {
  await requireAdmin();

  if (isMockMode()) {
    if (data.id) {
      const plan = mockStore.plans.find((p) => p.id === data.id);
      if (!plan) throw new Error("Plan not found");
      plan.name = data.name;
      plan.description = data.description || null;
      plan.pricePkr = data.pricePkr;
      plan.durationDays = data.durationDays;
      plan.active = data.active;
      plan.toolIds = data.toolIds;
    } else {
      mockStore.plans.push({
        id: mockId("plan"),
        name: data.name,
        description: data.description || null,
        pricePkr: data.pricePkr,
        durationDays: data.durationDays,
        active: data.active,
        toolIds: data.toolIds,
      });
    }
    revalidatePath("/admin/plans");
    revalidatePath("/pricing");
    return { success: true };
  }

  if (data.id) {
    await prisma.planTool.deleteMany({ where: { planId: data.id } });
    await prisma.plan.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description || null,
        pricePkr: data.pricePkr,
        durationDays: data.durationDays,
        active: data.active,
        tools: {
          create: data.toolIds.map((toolId) => ({ toolId })),
        },
      },
    });
  } else {
    await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description || null,
        pricePkr: data.pricePkr,
        durationDays: data.durationDays,
        active: data.active,
        tools: { create: data.toolIds.map((toolId) => ({ toolId })) },
      },
    });
  }
  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  return { success: true };
}

export async function integrateCatalogTools(slugs: string[]) {
  await requireAdmin();

  if (slugs.length === 0) {
    throw new Error("Select at least one tool to integrate");
  }

  const added: string[] = [];
  const skipped: string[] = [];

  for (const slug of slugs) {
    const entry = getCatalogEntry(slug);
    if (!entry) continue;

    if (isMockMode()) {
      const exists = mockStore.tools.some((t) => t.slug === slug);
      if (exists) {
        skipped.push(entry.name);
        continue;
      }
      mockStore.tools.push({
        id: mockId("tool"),
        name: entry.name,
        slug: entry.slug,
        description: entry.description,
        iconUrl: null,
        pricePkr: 0,
        accessDurationDays: 30,
        launchUrl: null,
        active: true,
      });
      added.push(entry.name);
      continue;
    }

    const exists = await prisma.tool.findUnique({ where: { slug } });
    if (exists) {
      skipped.push(entry.name);
      continue;
    }
    await prisma.tool.create({
      data: {
        name: entry.name,
        slug: entry.slug,
        description: entry.description,
        iconUrl: null,
        pricePkr: 0,
        accessDurationDays: 30,
        active: true,
      },
    });
    added.push(entry.name);
  }

  revalidatePath("/admin/tools");
  revalidatePath("/admin/plans");
  revalidatePath("/pricing");

  return { added, skipped };
}

export async function saveTool(data: {
  id?: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  pricePkr?: number;
  accessDurationDays?: number;
  launchUrl?: string;
  active?: boolean;
}) {
  await requireAdmin();

  if (isMockMode()) {
    if (data.id) {
      const tool = mockStore.tools.find((t) => t.id === data.id);
      if (!tool) throw new Error("Tool not found");
      tool.name = data.name;
      tool.slug = data.slug;
      tool.description = data.description || null;
      tool.iconUrl = data.iconUrl || null;
      if (data.pricePkr != null) tool.pricePkr = data.pricePkr;
      if (data.accessDurationDays != null) {
        tool.accessDurationDays = data.accessDurationDays;
      }
      if (data.launchUrl !== undefined) {
        tool.launchUrl = data.launchUrl.trim() || null;
      }
      if (data.active != null) tool.active = data.active;
    } else {
      const dup = mockStore.tools.some((t) => t.slug === data.slug);
      if (dup) throw new Error(`Tool slug "${data.slug}" already exists`);
      mockStore.tools.push({
        id: mockId("tool"),
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        iconUrl: data.iconUrl || null,
        pricePkr: data.pricePkr ?? 0,
        accessDurationDays: data.accessDurationDays ?? 30,
        launchUrl: data.launchUrl?.trim() || null,
        active: data.active ?? true,
      });
    }
    revalidatePath("/admin/tools");
    revalidatePath("/pricing");
    return { success: true };
  }

  if (data.id) {
    await prisma.tool.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        iconUrl: data.iconUrl || null,
        ...(data.pricePkr != null ? { pricePkr: data.pricePkr } : {}),
        ...(data.accessDurationDays != null
          ? { accessDurationDays: data.accessDurationDays }
          : {}),
        ...(data.launchUrl !== undefined
          ? { launchUrl: data.launchUrl.trim() || null }
          : {}),
        ...(data.active != null ? { active: data.active } : {}),
      },
    });
  } else {
    await prisma.tool.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        iconUrl: data.iconUrl || null,
        pricePkr: data.pricePkr ?? 0,
        accessDurationDays: data.accessDurationDays ?? 30,
        launchUrl: data.launchUrl?.trim() || null,
        active: data.active ?? true,
      },
    });
  }
  revalidatePath("/admin/tools");
  revalidatePath("/pricing");
  return { success: true };
}

export async function addCustomToolByName(name: string, description?: string) {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Tool name is required");

  const slug = slugifyToolName(trimmed);
  if (!slug) throw new Error("Invalid tool name");

  return saveTool({
    name: trimmed,
    slug,
    description: description?.trim() ?? "",
    iconUrl: "",
    pricePkr: 0,
    active: true,
  });
}

export async function addCustomToolsBulk(text: string) {
  await requireAdmin();
  const names = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (names.length === 0) throw new Error("Enter at least one tool name");

  const added: string[] = [];
  const skipped: string[] = [];

  for (const name of names) {
    try {
      await addCustomToolByName(name);
      added.push(name);
    } catch {
      skipped.push(name);
    }
  }

  revalidatePath("/admin/tools");
  return { added, skipped };
}

export async function submitUserToolRequest(toolIds: string[], note?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (toolIds.length === 0) {
    throw new Error("Select at least one tool");
  }

  if (isMockMode()) {
    mockStore.toolRequests.push({
      id: mockId("req"),
      userId: session.user.id,
      userName: session.user.name ?? "User",
      userEmail: session.user.email ?? "",
      toolIds,
      note: note?.trim() || null,
      status: "PENDING",
      createdAt: new Date(),
    });
    revalidatePath("/admin/tools");
    revalidatePath("/dashboard/request-tools");
    return { success: true };
  }

  await prisma.toolRequest.create({
    data: {
      userId: session.user.id,
      toolIds,
      note: note?.trim() || null,
    },
  });

  revalidatePath("/admin/tools");
  revalidatePath("/dashboard/request-tools");
  return { success: true };
}

export async function deleteTool(toolId: string) {
  await requireAdmin();

  if (isMockMode()) {
    const idx = mockStore.tools.findIndex((t) => t.id === toolId);
    if (idx >= 0) mockStore.tools.splice(idx, 1);
    mockStore.plans.forEach((p) => {
      p.toolIds = p.toolIds.filter((id) => id !== toolId);
    });
    revalidatePath("/admin/tools");
    return { success: true };
  }

  await prisma.tool.delete({ where: { id: toolId } });
  revalidatePath("/admin/tools");
  return { success: true };
}
