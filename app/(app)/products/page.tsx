import type { Metadata } from "next";
import { ProductsView } from "@/components/products/ProductsView";

export const metadata: Metadata = { title: "Products" };

// This page renders only after the signed-in check in AppShell, so there is
// nothing for Next.js to validate for instant navigation.
export const instant = false;

export default function ProductsPage() {
  return <ProductsView />;
}
