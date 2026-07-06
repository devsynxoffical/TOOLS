"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
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
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-neutral-100 px-5">
        <Link href={homeHref} onClick={onNavigate} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-sm font-extrabold text-white shadow-glow-sm">
            GB
          </span>
          <span className="text-lg font-bold tracking-tight text-neutral-900">
            GroupBuy
          </span>
        </Link>
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
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-primary-500 text-white shadow-md shadow-primary-500/25"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      <MaterialIcon
                        name={item.icon}
                        className={`text-[1.35rem] ${active ? "text-white" : "text-neutral-400"}`}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-neutral-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-800">
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
    title: "Home",
    items: [
      { href: "/admin", label: "Grant access", icon: "admin_panel_settings", exact: true },
      { href: "/admin/users", label: "Users", icon: "group" },
    ],
  },
  {
    title: "Manage",
    items: [
      { href: "/admin/tools", label: "Tools", icon: "apps" },
      { href: "/admin/payments", label: "Payments", icon: "payments" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
];
