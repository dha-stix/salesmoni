"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EmptyState, Pill, Skeleton } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Sale } from "@/lib/types";
import { formatDate, formatNaira, formatTime, sumBy } from "@/lib/utils";

/** How many of the day's sales the card shows before "View all". */
const PREVIEW_COUNT = 5;

interface DaySalesProps {
  date: Date;
  isToday: boolean;
  /** The day's sales, newest first. */
  sales: Sale[];
  loading: boolean;
}

function SaleList({ sales }: { sales: Sale[] }) {
  return (
    <ul className="tabular flex flex-col">
      <AnimatePresence initial={false}>
        {sales.map((sale) => (
          <motion.li
            key={sale.id}
            layout
            initial={{ opacity: 0, y: -12, backgroundColor: "#E3F2EA" }}
            animate={{ opacity: 1, y: 0, backgroundColor: "#FFFFFF" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-1.5 border-b border-line py-3.5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[13px] text-muted">
                {formatTime(sale.createdAt)} · Sold by <strong className="text-ink">{sale.soldByName}</strong>
              </p>
              <span className="font-bold">{formatNaira(sale.total)}</span>
            </div>
            <ul className="flex flex-col gap-0.5">
              {sale.items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold">
                    {item.productName} <span className="font-normal text-muted">× {item.qty}</span>
                  </span>
                  {sale.items.length > 1 && <span className="text-muted">{formatNaira(item.total)}</span>}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function DayTotal({ sales }: { sales: Sale[] }) {
  return (
    <div className="tabular flex items-baseline justify-between gap-3">
      <span className="font-semibold">Day total</span>
      <span className="font-display text-[28px] font-bold">{formatNaira(sumBy(sales, (sale) => sale.total))}</span>
    </div>
  );
}

/** The selected day's most recent sales, with the full list one tap away. */
export function DaySales({ date, isToday, sales, loading }: DaySalesProps) {
  const [showAll, setShowAll] = useState(false);
  const title = isToday
    ? `Today, ${formatDate(date, { day: "numeric", month: "long" })}`
    : formatDate(date, { day: "numeric", month: "long", year: "numeric" });
  const countLabel = `${sales.length} ${sales.length === 1 ? "sale" : "sales"}`;
  const hiddenCount = sales.length - PREVIEW_COUNT;

  return (
    <section className="card flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="heading-display text-2xl">{title}</h2>
        <Pill>{countLabel}</Pill>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 pt-2">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-14" />
          ))}
        </div>
      ) : sales.length === 0 ? (
        <EmptyState
          title={isToday ? "No sales yet today" : "No sales on this day"}
          body={isToday ? "Record a sale and it appears here straight away." : "Pick another date on the calendar."}
        />
      ) : (
        <>
          {hiddenCount > 0 && <p className="text-[13px] text-muted">Showing the {PREVIEW_COUNT} most recent</p>}
          <SaleList sales={sales.slice(0, PREVIEW_COUNT)} />
          {hiddenCount > 0 && (
            <Button variant="outline" onClick={() => setShowAll(true)} className="mt-2">
              View all {countLabel}
            </Button>
          )}
          <div className="pt-3">
            <DayTotal sales={sales} />
          </div>
        </>
      )}

      <Modal open={showAll} title={title} onClose={() => setShowAll(false)}>
        <p className="-mt-3 text-muted">{countLabel}, newest first</p>
        <SaleList sales={sales} />
        <div className="sticky -bottom-6 -mx-6 -mb-6 border-t border-line bg-white px-6 py-4 sm:-bottom-8 sm:-mx-8 sm:-mb-8 sm:px-8">
          <DayTotal sales={sales} />
        </div>
      </Modal>
    </section>
  );
}
