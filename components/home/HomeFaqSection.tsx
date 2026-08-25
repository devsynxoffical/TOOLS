"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/home/SectionHeader";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const faqs = [
  {
    q: "What is Rankmora?",
    a: "Rankmora is a platform that provides access to selected SEO, marketing, content, and research tools through a centralized dashboard — with flexible access periods and PKR pricing.",
  },
  {
    q: "Can I buy an SEO tool for only one day?",
    a: "Yes. Where 1-day access is available for a tool, you can choose a 1-day option instead of a longer period.",
  },
  {
    q: "Can I buy SEO tools for 3 or 7 days?",
    a: "Yes. Selected tools may offer 3-day and 7-day access depending on current pricing and availability. Check each tool’s page for options.",
  },
  {
    q: "Is 30-day access available?",
    a: "Yes. 30-day access is available for selected tools and suits longer campaigns and ongoing projects.",
  },
  {
    q: "Which SEO tools are available?",
    a: "The catalog can include Semrush, Moz Pro, SpyFu, Majestic, KWFinder, Ahrefs, Keywords Everywhere, QuillBot, and other resources. Availability can change over time.",
  },
  {
    q: "Who can use Rankmora?",
    a: "Freelancers, agencies, marketers, e-commerce businesses, affiliate marketers, website owners, content creators, learners, and marketing teams.",
  },
  {
    q: "How do I get started?",
    a: "Create a Rankmora account, browse available tools, choose a tool and access period, and follow the purchasing steps on the platform.",
  },
];

export function HomeFaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers about flexible access, tools, and getting started on Rankmora."
        />

        <div className="mx-auto max-w-3xl divide-y divide-neutral-200 rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-collab-dark sm:text-base">
                    {item.q}
                  </span>
                  <MaterialIcon
                    name={isOpen ? "expand_less" : "expand_more"}
                    className="shrink-0 text-collab-yellow"
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600 sm:px-6">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
