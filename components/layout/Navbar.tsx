import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Logo } from "@/components/layout/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-neutral-200/60 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-6 lg:px-10">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-neutral-600 transition-colors hover:text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/dashboard" className="btn-pill">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">
                Log in
              </Link>
              <Link href="/signup" className="btn-pill">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
