import { getToolLogoUrl } from "@/lib/tools/logos";
import { LaunchToolButton } from "@/components/dashboard/LaunchToolButton";

type ToolAvailabilityCardProps = {
  name: string;
  slug: string;
  iconUrl?: string | null;
  description?: string | null;
  available: boolean;
  expiresAt?: Date | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ToolAvailabilityCard({
  name,
  slug,
  iconUrl,
  description,
  available,
  expiresAt,
}: ToolAvailabilityCardProps) {
  const logoUrl = getToolLogoUrl({ slug, name }) ?? iconUrl ?? null;

  return (
    <div className="dashboard-panel-modern overflow-hidden transition-all hover:shadow-card">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="h-10 w-10 object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-lg font-bold text-brand-primary">
              {name.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-neutral-900">{name}</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                available
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200"
              }`}
            >
              {available ? "Available" : "Unavailable"}
            </span>
          </div>
          {description && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
              {description}
            </p>
          )}
          {available && expiresAt && (
            <p className="mt-2 text-xs text-neutral-400">
              Until {formatDate(expiresAt)}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 bg-neutral-50/50 px-5 py-4">
        {available ? (
          <LaunchToolButton slug={slug} />
        ) : (
          <p className="py-1 text-center text-sm text-neutral-500">
            Waiting for admin to grant access
          </p>
        )}
      </div>
    </div>
  );
}
