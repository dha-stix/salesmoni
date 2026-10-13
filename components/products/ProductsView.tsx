"use client";

import { useState } from "react";
import { ListPlus, Plus, Search } from "lucide-react";
import { addProduct, addProducts, deleteProduct, updateProduct } from "@/firebase-actions";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { EmptyState, PageHeader, Skeleton } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useProducts } from "@/lib/hooks";
import { starterProducts } from "@/lib/starter-products";
import type { Product, ProductInput } from "@/lib/types";
import { cn, errorMessage, formatNaira, stockStatus, sumBy, type StockStatus } from "@/lib/utils";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";

type Filter = "all" | Exclude<StockStatus, "in">;
const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "low", label: "Low stock" },
  { id: "out", label: "Out of stock" },
];

export function ProductsView() {
  const { profile } = useAuth();
  const toast = useToast();
  const products = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  /** "new" opens an empty form; a product opens it for editing. */
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [importing, setImporting] = useState(false);

  const businessId = profile!.businessId;
  const canManage = profile!.role === "owner";
  const count = (id: Filter) =>
    id === "all" ? products.data.length : products.data.filter((product) => stockStatus(product) === id).length;

  const visible = products.data.filter(
    (product) =>
      (filter === "all" || stockStatus(product) === filter) &&
      `${product.name} ${product.category}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  async function handleSave(input: ProductInput) {
    if (editing && editing !== "new") {
      await updateProduct(businessId, editing.id, input);
      toast("Product updated");
    } else {
      await addProduct(businessId, input);
      toast("Product added");
    }
    setEditing(null);
    products.reload();
  }

  async function handleImport() {
    setImporting(true);
    try {
      const added = await addProducts(businessId, starterProducts);
      toast(added > 0 ? `${added} starter products added` : "The starter products are already in your list");
      products.reload();
    } catch (reason) {
      toast(errorMessage(reason), "error");
    } finally {
      setImporting(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteProduct(businessId, deleting!.id);
      toast("Product deleted");
      products.reload();
    } catch (reason) {
      toast(errorMessage(reason), "error");
    }
    setDeleting(null);
  }

  const needRestock = count("low") + count("out");
  const stockValue = formatNaira(sumBy(products.data, (product) => product.price * product.qty));

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${products.data.length} products · ${stockValue} of stock on hand · ${needRestock} need restocking`}
      >
        {canManage && (
          <>
            <Button variant="outline" onClick={handleImport} loading={importing}>
              <ListPlus className="size-[18px]" aria-hidden /> Add starter products
            </Button>
            <Button onClick={() => setEditing("new")}>
              <Plus className="size-[18px]" aria-hidden /> Add product
            </Button>
          </>
        )}
      </PageHeader>

      <section className="card flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex min-h-[46px] min-w-0 flex-1 basis-60 items-center gap-2.5 rounded-xl border border-line-strong bg-ground px-3.5 focus-within:border-brand">
            <Search className="size-[18px] shrink-0 text-muted" aria-hidden />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "min-h-11 rounded-full px-4 text-sm font-semibold transition-colors",
                  filter === item.id ? "bg-forest text-white" : "border border-line-strong bg-white hover:bg-ground",
                )}
              >
                {item.label} {count(item.id)}
              </button>
            ))}
          </div>
        </div>

        {products.loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-14" />
            ))}
          </div>
        ) : products.data.length === 0 ? (
          <EmptyState
            title="Add your first product"
            body="List what you sell with its price and quantity. Stock goes down each time you record a sale."
          >
            {canManage && <Button onClick={() => setEditing("new")}>Add product</Button>}
          </EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState title="No products match" body="Try a different search or filter." />
        ) : (
          <ProductTable products={visible} canManage={canManage} onEdit={setEditing} onDelete={setDeleting} />
        )}
      </section>

      <Modal
        open={editing !== null}
        title={editing && editing !== "new" ? "Edit product" : "Add product"}
        onClose={() => setEditing(null)}
      >
        <ProductForm
          key={editing && editing !== "new" ? editing.id : "new"}
          product={editing && editing !== "new" ? editing : undefined}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete product?"
        body={`${deleting?.name ?? "This product"} will be removed from your stock list. Sales already recorded for it are kept.`}
        confirmLabel="Delete product"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
