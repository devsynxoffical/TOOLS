import Link from "next/link";
import { SectionHeader } from "@/components/home/SectionHeader";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const plans = [
  {
    days: "1",
    title: "1-Day access",
    blurb:
      "Perfect for a quick keyword check, competitor peek, or one-off backlink research.",
    icon: "bolt",
    highlight: true,
  },
  {
    days: "3",
    title: "3-Day access",
    blurb:
      "Short projects that need more than a day — deeper keyword and competitor research.",
    icon: "timer",
  },
  {
    days: "7",
    title: "7-Day access",
    blurb:
      "Weekly campaigns for freelancers, marketers, and agencies running focused SEO sprints.",
    icon: "date_range",
  },
  {
    days: "30",
    title: "30-Day access",
    blurb:
      "Monthly client work, ongoing campaigns, content planning, and recurring SEO tasks.",
    icon: "calendar_month",
  },
];

export function DurationPlansSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <SectionHeader
          eyebrow="Flexible access"
          title="1 day, 3 days, 7 days & 30 days"
          description="Every SEO project is different. Choose the duration that fits your task — not a subscription that outlasts the work."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.days}
              className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-collab-yellow bg-collab-yellow text-white shadow-lg"
                  : "border-neutral-200/80 bg-white shadow-sm hover:border-collab-yellow/40 hover:shadow-md"
              }`}
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
                  plan.highlight
                    ? "bg-white/20 text-white"
                    : "bg-collab-yellow text-white"
                }`}
              >
                <MaterialIcon name={plan.icon} className="text-2xl" />
              </div>
              <p
                className={`text-4xl font-extrabold tracking-tight ${
                  plan.highlight ? "text-white" : "text-collab-yellow"
                }`}
              >
                {plan.days}
                <span className="ml-1 text-base font-bold opacity-80">days</span>
              </p>
              <h3
                className={`mt-2 text-lg font-extrabold ${
                  plan.highlight ? "text-white" : "text-collab-dark"
                }`}
              >
                {plan.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  plan.highlight ? "text-white/85" : "text-neutral-600"
                }`}
              >
                {plan.blurb}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/pricing" className="btn-marketing">
            See tools & pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
