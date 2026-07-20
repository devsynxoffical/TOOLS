import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { adminUrl } from "@/lib/config/site";
import {
  adminNavSections,
  userNavSections,
  type DashboardNavSection,
} from "@/components/dashboard/DashboardSidebar";
import {
  getAdminNavBadgeCounts,
  getUserSupportUnreadCount,
} from "@/lib/data/support";

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

  let navSections: DashboardNavSection[] | undefined;
  if (variant === "admin") {
    const badges = await getAdminNavBadgeCounts();
    navSections = adminNavSections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        badge:
          item.href === "/admin/support"
            ? badges.support
            : item.href === "/admin/payments"
              ? badges.payments
              : undefined,
      })),
    }));
  } else {
    const unread = await getUserSupportUnreadCount(session.user.id);
    navSections = userNavSections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        badge:
          item.href === "/dashboard/support" && unread > 0
            ? unread
            : undefined,
      })),
    }));
  }

  return (
    <DashboardLayout
      variant={variant}
      userName={session.user.name}
      userEmail={session.user.email}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      navSections={navSections}
    >
      {children}
    </DashboardLayout>
  );
}
