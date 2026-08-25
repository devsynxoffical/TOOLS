"use client";

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  showText?: boolean;
  className?: string;
  variant?: "default" | "light" | "collab" | "dashboard";
  href?: string;
  onClick?: () => void;
};

export function Logo({
  className = "",
  href = "/",
  onClick,
}: LogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center ${className}`}
      aria-label="Rankmora home"
    >
      <Image
        src="/rm-logo.png"
        alt="Rankmora"
        width={160}
        height={81}
        className="h-9 w-auto object-contain sm:h-10"
        priority
      />
    </Link>
  );
}
