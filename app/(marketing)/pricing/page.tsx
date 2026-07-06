import Link from "next/link";
import { getActiveToolsForPricing } from "@/lib/data/tools";
import { getToolLogoUrl } from "@/lib/tools/logos";
import { AnimateIn } from "@/components/ui/AnimateIn";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const tools = await getActiveToolsForPricing();

  return (
    <div className="relative bg-white pt-16 pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateIn className="mb-10 text-center sm:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Choose the tools you need and pay per tool in PKR. Prices are set by
            the administrator — pick what you need at group-buy rates.
          </p>
        </AnimateIn>

        {tools.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-600">
            No tools are available for purchase yet. Check back soon.
          </div>
        ) : (
          <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool) => {
                const logoUrl =
                  getToolLogoUrl({ slug: tool.slug, name: tool.name }) ??
                  tool.iconUrl;

                return (
                  <div
                    key={tool.slug}
                    className="flex flex-col rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
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
                    <p className="mt-1 text-xs text-neutral-500">
                      {tool.accessDurationDays} days access
                    </p>
                    <Link
                      href={`/dashboard/buy/${tool.slug}`}
                      className="btn-primary mt-4 w-full !px-3 !py-2 text-sm"
                    >
                      Buy now
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
