import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { TOOL_CATALOG } from "@/lib/tools/catalog";

const heroStats = [
  { value: "70%", label: "Cost savings" },
  { value: String(TOOL_CATALOG.length), label: "Tools in catalog" },
  { value: "24h", label: "Payment verification" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.12),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.1),transparent_40%)]" />
      <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-primary-300/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-container items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-20">
        <div>
          <span className="badge-pill mb-5">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-500" />
            Group-buy SEO platform
          </span>

          <h1 className="max-w-xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.25rem]">
            Premium SEO tools,
            <span className="text-brand-primary"> one affordable place</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
            Access Semrush, Moz, SpyFu, Majestic and more. Pay per tool in PKR,
            launch from your dashboard — no juggling separate subscriptions.
          </p>

          <div className="mt-8">
            <HeroSearch />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">
              Create account
            </Link>
            <Link href="/pricing" className="btn-secondary">
              View all tools
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-card backdrop-blur-sm sm:p-6">
            <div className="rounded-2xl bg-gradient-brand p-6 text-white shadow-glow">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-100">
                Your workspace
              </p>
              <p className="mt-2 text-2xl font-bold">All tools. One login.</p>
              <p className="mt-2 text-sm text-primary-100/90">
                Launch tools instantly after admin approval.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {["Semrush", "Moz Pro", "SpyFu", "Majestic"].map((name, i) => (
                <div
                  key={name}
                  className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-brand-primary">
                    <MaterialIcon name="bolt" className="text-lg" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-neutral-900">{name}</p>
                  <p className="mt-1 text-xs text-accent-500">Active access</p>
                </div>
              ))}
            </div>

            <div className="absolute -right-3 -top-3 hidden rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-card sm:block">
              <p className="text-xs text-neutral-500">Starting from</p>
              <p className="text-lg font-bold text-brand-primary">PKR 1,300</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-4 text-center shadow-sm"
              >
                <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
                <p className="mt-1 text-[11px] font-medium text-neutral-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
