import { HeroSection } from "@/components/home/HeroSection";
import { ToolsShowcaseSection } from "@/components/home/ToolsShowcaseSection";
import { WhoItsForSection } from "@/components/home/WhoItsForSection";
import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { FeaturedTestimonial } from "@/components/home/FeaturedTestimonial";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { ToolsLogoCloud } from "@/components/home/ToolsLogoCloud";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ToolsShowcaseSection />
      <WhoItsForSection />
      <BenefitsStrip />
      <FeaturedTestimonial />
      <ConsultationSection />
      <ToolsLogoCloud />
      <NewsletterSection />
    </>
  );
}
