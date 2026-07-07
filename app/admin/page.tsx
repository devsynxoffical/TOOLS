import Link from "next/link";
import { getAllTools } from "@/lib/data/tools";
import { getAdminExtendedStats, getRecentUsers } from "@/lib/data/dashboard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GrantAccessForm } from "@/components/admin/GrantAccessForm";
import { ModernStatCard } from "@/components/dashboard/ModernStatCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default async function AdminPage() {
  const [tools, stats, recentUsers] = await Promise.all([
    getAllTools(),
    getAdminExtendedStats(),
    getRecentUsers(5),
  ]);

  const activeTools = tools.filter((t) => t.active);

  return (
    <DashboardShell
      variant="admin"
      pageTitle="Grant tool access"
      pageSubtitle="Assign tools to users by email"
    >
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ModernStatCard
          label="Total users"
          value={stats.totalUsers}
          accent="blue"
          icon={<MaterialIcon name="group" className="text-2xl" />}
        />
        <ModernStatCard
          label="Active subs"
          value={stats.activeSubscriptions}
          accent="green"
          icon={<MaterialIcon name="verified" className="text-2xl" />}
        />
        <ModernStatCard
          label="Tools"
          value={stats.totalTools}
          accent="purple"
          icon={<MaterialIcon name="apps" className="text-2xl" />}
        />
        <ModernStatCard
          label="Suspended"
          value={stats.suspendedUsers}
          accent="orange"
          icon={<MaterialIcon name="block" className="text-2xl" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="dashboard-panel-modern p-6 sm:p-8 xl:col-span-2">
          <h2 className="mb-1 text-lg font-bold text-neutral-900">
            Grant access
          </h2>
          <p className="mb-6 text-sm text-neutral-500">
            Enter user email, select tools, and save. Changes appear instantly on
            the user dashboard.
          </p>
          <GrantAccessForm
            tools={activeTools.map((t) => ({
              id: t.id,
              name: t.name,
              slug: t.slug,
              iconUrl: t.iconUrl,
            }))}
          />
        </div>

        <div className="dashboard-panel-modern overflow-hidden">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-bold text-neutral-900">Recent users</h2>
            <p className="text-xs text-neutral-500">Latest signups</p>
          </div>
          <ul className="divide-y divide-neutral-50">
            {recentUsers.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {user.email}
                    </p>
                  </div>
                  <MaterialIcon
                    name="chevron_right"
                    className="shrink-0 text-neutral-300"
                  />
                </Link>
              </li>
            ))}
            {recentUsers.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-neutral-500">
                No users yet
              </li>
            )}
          </ul>
          <div className="border-t border-neutral-100 px-5 py-3">
            <Link
              href="/admin/users"
              className="text-sm font-bold text-collab-dark hover:text-collab-dark/70"
            >
              View all users →
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
