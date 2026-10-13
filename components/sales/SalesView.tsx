"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { PageHeader } from "@/components/ui/Bits";
import { Reveal } from "@/components/ui/Motion";
import { useProducts, useSales } from "@/lib/hooks";
import { dayRange, isSameDay, monthRange } from "@/lib/utils";
import { DaySales } from "./DaySales";
import { ExportPanel } from "./ExportPanel";
import { NewSaleForm } from "./NewSaleForm";
import { SalesCalendar } from "./SalesCalendar";

export function SalesView() {
  const { profile } = useAuth();
  const [today] = useState(() => new Date());
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(today);

  const products = useProducts();
  const daySales = useSales(useMemo(() => dayRange(selected), [selected]));
  const monthSales = useSales(useMemo(() => monthRange(month), [month]));

  const daysWithSales = useMemo(
    () => new Set(monthSales.data.map((sale) => new Date(sale.createdAt).getDate())),
    [monthSales.data],
  );

  function handleRecorded() {
    // A new sale always belongs to today, so jump back to it.
    setSelected(today);
    setMonth(today);
    products.reload();
    daySales.reload();
    monthSales.reload();
  }

  return (
    <>
      <PageHeader title="Sales" subtitle="Record a sale, look back at any day, and download your records." />

      <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1.3fr_1fr]">
        <Reveal immediate>
          <NewSaleForm products={products.data} onRecorded={handleRecorded} />
        </Reveal>
        <Reveal immediate delay={0.08}>
          <DaySales date={selected} isToday={isSameDay(selected, today)} sales={daySales.data} loading={daySales.loading} />
        </Reveal>
        <Reveal immediate delay={0.16} className="flex flex-col gap-4 md:col-span-2 md:grid md:grid-cols-2 xl:col-span-1 xl:flex">
          <SalesCalendar
            month={month}
            selected={selected}
            today={today}
            daysWithSales={daysWithSales}
            onSelect={setSelected}
            onMonthChange={setMonth}
          />
          {profile!.role === "owner" && <ExportPanel today={today} />}
        </Reveal>
      </div>
    </>
  );
}
