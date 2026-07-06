import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SectionHeader } from "@/components/home/SectionHeader";

const audienceFeatures = [
  {
    icon: "person",
    title: "Freelancers",
    description:
      "Get enterprise-grade SEO data without paying full retail for every tool.",
  },
  {
    icon: "groups",
    title: "Agencies",
    description:
      "Equip your team with Semrush, Moz, and more from one shared workspace.",
  },
  {
    icon: "trending_up",
    title: "Growth teams",
    description:
      "Scale research and reporting with per-tool pricing that fits your stack.",
  },
  {
    icon: "school",
    title: "Learners",
    description:
      "Practice on real platforms while building skills — at a fraction of the cost.",
  },
];

export function WhoItsForSection() {
  return (
    <section className="border-y border-neutral-200/60 bg-neutral-50 py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white shadow-card">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 via-white to-primary-50 p-8">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-white/80 bg-white/60 p-6 backdrop-blur-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                      Built for SEO pros
                    </p>
                    <p className="mt-3 text-2xl font-bold text-neutral-900">
                      One dashboard for your entire tool stack
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Secure cookie-based launch",
                      "Manual payment + fast approval",
                      "Per-tool PKR pricing",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm"
                      >
                        <MaterialIcon
                          name="check_circle"
                          className="text-brand-primary"
                          filled
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 hidden rounded-2xl bg-neutral-900 px-5 py-4 text-white shadow-lg sm:block">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-neutral-300">Platform uptime</p>
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Who it's for"
              title="Perfect for every SEO workflow"
              description="Whether you run client campaigns solo or manage a full agency team, GroupBuy Tools keeps access simple and affordable."
              align="left"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {audienceFeatures.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-card"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-brand-primary">
                    <MaterialIcon name={item.icon} />
                  </div>
                  <h3 className="font-bold text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
