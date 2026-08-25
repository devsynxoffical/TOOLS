import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ToolLogo } from "@/components/ui/ToolLogo";

const durations = [
  { days: "1", label: "Day", hint: "Quick tasks" },
  { days: "3", label: "Days", hint: "Short projects" },
  { days: "7", label: "Days", hint: "Weekly campaigns" },
  { days: "30", label: "Days", hint: "Monthly SEO" },
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
          <div className="min-w-0 text-center lg:text-left">
            <p className="text-sm font-extrabold tracking-wide text-white/90 sm:text-base">
              Rankmora
            </p>
            <h1 className="mx-auto mt-3 max-w-xl text-balance text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:mx-0 lg:text-[3.1rem]">
              Premium SEO tools for 1, 3, 7 or 30 days
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:mt-5 sm:text-lg lg:mx-0">
              Buy only the access you need — pay in PKR, launch from one
              dashboard. No forced yearly subscriptions.
            </p>

            <div className="mx-auto mt-8 max-w-xl lg:mx-0">
              <HeroSearch />
            </div>

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
              <Link href="/pricing" className="btn-glass-solid !rounded-full text-center">
                Browse tools & durations
              </Link>
              <Link
                href="/signup"
                className="btn-glass-outline !rounded-full text-center"
              >
                Sign up free
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl border border-white/35 bg-white/20 p-5 shadow-xl backdrop-blur-md sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/90 sm:text-xs">
                Flexible access
              </p>
              <p className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                Pick your duration
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {durations.map((d, i) => (
                  <div
                    key={d.days}
                    className={`rounded-xl border border-white/30 px-3 py-4 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 ${
                      i === 0
                        ? "bg-white text-collab-yellow shadow-lg"
                        : "bg-white/15 text-white"
                    }`}
                  >
                    <p
                      className={`text-3xl font-extrabold sm:text-4xl ${
                        i === 0 ? "text-collab-yellow" : "text-white"
                      }`}
                    >
                      {d.days}
                    </p>
                    <p
                      className={`text-xs font-bold uppercase tracking-wide ${
                        i === 0 ? "text-collab-yellow/80" : "text-white/80"
                      }`}
                    >
                      {d.label}
                    </p>
                    <p
                      className={`mt-1 text-[10px] font-semibold sm:text-xs ${
                        i === 0 ? "text-neutral-500" : "text-white/70"
                      }`}
                    >
                      {d.hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
