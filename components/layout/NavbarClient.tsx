"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { adminUrl } from "@/lib/config/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
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
    <header className="relative z-50 w-full">
      <nav className="mx-auto grid h-[4.25rem] max-w-container grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:h-[4.75rem] sm:px-6 lg:px-10">
        <div className="justify-self-start flex items-center">
          <Logo variant="light" showText />
        </div>

        <div className="hidden items-center gap-1 rounded-full bg-neutral-100/90 p-1.5 ring-1 ring-neutral-200/80 md:flex shadow-sm">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-150 ${
                  active
                    ? "bg-white text-collab-yellow shadow-sm font-bold"
                    : "text-neutral-600 hover:bg-white/80 hover:text-collab-yellow"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2.5 justify-self-end">
          <div className="hidden items-center gap-2.5 md:flex">
            {isLoggedIn ? (
              <Link
                href={isAdmin ? adminUrl("/admin") : "/dashboard"}
                className="btn-marketing-pill !rounded-full !px-5 !py-2.5 text-sm font-bold shadow-sm"
              >
                {isAdmin ? "Admin" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-collab-yellow"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-marketing-pill !rounded-full !px-5 !py-2.5 text-sm font-bold shadow-md shadow-collab-yellow/20"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 hover:text-collab-yellow md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <MaterialIcon name={open ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-neutral-100 bg-white/98 backdrop-blur-md px-4 py-4 shadow-xl md:hidden">
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
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    active
                      ? "bg-collab-yellow-light text-collab-yellow"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-collab-yellow"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-4">
            {isLoggedIn ? (
              <Link
                href={isAdmin ? adminUrl("/admin") : "/dashboard"}
                className="btn-marketing-pill text-center !rounded-full"
                onClick={() => setOpen(false)}
              >
                {isAdmin ? "Admin" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-marketing-outline text-center !rounded-full"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-marketing-pill text-center !rounded-full"
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
