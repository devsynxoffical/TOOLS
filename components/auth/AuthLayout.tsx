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
    <div className="flex min-h-screen bg-[#f4f7fb]">
      {/* Left brand panel */}
      <div className="auth-panel-left">
        <div className="absolute inset-0 bg-mesh-hero opacity-40" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl" />

        <div className="relative">
          <Logo showText variant="light" href="/" />
        </div>

        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight text-white">{title}</h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-neutral-300">
            {subtitle}
          </p>

          <div className="mt-10 space-y-4">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary-200 ring-1 ring-white/10">
                  <MaterialIcon name={item.icon} className="text-lg" />
                </span>
                <span className="text-sm text-neutral-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} GroupBuy Tools
        </p>
      </div>

      {/* Right content panel */}
      <div className="relative flex flex-1 flex-col">
        <div className="absolute inset-0 bg-mesh-dashboard opacity-40" />

        {/* Mobile header */}
        <div className="relative border-b border-neutral-200/80 bg-white/90 px-4 py-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between">
            <Logo showText href="/" />
            <Link
              href="/"
              className="text-sm font-medium text-neutral-600 hover:text-brand-primary"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
