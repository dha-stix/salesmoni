"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatDate, isSameDay } from "@/lib/utils";

interface SalesCalendarProps {
  /** Any date inside the month being shown. */
  month: Date;
  selected: Date;
  today: Date;
  /** Day numbers in the shown month that have at least one sale. */
  daysWithSales: Set<number>;
  onSelect: (date: Date) => void;
  onMonthChange: (month: Date) => void;
}

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const arrowButton =
  "flex size-11 items-center justify-center rounded-xl bg-ground hover:bg-line disabled:opacity-40 disabled:hover:bg-ground";

export function SalesCalendar({ month, selected, today, daysWithSales, onSelect, onMonthChange }: SalesCalendarProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  // Weeks start on Monday, so shift JavaScript's Sunday-first weekday.
  const leadingBlanks = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const isCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth();
  const shift = (amount: number) => onMonthChange(new Date(year, monthIndex + amount, 1));

  return (
    <section className="card flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={() => shift(-1)} className={arrowButton}>
          <ChevronLeft className="size-[18px]" aria-hidden />
        </button>
        <h2 className="font-bold" aria-live="polite">
          {formatDate(month, { month: "long", year: "numeric" })}
        </h2>
        <button type="button" aria-label="Next month" disabled={isCurrentMonth} onClick={() => shift(1)} className={arrowButton}>
          <ChevronRight className="size-[18px]" aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-xs font-bold text-muted">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="tabular grid grid-cols-7 gap-0.5">
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const date = new Date(year, monthIndex, day);
          const isFuture = date > today;
          const isSelected = isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          return (
            <button
              key={day}
              type="button"
              disabled={isFuture}
              aria-pressed={isSelected}
              aria-label={formatDate(date, { day: "numeric", month: "long", year: "numeric" })}
              onClick={() => onSelect(date)}
              className={cn(
                "relative flex h-11 items-center justify-center rounded-xl text-sm transition-colors",
                isSelected && "bg-brand font-bold text-white",
                !isSelected && isToday && "bg-gold-soft font-bold",
                !isSelected && !isFuture && "hover:bg-mint",
                isFuture && "text-muted/50",
              )}
            >
              {day}
              {daysWithSales.has(day) && (
                <span className={cn("absolute bottom-1.5 size-1 rounded-full", isSelected ? "bg-gold" : "bg-brand")} />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[13px] text-muted">Tap a past date to see that day&apos;s sales. Dots mark days with sales.</p>
    </section>
  );
}
