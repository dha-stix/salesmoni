"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  gold: "bg-gold text-forest hover:brightness-95",
  outline: "border border-line-strong bg-white text-ink hover:bg-ground",
  ghost: "text-ink hover:bg-ink/5",
  "outline-dark": "border border-forest-line text-white hover:bg-white/10",
  danger: "bg-danger text-white hover:brightness-110",
} as const;

const sizes = {
  md: "min-h-[46px] px-[18px] text-[15px] rounded-xl",
  lg: "min-h-[54px] px-6 text-base rounded-[14px]",
  pill: "min-h-[52px] px-6 text-base rounded-full",
} as const;

interface Shared {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-bold transition-[background-color,filter,transform] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const classes = ({ variant = "primary", size = "md", className }: Omit<Shared, "children">) =>
  cn(base, variants[variant], sizes[size], className);

type ButtonProps = Shared & ComponentProps<"button"> & { loading?: boolean };

export function Button({ variant, size, className, loading, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={classes({ variant, size, className })}
    >
      {loading && <LoaderCircle className="size-[18px] animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

type ButtonLinkProps = Shared & { href: string };

export function ButtonLink({ variant, size, className, href, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={classes({ variant, size, className })}>
      {children}
    </Link>
  );
}
