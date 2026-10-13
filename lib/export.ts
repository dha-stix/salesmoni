import type { Sale } from "./types";
import { formatDate, formatTime, sumBy } from "./utils";

/**
 * Builds an Excel workbook from a list of sales and downloads it.
 * Sheet 1 lists every item sold; sheet 2 totals them by product.
 */
export async function exportSalesToExcel(sales: Sale[], label: string, businessName: string) {
  // Loaded on demand so the spreadsheet library stays out of the page bundle.
  const XLSX = await import("xlsx");
  const ordered = [...sales].sort((a, b) => a.createdAt - b.createdAt);

  // One row per product sold. Items from the same sale share a sale number.
  const items = ordered.flatMap((sale, index) =>
    sale.items.map((item) => ({ ...item, sale, saleNumber: index + 1 })),
  );

  const rows = items.map((item) => ({
    "Sale no.": item.saleNumber as number | string,
    Date: formatDate(item.sale.createdAt),
    Time: formatTime(item.sale.createdAt),
    Product: item.productName,
    Quantity: item.qty,
    "Unit price (₦)": item.unitPrice as number | string,
    "Total (₦)": item.total,
    "Sold by": item.sale.soldByName,
  }));
  rows.push({
    "Sale no.": "Total",
    Date: "",
    Time: "",
    Product: `${ordered.length} sales`,
    Quantity: sumBy(items, (item) => item.qty),
    "Unit price (₦)": "",
    "Total (₦)": sumBy(items, (item) => item.total),
    "Sold by": "",
  });

  const byProduct = new Map<string, { qty: number; total: number }>();
  for (const item of items) {
    const entry = byProduct.get(item.productName) ?? { qty: 0, total: 0 };
    byProduct.set(item.productName, { qty: entry.qty + item.qty, total: entry.total + item.total });
  }
  const summary = [...byProduct.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([product, entry]) => ({
      Product: product,
      "Quantity sold": entry.qty,
      "Total (₦)": entry.total,
    }));

  const salesSheet = XLSX.utils.json_to_sheet(rows);
  salesSheet["!cols"] = [9, 14, 10, 28, 10, 16, 16, 22].map((wch) => ({ wch }));
  const summarySheet = XLSX.utils.json_to_sheet(summary);
  summarySheet["!cols"] = [28, 14, 16].map((wch) => ({ wch }));

  const workbook = XLSX.utils.book_new();
  workbook.Props = { Title: `${businessName} sales, ${label}`, Author: "SalesMoni" };
  XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales");
  XLSX.utils.book_append_sheet(workbook, summarySheet, "By product");

  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  XLSX.writeFile(workbook, `salesmoni-${slug}.xlsx`);
}
