import type { Metadata } from "next";
import { SalesView } from "@/components/sales/SalesView";

export const metadata: Metadata = { title: "Sales" };

// This page renders only after the signed-in check in AppShell, so there is
// nothing for Next.js to validate for instant navigation.
export const instant = false;

export default function SalesPage() {
  return <SalesView />;
}
