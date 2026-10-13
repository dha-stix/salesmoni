import type { DateRange, Product } from "./types";

export const LOW_STOCK_LIMIT = 5;

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatNaira(amount: number) {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

/** ₦612,000 -> ₦612K, ₦4,782,000 -> ₦4.8M */
export function formatNairaShort(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${Math.round(amount / 1_000)}K`;
  return formatNaira(amount);
}

export function formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString(
    "en-GB",
    options ?? { day: "numeric", month: "short", year: "numeric" },
  );
}

export function formatTime(date: Date | number) {
  return new Date(date)
    .toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase();
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function isSameDay(a: Date | number, b: Date | number) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function dayRange(date: Date): DateRange {
  const from = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const to = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return { from: from.getTime(), to: to.getTime() - 1 };
}

export function monthRange(date: Date): DateRange {
  const from = new Date(date.getFullYear(), date.getMonth(), 1);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { from: from.getTime(), to: to.getTime() - 1 };
}

export function yearRange(year: number): DateRange {
  return {
    from: new Date(year, 0, 1).getTime(),
    to: new Date(year + 1, 0, 1).getTime() - 1,
  };
}

/** yyyy-mm-dd for <input type="date"> values. */
export function toDateInputValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function sumBy<T>(items: T[], pick: (item: T) => number) {
  return items.reduce((total, item) => total + pick(item), 0);
}

export type StockStatus = "in" | "low" | "out";

export function stockStatus(product: Pick<Product, "qty">): StockStatus {
  if (product.qty <= 0) return "out";
  if (product.qty <= LOW_STOCK_LIMIT) return "low";
  return "in";
}

/** Turns a thrown value into a short message that is safe to show a user. */
export function errorMessage(error: unknown) {
  const code = (error as { code?: string })?.code ?? "";
  const messages: Record<string, string> = {
    "auth/invalid-credential": "That email or password is wrong. Try again.",
    "auth/user-not-found": "No account uses that email. Create one first.",
    "auth/wrong-password": "That email or password is wrong. Try again.",
    "auth/email-already-in-use": "An account already uses that email. Sign in instead.",
    "auth/weak-password": "Use a password with at least 8 characters.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
    "auth/network-request-failed": "You're offline. Check your connection and try again.",
    "permission-denied": "You don't have permission to do that.",
  };
  if (messages[code]) return messages[code];
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Try again.";
}
