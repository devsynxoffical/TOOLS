import { HeroSection } from "@/components/home/HeroSection";
import { ToolsShowcaseSection } from "@/components/home/ToolsShowcaseSection";
import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { ToolsLogoCloud } from "@/components/home/ToolsLogoCloud";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ToolsShowcaseSection />
      <BenefitsStrip />
      <ToolsLogoCloud />

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-container overflow-hidden rounded-[2rem] bg-primary-50 px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Get started today
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-600 sm:text-base">
            Create your account, browse tools, and get access granted by your
            administrator.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary min-w-[160px]">
              Create account
            </Link>
            <Link href="/login" className="btn-secondary min-w-[160px]">
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
