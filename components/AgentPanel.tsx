"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage, TrendsData } from "@/lib/types";

export interface Suggestion {
  label: string;
  run: () => void;
}

// The docked research assistant. Open by default; collapses to a labelled
// rail with an unread badge instead of disappearing behind a tiny tab.
// Presentational — conversation state lives in DashboardClient so chart
// "Ask" hooks and suggestion chips can inject questions too.
export default function AgentPanel({
  data,
  open,
  unread,
  onToggle,
  messages,
  loading,
  suggestions,
  onAsk,
}: {
  data: TrendsData | null;
  open: boolean;
  unread: number;
  onToggle: () => void;
  messages: ChatMessage[];
  loading: boolean;
  suggestions: Suggestion[];
  onAsk: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    onAsk(text);
  }

  if (!open) {
    return (
      <aside className="border-l-2 border-divider">
        <div className="sticky top-0 h-screen">
          <button
            onClick={onToggle}
            aria-label="Open assistant"
            className="flex h-full w-full flex-col items-center gap-3 bg-surface py-4 transition hover:bg-brand-tint"
          >
            <span className="inline-block h-2.5 w-2.5 bg-brand" />
            {unread > 0 && (
              <span className="bg-brand px-1.5 py-0.5 text-[11px] font-extrabold text-paper">
                {unread}
              </span>
            )}
            <span className="text-[13px] font-extrabold uppercase tracking-widest text-ink [writing-mode:vertical-rl]">
              Assistant
            </span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="min-w-0 border-l-2 border-divider">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-paper">
        <div className="flex items-start gap-3 border-b-2 border-divider px-5 py-4">
          <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 bg-brand" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold uppercase tracking-wide">
              Research assistant
            </div>
            <p className="mb-0 mt-0.5 text-xs text-ink/55">
              {data
                ? `Reading “${data.keyword}” — ask me anything about it`
                : "No keyword yet — I can run the first search for you"}
            </p>
          </div>
          <button
            onClick={onToggle}
            aria-label="Collapse assistant"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-divider text-ink transition hover:bg-ink/5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[88%] px-3 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-brand text-paper"
                  : "bg-surface text-ink"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="max-w-[88%] bg-surface px-3 py-2.5 text-sm text-ink/55">
              {"Reading the data…"}
            </div>
          )}
          {!loading && suggestions.length > 0 && (
            <div className="mt-1 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-ink/55">
                Suggested
              </span>
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={s.run}
                  className="border border-divider px-3 py-2 text-left text-[13px] text-ink transition hover:border-brand hover:bg-brand-tint"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={send}
          className="flex gap-2 border-t-2 border-divider px-5 py-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"Ask about this keyword…"}
            className="min-w-0 flex-1 border border-divider bg-surface px-2.5 py-1.5 text-sm text-ink caret-brand outline-none placeholder:text-ink/50 hover:border-ink/45 focus-visible:border-brand"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand px-4 py-2 text-sm font-extrabold text-paper transition hover:bg-brand-dark active:bg-brand-deep disabled:opacity-45"
          >
            Ask
          </button>
        </form>
      </div>
    </aside>
  );
}
