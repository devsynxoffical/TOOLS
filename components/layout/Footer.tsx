import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const footerLinks = {
  product: [
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/signup", label: "Create account" },
  ],
  company: [
    { href: "/about", label: "About us" },
    { href: "/contact", label: "Contact" },
    { href: "/legal/terms", label: "Terms" },
  ],
  support: [
    { href: "/legal/privacy-policy", label: "Privacy policy" },
    { href: "/legal/refund-policy", label: "Refund policy" },
    { href: "/legal/disclaimer", label: "Disclaimer" },
    { href: "/contact", label: "Help center" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto bg-neutral-900 text-neutral-200">
      <div className="mx-auto max-w-container px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo
              showText
              className="[&_span]:text-white [&_span]:hover:text-primary-200"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
              Professional SEO tool access for freelancers and agencies. Pay per
              tool in PKR, launch from one secure dashboard.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="mailto:support@groupbuytools.com"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-400 transition-colors hover:border-primary-500/40 hover:text-white"
                aria-label="Email support"
              >
                <MaterialIcon name="mail" />
              </a>
              <Link
                href="/contact"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-400 transition-colors hover:border-primary-500/40 hover:text-white"
                aria-label="Contact"
              >
                <MaterialIcon name="chat" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-sm font-bold text-white">Product</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white">Company</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white">Support</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-6 sm:flex-row">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} GroupBuy Tools. All rights reserved.
          </p>
          <p className="text-sm text-neutral-500">
            Built for SEO professionals in Pakistan &amp; beyond.
          </p>
        </div>
      </div>
    </footer>
  );
}
