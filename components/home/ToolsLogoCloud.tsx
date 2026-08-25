import { TOOL_CATALOG } from "@/lib/tools/catalog";
import { getToolLogoUrl } from "@/lib/tools/logos";
import { SectionHeader } from "@/components/home/SectionHeader";

const featured = TOOL_CATALOG.filter((t) => t.popular).slice(0, 12);

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

      <div className="relative mt-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

        <div className="marquee-track gap-6 px-4">
          {loop.map((tool, i) => {
            const logoUrl = getToolLogoUrl({ slug: tool.slug, name: tool.name });
            return (
              <div
                key={`${tool.slug}-${i}`}
                className="flex w-32 shrink-0 flex-col items-center grayscale transition-all duration-300 hover:grayscale-0"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt=""
                      className="h-8 w-8 object-contain opacity-70"
                    />
                  ) : (
                    <span className="text-sm font-bold text-neutral-400">
                      {tool.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-1 text-center text-[10px] font-semibold text-neutral-500">
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
