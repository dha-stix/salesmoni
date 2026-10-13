"use client";

import Link from "next/link";
import { EmptyState, Pill } from "@/components/ui/Bits";
import { GrowBar } from "@/components/ui/Motion";
import { countUnits, describeItems } from "@/lib/sale-items";
import type { Product, Sale } from "@/lib/types";
import { formatNaira, formatTime, stockStatus } from "@/lib/utils";

export interface ProductTotal {
  name: string;
  total: number;
}

export function TopProducts({ items }: { items: ProductTotal[] }) {
  const highest = items[0]?.total ?? 0;
  return (
    <section className="card flex flex-col gap-[18px]">
      <h2 className="text-[19px] font-bold">Top products this year</h2>
      {items.length === 0 && <p className="text-muted">Your best sellers appear here after your first sale.</p>}
      {items.map((item, index) => (
        <div key={item.name} className="flex flex-col gap-2">
          <div className="flex justify-between gap-3">
            <span className="truncate font-semibold">{item.name}</span>
            <span className="tabular">{formatNaira(item.total)}</span>
          </div>
          <div className="h-2.5 rounded-full bg-ground">
            <GrowBar
              direction="right"
              size={`${Math.max((item.total / highest) * 100, 3)}%`}
              delay={0.2 + index * 0.1}
              className="h-2.5 rounded-full bg-brand"
            />
          </div>
        </div>
      ))}
    </section>
  );
}

const saleColumns = "grid grid-cols-[2fr_0.6fr_1.3fr_1fr_1fr] gap-3";

export function RecentSales({ sales }: { sales: Sale[] }) {
  return (
    <section className="card flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-bold">Recent sales</h2>
        <Link href="/sales" className="font-bold text-brand hover:underline">
          View all sales
        </Link>
      </div>
      {sales.length === 0 ? (
        <EmptyState title="Record your first sale" body="Sales you and your team record show up here as they happen." />
      ) : (
        <div className="overflow-x-auto">
          <div className="tabular min-w-[520px]">
            <div className={`${saleColumns} table-head py-3`}>
              <span>Items</span>
              <span>Qty</span>
              <span>Sold by</span>
              <span>Time</span>
              <span className="text-right">Total</span>
            </div>
            {sales.map((sale) => (
              <div key={sale.id} className={`${saleColumns} border-t border-line py-3.5`}>
                <span className="truncate font-semibold" title={describeItems(sale)}>
                  {sale.items[0]?.productName}
                  {sale.items.length > 1 && (
                    <span className="font-normal text-muted"> + {sale.items.length - 1} more</span>
                  )}
                </span>
                <span>{countUnits(sale)}</span>
                <span className="truncate">{sale.soldByName}</span>
                <span className="text-muted">{formatTime(sale.createdAt)}</span>
                <span className="text-right font-semibold">{formatNaira(sale.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function LowStock({ products }: { products: Product[] }) {
  return (
    <section className="card flex flex-col gap-1">
      <h2 className="pb-2 text-[19px] font-bold">Running low</h2>
      {products.length === 0 && <p className="text-muted">Everything is well stocked.</p>}
      {products.map((product) => (
        <div key={product.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
          <span className="truncate font-semibold">{product.name}</span>
          {stockStatus(product) === "out" ? (
            <Pill tone="red">Out of stock</Pill>
          ) : (
            <Pill tone="gold">{product.qty} left</Pill>
          )}
        </div>
      ))}
    </section>
  );
}
