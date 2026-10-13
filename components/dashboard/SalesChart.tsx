"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MONTHS, formatNaira, formatNairaShort } from "@/lib/utils";

interface SalesChartProps {
  /** Twelve totals, January first. */
  monthly: number[];
  /** Index of the last month that has happened; later months are left blank. */
  lastMonth: number;
}

const WIDTH = 720;
const HEIGHT = 270;
const LEFT = 64;
const RIGHT = 20;
const TOP = 20;
const BOTTOM = 224;
const STEP = (WIDTH - LEFT - RIGHT) / 11;

/** Rounds a maximum up to a tidy axis ceiling, e.g. 640,000 -> 800,000. */
function niceCeiling(max: number) {
  if (max <= 0) return 1000;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const steps = [1, 2, 4, 5, 8, 10];
  return (steps.find((step) => step * magnitude >= max) ?? 10) * magnitude;
}

export function SalesChart({ monthly, lastMonth }: SalesChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const ceiling = niceCeiling(Math.max(...monthly));
  const x = (index: number) => LEFT + index * STEP;
  const y = (value: number) => BOTTOM - (value / ceiling) * (BOTTOM - TOP);

  const points = monthly.slice(0, lastMonth + 1).map((value, index) => ({ x: x(index), y: y(value), value }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join("");
  const area = `${line}L${x(lastMonth)} ${BOTTOM}L${LEFT} ${BOTTOM}Z`;
  const active = hovered ?? lastMonth;
  const activePoint = points[active];
  const labelOnLeft = active > 8;

  return (
    <svg
      role="img"
      aria-label={`Monthly sales: ${points
        .map((point, index) => `${MONTHS[index]} ${formatNaira(point.value)}`)
        .join(", ")}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="tabular h-auto w-full text-xs"
      onMouseLeave={() => setHovered(null)}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
        <g key={fraction}>
          <line x1={LEFT} x2={WIDTH - RIGHT} y1={y(ceiling * fraction)} y2={y(ceiling * fraction)} className="stroke-line" />
          <text x={LEFT - 10} y={y(ceiling * fraction) + 4} textAnchor="end" className="fill-muted">
            {formatNairaShort(ceiling * fraction)}
          </text>
        </g>
      ))}

      <motion.path
        d={area}
        className="fill-mint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      />
      <motion.path
        d={line}
        fill="none"
        className="stroke-brand"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
      />

      {MONTHS.map((month, index) => (
        <text
          key={month}
          x={x(index)}
          y={BOTTOM + 24}
          textAnchor="middle"
          className={index === active ? "fill-ink font-bold" : "fill-muted"}
        >
          {month}
        </text>
      ))}

      {activePoint && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: hovered === null ? 1.7 : 0 }}>
          <line x1={activePoint.x} x2={activePoint.x} y1={activePoint.y} y2={BOTTOM} className="stroke-brand" strokeDasharray="4 4" />
          <circle cx={activePoint.x} cy={activePoint.y} r={7} className="fill-gold stroke-forest" strokeWidth={2.5} />
          <text
            x={activePoint.x + (labelOnLeft ? -14 : 14)}
            y={Math.max(activePoint.y - 12, 14)}
            textAnchor={labelOnLeft ? "end" : "start"}
            className="fill-ink text-[13px] font-bold"
          >
            {formatNaira(activePoint.value)}
          </text>
        </motion.g>
      )}

      {/* Invisible columns that pick up hover and touch for each month. */}
      {points.map((point, index) => (
        <rect
          key={index}
          x={point.x - STEP / 2}
          y={TOP}
          width={STEP}
          height={BOTTOM - TOP}
          fill="transparent"
          onMouseEnter={() => setHovered(index)}
          onClick={() => setHovered(index)}
        />
      ))}
    </svg>
  );
}
