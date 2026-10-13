"use client";

import { CountUp, GrowBar, Reveal } from "@/components/ui/Motion";
import { formatNaira } from "@/lib/utils";

const bars = [30, 44, 36, 58, 50, 72];

/** The sample "this month" card shown beside the sign-in form. */
export function MonthPreview() {
  return (
    <Reveal immediate delay={0.15} className="flex max-w-[420px] flex-col gap-3.5 rounded-[20px] bg-white p-6 text-ink">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted">This month</span>
        <span className="pill bg-mint text-brand">Sample</span>
      </div>
      <CountUp value={612000} format={formatNaira} className="tabular font-display text-[40px] font-bold leading-tight" />
      <div className="flex h-[72px] items-end gap-2">
        {bars.map((height, index) => (
          <GrowBar
            key={index}
            size={`${height}px`}
            delay={0.3 + index * 0.07}
            className={`flex-1 rounded-md ${index === bars.length - 1 ? "bg-brand" : "bg-mint-strong"}`}
          />
        ))}
      </div>
    </Reveal>
  );
}

const steps = [
  { title: "Add your products", body: "Name, price, and quantity in stock" },
  { title: "Invite your sales team", body: "Each person records sales under their own name" },
  { title: "Record sales and download reports", body: "Stock goes down as you sell" },
];

/** The three setup steps shown beside the sign-up form. */
export function SetupSteps() {
  return (
    <ol className="flex max-w-[460px] flex-col gap-3.5">
      {steps.map((step, index) => (
        <li key={step.title}>
          <Reveal immediate delay={0.15 + index * 0.12} className="flex items-center gap-4 rounded-2xl bg-forest-soft px-5 py-[18px]">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-forest">
              {index + 1}
            </span>
            <span>
              <strong className="block">{step.title}</strong>
              <span className="text-[15px] text-sage">{step.body}</span>
            </span>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
