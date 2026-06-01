"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import StatCards from "./StatCards";
import InterestOverTimeChart from "./InterestOverTimeChart";
import RegionChart from "./RegionChart";
import RelatedQueries from "./RelatedQueries";
import AgentPanel from "./AgentPanel";
import ComparisonPanel from "./ComparisonPanel";
import HistoryPanel from "./HistoryPanel";
import { fetchTrends, fetchRecentSearches } from "@/lib/trends";
import type { TrendsData, TrendSearchRow } from "@/lib/types";

export default function DashboardClient() {
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<TrendSearchRow[]>([]);
  const [comparing, setComparing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load recent searches on mount (so the dashboard isn't empty).
  useEffect(() => {
    fetchRecentSearches()
      .then((rows) => {
        setRecent(rows);
        if (rows[0]) setData(rows[0].data);
      })
      .catch(() => {
        /* table may not exist yet — ignore on first run */
      });
  }, []);

  async function handleSearch(keyword: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTrends(keyword);
      setData(result);
      setRecent((r) => [
        { id: keyword, keyword, created_at: "", data: result },
        ...r.filter((x) => x.keyword !== keyword),
      ]);
    } catch (e: any) {
      setError(e.message || "Failed to fetch trends.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold">Product Trends Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setComparing((c) => !c)}
            aria-pressed={comparing}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              comparing
                ? "border-brand bg-brand/20 text-slate-100"
                : "border-slate-700 text-slate-300 hover:border-brand"
            }`}
          >
            Comparison
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-brand"
          >
            History
          </button>
        </div>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Recent search chips */}
      {recent.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {recent.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSearch(r.keyword)}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300 hover:border-brand"
            >
              {r.keyword}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-lg border border-rose-900 bg-rose-950/50 p-4 text-sm text-rose-300">
          {error}
        </p>
      )}

      {comparing && <ComparisonPanel searches={recent} />}

      {data ? (
        <div className="mt-8 space-y-6">
          <h2 className="text-lg font-semibold text-slate-300">
            Results for{" "}
            <span className="text-brand">&ldquo;{data.keyword}&rdquo;</span>
          </h2>
          <StatCards data={data} />
          <InterestOverTimeChart data={data.interest_over_time} />
          <div className="grid gap-6 lg:grid-cols-2">
            <RegionChart data={data.interest_by_region} />
            <RelatedQueries top={data.top_queries} rising={data.rising_queries} />
          </div>
        </div>
      ) : (
        !loading && (
          <p className="mt-16 text-center text-slate-500">
            Search a keyword above to see trends, charts, and insights.
          </p>
        )
      )}

      <AgentPanel data={data} />

      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onSelect={(row) => {
            setData(row.data);
            setRecent((r) => [
              row,
              ...r.filter((x) => x.keyword !== row.keyword),
            ]);
          }}
        />
      )}
    </main>
  );
}
