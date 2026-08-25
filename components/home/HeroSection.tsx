import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const durations = [
  {
    days: "1",
    label: "Day",
    hint: "Quick tasks & single audits",
    tag: "Flexible",
    popular: false,
  },
  {
    days: "3",
    label: "Days",
    hint: "Short projects & client briefs",
    tag: "Pro",
    popular: false,
  },
  {
    days: "7",
    label: "Days",
    hint: "Weekly campaign & deep research",
    tag: "Most Popular",
    popular: true,
  },
  {
    days: "30",
    label: "Days",
    hint: "Full monthly SEO access",
    tag: "Best Value",
    popular: false,
  },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4.25rem)] sm:min-h-[calc(100vh-4.75rem)] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#1877b8] via-[#146BA8] to-[#0d4c78] text-white">
      {/* Dynamic Background Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='900' height='700' viewBox='0 0 900 700' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-80 160C180 60 380 260 640 150C790 80 890 210 1000 140' stroke='white' stroke-width='1.5' stroke-opacity='0.45'/%3E%3Cpath d='M-40 360C210 250 420 460 680 340C830 270 930 400 1040 330' stroke='white' stroke-width='1.5' stroke-opacity='0.3'/%3E%3Cpath d='M0 560C250 450 460 660 720 540C870 470 970 600 1080 530' stroke='white' stroke-width='1.5' stroke-opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-[32rem] w-[32rem] rounded-full bg-white/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-[#053252]/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[45rem] w-[45rem] rounded-full bg-radial-gradient from-white/10 to-transparent blur-3xl opacity-50"
        aria-hidden
      />

      <div className="relative z-10 w-full mx-auto max-w-container px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 xl:gap-16">
          {/* Copy + Actions */}
          <div className="min-w-0 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md shadow-sm mb-6 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Instant On-Demand SEO Access &bull; Pay in PKR</span>
            </div>

            <h1 className="mx-auto max-w-xl text-balance text-3xl sm:text-5xl lg:mx-0 lg:text-[3.35rem] xl:text-[3.75rem] font-extrabold leading-[1.08] tracking-tight text-white animate-fade-in">
              Premium SEO tools for{" "}
              <span className="relative inline-block whitespace-nowrap text-white underline decoration-white/40 decoration-wavy decoration-1 underline-offset-8">
                1–30 days
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/85 animate-fade-in-up sm:mt-6 sm:text-lg lg:mx-0">
              Buy only the access you need — pay in PKR, launch in 1-click from
              your private dashboard. Zero forced yearly subscriptions.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-7 max-w-lg animate-fade-in-up lg:mx-0">
              <HeroSearch />
            </div>

            {/* Action Buttons */}
            <div className="mx-auto mt-6 flex max-w-lg flex-col gap-3 animate-fade-in-up sm:flex-row sm:justify-center lg:mx-0 lg:justify-start">
              <Link
                href="/pricing"
                className="btn-glass-solid !rounded-full !px-7 !py-3.5 text-center font-bold shadow-lg"
              >
                Browse tools & durations
              </Link>
              <Link
                href="/signup"
                className="btn-glass-outline !rounded-full !px-7 !py-3.5 text-center font-semibold"
              >
                Sign up free
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/80 animate-fade-in-up sm:justify-center lg:mx-0 lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <MaterialIcon name="bolt" className="text-emerald-300 text-sm" />
                Instant Access
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MaterialIcon name="security" className="text-sky-200 text-sm" />
                Private & Secure
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MaterialIcon name="support_agent" className="text-amber-300 text-sm" />
                24/7 Fast Support
              </span>
            </div>
          </div>

          {/* Duration Visual Showcase */}
          <div className="relative mx-auto w-full max-w-md animate-fade-in-up lg:max-w-none">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-70 blur-xl" />
            <div className="relative rounded-[1.75rem] border border-white/35 bg-white/15 p-6 shadow-[0_24px_60px_-15px_rgba(0,30,70,0.5)] backdrop-blur-2xl sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white ring-1 ring-white/30">
                    Flexible Plans
                  </span>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-[1.75rem]">
                    Pick your duration
                  </h3>
                </div>
                <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                  <MaterialIcon name="schedule" className="text-xl" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3.5">
                {durations.map((d) => (
                  <Link
                    key={d.days}
                    href={`/pricing?duration=${d.days}`}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      d.popular
                        ? "border-white/90 bg-white text-collab-yellow shadow-lg ring-2 ring-white/50"
                        : "border-white/25 bg-white/10 text-white hover:border-white/45 hover:bg-white/20"
                    }`}
                  >
                    {d.popular && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-collab-yellow px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm ring-1 ring-white">
                        ★ {d.tag}
                      </span>
                    )}

                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-3xl font-black tabular-nums sm:text-4xl ${
                            d.popular ? "text-collab-yellow" : "text-white"
                          }`}
                        >
                          {d.days}
                        </span>
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            d.popular
                              ? "text-collab-yellow/80"
                              : "text-white/80"
                          }`}
                        >
                          {d.label}
                        </span>
                      </div>

                      <p
                        className={`mt-2 text-xs font-medium leading-snug line-clamp-2 ${
                          d.popular ? "text-neutral-600" : "text-white/75"
                        }`}
                      >
                        {d.hint}
                      </p>
                    </div>

                    <div
                      className={`mt-3 flex items-center justify-between border-t pt-2.5 text-[11px] font-bold ${
                        d.popular
                          ? "border-neutral-100 text-collab-yellow"
                          : "border-white/15 text-white/90 group-hover:text-white"
                      }`}
                    >
                      <span>Choose</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth transition into the next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white/20 sm:h-16"
        aria-hidden
      />
    </section>
  );
}
