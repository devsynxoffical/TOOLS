import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { DurationPlansSection } from "@/components/home/DurationPlansSection";
import { ToolsShowcaseSection } from "@/components/home/ToolsShowcaseSection";
import { WhyRankmoraSection } from "@/components/home/WhyRankmoraSection";
import { WhoItsForSection } from "@/components/home/WhoItsForSection";
import { ToolsLogoCloud } from "@/components/home/ToolsLogoCloud";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium SEO Tools for 1, 3, 7 or 30 Days | Rankmora",
  description:
    "Buy SEO tools for 1 day, 3 days, 7 days, or 30 days. Flexible access to Semrush, Moz, SpyFu, Majestic, Ahrefs, and more — priced in PKR on Rankmora.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DurationPlansSection />
      <ToolsShowcaseSection />
      <WhyRankmoraSection />
      <WhoItsForSection />
      <ToolsLogoCloud />
      <HomeFaqSection />
      <HomeFinalCta />
    </>
  );
}
