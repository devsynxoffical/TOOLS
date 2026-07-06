import { TOOL_CATALOG } from "@/lib/tools/catalog";

const stats = [
  { value: "70%", label: "Cost savings" },
  { value: String(TOOL_CATALOG.length), label: "SEO tools" },
  { value: "99.9%", label: "Uptime" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200/50 bg-neutral-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_35%),linear-gradient(180deg,#eff6ff_0%,#f8f9fa_55%,#ffffff_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(#2563eb_1px,transparent_1px),linear-gradient(90deg,#2563eb_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="relative mx-auto max-w-container px-4 pb-14 pt-10 text-center sm:px-6 sm:pb-16 sm:pt-12 lg:px-10 lg:pb-20 lg:pt-14">
        <h1 className="mx-auto max-w-4xl text-balance text-center text-[2rem] font-bold leading-[1.12] tracking-tight text-neutral-900 sm:text-[2.75rem] lg:text-6xl">
          Premium SEO tools,
          <br className="hidden sm:block" />
          <span className="text-brand-primary"> one affordable plan</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-neutral-600 sm:text-lg">
          Access Semrush, Moz Pro, SpyFu, Majestic and more from one place —
          without paying separate subscriptions for each tool.
        </p>

        <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-12">
          <div className="flex min-h-14 items-center justify-center rounded-xl border border-neutral-200/70 bg-white/75 px-4 py-4 text-center text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-sm">
            Instant access after signup
          </div>
          <div className="flex min-h-14 items-center justify-center rounded-xl border border-neutral-200/70 bg-white/75 px-4 py-4 text-center text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-sm">
            Shared agency-ready workspace
          </div>
          <div className="flex min-h-14 items-center justify-center rounded-xl border border-neutral-200/70 bg-white/75 px-4 py-4 text-center text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-sm">
            New tools added regularly
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:mt-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-neutral-200/70 bg-white/85 px-4 py-5 text-center shadow-sm sm:px-5 sm:py-6"
            >
              <p className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
