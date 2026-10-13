"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.2, 0.7, 0.2, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Animate on mount instead of waiting for the element to scroll into view. */
  immediate?: boolean;
}

/** Fades and lifts its children into place. */
export function Reveal({ children, delay = 0, className, immediate }: RevealProps) {
  const hidden = { opacity: 0, y: 22 };
  const shown = { opacity: 1, y: 0 };
  const transition = { duration: 0.7, delay, ease: EASE };

  return immediate ? (
    <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-60px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
}

const formatWhole = (value: number) => Math.round(value).toLocaleString("en-NG");

/**
 * Counts from zero up to a number the first time it is seen.
 * Pass a stable `format` function (defined outside the component).
 */
export function CountUp({ value, format = formatWhole, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduceMotion) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (latest) => (node.textContent = format(latest)),
    });
    return () => controls.stop();
  }, [value, inView, reduceMotion, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

interface GrowBarProps {
  /** Final size, as any CSS length. */
  size: string;
  direction?: "up" | "right";
  delay?: number;
  className?: string;
}

/** A bar that grows to its size, used for mini charts and progress bars. */
export function GrowBar({ size, direction = "up", delay = 0, className }: GrowBarProps) {
  const vertical = direction === "up";
  return (
    <motion.div
      className={className}
      style={vertical ? { height: size, originY: 1 } : { width: size, originX: 0 }}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    />
  );
}
