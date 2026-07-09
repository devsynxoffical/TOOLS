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
      <div className="relative overflow-hidden bg-collab-yellow text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <AnimateIn>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85">
              {description}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white/60">
              Last updated: {lastUpdated}
            </p>
          </AnimateIn>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="w-full shrink-0 lg:w-56">
            <div className="lg:sticky lg:top-24">
              <LegalNav />
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-5">
            <AnimateIn delay={100}>{children}</AnimateIn>

            <div className="relative mt-8 overflow-hidden rounded-2xl bg-collab-dark p-6 text-white sm:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-collab-yellow/20 blur-2xl" />
              <div className="relative">
                <h3 className="text-lg font-extrabold">Questions about this policy?</h3>
                <p className="mt-2 max-w-lg text-sm text-white/70">
                  Our team is happy to clarify any legal or billing questions before
                  you subscribe.
                </p>
                <Link
                  href="/contact"
                  className="btn-marketing mt-5 inline-flex !rounded-full !bg-collab-yellow !text-white hover:!bg-collab-yellow/90"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
