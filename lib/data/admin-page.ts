import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllTools } from "@/lib/data/tools";
import { getAdminExtendedStats, getRecentUsers } from "@/lib/data/dashboard";
import { getPaymentAdminStats } from "@/lib/data/payment-orders";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/admin/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return session;
}

export async function loadAdminDashboardData() {
  const [tools, stats, recentUsers, paymentStats] = await Promise.all([
    getAllTools(),
    getAdminExtendedStats(),
    getRecentUsers(5),
    getPaymentAdminStats(),
  ]);
  return { tools, stats, recentUsers, paymentStats };
}
