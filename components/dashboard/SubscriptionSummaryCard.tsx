import { StatusBadge } from "@/components/ui/StatusBadge";

type SubscriptionSummaryCardProps = {
  planName: string;
  toolNames: string[];
  startedAt?: Date | null;
  expiryDate?: Date | null;
  renewalDate?: Date | null;
  status: string;
  pricePkr?: number;
  priceCents?: number;
  notes?: string | null;
};

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function daysRemaining(expiry: Date | null | undefined) {
  if (!expiry) return null;
  return Math.max(
    0,
    Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
}

export function SubscriptionSummaryCard({
  planName,
  toolNames,
  startedAt,
  expiryDate,
  renewalDate,
  status,
  pricePkr,
  notes,
}: SubscriptionSummaryCardProps) {
  const expires = expiryDate ?? renewalDate ?? null;
  const remaining = daysRemaining(expires);
  const pending = status === "PENDING";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50/80 via-neutral-0 to-neutral-0 shadow-card">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/10 blur-2xl" />
      <div className="relative border-b border-primary-100/60 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600">
              Current plan
            </p>
            <p className="mt-1.5 text-xl font-bold text-neutral-900">
              {planName}
              <span className="ml-2 text-base font-normal text-neutral-500">
                PKR {(pricePkr ?? 0).toLocaleString()}
              </span>
            </p>
          </div>
          <StatusBadge
            status={status}
            label={pending ? "Awaiting activation" : undefined}
          />
        </div>
      </div>
      <div className="relative grid gap-4 px-6 py-5 sm:grid-cols-3">
        <div className="rounded-xl bg-neutral-0/60 p-4 ring-1 ring-primary-100/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Start date
          </p>
          <p className="mt-1.5 text-sm font-semibold text-neutral-800">
            {formatDate(startedAt)}
          </p>
        </div>
        <div className="rounded-xl bg-neutral-0/60 p-4 ring-1 ring-primary-100/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Expiry date
          </p>
          <p className="mt-1.5 text-sm font-semibold text-neutral-800">
            {formatDate(expires)}
          </p>
        </div>
        <div className="rounded-xl bg-neutral-0/60 p-4 ring-1 ring-primary-100/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Days remaining
          </p>
          <p
            className={`mt-1.5 text-sm font-semibold ${
              remaining != null && remaining < 7
                ? "text-warning-500"
                : "text-neutral-800"
            }`}
          >
            {remaining != null ? `${remaining} days` : "—"}
          </p>
        </div>
      </div>
      {notes && (
        <div className="relative border-t border-primary-100/60 px-6 py-3">
          <p className="text-xs text-neutral-500">
            <span className="font-semibold">Admin note:</span> {notes}
          </p>
        </div>
      )}
      <div className="relative border-t border-primary-100/60 px-6 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Tools included ({toolNames.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {toolNames.length === 0 ? (
            <span className="text-sm text-neutral-500">
              {pending
                ? "Tools will appear after your admin activates the plan."
                : "No tools in this plan yet."}
            </span>
          ) : (
            toolNames.map((name) => (
              <span
                key={name}
                className="rounded-full bg-neutral-0 px-3 py-1 text-xs font-semibold text-primary-700 ring-1 ring-primary-200/60"
              >
                {name}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
