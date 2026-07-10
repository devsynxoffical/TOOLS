"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { adminUrl } from "@/lib/config/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Tools" },
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
  const onHero = pathname === "/";

  return (
    <header className="relative z-50 w-full">
      <nav className="mx-auto grid h-16 max-w-container grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:px-10">
        {/* Logo */}
        <div className="justify-self-start">
          <Logo variant="collab" showText />
        </div>

        {/* Desktop nav — centered */}
        <div className="hidden justify-self-center md:flex md:items-center md:gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  active
                    ? "bg-white/95 text-collab-yellow shadow-sm backdrop-blur-sm"
                    : onHero
                      ? "text-white/90 hover:bg-white/20 hover:text-white"
                      : "text-neutral-600 hover:bg-collab-gray hover:text-collab-yellow"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions + mobile menu */}
        <div className="flex items-center justify-end gap-2 justify-self-end">
          <div className="hidden items-center gap-2 sm:gap-3 md:flex">
            {isLoggedIn ? (
              <Link
                href={isAdmin ? adminUrl("/admin") : "/dashboard"}
                className={`!rounded-full ${onHero ? "btn-glass-pill" : "btn-marketing-pill"}`}
              >
                {isAdmin ? "Admin" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`!rounded-full !px-5 !py-2.5 ${onHero ? "btn-glass-outline" : "btn-marketing-outline"}`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`!rounded-full !px-5 !py-2.5 ${onHero ? "btn-glass-solid" : "btn-marketing-pill"}`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
              onHero
                ? "border border-white/40 bg-white/20 text-white backdrop-blur-sm"
                : "border-2 border-collab-yellow/20 bg-white/80 text-collab-yellow"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <MaterialIcon name={open ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className={`border-t px-4 py-4 md:hidden ${
            onHero ? "border-white/20 bg-collab-yellow/95 backdrop-blur-md" : "border-neutral-100 bg-white"
          }`}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-bold ${
                    active
                      ? onHero
                        ? "bg-white/95 text-collab-yellow"
                        : "bg-collab-yellow-light text-collab-yellow"
                      : onHero
                        ? "text-white hover:bg-white/20"
                        : "text-neutral-700 hover:bg-collab-gray"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className={`mt-4 flex flex-col gap-2 border-t pt-4 ${onHero ? "border-white/20" : "border-neutral-100"}`}>
            {isLoggedIn ? (
              <Link
                href={isAdmin ? adminUrl("/admin") : "/dashboard"}
                className={`text-center !rounded-full ${onHero ? "btn-glass-pill" : "btn-marketing-pill"}`}
                onClick={() => setOpen(false)}
              >
                {isAdmin ? "Admin" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-center !rounded-full ${onHero ? "btn-glass-outline" : "btn-marketing-outline"}`}
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`text-center !rounded-full ${onHero ? "btn-glass-solid" : "btn-marketing-pill"}`}
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
