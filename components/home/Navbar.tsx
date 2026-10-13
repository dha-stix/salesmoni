"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { homeLinks } from "./links";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { profile } = useAuth();

  const actions = profile ? (
    <ButtonLink href="/dashboard" variant="gold" size="md" className="rounded-full">
      Open dashboard
    </ButtonLink>
  ) : (
    <>
      <Link href="/auth/login" className="px-3 py-3 text-[15px] font-semibold hover:text-gold">
        Sign in
      </Link>
      <ButtonLink href="/auth/register" variant="gold" size="md" className="rounded-full">
        Get started
      </ButtonLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forest/90 text-white backdrop-blur-md">
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Logo tone="light" />
        <nav className="hidden gap-8 text-[15px] text-sage md:flex">
          {homeLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">{actions}</div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex size-11 items-center justify-center rounded-xl hover:bg-white/10 md:hidden"
        >
          {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <nav className="container-page flex flex-col gap-1 pb-5">
              {homeLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-lg text-sage hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-wrap items-center gap-2 pt-3">{actions}</div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
