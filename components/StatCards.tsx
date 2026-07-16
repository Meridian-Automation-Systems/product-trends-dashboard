"use client";

import type { TrendsData } from "@/lib/types";
import { computeStats } from "@/lib/insights";

// The at-a-glance stat band: red numerals, uppercase labels, plain-English
// hints, drawn structure (2px rules) instead of cards.
export default function StatCards({ data }: { data: TrendsData }) {
  const s = computeStats(data);

  const cards = [
    {
      label: "Peak interest",
      value: String(s.peak),
      hint: "100 = its single busiest week",
      big: true,
    },
    {
      label: "Typical week",
      value: String(s.avg),
      hint: "average interest, 0\u2013100",
      big: true,
    },
    {
      label: "Momentum",
      value: `${s.momentum > 0 ? "+" : ""}${s.momentum}%`,
      hint: "last 3 weeks vs. first 3",
      big: true,
    },
    {
      label: "Top region",
      value: s.topRegion,
      hint: "highest search interest",
      big: false,
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] overflow-hidden border-y-2 border-divider">
      {cards.map((c) => (
        <div key={c.label} className="-ml-0.5 border-l-2 border-divider px-6 pb-5 pt-5">
          <p className="m-0 text-[13px] uppercase tracking-wider text-ink/70">
            {c.label}
          </p>
          <p
            className={`-ml-[0.045em] mb-0 mt-2.5 font-extrabold leading-[1.15] text-brand ${
              c.big ? "text-[38px]" : "text-[25px]"
            }`}
          >
            {c.value}
          </p>
          <p className="mb-0 mt-2 text-[13px] leading-[18px] text-ink/55">
            {c.hint}
          </p>
        </div>
      ))}
    </div>
  );
}
