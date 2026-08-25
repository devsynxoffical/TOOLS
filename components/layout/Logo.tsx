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
  variant = "default",
  href = "/",
  onClick,
}: LogoProps) {
  const isLightVariant = variant === "light" || variant === "dashboard";
  const src = isLightVariant ? "/rm-logo-on-light.png" : "/rm-logo-on-dark.png";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center transition-opacity hover:opacity-90 ${className}`}
      aria-label="Rankmora home"
    >
      <Image
        src={src}
        alt="Rankmora"
        width={180}
        height={50}
        className="h-9 w-auto object-contain sm:h-10 transition-transform duration-200 group-hover:scale-[1.02]"
        priority
      />
    </Link>
  );
}
