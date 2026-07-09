import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { adminUrl } from "@/lib/config/site";

type DashboardShellProps = {
  children: React.ReactNode;
  variant: "user" | "admin";
  pageTitle?: string;
  pageSubtitle?: string;
};

export async function DashboardShell({
  children,
  variant,
  pageTitle,
  pageSubtitle,
}: DashboardShellProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(variant === "admin" ? "/admin/login" : "/login");
  }

  if (variant === "admin" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  if (variant === "user" && session.user.role === "ADMIN") {
    redirect(adminUrl("/admin"));
  }

  return (
    <DashboardLayout
      variant={variant}
      userName={session.user.name}
      userEmail={session.user.email}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
    >
      {children}
    </DashboardLayout>
  );
}
