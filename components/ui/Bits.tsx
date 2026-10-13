import type { ReactNode } from "react";
import { cn, initials, type StockStatus } from "@/lib/utils";

const pillTones = {
  green: "bg-mint text-brand",
  gold: "bg-gold-soft text-gold-ink",
  red: "bg-danger-soft text-danger",
} as const;

export function Pill({ tone = "green", children }: { tone?: keyof typeof pillTones; children: ReactNode }) {
  return <span className={cn("pill", pillTones[tone])}>{children}</span>;
}

const stockLabels: Record<StockStatus, { label: string; tone: keyof typeof pillTones }> = {
  in: { label: "In stock", tone: "green" },
  low: { label: "Low stock", tone: "gold" },
  out: { label: "Out of stock", tone: "red" },
};

export function StockPill({ status }: { status: StockStatus }) {
  const { label, tone } = stockLabels[status];
  return <Pill tone={tone}>{label}</Pill>;
}

const avatarTones = {
  forest: "bg-forest text-gold",
  mint: "bg-mint-strong text-forest",
  gold: "bg-gold-soft text-gold-ink",
} as const;

interface AvatarProps {
  name: string;
  tone?: keyof typeof avatarTones;
  className?: string;
}

export function Avatar({ name, tone = "mint", className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        avatarTones[tone],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
}

/** The title row at the top of every signed-in page. */
export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="heading-display text-[28px] leading-tight sm:text-[34px]">{title}</h1>
        {subtitle && <p className="text-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2.5">{children}</div>}
    </div>
  );
}

export function EmptyState({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="max-w-sm text-muted">{body}</p>
      {children && <div className="pt-3">{children}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-line/70", className)} />;
}
