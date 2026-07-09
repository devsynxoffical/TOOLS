"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getAppBaseUrl } from "@/lib/config/site";

type AdminAuthLayoutProps = {
  children: ReactNode;
};

const highlights = [
  { icon: "admin_panel_settings", text: "Manage users and tool access" },
  { icon: "payments", text: "Review payments and subscriptions" },
  { icon: "settings", text: "Configure platform settings" },
];

export function AdminAuthLayout({ children }: AdminAuthLayoutProps) {
  const appUrl = getAppBaseUrl();

  return (
    <div className="flex min-h-screen flex-col bg-collab-gray lg:flex-row">
      <div className="bg-collab-dark px-4 py-6 text-white lg:hidden">
        <div className="mx-auto flex max-w-md items-start justify-between gap-4">
          <Logo showText variant="light" href="/admin/login" />
          <Link
            href={appUrl}
            className="shrink-0 text-sm font-bold text-white/80 hover:text-white"
          >
            Main site
          </Link>
        </div>
        <h2 className="mx-auto mt-5 max-w-md text-2xl font-extrabold text-white">
          Admin portal
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
          Sign in with your administrator account.
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-collab-dark text-white lg:flex lg:w-[46%] lg:max-w-xl lg:flex-col lg:justify-between lg:p-12 xl:max-w-2xl">
        <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-collab-yellow/20 blur-2xl" />
        <div className="relative">
          <Logo showText variant="light" href="/admin/login" />
        </div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            Admin portal
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/80">
            This area is for platform administrators only. User accounts should
            sign in on the main site.
          </p>

          <div className="mt-10 space-y-4">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-collab-yellow text-white">
                  <MaterialIcon name={item.icon} className="text-lg" />
                </span>
                <span className="text-sm font-medium text-white/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/50">
          &copy; {new Date().getFullYear()} GroupBuy Tools
        </p>
      </div>

      <div className="relative flex flex-1 flex-col bg-white">
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
