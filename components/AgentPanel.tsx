"use client";

import { useState } from "react";
import type { TrendsData } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// A slide-in/out assistant. It receives the currently loaded trends data and
// answers questions about it via the /api/agent route (OpenAI server-side).
export default function AgentPanel({ data }: { data: TrendsData | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your research assistant. Search a keyword, then ask me what the trends mean for your store.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

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
        { role: "assistant", content: "Network error — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Toggle handle — pulls the panel in/out */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-lg bg-brand px-3 py-4 font-medium text-white shadow-lg transition hover:bg-brand-dark"
        aria-label="Toggle AI assistant"
      >
        {open ? "→" : "AI"}
      </button>

      {/* Sliding panel */}
      <aside
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 p-4">
          <h2 className="font-semibold">AI Research Assistant</h2>
          <p className="text-xs text-slate-500">
            {data
              ? `Context: "${data.keyword}"`
              : "Search a keyword to give me context"}
          </p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-brand text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-400">
              Thinking…
            </div>
          )}
        </div>

        <form onSubmit={send} className="border-t border-slate-800 p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this keyword…"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
