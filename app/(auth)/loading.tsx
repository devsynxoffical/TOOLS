import { RouteLoading } from "@/components/ui/RouteLoading";

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
      <RouteLoading label="Loading..." />
    </div>
  );
}
