import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserSubscription } from "@/lib/data/tools";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SubscriptionSummaryCard } from "@/components/dashboard/SubscriptionSummaryCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  const subscription = await getUserSubscription(session!.user.id);
  const hasActiveSubscription =
    subscription && subscription.status === "ACTIVE";

  return (
    <DashboardShell
      variant="user"
      pageTitle="Your subscription"
      pageSubtitle="Plan status and included tools"
    >
      {!hasActiveSubscription ? (
        <div className="dashboard-panel-modern mx-auto max-w-lg px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
            <MaterialIcon name="card_membership" className="text-3xl text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">
            No active subscription
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
            You don&apos;t have an active plan yet. Your admin can assign tools
            directly from the admin panel.
          </p>
        </div>
      ) : (
        <SubscriptionSummaryCard
          planName={subscription.plan?.name ?? "No plan assigned"}
          toolNames={
            subscription.plan?.tools.map((t) => t.tool.name) ?? []
          }
          startedAt={subscription.startedAt}
          expiryDate={subscription.expiresAt}
          status={subscription.status}
          pricePkr={subscription.plan?.pricePkr ?? 0}
          notes={subscription.notes}
        />
      )}
    </DashboardShell>
  );
}
