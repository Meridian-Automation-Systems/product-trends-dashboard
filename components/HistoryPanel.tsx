"use client";

import { useEffect, useState } from "react";
import { fetchSearchHistory } from "@/lib/trends";
import type { TrendSearchRow } from "@/lib/types";

// A modal dialog listing the full saved-search history.
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#2d2b2b]/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-xl flex-col gap-3 bg-surface p-4 shadow-[0_12px_32px_rgba(45,43,43,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xl font-extrabold">Search history</div>
        <div className="overflow-y-auto">
          {loading ? (
            <p className="text-sm text-ink/55">Loading history\u2026</p>
          ) : error ? (
            <p className="border-2 border-brand bg-brand-tint p-4 text-sm text-brand-deep">
              {error}
            </p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-ink/55">No searches saved yet.</p>
          ) : (
            <>
              <div className="flex items-center justify-between border-b-2 border-divider pb-2 text-[11px] uppercase tracking-widest text-ink/60">
                <span>Keyword</span>
                <span>When</span>
              </div>
              {rows.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelect(r);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between gap-3 border-b border-divider px-1 py-3 text-left transition hover:bg-ink/5"
                >
                  <span className="truncate text-sm font-semibold text-ink">
                    {r.keyword}
                  </span>
                  {r.created_at && (
                    <span className="shrink-0 text-xs text-ink/55">
                      {formatDate(r.created_at)}
                    </span>
                  )}
                </button>
              ))}
              <p className="mb-0 mt-2.5 text-xs text-ink/55">
                Click a row to load that search.
              </p>
            </>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="border border-divider px-4 py-2 text-sm font-extrabold text-ink transition hover:bg-ink/5"
          >
            Close
          </button>
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
