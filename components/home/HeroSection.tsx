import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { TOOL_CATALOG } from "@/lib/tools/catalog";

const heroStats = [
  { value: "70%", label: "Cost savings" },
  { value: String(TOOL_CATALOG.length), label: "SEO tools" },
  { value: "24h", label: "Fast approval" },
];

const toolTags = [
  { name: "Semrush", slug: "semrush" },
  { name: "Moz Pro", slug: "moz" },
  { name: "SpyFu", slug: "spyfu" },
  { name: "Majestic", slug: "majestic" },
  { name: "KWFinder", slug: "kwfinder" },
  { name: "Ahrefs", slug: "ahrefs" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-collab-yellow text-white">
      {/* Collab-style curved lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='800' viewBox='0 0 800 800' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-100 200C150 100 350 300 600 200C750 130 850 250 950 180' stroke='white' stroke-width='2' stroke-opacity='0.5'/%3E%3Cpath d='M-50 400C200 300 400 500 650 400C800 330 900 450 1000 380' stroke='white' stroke-width='2' stroke-opacity='0.35'/%3E%3Cpath d='M0 600C250 500 450 700 700 600C850 530 950 650 1050 580' stroke='white' stroke-width='2' stroke-opacity='0.25'/%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-white/15 blur-3xl" />

      <div className="relative mx-auto max-w-container px-4 pb-12 pt-2 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20 lg:pt-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left — copy + search */}
          <div className="min-w-0 text-center lg:text-left">
            <h1 className="mx-auto max-w-xl text-balance text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:mx-0 lg:text-[3.25rem]">
              Access premium SEO tools with one affordable subscription.
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:mt-5 sm:text-lg lg:mx-0">
              Semrush, Moz, SpyFu, Majestic and more — pay per tool in PKR, launch
              from your dashboard.
            </p>

            <div className="mx-auto mt-8 max-w-xl lg:mx-0">
              <HeroSearch />
            </div>

            {/* Tag cloud — Collab style */}
            <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2 lg:mx-0 lg:justify-start">
              {toolTags.map((tag) => (
                <span
                  key={tag.slug}
                  className="inline-flex items-center rounded-full bg-white px-2 py-1.5 pr-3.5 shadow-sm"
                >
                  <ToolLogo
                    name={tag.name}
                    slug={tag.slug}
                    size="xs"
                    showName
                    nameClassName="text-xs font-bold text-collab-yellow sm:text-sm"
                  />
                </span>
              ))}
            </div>

            <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center lg:mx-0 lg:justify-start">
              <Link href="/signup" className="btn-glass-solid !rounded-full text-center">
                Sign up free
              </Link>
              <Link
                href="/pricing"
                className="btn-glass-outline !rounded-full text-center"
              >
                Browse tools
              </Link>
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl border border-white/35 bg-white/20 shadow-xl backdrop-blur-md">
              <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 p-5 sm:p-7">
                <div className="glass-surface flex h-full flex-col justify-between rounded-xl p-4 text-white sm:p-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/90 sm:text-xs">
                      Your workspace
                    </p>
                    <p className="mt-2 text-xl font-extrabold sm:text-2xl">
                      All tools. One login.
                    </p>
                    <p className="mt-2 text-xs text-white/75 sm:text-sm">
                      Launch instantly after admin approval.
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {["Semrush", "Moz Pro", "SpyFu", "Majestic"].map((name) => (
                      <div
                        key={name}
                        className="rounded-lg border border-white/25 bg-white/15 px-2 py-2 text-center text-[10px] font-semibold backdrop-blur-sm sm:text-xs"
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges — desktop only, contained */}
            <div className="absolute -left-2 top-6 hidden rounded-xl glass-surface-strong px-3 py-2 lg:block">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-collab-yellow/15 text-xs font-bold text-collab-yellow">
                  SK
                </span>
                <div>
                  <p className="text-xs font-bold text-neutral-800">Sarah K.</p>
                  <p className="text-[10px] text-neutral-500">Agency owner</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 bottom-16 hidden rounded-xl glass-surface-strong px-3 py-2 lg:block">
              <p className="text-[10px] text-neutral-500">Starting from</p>
              <p className="text-base font-extrabold text-collab-yellow">PKR 1,300</p>
            </div>

            <div className="btn-glass-pill absolute right-4 top-3 hidden !px-3 !py-1.5 lg:flex lg:items-center lg:gap-1.5">
              <MaterialIcon name="bolt" className="text-sm text-white" />
              <span className="text-[10px] font-bold sm:text-xs">Live access</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-4 lg:mt-14">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="glass-surface-strong rounded-xl px-2 py-3 text-center sm:px-4 sm:py-4"
            >
              <p className="text-lg font-extrabold text-collab-yellow sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-neutral-600 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
