"use client";

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  showText?: boolean;
  className?: string;
  imageClassName?: string;
  variant?: "default" | "light" | "collab" | "dashboard" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  onClick?: () => void;
};

const SIZE_CLASSES: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-8 sm:h-9",
  md: "h-10 sm:h-11",
  lg: "h-12 sm:h-13 lg:h-14",
  xl: "h-14 sm:h-16 lg:h-20",
};

export function Logo({
  className = "",
  imageClassName = "",
  variant = "default",
  size = "lg",
  href = "/",
  onClick,
}: LogoProps) {
  const isLightVariant = variant === "light" || variant === "dashboard";
  const src = isLightVariant ? "/rm-logo-on-light.png" : "/rm-logo-on-dark.png";
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.lg;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center transition-all duration-200 hover:opacity-95 active:scale-[0.99] ${className}`}
      aria-label="Rankmora home"
    >
      <Image
        src={src}
        alt="Rankmora"
        width={300}
        height={175}
        quality={100}
        className={`${sizeClass} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] ${imageClassName}`}
        priority
      />
    </Link>
  );
}
