import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SectionHeader } from "@/components/home/SectionHeader";

const audienceList = [
  { icon: "person", label: "Freelancers" },
  { icon: "groups", label: "Agencies" },
  { icon: "trending_up", label: "Growth teams" },
  { icon: "school", label: "Learners" },
  { icon: "storefront", label: "E-commerce brands" },
  { icon: "campaign", label: "Marketing teams" },
];

export function WhoItsForSection() {
  return (
    <section className="marketing-section-gray py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Who it's for"
              title="Our tools are suitable for everyone in SEO"
              description="Whether you run client campaigns solo or manage a full agency team, GroupBuy Tools keeps access simple and affordable."
              align="left"
            />

            <ul className="space-y-3">
              {audienceList.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-collab-yellow text-white">
                    <MaterialIcon name={item.icon} className="text-xl" />
                  </span>
                  <span className="text-base font-bold text-collab-dark">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-collab-yellow sm:h-40 sm:w-40" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-collab-dark/10" />

            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-collab-gray via-white to-collab-yellow-light p-8">
                <div className="flex h-full flex-col justify-between rounded-xl border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
                  <div>
                    <p className="marketing-eyebrow">Built for SEO pros</p>
                    <p className="mt-3 text-2xl font-extrabold text-collab-dark">
                      One dashboard for your entire tool stack
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Secure cookie-based launch",
                      "Manual payment + fast approval",
                      "Per-tool PKR pricing",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-lg bg-collab-gray px-4 py-3 text-sm font-semibold text-collab-dark"
                      >
                        <MaterialIcon
                          name="check_circle"
                          className="text-collab-dark"
                          filled
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 rounded-xl bg-collab-dark px-5 py-4 text-white shadow-xl">
              <p className="text-2xl font-extrabold">99.9%</p>
              <p className="text-xs text-white/60">Platform uptime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
