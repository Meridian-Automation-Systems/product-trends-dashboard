"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import StatCards from "./StatCards";
import InterestOverTimeChart from "./InterestOverTimeChart";
import RegionChart from "./RegionChart";
import RelatedQueries from "./RelatedQueries";
import AgentPanel, { type Suggestion } from "./AgentPanel";
import ComparisonPanel from "./ComparisonPanel";
import HistoryPanel from "./HistoryPanel";
import { fetchTrends, fetchRecentSearches } from "@/lib/trends";
import {
  computeStats,
  localBrief,
  suggestedQuestions,
  verdictLabel,
  verdictOf,
} from "@/lib/insights";
import type { ChatMessage, TrendSearchRow, TrendsData } from "@/lib/types";

const VERDICT_TAG: Record<string, string> = {
  up: "bg-brand-tint text-[#7c1405]",
  down: "border border-brand text-brand",
  steady: "bg-[#f8f4f4] text-[#444141]",
};

export default function DashboardClient() {
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingKeyword, setPendingKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<TrendSearchRow[]>([]);
  const [comparing, setComparing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Assistant state lives here so suggestion chips, chart \u201cAsk\u201d hooks and
  // the auto-brief can all talk to the same conversation.
  const [agentOpen, setAgentOpen] = useState(true);
  const [agentLoading, setAgentLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I read Google Trends so you don't have to. Search a keyword above \u2014 or tap a suggestion and I'll run one for you.",
    },
  ]);

  // Load recent searches for the chips \u2014 but keep the guided start visible
  // until the user picks something.
  useEffect(() => {
    fetchRecentSearches()
      .then((rows) => setRecent(rows))
      .catch(() => {
        /* table may not exist yet \u2014 ignore on first run */
      });
  }, []);

  function postBrief(keyword: string, result: TrendsData) {
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: `Here's my read on \u201c${keyword}\u201d. ${localBrief(result)}`,
      },
    ]);
    setUnread((u) => (agentOpen ? 0 : u + 1));
  }

  async function handleSearch(keyword: string) {
    setLoading(true);
    setPendingKeyword(keyword);
    setError(null);
    try {
      const result = await fetchTrends(keyword);
      setData(result);
      setRecent((r) => [
        { id: keyword, keyword, created_at: "", data: result },
        ...r.filter((x) => x.keyword !== keyword),
      ]);
      postBrief(keyword, result);
    } catch (e: any) {
      setError(e.message || "Failed to fetch trends.");
    } finally {
      setLoading(false);
    }
  }

  function loadRow(row: TrendSearchRow) {
    setData(row.data);
    setRecent((r) => [row, ...r.filter((x) => x.keyword !== row.keyword)]);
    postBrief(row.keyword, row.data);
  }

  // Send a question to the real agent endpoint.
  async function ask(text: string) {
    if (agentLoading) return;
    setAgentOpen(true);
    setUnread(0);
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setAgentLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, trends: data }),
      });
      const json = await res.json();
      setMessages([
        ...next,
        {
          role: "assistant",
          content: json.reply || json.error || "Something went wrong.",
        },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Network error \u2014 please try again." },
      ]);
    } finally {
      setAgentLoading(false);
    }
  }

  // The assistant can run the first search itself.
  function agentSearch(keyword: string) {
    setMessages((m) => [
      ...m,
      { role: "user", content: `Search \u201c${keyword}\u201d for me` },
    ]);
    handleSearch(keyword);
  }

  const suggestions: Suggestion[] = data
    ? suggestedQuestions(data).map((q) => ({ label: q, run: () => ask(q) }))
    : [
        {
          label: "Search \u201ccold plunge tub\u201d for me",
          run: () => agentSearch("cold plunge tub"),
        },
        { label: "What can you do?", run: () => ask("What can you do?") },
      ];

  const verdict = data ? verdictOf(computeStats(data).momentum) : null;

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <nav className="flex flex-wrap items-center gap-2.5 border-b-2 border-divider px-6 py-3">
        <Link
          href="/"
          className="mr-auto text-lg font-extrabold text-ink no-underline"
        >
          Product Trends
        </Link>
        <button
          onClick={() => setComparing((c) => !c)}
          aria-pressed={comparing}
          className={`border px-4 py-2 text-sm font-extrabold transition ${
            comparing
              ? "border-brand bg-brand text-paper"
              : "border-divider text-ink hover:bg-ink/5"
          }`}
        >
          Compare
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className="border border-divider px-4 py-2 text-sm font-extrabold text-ink transition hover:bg-ink/5"
        >
          History
        </button>
        <button
          onClick={() => {
            setAgentOpen((o) => !o);
            setUnread(0);
          }}
          className="flex items-center gap-2 border border-divider px-4 py-2 text-sm font-extrabold text-ink transition hover:bg-ink/5"
        >
          <span className="inline-block h-2.5 w-2.5 bg-brand" />
          Assistant
        </button>
      </nav>

      <div
        className="grid flex-1 items-stretch"
        style={{
          gridTemplateColumns: agentOpen
            ? "minmax(0,1fr) min(400px,36vw)"
            : "minmax(0,1fr) 48px",
        }}
      >
        <main className="min-w-0 px-6 pb-20 pt-9 md:px-12">
          <span className="block text-[13px] uppercase tracking-wider text-brand-deep">
            E-commerce research
          </span>
          <h1 className="mb-1.5 mt-3 text-[32px] font-extrabold leading-tight tracking-[-0.015em]">
            Keyword research
          </h1>
          <p className="mb-6 mt-0 text-[15px] text-ink/70">
            Live Google Trends for any product keyword \u2014 explained in plain
            English.
          </p>

          <SearchBar onSearch={handleSearch} loading={loading} />

          {recent.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs uppercase tracking-wider text-ink/55">
                Recent
              </span>
              {recent.slice(0, 8).map((r) => (
                <button
                  key={r.id}
                  onClick={() => loadRow(r)}
                  className="border border-divider px-3 py-1.5 text-[13px] text-ink transition hover:border-brand hover:bg-brand-tint"
                >
                  {r.keyword}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-6 border-2 border-brand bg-brand-tint p-4 text-sm text-brand-deep">
              {error}
            </p>
          )}

          {comparing && <ComparisonPanel searches={recent} />}

          {!data && !loading && !error && (
            <section className="mt-10 border-t-2 border-divider pt-7">
              <span className="block text-[13px] uppercase tracking-wider text-brand-deep">
                Start here
              </span>
              {[
                "Search any product keyword above \u2014 or tap a recent search.",
                "You'll get four numbers and three charts, each explained in plain English.",
                "Ask the assistant what it means for your store \u2014 it reads the data for you.",
              ].map((step, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[56px_minmax(0,620px)] items-baseline gap-x-6 py-4 ${
                    i > 0 ? "border-t-2 border-divider" : ""
                  }`}
                >
                  <p className="m-0 text-[15px] font-extrabold">0{i + 1}</p>
                  <p className="m-0 text-[15.5px] leading-[26px]">{step}</p>
                </div>
              ))}
              <p className="mb-0 mt-4 text-sm text-ink/70">
                <span className="mr-2.5 inline-block h-2.5 w-2.5 bg-brand" />
                Tip: the assistant on the right can run the first search for
                you.
              </p>
            </section>
          )}

          {loading && (
            <p className="mt-10 text-[15px] text-ink/60">
              Pulling live Google Trends for \u201c{pendingKeyword}\u201d\u2026
            </p>
          )}

          {data && !loading && (
            <section className="mt-9 border-t-2 border-divider pt-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="m-0 text-[25px] font-extrabold tracking-[-0.015em]">
                  Results for \u201c{data.keyword}\u201d
                </h2>
                {verdict && (
                  <span
                    className={`px-2.5 py-0.5 text-[11px] ${VERDICT_TAG[verdict]}`}
                  >
                    {verdictLabel(verdict)}
                  </span>
                )}
                <span className="text-xs text-ink/55">
                  Live Google Trends \u00b7 last 6 months
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3.5">
                <span className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 bg-brand" />
                <div className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-widest text-brand-deep">
                    Assistant brief
                  </span>
                  <p className="mb-0 mt-1.5 max-w-[72ch] text-[15.5px] leading-[26px]">
                    {localBrief(data)}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s.label}
                        onClick={s.run}
                        className="border border-divider px-3 py-1.5 text-[13px] text-ink transition hover:border-brand hover:bg-brand-tint"
                      >
                        {s.label}
                      </button>
                    ))}
                    {!agentOpen && (
                      <button
                        onClick={() => {
                          setAgentOpen(true);
                          setUnread(0);
                        }}
                        className="px-1 py-1.5 text-[13px] font-extrabold text-brand hover:bg-brand/10"
                      >
                        Open the assistant \u2192
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <StatCards data={data} />
              </div>

              <div className="mt-9">
                <InterestOverTimeChart
                  data={data.interest_over_time}
                  onAsk={() =>
                    ask(
                      "Explain the interest-over-time chart for this keyword \u2014 what's the story?"
                    )
                  }
                />
              </div>

              <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-11 gap-y-7">
                <RegionChart
                  data={data.interest_by_region}
                  onAsk={() =>
                    ask("Where should I focus regionally, based on this data?")
                  }
                />
                <RelatedQueries
                  top={data.top_queries}
                  rising={data.rising_queries}
                  onSearch={handleSearch}
                  onAsk={() =>
                    ask("What do the related and rising queries tell me?")
                  }
                />
              </div>
            </section>
          )}
        </main>

        <AgentPanel
          data={data}
          open={agentOpen}
          unread={unread}
          onToggle={() => {
            setAgentOpen((o) => !o);
            setUnread(0);
          }}
          messages={messages}
          loading={agentLoading}
          suggestions={suggestions}
          onAsk={ask}
        />
      </div>

      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onSelect={loadRow}
        />
      )}
    </div>
  );
}
