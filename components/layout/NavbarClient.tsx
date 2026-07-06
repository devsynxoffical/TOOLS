"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type NavbarClientProps = {
  isLoggedIn: boolean;
  isAdmin?: boolean;
};

export function NavbarClient({ isLoggedIn, isAdmin = false }: NavbarClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[4.25rem] max-w-container items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary-50 text-brand-primary"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="btn-pill">
              {isAdmin ? "Admin" : "Dashboard"}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:text-brand-primary"
              >
                Login
              </Link>
              <Link href="/signup" className="btn-pill">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <MaterialIcon name={open ? "close" : "menu"} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-primary-50 hover:text-brand-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-4">
            {isLoggedIn ? (
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className="btn-pill text-center"
              >
                {isAdmin ? "Admin" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-center">
                  Login
                </Link>
                <Link href="/signup" className="btn-pill text-center">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
