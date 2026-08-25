"use client";

import Link from "next/link";

type LogoProps = {
  showText?: boolean;
  className?: string;
  variant?: "default" | "light" | "collab" | "dashboard";
  href?: string;
  onClick?: () => void;
};

export function Logo({
  showText = true,
  className = "",
  variant = "default",
  href = "/",
  onClick,
}: LogoProps) {
  const textClass =
    variant === "light"
      ? "text-white group-hover:text-primary-200"
      : variant === "collab"
        ? "text-white group-hover:text-white/85"
        : variant === "dashboard"
          ? "text-collab-yellow group-hover:text-collab-yellow/80"
          : "text-neutral-900 group-hover:text-brand-primary";

  const iconClass =
    variant === "collab"
      ? "glass-icon text-white"
      : variant === "dashboard"
        ? "bg-collab-yellow text-white"
        : "bg-gradient-brand text-white";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-extrabold shadow-sm ${iconClass}`}
      >
        RM
      </span>
      {showText && (
        <span className={`text-base font-extrabold tracking-tight transition-colors sm:text-lg ${textClass}`}>
          Rankmora
        </span>
      )}
    </Link>
  );
}
