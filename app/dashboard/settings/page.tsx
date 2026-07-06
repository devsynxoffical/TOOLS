import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SettingsPageClient } from "@/components/dashboard/SettingsForm";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <DashboardShell variant="user">
      <PageHeader
        title="Account settings"
        description="Manage your profile details and security preferences."
      />
      <SessionProvider>
        <SettingsPageClient email={session?.user?.email ?? ""} name={session?.user?.name ?? ""} />
      </SessionProvider>
    </DashboardShell>
  );
}
