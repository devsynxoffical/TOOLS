"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: number;
};

export type DashboardNavSection = {
  title: string;
  items: DashboardNavItem[];
};

type DashboardSidebarProps = {
  sections: DashboardNavSection[];
  homeHref: string;
  userName?: string | null;
  userEmail?: string | null;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function DashboardSidebar({
  sections,
  homeHref,
  userName,
  userEmail,
  collapsed = false,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  function isActive(href: string, exact?: boolean) {
    if (exact || href === "/dashboard" || href === "/admin") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      className={`dashboard-modern-sidebar flex h-full flex-col ${
        collapsed ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-neutral-100 bg-collab-yellow/40 px-5">
        <Logo
          variant="dashboard"
          href={homeHref}
          onClick={onNavigate}
          className="[&_span:last-child]:text-lg"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        {sections.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                        active
                          ? "bg-collab-dark text-white shadow-md"
                          : "text-neutral-600 hover:bg-collab-yellow/50 hover:text-collab-dark"
                      }`}
                    >
                      <MaterialIcon
                        name={item.icon}
                        className={`text-[1.35rem] ${active ? "text-collab-yellow" : "text-neutral-400"}`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {typeof item.badge === "number" && item.badge > 0 && (
                        <span
                          className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
                            active
                              ? "bg-collab-yellow text-collab-dark"
                              : "bg-collab-dark text-white"
                          }`}
                        >
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-neutral-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-collab-gray p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-collab-dark text-xs font-bold text-collab-yellow">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-collab-dark">
              {userName ?? "User"}
            </p>
            <p className="truncate text-xs text-neutral-500">{userEmail}</p>
          </div>
          <Link
            href="/signout"
            onClick={onNavigate}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white hover:text-danger-500"
            aria-label="Sign out"
          >
            <MaterialIcon name="logout" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export const userNavSections: DashboardNavSection[] = [
  {
    title: "Home",
    items: [
      { href: "/dashboard", label: "Tools", icon: "grid_view", exact: true },
      {
        href: "/dashboard/subscription",
        label: "Your subscription",
        icon: "card_membership",
      },
      {
        href: "/dashboard/orders",
        label: "Orders",
        icon: "receipt_long",
      },
    ],
  },
  {
    title: "Help",
    items: [
      {
        href: "/dashboard/support",
        label: "Support",
        icon: "support_agent",
      },
      {
        href: "/dashboard/request-tools",
        label: "Request a tool",
        icon: "add_circle",
      },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: "settings" },
    ],
  },
];

export const adminNavSections: DashboardNavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
      { href: "/admin/users", label: "Users", icon: "group" },
      { href: "/admin/support", label: "Support", icon: "forum" },
    ],
  },
  {
    title: "Manage",
    items: [
      { href: "/admin/tools", label: "Tools", icon: "apps" },
      { href: "/admin/payments", label: "Payments", icon: "payments" },
      { href: "/admin/plans", label: "Plans", icon: "card_membership" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
];
