"use client";

import { useEffect, useState } from "react";
import { fetchSearchHistory } from "@/lib/trends";
import type { TrendSearchRow } from "@/lib/types";

// A modal overlay that loads and lists the full saved-search history.
// Clicking an entry loads that search back into the dashboard.
export default function HistoryPanel({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (row: TrendSearchRow) => void;
}) {
  const [rows, setRows] = useState<TrendSearchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSearchHistory()
      .then((data) => setRows(data))
      .catch((e) => setError(e.message || "Failed to load history."))
      .finally(() => setLoading(false));
  }, []);

  // Close on Escape for keyboard accessibility.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 sm:p-10"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-2xl flex-col rounded-xl border border-slate-800 bg-slate-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <h2 className="text-lg font-semibold text-slate-200">
            Search history
          </h2>
          <button
            onClick={onClose}
            aria-label="Close history"
            className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:border-brand"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-slate-500">Loading history…</p>
          ) : error ? (
            <p className="rounded-lg border border-rose-900 bg-rose-950/50 p-4 text-sm text-rose-300">
              {error}
            </p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-slate-500">No searches saved yet.</p>
          ) : (
            <ul className="space-y-2">
              {rows.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => {
                      onSelect(r);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-left transition hover:border-brand"
                  >
                    <span className="truncate font-medium text-slate-200">
                      {r.keyword}
                    </span>
                    {r.created_at && (
                      <span className="shrink-0 text-xs text-slate-500">
                        {formatDate(r.created_at)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
