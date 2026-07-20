import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminUrl } from "@/lib/config/site";
import { getAllTools, getUserToolAccess } from "@/lib/data/tools";
import { getUserDashboardStats } from "@/lib/data/dashboard";

export async function requireUserDashboardSession() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login?callbackUrl=/dashboard");
  }

  if (session.user.role === "ADMIN") {
    redirect(adminUrl("/admin"));
  }

  return { session, userId };
}

export async function loadUserDashboardData(userId: string) {
  const [allTools, toolAccess, stats] = await Promise.all([
    getAllTools(),
    getUserToolAccess(userId),
    getUserDashboardStats(userId),
  ]);

  return { allTools, toolAccess, stats };
}
