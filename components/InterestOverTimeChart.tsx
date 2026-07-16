"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimelinePoint } from "@/lib/types";

export default function InterestOverTimeChart({
  data,
  onAsk,
}: {
  data: TimelinePoint[];
  onAsk?: () => void;
}) {
  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="m-0 text-xl font-extrabold">Interest over time</h4>
          <p className="mb-0 mt-1 text-[13px] text-ink/60">
            Weekly search interest on Google, 0\u2013100. 100 is this keyword's
            single busiest week.
          </p>
        </div>
        {onAsk && (
          <button
            onClick={onAsk}
            className="px-1 py-2 text-[13px] font-extrabold text-brand hover:bg-brand/10"
          >
            Ask about this chart \u2192
          </button>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ec3013"
            strokeWidth={2}
            fill="#ffe0d9"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
