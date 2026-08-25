import { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";

type MarketingShellProps = {
  navbar: ReactNode;
  children: ReactNode;
};

export function MarketingShell({ navbar, children }: MarketingShellProps) {

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <div className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        {navbar}
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
