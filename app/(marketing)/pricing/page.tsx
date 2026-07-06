import { INDIVIDUAL_TOOL_PRICES } from "@/lib/data/individual-tool-prices";
import { AnimateIn } from "@/components/ui/AnimateIn";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  return (
    <div className="relative bg-white pt-16 pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">        <AnimateIn className="mb-10 text-center sm:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Choose the tools you need and pay per tool in PKR. No bundled plans —
            pick Semrush, Moz, SpyFu, and more individually at group-buy rates.
          </p>
        </AnimateIn>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INDIVIDUAL_TOOL_PRICES.map((tool) => (              <div
                key={tool.slug}
                className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {tool.logoUrl ? (
                    <img
                      src={tool.logoUrl}
                      alt={`${tool.name} logo`}
                      className="h-9 w-9 rounded-md border border-neutral-200 bg-white object-contain p-1"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                      {tool.name.charAt(0)}
                    </div>
                  )}
                  <p className="line-clamp-1 text-sm font-semibold text-neutral-900">
                    {tool.name}
                  </p>
                </div>
                <p className="mt-4 text-lg font-bold text-primary-700">
                  PKR {tool.pricePkr.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
