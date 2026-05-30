"use client";

import type { TrendsData } from "@/lib/types";

// Small derived stats so the user gets an at-a-glance read of the keyword.
export default function StatCards({ data }: { data: TrendsData }) {
  const series = data.interest_over_time;
  const values = series.map((p) => p.value);

  const peak = values.length ? Math.max(...values) : 0;
  const avg = values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;

  // Simple momentum: average of last 3 points vs. first 3 points.
  const recent = avgOf(values.slice(-3));
  const early = avgOf(values.slice(0, 3));
  const momentum = early ? Math.round(((recent - early) / early) * 100) : 0;

  const topRegion = data.interest_by_region[0]?.location ?? "—";

  const cards = [
    { label: "Peak interest", value: String(peak), hint: "0–100 scale" },
    { label: "Average interest", value: String(avg), hint: "across the period" },
    {
      label: "Momentum",
      value: `${momentum > 0 ? "+" : ""}${momentum}%`,
      hint: "recent vs. early",
      accent: momentum >= 0 ? "text-emerald-400" : "text-rose-400",
    },
    { label: "Top region", value: topRegion, hint: "highest interest" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <p className="text-sm text-slate-400">{c.label}</p>
          <p className={`mt-2 text-2xl font-bold ${c.accent ?? ""}`}>
            {c.value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{c.hint}</p>
        </div>
      ))}
    </div>
  );
}

function avgOf(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
