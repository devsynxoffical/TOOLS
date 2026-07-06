"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type DashboardHeaderProps = {
  title: string;
  subtitle?: string;
  homeHref: string;
  onMenuClick: () => void;
  userName?: string | null;
};

export function DashboardHeader({
  title,
  subtitle,
  homeHref,
  onMenuClick,
  userName,
}: DashboardHeaderProps) {
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className="dashboard-modern-header sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 lg:hidden"
            aria-label="Toggle menu"
          >
            <MaterialIcon name="menu" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-neutral-900 sm:text-xl">
              {title}
            </h1>
            {subtitle && (
              <p className="hidden truncate text-sm text-neutral-500 sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={homeHref}
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-brand-primary sm:inline-flex"
          >
            Dashboard
          </Link>
          <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-brand-primary sm:flex">
            {initials}
          </span>
        </div>
      </div>
    </header>
  );
}
