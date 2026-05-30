"use client";

import type { RelatedQuery } from "@/lib/types";

// Two simple lists: "top" (consistently popular) and "rising" (fast growing).
export default function RelatedQueries({
  top,
  rising,
}: {
  top: RelatedQuery[];
  rising: RelatedQuery[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <QueryList title="Top related queries" items={top} suffix="" />
      <QueryList title="Rising queries" items={rising} suffix="%" accent />
    </div>
  );
}

function QueryList({
  title,
  items,
  suffix,
  accent,
}: {
  title: string;
  items: RelatedQuery[];
  suffix: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="mb-4 font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No data.</p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 10).map((q, i) => (
            <li
              key={`${q.query}-${i}`}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="truncate text-slate-300">{q.query}</span>
              <span
                className={`shrink-0 font-medium ${
                  accent ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {q.value}
                {suffix}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
