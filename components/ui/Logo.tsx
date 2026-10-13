import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "light" is for dark backgrounds. */
  tone?: "light" | "dark";
  href?: string;
  className?: string;
}

export function Logo({ tone = "dark", href = "/", className }: LogoProps) {
  const onDark = tone === "light";
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-[22px] font-bold",
        onDark ? "text-white" : "text-ink",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-[34px] items-center justify-center rounded-[10px]",
          onDark ? "bg-gold" : "bg-forest",
        )}
      >
        <svg
          aria-hidden
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={onDark ? "#0B2E22" : "#F4B63F"}
          strokeWidth="2.4"
          strokeLinecap="round"
          className="lucide"
        >
          <path d="M4 18V11" />
          <path d="M10 18V6" />
          <path d="M16 18v-5" />
          <path d="M20 18V9" />
        </svg>
      </span>
      SalesMoni
    </Link>
  );
}
