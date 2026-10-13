"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { recordSale } from "@/firebase-actions";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Avatar } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/types";
import { errorMessage, formatNaira, sumBy } from "@/lib/utils";
import { SaleItemRow } from "./SaleItemRow";

interface NewSaleFormProps {
  products: Product[];
  /** Called after a sale is saved so the lists and stock can refresh. */
  onRecorded: () => void;
}

/** A row in the form. `key` stays the same while the row's product changes. */
interface Row {
  key: number;
  productId: string;
  qty: number;
}

export function NewSaleForm({ products, onRecorded }: NewSaleFormProps) {
  const { profile } = useAuth();
  const toast = useToast();
  const nextKey = useRef(1);
  const [rows, setRows] = useState<Row[]>([{ key: 0, productId: "", qty: 1 }]);
  const [busy, setBusy] = useState(false);

  const inStock = products.filter((product) => product.qty > 0);

  // Match each row to a product. A row with no choice yet (or whose product
  // went out of stock) takes the first product no other row is using.
  const used = new Set<string>();
  const lines = rows.flatMap((row) => {
    const product =
      inStock.find((item) => item.id === row.productId && !used.has(item.id)) ??
      inStock.find((item) => !used.has(item.id));
    if (!product) return [];
    used.add(product.id);
    return [{ key: row.key, product, qty: Math.min(Math.max(row.qty, 1), product.qty) }];
  });

  const total = sumBy(lines, (line) => line.product.price * line.qty);
  const units = sumBy(lines, (line) => line.qty);
  const canAddRow = lines.length < inStock.length;

  const updateRow = (key: number, change: Partial<Row>) =>
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...change } : row)));

  function addRow() {
    // Pin the current choices so adding a row never changes an existing one.
    setRows([
      ...lines.map((line) => ({ key: line.key, productId: line.product.id, qty: line.qty })),
      { key: nextKey.current++, productId: "", qty: 1 },
    ]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (lines.length === 0) return;
    setBusy(true);
    try {
      await recordSale(
        profile!,
        lines.map((line) => ({ productId: line.product.id, qty: line.qty })),
      );
      toast(`Sale recorded: ${lines.length} ${lines.length === 1 ? "item" : "items"}, ${formatNaira(total)}`);
      setRows([{ key: nextKey.current++, productId: "", qty: 1 }]);
      onRecorded();
    } catch (reason) {
      toast(errorMessage(reason), "error");
    } finally {
      setBusy(false);
    }
  }

  if (lines.length === 0) {
    return (
      <section className="card flex flex-col gap-3">
        <h2 className="heading-display text-2xl">New sale</h2>
        <p className="text-muted">
          {products.length === 0
            ? "Add a product before recording a sale."
            : "Everything is out of stock. Restock a product to record a sale."}
        </p>
        <Link href="/products" className="font-bold text-brand hover:underline">
          Go to products
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="heading-display text-2xl">New sale</h2>
        <span className="text-sm text-muted">
          {lines.length} {lines.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {lines.map((line, index) => (
            <motion.div
              key={line.key}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <SaleItemRow
                number={index + 1}
                product={line.product}
                qty={line.qty}
                products={products}
                takenIds={new Set(lines.filter((other) => other.key !== line.key).map((other) => other.product.id))}
                canRemove={lines.length > 1}
                onProductChange={(productId) => updateRow(line.key, { productId, qty: 1 })}
                onQtyChange={(qty) => updateRow(line.key, { productId: line.product.id, qty })}
                onRemove={() => setRows((current) => current.filter((row) => row.key !== line.key))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={addRow}
        disabled={!canAddRow}
        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong text-[15px] font-bold text-brand transition-colors hover:bg-mint disabled:text-muted disabled:hover:bg-transparent"
      >
        <Plus className="size-[18px]" aria-hidden />
        {canAddRow ? "Add another item" : "Every product in stock is already added"}
      </button>

      <div className="tabular flex flex-col gap-2 rounded-[14px] bg-ground p-4">
        <div className="flex justify-between gap-3 text-muted">
          <span>Units</span>
          <span>{units}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-semibold">Total</span>
          <span className="font-display text-[28px] font-bold">{formatNaira(total)}</span>
        </div>
      </div>

      <p className="flex items-center gap-2.5 text-sm text-muted">
        <Avatar name={profile!.name} tone="forest" className="size-8 text-[13px]" />
        <span>
          Recording as <strong className="text-ink">{profile!.name}</strong>
        </span>
      </p>

      <Button type="submit" size="lg" loading={busy}>
        Record sale
      </Button>
    </form>
  );
}
