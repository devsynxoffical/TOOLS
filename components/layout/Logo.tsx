import Link from "next/link";

type LogoProps = {
  showText?: boolean;
  className?: string;
};

export function Logo({ showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`group inline-flex items-center ${className}`}>
      {showText && (
        <span className="text-xl font-extrabold text-brand-primary">
          GroupBuy Tools
        </span>
      )}
    </Link>
  );
}
