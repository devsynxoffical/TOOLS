import { Suspense } from "react";
import { getAllPaymentOrders, getPendingPaymentOrders } from "@/lib/data/payment-orders";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { PaymentsQueue } from "@/components/admin/PaymentsQueue";
import { PaymentsTabs } from "@/components/admin/PaymentsTabs";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { status?: string };
};

export default async function AdminPaymentsPage({ searchParams }: Props) {
  const status = searchParams.status;
  const [pending, all] = await Promise.all([
    getPendingPaymentOrders(),
    status === "all" ? getAllPaymentOrders() : getPendingPaymentOrders(),
  ]);

  return (
    <DashboardShell variant="admin" pageTitle="Payments" pageSubtitle="Review and approve payment orders">
      <PageHeader
        title="Payments"
        description="Review user payment screenshots and approve tool access."
        action={
          pending.length > 0 ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
              {pending.length} pending
            </span>
          ) : undefined
        }
      />
      <Suspense fallback={<div className="h-10" />}>
        <PaymentsTabs pendingCount={pending.length} />
      </Suspense>
      <div className="mt-6">
        <PaymentsQueue orders={all} showAll={status === "all"} />
      </div>
    </DashboardShell>
  );
}
