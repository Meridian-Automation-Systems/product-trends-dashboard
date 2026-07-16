"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RegionPoint } from "@/lib/types";

export default function RegionChart({
  data,
  onAsk,
}: {
  data: RegionPoint[];
  onAsk?: () => void;
}) {
  const top = data.slice(0, 10);

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="m-0 text-xl font-extrabold">Where demand lives</h4>
          <p className="mb-0 mt-1 text-[13px] text-ink/60">
            Top 10 regions by search interest.
          </p>
        </div>
        {onAsk && (
          <button
            onClick={onAsk}
            className="px-1 py-2 text-[13px] font-extrabold text-brand hover:bg-brand/10"
          >
            Ask \u2192
          </button>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 20, bottom: 0 }}
        >
          <CartesianGrid stroke="#d7d3d3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: "#7d7979", fontSize: 12 }}
            stroke="#201e1d"
          />
          <YAxis
            type="category"
            dataKey="location"
            width={90}
            tick={{ fill: "#444141", fontSize: 12 }}
            stroke="#201e1d"
          />
          <Tooltip
            cursor={{ fill: "rgba(32,30,29,0.06)" }}
            contentStyle={{
              background: "#f8f4f4",
              border: "1px solid rgba(32,30,29,0.4)",
              borderRadius: 0,
              color: "#201e1d",
            }}
          />
          <Bar dataKey="value" fill="#201e1d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
