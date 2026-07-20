"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encryptCookiesFromJson } from "@/lib/crypto/cookies";
import { isMockMode } from "@/lib/config";
import { mockId, mockStore } from "@/lib/mock/store";
import { prisma } from "@/lib/prisma";
import {
  isSessionServiceConfigured,
  revokeProxySessions,
  testToolAccountSession,
  fetchAccountLoad,
} from "@/lib/session-service/client";
import { probeCookieSession } from "@/lib/tools/cookie-health";
import { decryptCookiesToHeader } from "@/lib/crypto/cookies";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function saveToolAccount(data: {
  id?: string;
  toolId: string;
  label: string;
  cookieJson: string;
  maxConcurrentUsers: number;
  active: boolean;
  notes: string;
}) {
  await requireAdmin();

  const label = data.label.trim();
  if (!label) throw new Error("Account label is required");

  const cookiesChanged = Boolean(data.cookieJson.trim());
  let cookieDataEnc: string;
  if (data.id && !cookiesChanged) {
    if (isMockMode()) {
      const existing = mockStore.toolAccounts.find((a) => a.id === data.id);
      if (!existing) throw new Error("Account not found");
      cookieDataEnc = existing.cookieDataEnc;
    } else {
      const existing = await prisma.toolAccount.findUnique({
        where: { id: data.id },
      });
      if (!existing) throw new Error("Account not found");
      cookieDataEnc = existing.cookieDataEnc;
    }
  } else {
    cookieDataEnc = encryptCookiesFromJson(data.cookieJson);
  }

  const healthReset = cookiesChanged
    ? {
        healthStatus: "UNKNOWN" as const,
        lastHealthCheckAt: null,
        lastHealthError: null,
      }
    : {};

  if (isMockMode()) {
    if (data.id) {
      const account = mockStore.toolAccounts.find((a) => a.id === data.id);
      if (!account) throw new Error("Account not found");
      Object.assign(account, {
        label,
        cookieDataEnc,
        maxConcurrentUsers: data.maxConcurrentUsers,
        active: data.active,
        notes: data.notes.trim() || null,
        ...healthReset,
        ...(cookiesChanged ? {} : {}),
      });
    } else {
      mockStore.toolAccounts.push({
        id: mockId("tacc"),
        toolId: data.toolId,
        label,
        cookieDataEnc,
        maxConcurrentUsers: data.maxConcurrentUsers,
        active: data.active,
        healthStatus: "UNKNOWN",
        lastHealthCheckAt: null,
        lastHealthError: null,
        lastVerifiedAt: null,
        notes: data.notes.trim() || null,
        createdAt: new Date(),
      });
    }
    revalidatePath(`/admin/tools/${data.toolId}/accounts`);
    return { success: true };
  }

  if (data.id) {
    await prisma.toolAccount.update({
      where: { id: data.id },
      data: {
        label,
        cookieDataEnc,
        maxConcurrentUsers: data.maxConcurrentUsers,
        active: data.active,
        notes: data.notes.trim() || null,
        ...healthReset,
      },
    });
    if (cookiesChanged) {
      await revokeProxySessions({ toolAccountId: data.id });
    }
  } else {
    await prisma.toolAccount.create({
      data: {
        toolId: data.toolId,
        label,
        cookieDataEnc,
        maxConcurrentUsers: data.maxConcurrentUsers,
        active: data.active,
        notes: data.notes.trim() || null,
        healthStatus: "UNKNOWN",
      },
    });
  }

  revalidatePath(`/admin/tools/${data.toolId}/accounts`);
  revalidatePath("/admin/tools");
  return { success: true };
}

