import type { Metadata } from "next";
import { TeamView } from "@/components/team/TeamView";

export const metadata: Metadata = { title: "Team" };

// This page renders only after the signed-in check in AppShell, so there is
// nothing for Next.js to validate for instant navigation.
export const instant = false;

export default function TeamPage() {
  return <TeamView />;
}
