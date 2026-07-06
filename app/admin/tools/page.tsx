import { getToolsCatalogView } from "@/lib/data/tool-catalog";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdminToolsHub } from "@/components/admin/AdminToolsHub";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuickAddTools } from "@/components/admin/QuickAddTools";
import { PendingToolRequests } from "@/components/admin/PendingToolRequests";

export default async function AdminToolsPage() {
  const { active, catalog } = await getToolsCatalogView();
  const availableCount = catalog.filter((t) => !t.integrated).length;

  return (
    <DashboardShell variant="admin">
      <PageHeader
        title="Tools catalog"
        description="Add any tool by name, let users request tools, or browse optional suggestions."
      />
      <QuickAddTools />
      <div className="mt-6">
        <PendingToolRequests />
      </div>
      <div className="mt-6">
        <AdminToolsHub activeTools={active} catalog={catalog} availableCount={availableCount} />
      </div>
    </DashboardShell>
  );
}
