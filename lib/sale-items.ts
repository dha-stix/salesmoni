import type { Product, Sale, SaleItem, SaleLine } from "./types";

type StockedProduct = Pick<Product, "name" | "price" | "qty">;

/** Checks the rows of a sale and combines rows that repeat the same product. */
export function mergeSaleLines(lines: SaleLine[]): SaleLine[] {
  if (lines.length === 0) throw new Error("Add at least one item to the sale.");
  const merged = new Map<string, number>();
  for (const line of lines) {
    if (!line.productId) throw new Error("Choose a product for every item.");
    if (!Number.isInteger(line.qty) || line.qty < 1) {
      throw new Error("Enter a quantity of at least 1 for every item.");
    }
    merged.set(line.productId, (merged.get(line.productId) ?? 0) + line.qty);
  }
  return [...merged].map(([productId, qty]) => ({ productId, qty }));
}

/**
 * Prices each line from the product's current record and makes sure there is
 * enough stock. `findProduct` returns undefined for a product that was deleted.
 */
export function buildSaleItems(
  lines: SaleLine[],
  findProduct: (productId: string) => StockedProduct | undefined,
): SaleItem[] {
  return lines.map(({ productId, qty }) => {
    const product = findProduct(productId);
    if (!product) throw new Error("One of those products no longer exists.");
    if (qty > product.qty) {
      throw new Error(`Only ${product.qty} of ${product.name} left in stock.`);
    }
    return {
      productId,
      productName: product.name,
      qty,
      unitPrice: product.price,
      total: qty * product.price,
    };
  });
}

/** "Rice 50kg × 1, Sugar 1kg × 4" */
export function describeItems(sale: Pick<Sale, "items">) {
  return sale.items.map((item) => `${item.productName} × ${item.qty}`).join(", ");
}

export function countUnits(sale: Pick<Sale, "items">) {
  return sale.items.reduce((units, item) => units + item.qty, 0);
}