export async function deleteToolAccount(id: string, toolId: string) {
  await requireAdmin();

  if (isMockMode()) {
    const idx = mockStore.toolAccounts.findIndex((a) => a.id === id);
    if (idx >= 0) mockStore.toolAccounts.splice(idx, 1);
    revalidatePath(`/admin/tools/${toolId}/accounts`);
    return { success: true };
  }

  await revokeProxySessions({ toolAccountId: id });
  await prisma.toolAccount.delete({ where: { id } });
  revalidatePath(`/admin/tools/${toolId}/accounts`);
  return { success: true };
}

export async function toggleToolAccountActive(id: string, toolId: string) {
  await requireAdmin();

  if (isMockMode()) {
    const account = mockStore.toolAccounts.find((a) => a.id === id);
    if (!account) throw new Error("Account not found");
    account.active = !account.active;
    revalidatePath(`/admin/tools/${toolId}/accounts`);
    return { active: account.active };
  }

  const account = await prisma.toolAccount.findUnique({ where: { id } });
  if (!account) throw new Error("Account not found");
  const updated = await prisma.toolAccount.update({
    where: { id },
    data: { active: !account.active },
  });
  if (!updated.active) {
    await revokeProxySessions({ toolAccountId: id });
  }
  revalidatePath(`/admin/tools/${toolId}/accounts`);
  return { active: updated.active };
}

export async function testToolAccount(id: string, toolId: string) {
  await requireAdmin();

  if (isMockMode()) {
    const account = mockStore.toolAccounts.find((a) => a.id === id);
    if (!account) throw new Error("Account not found");
    const tool = mockStore.tools.find((t) => t.id === toolId);
    if (!tool?.launchUrl) {
      throw new Error("Set a Launch URL on this tool before testing");
    }
    let cookieHeader: string;
    try {
      cookieHeader = decryptCookiesToHeader(account.cookieDataEnc);
    } catch {
      account.healthStatus = "UNKNOWN";
      account.lastHealthError = "Could not decrypt cookies";
      account.lastHealthCheckAt = new Date();
      return {
        healthStatus: "UNKNOWN" as const,
        message: "Could not decrypt cookies",
      };
    }
    const result = await probeCookieSession({
      launchUrl: tool.launchUrl,
      cookieHeader,
    });
    account.healthStatus = result.healthStatus;
    account.lastHealthCheckAt = new Date();
    account.lastHealthError =
      result.healthStatus === "ALIVE" ? null : result.message;
    revalidatePath(`/admin/tools/${toolId}/accounts`);
    return result;
  }

  if (isSessionServiceConfigured()) {
    const result = await testToolAccountSession(id);
    revalidatePath(`/admin/tools/${toolId}/accounts`);
    return result;
  }

  const account = await prisma.toolAccount.findUnique({
    where: { id },
    include: { tool: true },
  });
  if (!account || account.toolId !== toolId) {
    throw new Error("Account not found");
  }
  if (!account.tool.launchUrl) {
    throw new Error("Set a Launch URL on this tool before testing");
  }

  let cookieHeader: string;
  try {
    cookieHeader = decryptCookiesToHeader(account.cookieDataEnc);
  } catch {
    await prisma.toolAccount.update({
      where: { id },
      data: {
        healthStatus: "UNKNOWN",
        lastHealthCheckAt: new Date(),
        lastHealthError: "Could not decrypt cookies",
      },
    });
    return {
      healthStatus: "UNKNOWN" as const,
      message: "Could not decrypt cookies",
    };
  }

  const result = await probeCookieSession({
    launchUrl: account.tool.launchUrl,
    cookieHeader,
  });

  await prisma.toolAccount.update({
    where: { id },
    data: {
      healthStatus: result.healthStatus,
      lastHealthCheckAt: new Date(),
      lastHealthError: result.healthStatus === "ALIVE" ? null : result.message,
    },
  });

  revalidatePath(`/admin/tools/${toolId}/accounts`);
  return result;
}

export async function getToolAccountCapacity(toolId: string) {
  await requireAdmin();
  if (!isSessionServiceConfigured()) return [];
  try {
    return await fetchAccountLoad(toolId);
  } catch {
    return [];
  }
}
