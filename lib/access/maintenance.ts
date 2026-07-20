import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/config";
import { mockStore } from "@/lib/mock/store";

/** Mark expired access and subscriptions so UI and launch checks stay accurate. */
export async function expireStaleAccessRecords() {
  const now = new Date();

  if (isMockMode()) {
    for (const access of mockStore.toolAccess) {
      if (
        access.status === "ACTIVE" &&
        access.expiresAt &&
        access.expiresAt < now
      ) {
        access.status = "EXPIRED";
      }
    }
    for (const sub of mockStore.subscriptions) {
      if (
        sub.status === "ACTIVE" &&
        sub.expiresAt &&
        sub.expiresAt < now
      ) {
        sub.status = "EXPIRED";
      }
    }
    return;
  }

  const expiringAccess = await prisma.userToolAccess.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: now },
    },
    select: { userId: true, toolId: true },
  });

  await Promise.all([
    prisma.userToolAccess.updateMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lt: now },
      },
      data: { status: "EXPIRED" },
    }),
    prisma.subscription.updateMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lt: now },
      },
      data: { status: "EXPIRED" },
    }),
  ]);

  if (expiringAccess.length > 0) {
    const {
      isSessionServiceConfigured,
      revokeProxySessions,
    } = await import("@/lib/session-service/client");

    if (isSessionServiceConfigured()) {
      await Promise.all(
        expiringAccess.map((row) =>
          revokeProxySessions({ userId: row.userId, toolId: row.toolId })
        )
      );
    } else {
      await Promise.all(
        expiringAccess.map((row) =>
          prisma.proxySession.updateMany({
            where: {
              userId: row.userId,
              toolId: row.toolId,
              revokedAt: null,
            },
            data: { revokedAt: now },
          })
        )
      );
    }
  }

  await prisma.proxySession.updateMany({
    where: {
      revokedAt: null,
      expiresAt: { lt: now },
    },
    data: { revokedAt: now },
  });
}
