"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, LoaderCircle, LogOut, Package, ReceiptText, Users } from "lucide-react";
import { logout } from "@/firebase-actions";
import { useAuth } from "@/components/providers/AuthProvider";
import { Avatar } from "@/components/ui/Bits";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/sales", label: "Sales", icon: ReceiptText },
  { href: "/team", label: "Team", icon: Users },
];

/** Sidebar on desktop, top bar and bottom tabs on phones. Signed-in users only. */
export function AppShell({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !profile) router.replace("/auth/login");
  }, [loading, profile, router]);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
        <LoaderCircle className="size-8 animate-spin text-brand" aria-hidden />
      </div>
    );
  }

  return (
    <div className="draw-icons min-h-screen lg:pl-[240px]">
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] flex-col gap-7 bg-forest px-4 py-6 text-white lg:flex">
        <Logo tone="light" href="/dashboard" className="px-2 text-[21px]" />
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-[46px] items-center gap-3 rounded-xl px-3.5 font-semibold transition-colors",
                  active ? "text-forest" : "text-sage hover:bg-white/10 hover:text-white",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <item.icon className="relative size-5" aria-hidden />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-[14px] bg-forest-soft p-3">
          <Avatar name={profile.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{profile.businessName}</p>
            <p className="truncate text-[13px] text-sage">{profile.name}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sage hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-[18px]" aria-hidden />
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-ground/90 px-5 py-3 backdrop-blur-md lg:hidden">
        <Logo href="/dashboard" className="text-xl" />
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold text-muted">{profile.businessName}</span>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-line"
          >
            <LogOut className="size-5" aria-hidden />
          </button>
        </div>
      </header>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-5 pb-28 pt-6 sm:px-8 lg:pb-10 lg:pt-9"
      >
        {children}
      </motion.main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold",
                active ? "text-brand" : "text-muted",
              )}
            >
              {active && (
                <motion.span layoutId="tab-active" className="absolute top-0 h-[3px] w-10 rounded-full bg-brand" />
              )}
              <item.icon className="size-[22px]" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
