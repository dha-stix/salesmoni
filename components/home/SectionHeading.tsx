import { Reveal } from "@/components/ui/Motion";

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="flex max-w-[640px] flex-col gap-3.5">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="heading-display text-[32px] leading-[1.08] sm:text-[46px]">{title}</h2>
    </Reveal>
  );
}
