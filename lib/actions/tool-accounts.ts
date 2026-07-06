"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encryptCookiesFromJson } from "@/lib/crypto/cookies";
import { isMockMode } from "@/lib/config";
import { mockId, mockStore } from "@/lib/mock/store";
import { prisma } from "@/lib/prisma";

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

  let cookieDataEnc: string;
  if (data.id && !data.cookieJson.trim()) {
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
        lastVerifiedAt: new Date(),
      });
    } else {
      mockStore.toolAccounts.push({
        id: mockId("tacc"),
        toolId: data.toolId,
        label,
        cookieDataEnc,
        maxConcurrentUsers: data.maxConcurrentUsers,
        active: data.active,
        lastVerifiedAt: new Date(),
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
        lastVerifiedAt: new Date(),
      },
    });
  } else {
    await prisma.toolAccount.create({
      data: {
        toolId: data.toolId,
        label,
        cookieDataEnc,
        maxConcurrentUsers: data.maxConcurrentUsers,
        active: data.active,
        notes: data.notes.trim() || null,
        lastVerifiedAt: new Date(),
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
  revalidatePath(`/admin/tools/${toolId}/accounts`);
  return { active: updated.active };
}
