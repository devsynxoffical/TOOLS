"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";

type MarketingShellProps = {
  navbar: ReactNode;
  children: ReactNode;
};

export function MarketingShell({ navbar, children }: MarketingShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <div
        className={
          isHome
            ? "bg-collab-yellow"
            : "border-b border-neutral-200/80 bg-white"
        }
      >
        {navbar}
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
