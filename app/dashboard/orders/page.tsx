import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPaymentOrdersByUser } from "@/lib/data/payment-orders";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconBilling } from "@/components/ui/icons";
import {
  buildPaymentWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import { getPlatformSettings } from "@/lib/data/platform-settings";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const [orders, settings] = await Promise.all([
    getPaymentOrdersByUser(session!.user.id),
    getPlatformSettings(),
  ]);

  return (
    <DashboardShell variant="user">
      <PageHeader
        title="My orders"
        description="Track payment submissions and approval status."
        action={
          <Link href="/pricing" className="btn-secondary !px-4 !py-2">
            Browse tools
          </Link>
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={<IconBilling className="h-6 w-6" />}
          title="No orders yet"
          description="Buy a tool from the pricing page to get started."
          action={
            <Link href="/pricing" className="btn-primary !px-4 !py-2">
              View pricing
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const whatsappUrl =
              order.status === "PENDING" &&
              settings.whatsappNumber &&
              buildWhatsAppUrl(
                settings.whatsappNumber,
                buildPaymentWhatsAppMessage({
                  userName: order.user.name,
                  toolName: order.tool.name,
                  amountPkr: order.amountPkr,
                  bankName: order.bankAccount.bankName,
                  orderId: order.id,
                })
              );

            return (
              <div key={order.id} className="dashboard-panel p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-neutral-900">{order.tool.name}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-lg font-bold text-primary-700">
                      PKR {order.amountPkr.toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-neutral-500">
                      {order.bankAccount.bankName} · {formatDate(order.createdAt)}
                    </p>
                    {order.adminNote && (
                      <p className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                        {order.adminNote}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    {order.screenshotUrl && (
                      <a
                        href={order.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={order.screenshotUrl}
                          alt="Payment screenshot"
                          className="h-24 rounded-lg border border-neutral-200 object-cover"
                        />
                      </a>
                    )}
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Chat on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
