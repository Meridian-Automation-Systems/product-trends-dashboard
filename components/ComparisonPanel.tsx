"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendSearchRow } from "@/lib/types";

// Distinct line colors cycled across the selected keywords.
const COLORS = [
  "#818cf8",
  "#34d399",
  "#f472b6",
  "#fbbf24",
  "#60a5fa",
  "#f87171",
  "#a78bfa",
  "#2dd4bf",
];

export default function ComparisonPanel({
  searches,
}: {
  searches: TrendSearchRow[];
}) {
  // Track selected keywords. Default to the first two so the chart isn't empty.
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(searches.slice(0, 2).map((s) => s.keyword))
  );

  function toggle(keyword: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) next.delete(keyword);
      else next.add(keyword);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(searches.map((s) => s.keyword)));
  }

  function clearAll() {
    setSelected(new Set());
  }

  const selectedRows = useMemo(
    () => searches.filter((s) => selected.has(s.keyword)),
    [searches, selected]
  );

  // Merge each keyword's interest-over-time series into a single dataset,
  // keyed by date, with one value column per selected keyword.
  const merged = useMemo(() => {
    const byDate = new Map<string, Record<string, number | string>>();
    for (const row of selectedRows) {
      for (const point of row.data.interest_over_time) {
        const entry = byDate.get(point.date) ?? { date: point.date };
        entry[row.keyword] = point.value;
        byDate.set(point.date, entry);
      }
    }
    return Array.from(byDate.values());
  }, [selectedRows]);

  return (
    <div className="mt-8 space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-300">
          Compare keywords
        </h2>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-brand"
          >
            Select all
          </button>
          <button
            onClick={clearAll}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-brand"
          >
            Clear
          </button>
        </div>
      </div>

      {searches.length === 0 ? (
        <p className="text-sm text-slate-500">
          No recent searches to compare yet. Search a few keywords first.
        </p>
      ) : (
        <>
          {/* Selectable keyword chips */}
          <div className="flex flex-wrap gap-2">
            {searches.map((s) => {
              const active = selected.has(s.keyword);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.keyword)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    active
                      ? "border-brand bg-brand/20 text-slate-100"
                      : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {active ? "✓ " : ""}
                  {s.keyword}
                </button>
              );
            })}
          </div>

          {/* Multi-line comparison chart */}
          {selectedRows.length === 0 ? (
            <p className="text-sm text-slate-500">
              Select one or more keywords above to compare their interest over
              time.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={merged}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  minTickGap={32}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 8,
                    color: "#e2e8f0",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {selectedRows.map((row, i) => (
                  <Line
                    key={row.keyword}
                    type="monotone"
                    dataKey={row.keyword}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
}
