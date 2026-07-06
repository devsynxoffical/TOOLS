import { HeroSection } from "@/components/home/HeroSection";

import { FeatureCard } from "@/components/home/FeatureCard";

import { ReviewsSection } from "@/components/home/ReviewsSection";

import { AnimateIn } from "@/components/ui/AnimateIn";

import Link from "next/link";



const features = [

  {

    icon: "hub",

    title: "All-in-one access",

    description:

      "One login gives you Ahrefs, Semrush, Moz, and more. No juggling multiple accounts or browser extensions.",

  },

  {

    icon: "bolt",

    title: "Fast access",

    description:

      "Pay via bank transfer, get verified by admin, then launch tools instantly from your dashboard.",

  },

  {

    icon: "receipt_long",

    title: "Per-tool pricing",

    description:

      "Transparent PKR pricing per tool with order history. Buy only what you need — no hidden fees.",

  },

  {

    icon: "shield",

    title: "Secure & reliable",

    description:

      "Enterprise-grade infrastructure with encrypted sessions and 99.9% uptime. Your data stays private.",

  },

];



export default function HomePage() {

  return (

    <>

      <HeroSection />



      <section className="mx-auto max-w-container px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <AnimateIn className="mb-10 text-center">
          <span className="mb-3 block text-sm font-semibold text-brand-primary">
            Why choose us
          </span>

          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">

            Everything you need to dominate search

          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600 sm:text-base">

            Stop overpaying for individual tool subscriptions. Get the full SEO

            stack at a price that makes sense.

          </p>

        </AnimateIn>



        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {features.map((feature, i) => (

            <AnimateIn key={feature.title} delay={i * 100}>

              <FeatureCard {...feature} />

            </AnimateIn>

          ))}

        </div>

      </section>



      <section className="px-4 py-10 sm:px-6 lg:px-10">
        <AnimateIn className="relative mx-auto max-w-container overflow-hidden rounded-2xl bg-primary-100 px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
            Ready to save on SEO tools?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-600 sm:text-base">
            Join thousands of marketers who switched to GroupBuy Tools and never
            looked back.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary">
              Get started free
            </Link>
            <Link href="/pricing" className="btn-secondary">
              See plans &amp; pricing
            </Link>
          </div>
        </AnimateIn>
      </section>



      <ReviewsSection />

    </>

  );

}


