import Link from "next/link";
import { ReactNode } from "react";
import { LegalNav } from "./LegalNav";
import { AnimateIn } from "@/components/ui/AnimateIn";

type LegalPageProps = {
  title: string;
  description: string;
  children: ReactNode;
  lastUpdated?: string;
};

export function LegalPage({
  title,
  description,
  children,
  lastUpdated = "July 2026",
}: LegalPageProps) {
  return (
    <div className="relative">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-neutral-200/60 bg-neutral-0/60 pt-16">
        <div className="absolute inset-0 bg-mesh-hero opacity-70" />
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-primary-400/15 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-accent-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <AnimateIn>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
              {description}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-neutral-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Last updated: {lastUpdated}
            </p>
          </AnimateIn>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="w-full shrink-0 lg:w-56">
            <div className="lg:sticky lg:top-24">
              <LegalNav />
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-5">
            <AnimateIn delay={100}>{children}</AnimateIn>

            {/* Contact CTA */}
            <div className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-cta p-6 text-neutral-0 sm:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <h3 className="text-lg font-bold">Questions about this policy?</h3>
                <p className="mt-2 max-w-lg text-sm text-primary-100/90">
                  Our team is happy to clarify any legal or billing questions before
                  you subscribe.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-0 px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Contact support
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
