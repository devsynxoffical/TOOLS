import { TOOL_CATALOG } from "@/lib/tools/catalog";
import { getToolLogoUrl } from "@/lib/tools/logos";
import { SectionHeader } from "@/components/home/SectionHeader";

const featured = TOOL_CATALOG.filter((t) => t.popular).slice(0, 12);

export function ToolsLogoCloud() {
  const loop = [...featured, ...featured];

  return (
    <section className="overflow-hidden border-y border-neutral-200/60 bg-neutral-50 py-14 sm:py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <SectionHeader
          eyebrow="Tool catalog"
          title="Tools available on our platform"
          description="Browse popular SEO, content, and research tools — add more anytime from the admin panel."
        />
      </div>

      <div className="relative mt-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-neutral-50 to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-neutral-50 to-transparent sm:w-24" />

        <div className="marquee-track gap-4 px-4">
          {loop.map((tool, i) => {
            const logoUrl = getToolLogoUrl({ slug: tool.slug, name: tool.name });
            return (
              <div
                key={`${tool.slug}-${i}`}
                className="flex w-36 shrink-0 flex-col items-center rounded-2xl border border-neutral-200/80 bg-white px-4 py-5 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50">
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
                <p className="mt-3 line-clamp-1 text-center text-xs font-semibold text-neutral-700">
                  {tool.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
