"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import type { Product, ProductInput } from "@/lib/types";
import { errorMessage, formatNaira } from "@/lib/utils";

interface ProductFormProps {
  /** The product being edited, or undefined when adding a new one. */
  product?: Product;
  onSave: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.category ?? "",
    price: product ? String(product.price) : "",
    qty: product ? String(product.qty) : "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const bind = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (event: { target: { value: string } }) =>
      setForm((current) => ({ ...current, [key]: event.target.value })),
  });

  const price = Number(form.price) || 0;
  const qty = Number(form.qty) || 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSave({ name: form.name, category: form.category, price, qty });
    } catch (reason) {
      setError(errorMessage(reason));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
      <Field label="Product name" placeholder="Rice 50kg" required autoFocus {...bind("name")} />
      <Field
        label={
          <>
            Category <span className="font-normal text-muted">(optional)</span>
          </>
        }
        placeholder="Grains"
        {...bind("category")}
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (₦)" type="number" inputMode="decimal" min={0} step="any" placeholder="78000" required {...bind("price")} />
        <Field label="Quantity in stock" type="number" inputMode="numeric" min={0} step={1} placeholder="40" required {...bind("qty")} />
      </div>
      <div className="tabular flex justify-between gap-3 rounded-xl bg-mint px-4 py-3.5 text-brand-dark">
        <span>Stock value</span>
        <strong>{formatNaira(price * qty)}</strong>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-2.5">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={busy} className="flex-[2]">
          {product ? "Save changes" : "Save product"}
        </Button>
      </div>
    </form>
  );
}
