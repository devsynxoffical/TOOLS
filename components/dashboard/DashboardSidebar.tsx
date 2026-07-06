"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@prisma/client";
import {
  IconOverview,
  IconPackage,
  IconPlans,
  IconSettings,
  IconTools,
  IconUsers,
} from "@/components/ui/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const userNav: NavItem[] = [
  { href: "/dashboard", label: "My Tools", icon: <IconTools className="h-4 w-4" /> },
  { href: "/dashboard/subscription", label: "Subscription", icon: <IconPackage className="h-4 w-4" /> },
  { href: "/dashboard/settings", label: "Settings", icon: <IconSettings className="h-4 w-4" /> },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <IconOverview className="h-4 w-4" /> },
  { href: "/admin/users", label: "Users", icon: <IconUsers className="h-4 w-4" /> },
  { href: "/admin/plans", label: "Plans", icon: <IconPlans className="h-4 w-4" /> },
  { href: "/admin/tools", label: "Tools", icon: <IconPackage className="h-4 w-4" /> },
];

type DashboardSidebarProps = {
  role: Role;
  variant: "user" | "admin";
  userName?: string | null;
  userEmail?: string | null;
};

export function DashboardSidebar({
  role,
  variant,
  userName,
  userEmail,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = variant === "admin" ? adminNav : userNav;
  const isAdmin = role === "ADMIN";
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="dashboard-sidebar sticky top-20">
        <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
          {variant === "admin" ? "Administration" : "Workspace"}
        </p>
        <nav className="space-y-1">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
              >
                <span className={active ? "text-neutral-0" : "text-neutral-400"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {isAdmin && variant === "user" && (
          <div className="mt-4 space-y-1 border-t border-neutral-100/80 pt-4">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              Admin
            </p>
            <Link
              href="/admin/tools"
              className="sidebar-link sidebar-link-active"
            >
              <IconPackage className="h-4 w-4" />
              Add / manage tools
            </Link>
            <Link href="/admin" className="sidebar-link">
              <IconOverview className="h-4 w-4 text-neutral-400" />
              Admin overview
            </Link>
          </div>
        )}

        {variant === "admin" && (
          <div className="mt-4 border-t border-neutral-100/80 pt-4">
            <Link href="/dashboard" className="sidebar-link">
              <IconTools className="h-4 w-4 text-neutral-400" />
              User dashboard
            </Link>
          </div>
        )}

        <div className="mt-4 border-t border-neutral-100/80 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-primary-50/50 p-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-xs font-bold text-neutral-0 shadow-glow-sm">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-800">
                {userName ?? "User"}
              </p>
              <p className="truncate text-xs text-neutral-400">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
