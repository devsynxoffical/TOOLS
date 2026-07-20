import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllTools, getUserToolAccess } from "@/lib/data/tools";
import { getUserDashboardStats } from "@/lib/data/dashboard";
import { ToolAvailabilityCard } from "@/components/dashboard/ToolAvailabilityCard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ModernStatCard } from "@/components/dashboard/ModernStatCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const [allTools, toolAccess, stats] = await Promise.all([
    getAllTools(),
    getUserToolAccess(userId),
    getUserDashboardStats(userId),
  ]);

  const activeTools = allTools.filter((t) => t.active);
  const accessByToolId = Object.fromEntries(
    toolAccess
      .filter((a) => a.status === "ACTIVE")
      .map((a) => [a.toolId, a])
  );

  const grantedCount = activeTools.filter((t) => accessByToolId[t.id]).length;
  const unavailableCount = activeTools.length - grantedCount;

  return (
    <DashboardShell
      variant="user"
      pageTitle={`Welcome, ${firstName}`}
      pageSubtitle="Your tools and access status"
    >
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ModernStatCard
          label="Total tools"
          value={activeTools.length}
          accent="blue"
          icon={<MaterialIcon name="apps" className="text-2xl" />}
        />
        <ModernStatCard
          label="Available"
          value={grantedCount}
          accent="green"
          icon={<MaterialIcon name="check_circle" className="text-2xl" />}
        />
        <ModernStatCard
          label="Unavailable"
          value={unavailableCount}
          accent="orange"
          icon={<MaterialIcon name="lock" className="text-2xl" />}
        />
        <ModernStatCard
          label="Subscription"
          value={stats.subscriptionStatus === "ACTIVE" ? "Active" : "None"}
          accent="purple"
          icon={<MaterialIcon name="card_membership" className="text-2xl" />}
        />
      </div>

      <div className="dashboard-panel-modern mb-6 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-neutral-900">All tools</h2>
            <p className="text-sm text-neutral-500">
              Subscribe to unlock tools instantly, or buy individual tools.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/subscription"
              className="btn-primary !px-4 !py-2 text-xs"
            >
              Subscribe now
            </Link>
            <Link
              href="/dashboard/support"
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
            >
              <MaterialIcon name="support_agent" className="text-base" />
              Support
            </Link>
            <span className="rounded-full bg-collab-yellow px-3 py-1 text-xs font-bold text-white">
              {grantedCount} / {activeTools.length} unlocked
            </span>
          </div>
        </div>
      </div>

      {activeTools.length === 0 ? (
        <div className="dashboard-panel-modern px-6 py-16 text-center">
          <MaterialIcon name="inventory_2" className="mx-auto text-4xl text-neutral-300" />
          <p className="mt-4 font-medium text-neutral-700">No tools added yet</p>
          <p className="mt-1 text-sm text-neutral-500">
            Your admin will add tools to the platform soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {activeTools.map((tool) => {
            const access = accessByToolId[tool.id];
            return (
              <ToolAvailabilityCard
                key={tool.id}
                name={tool.name}
                slug={tool.slug}
                iconUrl={tool.iconUrl}
                description={tool.description}
                available={!!access}
                expiresAt={access?.expiresAt}
              />
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
