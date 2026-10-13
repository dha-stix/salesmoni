"use client";

import { motion } from "framer-motion";
import { CalendarDays, ChartLine, Download, Package, ReceiptText, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  tone: "white" | "forest" | "gold";
}

const features: Feature[] = [
  {
    icon: ReceiptText,
    title: "Record a sale in seconds",
    body: "Pick the product, enter the quantity, and save. The total is worked out for you and the sale lands in today's records straight away.",
    tone: "white",
  },
  {
    icon: Package,
    title: "Stock that counts itself",
    body: "Every sale reduces the quantity left. You get a warning before a product runs out.",
    tone: "forest",
  },
  {
    icon: ChartLine,
    title: "See the whole year",
    body: "A dashboard shows sales by month, your best sellers, and totals at a glance.",
    tone: "white",
  },
  {
    icon: CalendarDays,
    title: "Look back at any day",
    body: "Open the calendar, tap a date, and see exactly what was sold that day.",
    tone: "white",
  },
  {
    icon: Download,
    title: "Download to Excel",
    body: "Export sales for a month, a year, or any dates you choose as a ready-made spreadsheet.",
    tone: "gold",
  },
  {
    icon: Users,
    title: "Bring your sales team",
    body: "Add your staff so they record sales for the business. Each sale shows the name of who made it.",
    tone: "white",
  },
];

const tones = {
  white: { card: "bg-white border-line", icon: "bg-mint text-brand", body: "text-muted" },
  forest: { card: "bg-forest border-forest text-white", icon: "bg-gold text-forest", body: "text-sage" },
  gold: { card: "bg-gold-soft border-gold-line", icon: "bg-gold text-forest", body: "text-gold-ink" },
};

export function Features() {
  return (
    <section id="features" className="container-page scroll-mt-24 pt-24">
      <SectionHeading eyebrow="What it does" title="Your sales book, stock list, and reports in one place" />

      <div className="grid gap-5 pt-12 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const tone = tones[feature.tone];
          return (
            <Reveal key={feature.title} delay={(index % 3) * 0.08}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn("group flex h-full flex-col gap-3.5 rounded-3xl border p-7 sm:p-8", tone.card)}
              >
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-[14px] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110",
                    tone.icon,
                  )}
                >
                  <feature.icon className="size-6" aria-hidden />
                </span>
                <h3 className="font-display text-[26px] font-bold leading-tight">{feature.title}</h3>
                <p className={tone.body}>{feature.body}</p>
              </motion.article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
