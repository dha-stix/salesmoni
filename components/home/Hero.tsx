"use client";

import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { ledgerBackground } from "@/images";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp, GrowBar, Reveal } from "@/components/ui/Motion";
import { formatNaira } from "@/lib/utils";

const headline = ["Know", "what", "you", "sold,", "what's", "left,", "and", "what", "you"];
const bars = [58, 84, 66, 110, 92, 124, 140];
const sampleSales = [
  { name: "Rice 50kg", qty: 1, total: 78000 },
  { name: "Vegetable oil 5L", qty: 2, total: 29000 },
  { name: "Sugar 1kg", qty: 4, total: 12000 },
];

export function Hero() {
  return (
    <section className="draw-icons overflow-hidden bg-forest text-white" style={ledgerBackground}>
      <div className="container-page grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <Reveal immediate>
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-line px-3.5 py-1.5 text-sm text-sage">
              <span className="size-2 rounded-full bg-gold" />
              Sales records and stock control for growing businesses
            </span>
          </Reveal>

          <h1 className="heading-display text-[44px] leading-[1.02] sm:text-6xl lg:text-[72px]">
            {headline.map((word, index) => (
              <span key={index} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + index * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {word}&nbsp;
                </motion.span>
              </span>
            ))}
            <span className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className="inline-block text-gold"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + headline.length * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
              >
                made.
              </motion.span>
            </span>
          </h1>

          <Reveal immediate delay={0.7}>
            <p className="max-w-[520px] text-lg text-sage sm:text-[19px]">
              Record every sale in seconds. SalesMoni updates your stock as you sell and turns your
              records into a clean Excel report whenever you need one.
            </p>
          </Reveal>

          <Reveal immediate delay={0.85} className="flex flex-wrap gap-3.5 pt-2">
            <ButtonLink href="/auth/register" variant="gold" size="pill">
              Start free <ArrowRight className="size-[18px]" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="outline-dark" size="pill">
              See how it works
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal immediate delay={0.3} className="relative pb-10 pt-2">
          <motion.div
            className="flex flex-col gap-5 rounded-3xl bg-white p-6 text-ink shadow-2xl shadow-black/30 sm:p-7"
            whileHover={{ rotate: -1, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted">Today&apos;s sales</p>
                <CountUp
                  value={248500}
                  format={formatNaira}
                  className="tabular font-display text-[40px] font-bold leading-tight sm:text-[44px]"
                />
              </div>
              <span className="pill bg-mint text-brand">18 sales</span>
            </div>

            <div className="flex h-[140px] items-end gap-2.5">
              {bars.map((height, index) => (
                <GrowBar
                  key={index}
                  size={`${height}px`}
                  delay={0.5 + index * 0.07}
                  className={`flex-1 rounded-lg ${index === bars.length - 1 ? "bg-brand" : "bg-mint-strong"}`}
                />
              ))}
            </div>

            <ul className="tabular flex flex-col text-[15px]">
              {sampleSales.map((sale, index) => (
                <motion.li
                  key={sale.name}
                  className="flex justify-between gap-3 border-t border-line py-3 last:pb-0"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.12 }}
                >
                  <span>
                    {sale.name} <span className="text-muted">× {sale.qty}</span>
                  </span>
                  <span className="font-semibold">{formatNaira(sale.total)}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 flex items-center gap-3 rounded-2xl bg-gold px-4 py-3.5 text-sm text-forest shadow-xl sm:-left-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Package className="size-[22px]" aria-hidden />
            <span>
              <strong className="block">Stock updated</strong>
              Rice 50kg: 42 → 41 left
            </span>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
