"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { TOOL_CATALOG } from "@/lib/tools/catalog";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

const highlights = [
  { icon: "apps", text: `${TOOL_CATALOG.length}+ SEO tools in one place` },
  { icon: "verified_user", text: "Secure dashboard access" },
  { icon: "bolt", text: "Launch tools after admin approval" },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-collab-gray lg:flex-row">
      {/* Mobile / tablet yellow banner */}
      <div className="bg-collab-yellow px-4 py-6 text-white lg:hidden">
        <div className="mx-auto flex max-w-md items-start justify-between gap-4">
          <Logo showText variant="collab" href="/" />
          <Link
            href="/"
            className="shrink-0 text-sm font-bold text-white/80 hover:text-white"
          >
            Home
          </Link>
        </div>
        <h2 className="mx-auto mt-5 max-w-md text-2xl font-extrabold text-white">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/85">{subtitle}</p>
      </div>

      {/* Desktop left panel */}
      <div className="auth-panel-left">
        <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-white/25 blur-2xl" />

        <div className="relative">
          <Logo showText variant="collab" href="/" />
        </div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/85">
            {subtitle}
          </p>

          <div className="mt-10 space-y-4">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="glass-icon h-9 w-9 shrink-0">
                  <MaterialIcon name={item.icon} className="text-lg" />
                </span>
                <span className="text-sm font-medium text-white/90">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/60">
          &copy; {new Date().getFullYear()} GroupBuy Tools
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 flex-col bg-white">
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
