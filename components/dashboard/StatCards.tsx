"use client";

import Link from "next/link";
import { CountUp, Reveal } from "@/components/ui/Motion";
import { cn, formatNaira } from "@/lib/utils";

export interface Stat {
  label: string;
  value: number;
  /** Money is shown in naira; counts are shown as plain numbers with a suffix. */
  kind: "money" | "count";
  suffix?: string;
  note: string;
  tone?: "forest" | "white" | "gold";
  link?: { href: string; label: string };
}

const tones = {
  forest: { card: "bg-forest border-forest text-white", label: "text-sage", note: "text-gold" },
  white: { card: "bg-white border-line", label: "text-muted", note: "text-muted" },
  gold: { card: "bg-gold-soft border-gold-line", label: "text-gold-ink", note: "text-gold-ink" },
};

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const tone = tones[stat.tone ?? "white"];
        return (
          <Reveal key={stat.label} immediate delay={index * 0.08} className={cn("flex flex-col gap-1.5 rounded-[20px] border p-5 sm:p-[22px]", tone.card)}>
            <p className={tone.label}>{stat.label}</p>
            <p className="tabular font-display text-[32px] font-bold leading-tight">
              {stat.kind === "money" ? <CountUp value={stat.value} format={formatNaira} /> : <CountUp value={stat.value} />}
              {stat.suffix && ` ${stat.suffix}`}
            </p>
            {stat.link ? (
              <Link href={stat.link.href} className={cn("text-sm font-bold underline", tone.note)}>
                {stat.link.label}
              </Link>
            ) : (
              <p className={cn("text-sm", tone.note)}>{stat.note}</p>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
