"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { getSales } from "@/firebase-actions";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { exportSalesToExcel } from "@/lib/export";
import type { DateRange } from "@/lib/types";
import { cn, dayRange, errorMessage, formatDate, monthRange, toDateInputValue, yearRange } from "@/lib/utils";

type Mode = "month" | "year" | "custom";
const modes: Array<{ id: Mode; label: string }> = [
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
  { id: "custom", label: "Custom dates" },
];

const dateInput =
  "min-h-11 w-full rounded-[10px] border border-forest-line bg-forest-soft px-2.5 text-sm text-white [color-scheme:dark]";

/** Lets the owner download sales for a month, a year, or any dates as Excel. */
export function ExportPanel({ today }: { today: Date }) {
  const { profile } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("month");
  const [from, setFrom] = useState(() => toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1)));
  const [to, setTo] = useState(() => toDateInputValue(today));
  const [busy, setBusy] = useState(false);

  const monthName = formatDate(today, { month: "long", year: "numeric" });
  const buttonLabel = {
    month: `Download ${monthName}`,
    year: `Download all of ${today.getFullYear()}`,
    custom: "Download selected dates",
  }[mode];

  function selection(): { range: DateRange; label: string } {
    if (mode === "month") return { range: monthRange(today), label: monthName };
    if (mode === "year") return { range: yearRange(today.getFullYear()), label: String(today.getFullYear()) };
    // Date inputs give yyyy-mm-dd; adding a time keeps them in local time.
    const start = new Date(`${from}T00:00`);
    const end = new Date(`${to}T00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new Error("Choose both dates.");
    if (start > end) throw new Error("The From date must be before the To date.");
    return {
      range: { from: dayRange(start).from, to: dayRange(end).to },
      label: `${formatDate(start)} to ${formatDate(end)}`,
    };
  }

  async function handleDownload() {
    setBusy(true);
    try {
      const { range, label } = selection();
      const sales = await getSales(profile!.businessId, range);
      if (sales.length === 0) throw new Error("There are no sales in that period.");
      await exportSalesToExcel(sales, label, profile!.businessName);
      toast(`Downloaded ${sales.length} sales`);
    } catch (reason) {
      toast(errorMessage(reason), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-3.5 rounded-[20px] bg-forest p-5 text-white">
      <h2 className="text-[17px] font-bold">Download to Excel</h2>
      <div className="flex flex-wrap gap-2">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={mode === item.id}
            onClick={() => setMode(item.id)}
            className={cn(
              "min-h-11 rounded-full border px-3.5 text-sm font-bold transition-colors",
              mode === item.id ? "border-white bg-white text-forest" : "border-forest-line hover:bg-white/10",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {mode === "custom" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex flex-col gap-1 text-[13px] text-sage">
                From
                <input type="date" value={from} max={to} onChange={(event) => setFrom(event.target.value)} className={dateInput} />
              </label>
              <label className="flex flex-col gap-1 text-[13px] text-sage">
                To
                <input
                  type="date"
                  value={to}
                  min={from}
                  max={toDateInputValue(today)}
                  onChange={(event) => setTo(event.target.value)}
                  className={dateInput}
                />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button variant="gold" onClick={handleDownload} loading={busy}>
        <Download className="size-[18px]" aria-hidden /> {buttonLabel}
      </Button>
    </section>
  );
}
