import Link from "next/link";
import { SectionHeader } from "@/components/home/SectionHeader";
import { getActiveToolsForPricing } from "@/lib/data/tools";
import { getToolLogoUrl } from "@/lib/tools/logos";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export async function ToolsShowcaseSection() {
  const tools = (await getActiveToolsForPricing()).slice(0, 8);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <SectionHeader
          eyebrow="Our tools"
          title="Popular tools at group-buy rates"
          description="Pick the tools you need — pay in PKR, get verified access, and launch from your dashboard."
          action={
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition-colors hover:border-primary-200 hover:text-brand-primary"
            >
              See all tools
              <MaterialIcon name="arrow_forward" className="text-base" />
            </Link>
          }
          align="left"
        />

        {tools.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
            <p className="text-neutral-600">
              Tools will appear here once the admin adds pricing.
            </p>
            <Link href="/signup" className="btn-primary mt-4 inline-flex">
              Sign up to get notified
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => {
              const logoUrl =
                getToolLogoUrl({ slug: tool.slug, name: tool.name }) ??
                tool.iconUrl;

              return (
                <article
                  key={tool.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative h-36 bg-gradient-to-br from-primary-50 to-neutral-50 p-5">
                    <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary shadow-sm">
                      SEO Tool
                    </span>
                    <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm">
                      {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoUrl}
                          alt=""
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <span className="text-sm font-bold text-brand-primary">
                          {tool.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-neutral-900">
                      {tool.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-neutral-600">
                      {tool.description ?? "Premium SEO access via group buy."}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                      <div>
                        <p className="text-lg font-bold text-brand-primary">
                          PKR {tool.pricePkr.toLocaleString()}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {tool.accessDurationDays} days access
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/buy/${tool.slug}`}
                        className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-primary"
                      >
                        Buy now
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
