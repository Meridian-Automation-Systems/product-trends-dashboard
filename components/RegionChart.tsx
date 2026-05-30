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

export default function RegionChart({ data }: { data: RegionPoint[] }) {
  const top = data.slice(0, 10);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="mb-4 font-semibold">Interest by region (top 10)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="location"
            width={90}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "#1e293b80" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
          />
          <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
