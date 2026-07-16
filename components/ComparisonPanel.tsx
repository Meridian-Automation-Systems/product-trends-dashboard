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

// Distinct line colors cycled across the selected keywords \u2014 the accent,
// ink, and neutral steps of the theme.
const COLORS = ["#ec3013", "#201e1d", "#9b9797", "#e15b47", "#605d5d"];

export default function ComparisonPanel({
  searches,
}: {
  searches: TrendSearchRow[];
}) {
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

  const selectedRows = useMemo(
    () => searches.filter((s) => selected.has(s.keyword)),
    [searches, selected]
  );

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
    <section className="mt-9 border-t-2 border-divider pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="m-0 text-xl font-extrabold">Compare keywords</h4>
          <p className="mb-0 mt-1 text-[13px] text-ink/60">
            Pick from your recent searches to see them on one chart.
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setSelected(new Set(searches.map((s) => s.keyword)))}
            className="px-1.5 py-2 text-[13px] font-extrabold text-brand hover:bg-brand/10"
          >
            Select all
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="px-1.5 py-2 text-[13px] font-extrabold text-brand hover:bg-brand/10"
          >
            Clear
          </button>
        </div>
      </div>

      {searches.length === 0 ? (
        <p className="mt-4 text-sm text-ink/55">
          No recent searches to compare yet. Search a few keywords first.
        </p>
      ) : (
        <>
          <div className="mb-4 mt-4 flex flex-wrap gap-2">
            {searches.map((s) => {
              const active = selected.has(s.keyword);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.keyword)}
                  aria-pressed={active}
                  className={`border px-3 py-1.5 text-[13px] transition ${
                    active
                      ? "border-brand bg-brand text-paper"
                      : "border-divider bg-transparent text-ink hover:border-brand"
                  }`}
                >
                  {s.keyword}
                </button>
              );
            })}
          </div>

          {selectedRows.length === 0 ? (
            <p className="text-sm text-ink/55">
              Select one or more keywords above to compare their interest over
              time.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={merged}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#d7d3d3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#7d7979", fontSize: 12 }}
                  minTickGap={48}
                  stroke="#201e1d"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#7d7979", fontSize: 12 }}
                  stroke="#201e1d"
                />
                <Tooltip
                  contentStyle={{
                    background: "#f8f4f4",
                    border: "1px solid rgba(32,30,29,0.4)",
                    borderRadius: 0,
                    color: "#201e1d",
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
    </section>
  );
}
