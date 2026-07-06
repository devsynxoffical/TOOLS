import Link from "next/link";

type LogoProps = {
  showText?: boolean;
  className?: string;
  variant?: "default" | "light";
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
      : "text-neutral-900 group-hover:text-brand-primary";

  return (
    <Link href={href} className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-sm font-extrabold text-white shadow-glow-sm">
        GB
      </span>
      {showText && (
        <span className={`text-lg font-extrabold tracking-tight transition-colors ${textClass}`}>
          GroupBuy Tools
        </span>
      )}
    </Link>
  );
}
