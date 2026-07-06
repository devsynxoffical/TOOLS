import { isMockMode } from "@/lib/config";
import { mockStore } from "@/lib/mock/store";
import { getAllTools } from "@/lib/data/tools";

export async function getPendingToolRequests() {
  if (!isMockMode()) return [];

  const tools = await getAllTools();
  const requests = mockStore.toolRequests ?? [];
  return requests
    .filter((r) => r.status === "PENDING")
    .map((r) => ({
      ...r,
      tools: r.toolIds
        .map((id) => tools.find((t) => t.id === id))
        .filter(Boolean) as { id: string; name: string }[],
    }));
}
