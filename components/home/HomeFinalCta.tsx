import Link from "next/link";

export function HomeFinalCta() {
  return (
    <section className="relative overflow-hidden bg-collab-yellow py-16 text-white sm:py-20">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-container px-4 text-center sm:px-6 lg:px-10">
        <p className="text-sm font-extrabold tracking-wide text-white/90">
          Rankmora
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
          Choose your tool. Choose your duration. Start your SEO work.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">
          Need a tool for one day? Choose 1-day access. Short project? 3 or 7
          days. Monthly campaign? Go with 30 days — priced in PKR.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/pricing" className="btn-glass-solid !rounded-full">
            Explore tools
          </Link>
          <Link href="/signup" className="btn-glass-outline !rounded-full">
            Create free account
          </Link>
        </div>
      </div>
    </section>
  );
}
