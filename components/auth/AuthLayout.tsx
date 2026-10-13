"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ledgerBackground } from "@/images";
import { useAuth } from "@/components/providers/AuthProvider";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  /** The dark panel's headline; the last phrase is highlighted. */
  headline: string;
  highlight: string;
  /** Content shown under the headline in the dark panel. */
  aside: ReactNode;
  /** Put the dark panel on the right instead of the left. */
  reverse?: boolean;
  children: ReactNode;
}

/** The split screen shared by the sign-in and sign-up pages. */
export function AuthLayout({ headline, highlight, aside, reverse, children }: AuthLayoutProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  // Someone who is already signed in has no business on an auth page.
  useEffect(() => {
    if (!loading && profile) router.replace("/dashboard");
  }, [loading, profile, router]);

  return (
    <main className="draw-icons grid min-h-screen lg:grid-cols-2">
      <section
        className={cn(
          "hidden flex-col justify-between gap-10 bg-forest p-10 text-white lg:flex xl:p-14",
          reverse && "lg:order-2",
        )}
        style={ledgerBackground}
      >
        <Logo tone="light" />
        <div className="flex flex-col gap-8">
          <Reveal immediate>
            <h1 className="heading-display text-[44px] leading-[1.04] xl:text-[56px]">
              {headline} <span className="text-gold">{highlight}</span>
            </h1>
          </Reveal>
          {aside}
        </div>
        <p className="text-sm text-sage">Sales records and stock control for growing businesses</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-6">
        <Reveal immediate delay={0.1} className="flex w-full max-w-[400px] flex-col gap-6">
          <Logo className="lg:hidden" />
          {children}
        </Reveal>
      </section>
    </main>
  );
}
