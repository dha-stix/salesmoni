"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { StockPill } from "@/components/ui/Bits";
import type { Product } from "@/lib/types";
import { formatNaira, stockStatus } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  /** Owners can edit and delete; staff see a read-only list. */
  canManage: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// One row layout: a table on desktop, a stacked card on phones.
const columns = "md:grid md:grid-cols-[2.2fr_1fr_0.8fr_1.2fr_1.2fr_96px] md:items-center md:gap-3";

export function ProductTable({ products, canManage, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="tabular">
      <div className={`${columns} table-head hidden py-3`}>
        <span>Product</span>
        <span className="text-right">Price</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Stock value</span>
        <span>Status</span>
        <span />
      </div>
      <AnimatePresence initial={false}>
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className={`${columns} flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line py-3.5`}
          >
            <div className="min-w-0 basis-full md:basis-auto">
              <p className="truncate font-semibold">{product.name}</p>
              {product.category && <p className="text-[13px] text-muted">{product.category}</p>}
            </div>
            <span className="md:text-right">{formatNaira(product.price)}</span>
            <span className="font-bold md:text-right">
              {product.qty} <span className="font-normal text-muted md:hidden">in stock</span>
            </span>
            <span className="hidden md:block md:text-right">{formatNaira(product.price * product.qty)}</span>
            <StockPill status={stockStatus(product)} />
            <div className="ml-auto flex justify-end gap-1">
              {canManage && (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    aria-label={`Edit ${product.name}`}
                    className="flex size-11 items-center justify-center rounded-xl hover:bg-ground"
                  >
                    <Pencil className="size-[18px]" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    aria-label={`Delete ${product.name}`}
                    className="flex size-11 items-center justify-center rounded-xl text-danger hover:bg-danger-soft"
                  >
                    <Trash2 className="size-[18px]" aria-hidden />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
