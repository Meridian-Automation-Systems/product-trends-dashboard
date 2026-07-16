"use client";

import type { RelatedQuery } from "@/lib/types";

// Two ruled lists: "top" (consistently popular) and "rising" (fast growing).
// Every row is clickable and runs that query as a new search.
export default function RelatedQueries({
  top,
  rising,
  onSearch,
  onAsk,
}: {
  top: RelatedQuery[];
  rising: RelatedQuery[];
  onSearch?: (keyword: string) => void;
  onAsk?: () => void;
}) {
  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="m-0 text-xl font-extrabold">What people search</h4>
          <p className="mb-0 mt-1 text-[13px] text-ink/60">
            Related queries \u2014 click one to search it.
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-7 gap-y-3">
        <QueryList
          title="Top \u2014 steady favorites"
          items={top}
          accent={false}
          onSearch={onSearch}
        />
        <QueryList
          title="Rising \u2014 growing fast"
          items={rising}
          accent
          onSearch={onSearch}
        />
      </div>
    </div>
  );
}

function QueryList({
  title,
  items,
  accent,
  onSearch,
}: {
  title: string;
  items: RelatedQuery[];
  accent: boolean;
  onSearch?: (keyword: string) => void;
}) {
  return (
    <div>
      <p
        className={`m-0 border-b-2 border-divider pb-2 text-[11px] uppercase tracking-widest ${
          accent ? "text-brand-deep" : "text-ink/60"
        }`}
      >
        {title}
      </p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-ink/55">No data.</p>
      ) : (
        items.slice(0, 6).map((q, i) => (
          <button
            key={`${q.query}-${i}`}
            onClick={() => onSearch?.(q.query)}
            className="flex w-full items-center justify-between gap-2.5 border-b border-divider px-0.5 py-2 text-left text-[13.5px] text-ink transition hover:bg-ink/5"
          >
            <span className="min-w-0 truncate">{q.query}</span>
            <span
              className={`shrink-0 tabular-nums ${
                accent ? "font-semibold text-brand-deep" : "text-ink/60"
              }`}
            >
              {accent ? `+${q.value}%` : q.value}
            </span>
          </button>
        ))
      )}
    </div>
  );
}
