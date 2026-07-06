import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserSubscription } from "@/lib/data/tools";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubscriptionSummaryCard } from "@/components/dashboard/SubscriptionSummaryCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconPackage } from "@/components/ui/icons";

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  const subscription = await getUserSubscription(session!.user.id);

  return (
    <DashboardShell variant="user">
      <PageHeader
        title="My subscription"
        description="Your plan, status, and included tools — managed by your administrator."
      />

      {!subscription ? (
        <EmptyState
          icon={<IconPackage className="h-6 w-6" />}
          title="No subscription yet"
          description="Your administrator will create your account and activate a plan after payment is confirmed offline."
        />
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
