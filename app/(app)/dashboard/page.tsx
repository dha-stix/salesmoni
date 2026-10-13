import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

// This page renders only after the signed-in check in AppShell, so there is
// nothing for Next.js to validate for instant navigation.
export const instant = false;

export default function DashboardPage() {
  return <DashboardView />;
}
