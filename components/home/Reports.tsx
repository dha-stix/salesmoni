"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sheet } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";
import { cn, formatNaira, sumBy } from "@/lib/utils";

const ranges = {
  "This month": {
    file: "salesmoni-october-2026.xlsx",
    rows: [
      { date: "12 Oct 2026", product: "Rice 50kg", qty: 1, total: 78000 },
      { date: "12 Oct 2026", product: "Vegetable oil 5L", qty: 2, total: 29000 },
      { date: "12 Oct 2026", product: "Sugar 1kg", qty: 4, total: 12000 },
      { date: "11 Oct 2026", product: "Noodles carton", qty: 3, total: 43500 },
    ],
  },
  "This year": {
    file: "salesmoni-2026.xlsx",
    rows: [
      { date: "3 Jan 2026", product: "Spaghetti 500g", qty: 10, total: 12000 },
      { date: "14 Mar 2026", product: "Rice 50kg", qty: 2, total: 156000 },
      { date: "22 Jun 2026", product: "Milk tin", qty: 12, total: 21600 },
      { date: "12 Oct 2026", product: "Rice 50kg", qty: 1, total: 78000 },
    ],
  },
  "Custom dates": {
    file: "salesmoni-15-sep-to-12-oct-2026.xlsx",
    rows: [
      { date: "15 Sep 2026", product: "Cocoa drink 500g", qty: 3, total: 12600 },
      { date: "28 Sep 2026", product: "Vegetable oil 5L", qty: 4, total: 58000 },
      { date: "6 Oct 2026", product: "Noodles carton", qty: 2, total: 29000 },
      { date: "12 Oct 2026", product: "Sugar 1kg", qty: 4, total: 12000 },
    ],
  },
};

type RangeName = keyof typeof ranges;
const columns = "grid grid-cols-[1.1fr_1.6fr_0.6fr_1fr]";

export function Reports() {
  const [active, setActive] = useState<RangeName>("This month");
  const { file, rows } = ranges[active];

  return (
    <section id="reports" className="container-page scroll-mt-24 pt-28">
      <Reveal className="draw-icons grid items-center gap-12 rounded-[32px] border border-line bg-white p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
        <div className="flex flex-col gap-[18px]">
          <p className="eyebrow">Reports</p>
          <h2 className="heading-display text-[32px] leading-[1.08] sm:text-[46px]">
            Your records, ready for Excel
          </h2>
          <p className="max-w-[440px] text-muted">
            Choose this month, this year, or your own dates. SalesMoni builds the spreadsheet with
            every sale, quantity, and total filled in.
          </p>
          <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Report period">
            {(Object.keys(ranges) as RangeName[]).map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={active === name}
                onClick={() => setActive(name)}
                className={cn(
                  "min-h-11 rounded-full px-[18px] text-sm font-semibold transition-colors",
                  active === name ? "bg-brand text-white" : "border border-line-strong hover:bg-ground",
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line">
          <div className="tabular min-w-[420px] text-sm">
            <div className="flex items-center gap-2.5 bg-brand px-4 py-3 font-semibold text-white">
              <Sheet className="size-[18px]" aria-hidden />
              {file}
            </div>
            <div className={cn(columns, "bg-ground font-bold text-muted")}>
              <span className="px-4 py-2.5">Date</span>
              <span className="px-4 py-2.5">Product</span>
              <span className="px-4 py-2.5">Qty</span>
              <span className="px-4 py-2.5 text-right">Total</span>
            </div>
            {rows.map((row, index) => (
              <motion.div
                key={`${active}-${index}`}
                className={cn(columns, "border-t border-line")}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <span className="px-4 py-2.5">{row.date}</span>
                <span className="px-4 py-2.5">{row.product}</span>
                <span className="px-4 py-2.5">{row.qty}</span>
                <span className="px-4 py-2.5 text-right">{formatNaira(row.total)}</span>
              </motion.div>
            ))}
            <div className={cn(columns, "border-t border-line bg-mint font-bold")}>
              <span className="px-4 py-2.5">Total</span>
              <span />
              <span className="px-4 py-2.5">{sumBy(rows, (row) => row.qty)}</span>
              <span className="px-4 py-2.5 text-right">{formatNaira(sumBy(rows, (row) => row.total))}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
