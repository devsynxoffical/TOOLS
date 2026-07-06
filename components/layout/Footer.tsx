import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const footerLinks = {
  product: [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  support: [
    { href: "/legal/privacy-policy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms of Service" },
    { href: "/contact", label: "Help Center" },
  ],
};

export function Footer() {
  return (
    <footer className="relative z-20 mt-auto w-full shrink-0 overflow-hidden border-t border-neutral-800 bg-gradient-dark text-neutral-0">
      <div className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-primary-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-container px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo
              showText
              className="mb-5 [&_span]:text-neutral-0 [&_span]:hover:text-primary-200"
            />
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-neutral-200">
              Professional tool aggregation for high-growth SEO agencies. One
              subscription, infinite possibilities.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700/80 bg-neutral-800/60 text-neutral-400 transition-colors hover:border-primary-500/40 hover:text-primary-200"
                aria-label="Website"
              >
                <MaterialIcon name="public" />
              </a>
              <a
                href="mailto:support@groupbuytools.com"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700/80 bg-neutral-800/60 text-neutral-400 transition-colors hover:border-primary-500/40 hover:text-primary-200"
                aria-label="Email"
              >
                <MaterialIcon name="alternate_email" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary-300">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-200 transition-colors hover:text-primary-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary-300">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-200 transition-colors hover:text-primary-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary-300">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-200 transition-colors hover:text-primary-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6">
          <p className="text-center text-sm text-neutral-400 sm:text-left">
            &copy; {new Date().getFullYear()} GroupBuy Tools. Agency-grade SEO
            access.
          </p>
        </div>
      </div>
    </footer>
  );
}
