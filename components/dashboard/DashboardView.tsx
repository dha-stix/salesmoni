"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { PageHeader, Pill, Skeleton } from "@/components/ui/Bits";
import { Button, ButtonLink } from "@/components/ui/Button";
import { exportSalesToExcel } from "@/lib/export";
import { useProducts, useSales } from "@/lib/hooks";
import { MONTHS, errorMessage, formatDate, formatNaira, isSameDay, stockStatus, sumBy, yearRange } from "@/lib/utils";
import { LowStock, RecentSales, TopProducts } from "./DashboardLists";
import { SalesChart } from "./SalesChart";
import { StatCards, type Stat } from "./StatCards";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardView() {
  const { profile } = useAuth();
  const toast = useToast();
  const [now] = useState(() => new Date());
  const [year, setYear] = useState(now.getFullYear());
  const [exporting, setExporting] = useState(false);

  const range = useMemo(() => yearRange(year), [year]);
  const sales = useSales(range);
  const products = useProducts();
  const isCurrentYear = year === now.getFullYear();
  const isOwner = profile?.role === "owner";

  const summary = useMemo(() => {
    const monthly = Array<number>(12).fill(0);
    const byProduct = new Map<string, number>();
    for (const sale of sales.data) {
      monthly[new Date(sale.createdAt).getMonth()] += sale.total;
      for (const item of sale.items) {
        byProduct.set(item.productName, (byProduct.get(item.productName) ?? 0) + item.total);
      }
    }
    const today = sales.data.filter((sale) => isSameDay(sale.createdAt, now));
    const bestMonth = monthly.indexOf(Math.max(...monthly));
    return {
      monthly,
      bestMonth,
      total: sumBy(sales.data, (sale) => sale.total),
      todayTotal: sumBy(today, (sale) => sale.total),
      todayCount: today.length,
      top: [...byProduct.entries()]
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 4),
    };
  }, [sales.data, now]);

  const lowStock = products.data
    .filter((product) => stockStatus(product) !== "in")
    .sort((a, b) => a.qty - b.qty);

  const stats: Stat[] = [
    {
      label: `Total sales in ${year}`,
      value: summary.total,
      kind: "money",
      note: isCurrentYear ? `January to ${formatDate(now, { day: "numeric", month: "long" })}` : "Full year",
      tone: "forest",
    },
    isCurrentYear
      ? {
          label: "This month",
          value: summary.monthly[now.getMonth()],
          kind: "money",
          note: `${formatDate(now, { month: "long" })}, ${now.getDate()} days in`,
        }
      : {
          label: "Best month",
          value: summary.monthly[summary.bestMonth],
          kind: "money",
          note: MONTHS[summary.bestMonth],
        },
    isCurrentYear
      ? {
          label: "Today",
          value: summary.todayTotal,
          kind: "money",
          note: `${summary.todayCount} ${summary.todayCount === 1 ? "sale" : "sales"} so far`,
        }
      : { label: "Sales recorded", value: sales.data.length, kind: "count", note: `Across ${year}` },
    {
      label: "Needs restock",
      value: lowStock.length,
      kind: "count",
      suffix: lowStock.length === 1 ? "product" : "products",
      note: "",
      tone: "gold",
      link: { href: "/products", label: "View products" },
    },
  ];

  async function handleExport() {
    setExporting(true);
    try {
      await exportSalesToExcel(sales.data, String(year), profile!.businessName);
      toast(`Downloaded ${year} sales`);
    } catch (reason) {
      toast(errorMessage(reason), "error");
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <PageHeader
        title={`${greeting(now.getHours())}, ${profile!.name.split(" ")[0]}`}
        subtitle={formatDate(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      >
        <select
          aria-label="Year"
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
          className="min-h-[46px] rounded-xl border border-line-strong bg-white px-4 text-[15px] font-semibold"
        >
          {[0, 1, 2].map((offset) => (
            <option key={offset}>{now.getFullYear() - offset}</option>
          ))}
        </select>
        {isOwner && (
          <Button variant="outline" onClick={handleExport} loading={exporting} disabled={sales.data.length === 0}>
            <Download className="size-[18px]" aria-hidden /> Download Excel
          </Button>
        )}
        <ButtonLink href="/sales">
          <Plus className="size-[18px]" aria-hidden /> New sale
        </ButtonLink>
      </PageHeader>

      {sales.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-[132px] rounded-[20px]" />
          ))}
        </div>
      ) : (
        <StatCards key={year} stats={stats} />
      )}

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="card flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[19px] font-bold">Sales across the year</h2>
            {summary.total > 0 && (
              <Pill>
                Best month: {MONTHS[summary.bestMonth]}, {formatNaira(summary.monthly[summary.bestMonth])}
              </Pill>
            )}
          </div>
          {sales.loading ? (
            <Skeleton className="aspect-[720/270] w-full" />
          ) : (
            <SalesChart key={year} monthly={summary.monthly} lastMonth={isCurrentYear ? now.getMonth() : 11} />
          )}
        </section>
        <TopProducts items={summary.top} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <RecentSales sales={sales.data.slice(0, 5)} />
        <LowStock products={lowStock} />
      </div>
    </>
  );
}
