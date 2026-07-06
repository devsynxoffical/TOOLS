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
}
