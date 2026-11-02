import { TOOL_CATALOG } from "@/lib/tools/catalog";
import { getToolLogoUrl } from "@/lib/tools/logos";
import { SectionHeader } from "@/components/home/SectionHeader";

const featured = TOOL_CATALOG.filter((t) => t.popular).slice(0, 16);

export function ToolsLogoCloud() {
  const loop = [...featured, ...featured];

  return (
    <section className="overflow-hidden bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <SectionHeader
          eyebrow="Tool catalog"
          title="Where our users get their SEO data"
          description="Browse popular SEO, content, and research tools available on Rankmora."
        />
      </div>

      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

        <div className="marquee-track gap-7 px-4">
          {loop.map((tool, i) => {
            const logoUrl = getToolLogoUrl({ slug: tool.slug, name: tool.name });
            return (
              <div
                key={`${tool.slug}-${i}`}
                className="group flex w-32 shrink-0 flex-col items-center transition-all duration-300"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200/90 bg-white p-2.5 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt={`${tool.name} logo`}
                      className="h-11 w-11 object-contain"
                    />
                  ) : (
                    <span className="text-base font-extrabold text-neutral-600">
                      {tool.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 line-clamp-1 text-center text-xs font-semibold text-neutral-700">
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
