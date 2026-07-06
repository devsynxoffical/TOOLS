import { ReactNode } from "react";
import { TOOL_CATALOG } from "@/lib/tools/catalog";
import { Logo } from "@/components/layout/Logo";
type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div className="auth-panel-left">
        <div className="absolute inset-0 bg-mesh-hero opacity-40" />
        <div className="absolute -left-20 top-20 h-72 w-72 animate-pulse-glow rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-64 w-64 animate-float rounded-full bg-accent-500/15 blur-3xl" />

        <div className="relative">
          <Logo
            showText
            className="[&_span]:text-neutral-0 [&_span]:hover:text-primary-200"
          />
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight text-neutral-0">
            {title}
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-neutral-400">
            {subtitle}
          </p>

          <div className="mt-12 space-y-4">
            {[
              `Access ${TOOL_CATALOG.length} premium SEO tools`,
              "One dashboard, one subscription",
              "Instant provisioning after signup",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500/20">
                  <svg className="h-3.5 w-3.5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-neutral-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} GroupBuy Tools
        </p>
      </div>

      {/* Right form panel */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="absolute inset-0 bg-mesh-dashboard opacity-50" />
        <div className="relative w-full max-w-md lg:hidden">
          <div className="mb-8 flex justify-center">
            <Logo showText />
          </div>
        </div>        <div className="relative w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
