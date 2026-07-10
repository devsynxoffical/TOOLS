import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const footerLinks = {
  menu: [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Tools" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  product: [
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/signup", label: "Create account" },
    { href: "/login", label: "Login" },
  ],
  legal: [
    { href: "/legal/terms", label: "Terms" },
    { href: "/legal/privacy-policy", label: "Privacy" },
    { href: "/legal/disclaimer", label: "Disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-br from-[#125A8E] via-[#146BA8] to-[#197CC0] pt-28 text-white/85">
      <div className="mx-auto max-w-container px-4 pb-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo
              showText
              variant="light"
              className="[&_span:first-child]:bg-collab-yellow [&_span:first-child]:text-white"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Professional SEO tool access for freelancers and agencies. Pay per
              tool in PKR, launch from one secure dashboard.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="mailto:support@groupbuytools.com"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/15 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/25 hover:text-white"
                aria-label="Email support"
              >
                <MaterialIcon name="mail" />
              </a>
              <Link
                href="/contact"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-white/15 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/25 hover:text-white"
                aria-label="Contact"
              >
                <MaterialIcon name="chat" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-extrabold text-white">Menu</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-extrabold text-white">Product</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-extrabold text-white">Legal</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-extrabold text-white">Get started</h4>
            <p className="mt-4 text-sm text-white/70">
              Create your account and browse tools today.
            </p>
            <Link href="/signup" className="btn-glass-solid mt-4 inline-flex">
              Create account
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 sm:flex-row">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} GroupBuy Tools. All rights reserved.
          </p>
          <p className="text-sm text-white/60">
            Built for SEO professionals in Pakistan &amp; beyond.
          </p>
        </div>
      </div>
    </footer>
  );
}
