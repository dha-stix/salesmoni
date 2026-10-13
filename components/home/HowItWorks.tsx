"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    title: "Add your products",
    body: "List what you sell with its price and the quantity you have in stock.",
  },
  {
    title: "Record each sale",
    body: "Choose the product and quantity. Your stock goes down by the amount sold.",
  },
  {
    title: "Check and download",
    body: "Watch your totals on the dashboard and download an Excel report for any period.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.35"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="how-it-works" className="container-page scroll-mt-24 pt-28">
      <SectionHeading eyebrow="How it works" title="Set up once. Sell all day." />

      <div ref={ref} className="relative pt-12">
        {/* A line that fills from left to right as the section scrolls into view. */}
        <div className="absolute inset-x-0 top-12 hidden h-[3px] rounded-full bg-line md:block">
          <motion.div className="h-full origin-left rounded-full bg-brand" style={{ scaleX: progress }} />
        </div>

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.15} className="flex flex-col gap-3 border-t-[3px] border-brand pt-6 md:border-transparent">
                <span className="font-display text-[56px] font-bold leading-none text-brand">{index + 1}</span>
                <h3 className="text-[22px] font-bold">{step.title}</h3>
                <p className="text-muted">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
