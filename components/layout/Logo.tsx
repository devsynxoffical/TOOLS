"use client";

import Link from "next/link";

type LogoProps = {
  showText?: boolean;
  className?: string;
  variant?: "default" | "light" | "collab";
  href?: string;
};

export function Logo({
  showText = true,
  className = "",
  variant = "default",
  href = "/",
}: LogoProps) {
  const textClass =
    variant === "light"
      ? "text-white group-hover:text-primary-200"
      : variant === "collab"
        ? "text-collab-dark group-hover:text-collab-dark/80"
        : "text-neutral-900 group-hover:text-brand-primary";

  const iconClass =
    variant === "collab"
      ? "bg-collab-dark text-collab-yellow"
      : "bg-gradient-brand text-white";

  return (
    <Link href={href} className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-extrabold shadow-sm ${iconClass}`}
      >
        GB
      </span>
      {showText && (
        <span className={`text-base font-extrabold tracking-tight transition-colors sm:text-lg ${textClass}`}>
          GroupBuy
        </span>
      )}
    </Link>
  );
}
