import { RouteLoading } from "@/components/ui/RouteLoading";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <RouteLoading label="Loading admin..." />
    </div>
  );
}
