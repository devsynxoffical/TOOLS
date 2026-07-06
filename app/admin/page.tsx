import Link from "next/link";
import { getPendingPaymentOrders } from "@/lib/data/payment-orders";
import { getAdminExtendedStats, getRecentUsers } from "@/lib/data/dashboard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  IconArrowRight,
  IconPackage,
  IconPlans,
  IconUsers,
} from "@/components/ui/icons";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function AdminOverviewPage() {
  const [stats, recentUsers, pendingPayments] = await Promise.all([
    getAdminExtendedStats(),
    getRecentUsers(5),
    getPendingPaymentOrders(),
  ]);

  const quickLinks = [
    {
      href: "/admin/payments",
      label: "Review payments",
      desc:
        pendingPayments.length > 0
          ? `${pendingPayments.length} pending approval`
          : "Approve bank transfer proofs",
    },
    { href: "/admin/settings", label: "Payment settings", desc: "Banks, WhatsApp, instructions" },
    { href: "/admin/users", label: "Manage users", desc: "Search, suspend, assign tools" },
    { href: "/admin/tools", label: "Tool catalog", desc: "Prices, duration, and tools" },
  ];

  return (
    <DashboardShell variant="admin">
      <PageHeader
        title="Overview"
        description="Platform health, revenue metrics, and quick actions."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total users"
          value={stats.totalUsers}
          hint={`${stats.suspendedUsers} suspended`}
          icon={<IconUsers className="h-4 w-4" />}
          accent="primary"
        />
        <StatCard
          label="Active subscriptions"
          value={stats.activeSubscriptions}
          hint="Currently billing"
          icon={<IconPlans className="h-4 w-4" />}
          accent="accent"
        />
        <StatCard
          label="Pending payments"
          value={pendingPayments.length}
          hint="Awaiting approval"
          accent="warning"
        />
        <StatCard
          label="Active plans"
          value={stats.totalPlans}
          hint="Visible on pricing page"
          icon={<IconPlans className="h-4 w-4" />}
          accent="neutral"
        />
        <StatCard
          label="Tools in catalog"
          value={stats.totalTools}
          hint="Available to bundle"
          icon={<IconPackage className="h-4 w-4" />}
          accent="neutral"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="dashboard-panel lg:col-span-3">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Recent users
              </h2>
              <p className="text-xs text-neutral-500">Latest signups</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {recentUsers.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-neutral-400 sm:inline">
                    {formatDate(user.createdAt)}
                  </span>
                  <StatusBadge status={user.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-panel lg:col-span-2">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-neutral-900">
              Quick actions
            </h2>
            <p className="text-xs text-neutral-500">Common admin tasks</p>
          </div>
          <div className="divide-y divide-neutral-50">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {link.label}
                  </p>
                  <p className="text-xs text-neutral-500">{link.desc}</p>
                </div>
                <IconArrowRight className="h-4 w-4 text-neutral-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
