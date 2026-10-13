"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils";

interface SaleItemRowProps {
  /** Position in the sale, starting at 1. Used for labels. */
  number: number;
  product: Product;
  qty: number;
  products: Product[];
  /** Products already chosen in other rows, which can't be picked again. */
  takenIds: Set<string>;
  canRemove: boolean;
  onProductChange: (productId: string) => void;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}

const stepperButton =
  "flex size-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-white hover:bg-ground disabled:opacity-40";

/** One product line in the new-sale form: product, quantity, and line total. */
export function SaleItemRow({
  number,
  product,
  qty,
  products,
  takenIds,
  canRemove,
  onProductChange,
  onQtyChange,
  onRemove,
}: SaleItemRowProps) {
  return (
    <fieldset className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-ground/60 p-3">
      <legend className="sr-only">Item {number}</legend>
      <div className="flex items-center gap-2">
        <select
          aria-label={`Product for item ${number}`}
          value={product.id}
          onChange={(event) => onProductChange(event.target.value)}
          className="field-input min-h-11 min-w-0 flex-1 px-3 text-[15px]"
        >
          {products.map((item) => (
            <option key={item.id} value={item.id} disabled={item.qty <= 0 || takenIds.has(item.id)}>
              {item.name} ({item.qty > 0 ? `${item.qty} in stock` : "out of stock"})
            </option>
          ))}
        </select>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove item ${number}`}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-danger hover:bg-danger-soft"
          >
            <Trash2 className="size-[18px]" aria-hidden />
          </button>
        )}
      </div>

      <div className="tabular flex items-center gap-2">
        <button type="button" aria-label={`Reduce quantity of item ${number}`} disabled={qty <= 1} onClick={() => onQtyChange(qty - 1)} className={stepperButton}>
          <Minus className="size-4" aria-hidden />
        </button>
        <input
          type="number"
          inputMode="numeric"
          aria-label={`Quantity for item ${number}`}
          min={1}
          max={product.qty}
          value={qty}
          onChange={(event) => onQtyChange(Math.floor(Number(event.target.value)) || 1)}
          className="min-h-11 w-14 rounded-xl bg-white text-center font-display text-lg font-bold [appearance:textfield] focus:outline-none focus:ring-2 focus:ring-brand/30 [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" aria-label={`Increase quantity of item ${number}`} disabled={qty >= product.qty} onClick={() => onQtyChange(qty + 1)} className={stepperButton}>
          <Plus className="size-4" aria-hidden />
        </button>
        <div className="ml-auto text-right">
          <p className="font-bold">{formatNaira(product.price * qty)}</p>
          <p className="text-xs text-muted">{formatNaira(product.price)} each</p>
        </div>
      </div>

      <p className="text-xs text-gold-ink">
        Stock after this sale: <strong className="tabular">{product.qty} → {product.qty - qty}</strong>
      </p>
    </fieldset>
  );
}
