import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserToolAccess } from "@/lib/data/tools";
import { getUserDashboardStats } from "@/lib/data/dashboard";
import { ToolCard } from "@/components/dashboard/ToolCard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconPackage, IconTools } from "@/components/ui/icons";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [toolAccess, stats] = await Promise.all([
    getUserToolAccess(userId),
    getUserDashboardStats(userId),
  ]);

  const activeTools = toolAccess.filter((a) => a.status === "ACTIVE");
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <DashboardShell variant="user">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Your active SEO tools. Subscription details are on the Subscription tab."
        action={
          <Link href="/dashboard/subscription" className="btn-secondary !px-4 !py-2">
            <IconPackage className="h-4 w-4 text-neutral-400" />
            My subscription
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Active tools"
          value={stats.activeTools}
          hint="Ready to launch"
          icon={<IconTools className="h-4 w-4" />}
          accent="primary"
        />
        <StatCard
          label="Current plan"
          value={stats.planName ?? "—"}
          hint={stats.subscriptionStatus ?? "No subscription"}
          icon={<IconPackage className="h-4 w-4" />}
          accent="accent"
        />
        <StatCard
          label="Expires in"
          value={
            stats.daysUntilRenewal != null
              ? `${stats.daysUntilRenewal} days`
              : "—"
          }
          hint="Until subscription ends"
          accent="warning"
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">My tools</h2>
        <span className="text-sm text-neutral-500">
          {activeTools.length} available
        </span>
      </div>

      {activeTools.length === 0 ? (
        <EmptyState
          icon={<IconTools className="h-6 w-6" />}
          title="No tools assigned yet"
          description="Contact your administrator. They will create your account and activate your subscription manually."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {activeTools.map((access) => (
            <ToolCard
              key={access.id}
              name={access.tool.name}
              slug={access.tool.slug}
              iconUrl={access.tool.iconUrl}
              description={access.tool.description}
              status={access.status}
              expiresAt={access.expiresAt}
            />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
