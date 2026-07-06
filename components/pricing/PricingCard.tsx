import Link from "next/link";
import { getToolLogoUrl } from "@/lib/tools/logos";

type PricingCardProps = {
  id: string;
  name: string;
  description: string | null;
  pricePkr: number;
  durationDays: number;
  tools: { tool: { name: string; slug?: string } }[];
  featured?: boolean;
};

export function PricingCard({
  name,
  description,
  pricePkr,
  durationDays,
  tools,
  featured = false,
}: PricingCardProps) {
  return (
    <div
      className={`pricing-card ${featured ? "pricing-card-featured lg:scale-105" : ""}`}
    >
      {featured && (
        <span className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-xl bg-gradient-brand px-4 py-1 text-xs font-semibold text-neutral-0 shadow-glow-sm">
          Most popular
        </span>
      )}
      <h3 className="text-xl font-bold text-neutral-900">{name}</h3>
      {description && (
        <p className="mt-2 text-sm text-neutral-600">{description}</p>
      )}
      <div className="mt-8">
        <span className="text-5xl font-bold tracking-tight text-gradient">
          PKR {pricePkr.toLocaleString()}
        </span>
        <span className="text-sm text-neutral-500"> / {durationDays} days</span>
      </div>
      <ul className="mt-8 flex-1 space-y-3.5">
        {tools.map(({ tool }) => {
          const logoUrl = getToolLogoUrl({ slug: tool.slug, name: tool.name });
          return (
            <li
              key={tool.name}
              className="flex items-center gap-2.5 text-sm text-neutral-600"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${tool.name} logo`}
                  className="h-5 w-5 shrink-0 rounded object-contain"
                  loading="lazy"
                />
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/10">
                  <svg
                    className="h-3 w-3 text-accent-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              {tool.name}
            </li>
          );
        })}
      </ul>
      <Link
        href="/contact"
        className={`mt-10 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all duration-300 ${
          featured
            ? "btn-primary w-full"
            : "border border-neutral-200 bg-neutral-0 text-neutral-800 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card"
        }`}
      >
        Contact to subscribe
      </Link>
    </div>
  );
}
