import Link from "next/link";
import { SectionHeader } from "@/components/home/SectionHeader";
import { getActiveToolsForPricing } from "@/lib/data/tools";
import { getToolLogoUrl } from "@/lib/tools/logos";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export async function ToolsShowcaseSection() {
  const tools = (await getActiveToolsForPricing()).slice(0, 6);

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
              className="btn-marketing-outline inline-flex items-center gap-2 !py-2.5"
            >
              Explore tools
              <MaterialIcon name="arrow_forward" className="text-base" />
            </Link>
          }
          align="left"
        />

        {tools.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-collab-gray px-6 py-16 text-center">
            <p className="text-neutral-600">
              Tools will appear here once the admin adds pricing.
            </p>
            <Link href="/signup" className="btn-marketing mt-4 inline-flex">
              Sign up to get notified
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const logoUrl =
                getToolLogoUrl({ slug: tool.slug, name: tool.name }) ??
                tool.iconUrl;

              return (
                <article key={tool.id} className="marketing-card group">
                  <div className="relative h-44 bg-collab-gray p-5">
                    <span className="inline-flex rounded-md bg-collab-yellow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-collab-dark">
                      SEO Tool
                    </span>
                    <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm">
                      {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoUrl}
                          alt=""
                          className="h-9 w-9 object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-collab-dark">
                          {tool.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-extrabold text-collab-dark">
                      {tool.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-neutral-600">
                      {tool.description ?? "Premium SEO access via group buy."}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                      <div>
                        <p className="text-xl font-extrabold text-collab-dark">
                          PKR {tool.pricePkr.toLocaleString()}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {tool.accessDurationDays} days access
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/buy/${tool.slug}`}
                        className="btn-marketing-pill !px-4 !py-2 text-xs"
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
