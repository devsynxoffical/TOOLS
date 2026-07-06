import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SignOutLink } from "@/components/auth/SignOutLink";
import { Logo } from "@/components/layout/Logo";
import { Role } from "@prisma/client";
import { isMockMode } from "@/lib/config";

type DashboardShellProps = {
  children: React.ReactNode;
  variant: "user" | "admin";
};

export async function DashboardShell({
  children,
  variant,
}: DashboardShellProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (variant === "admin" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-neutral-50">
      <div className="page-mesh" />

      <header className="sticky top-0 z-40 border-b border-neutral-200/50 bg-neutral-0/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Logo showText className="[&_span]:text-base" />
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-neutral-400 sm:block">
              {variant === "admin" ? "Admin Console" : "Member Portal"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isMockMode() && (
              <span className="rounded-full bg-warning-500/10 px-2.5 py-1 text-xs font-semibold text-warning-500 ring-1 ring-warning-500/20">
                Demo
              </span>
            )}
            <Link
              href="/"
              className="hidden text-sm font-medium text-neutral-500 transition-colors hover:text-primary-600 sm:inline"
            >
              Website
            </Link>
            <SignOutLink />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
        <DashboardSidebar
          role={session.user.role as Role}
          variant={variant}
          userName={session.user.name}
          userEmail={session.user.email}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
