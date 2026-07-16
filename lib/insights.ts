import type { TrendsData } from "./types";

// Shared, deterministic reading of a trends payload. Used by the stat band,
// the verdict tag, and the assistant's instant local brief (no API cost).

export interface TrendStats {
  peak: number;
  avg: number;
  momentum: number;
  early: number;
  recent: number;
  peakIndex: number;
  first: number;
  last: number;
  topRegion: string;
}

export type Verdict = "up" | "down" | "steady";

function avgOf(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function computeStats(data: TrendsData): TrendStats {
  const values = data.interest_over_time.map((p) => p.value);
  const peak = values.length ? Math.max(...values) : 0;
  const avg = values.length ? Math.round(avgOf(values)) : 0;
  const early = Math.round(avgOf(values.slice(0, 3)));
  const recent = Math.round(avgOf(values.slice(-3)));
  const momentum = early ? Math.round(((recent - early) / early) * 100) : 0;
  return {
    peak,
    avg,
    momentum,
    early,
    recent,
    peakIndex: values.indexOf(peak),
    first: values[0] ?? 0,
    last: values[values.length - 1] ?? 0,
    topRegion: data.interest_by_region[0]?.location ?? "\u2014",
  };
}

export function verdictOf(momentum: number): Verdict {
  return momentum >= 15 ? "up" : momentum <= -15 ? "down" : "steady";
}

export function verdictLabel(v: Verdict): string {
  return v === "up" ? "Trending up" : v === "down" ? "Cooling off" : "Steady";
}

// A 2\u20133 sentence plain-English brief, posted by the assistant right after a
// search completes. Deterministic and instant \u2014 follow-up questions go to the
// real /api/agent.
export function localBrief(data: TrendsData): string {
  const s = computeStats(data);
  const v = verdictOf(s.momentum);
  const rq = data.rising_queries[0];
  const head =
    v === "up"
      ? "It's trending up"
      : v === "down"
        ? "It's cooling off"
        : "It's holding steady";
  const move =
    s.momentum >= 0 ? `grew ${s.momentum}%` : `fell ${Math.abs(s.momentum)}%`;
  const rising = rq
    ? ` The fastest-rising related search is \u201c${rq.query}\u201d (+${rq.value}%) \u2014 a hint at where buyers are heading.`
    : "";
  return `${head}: interest in \u201c${data.keyword}\u201d ${move} over the period, and demand is strongest in ${s.topRegion}.${rising}`;
}

export function suggestedQuestions(data: TrendsData): string[] {
  const v = verdictOf(computeStats(data).momentum);
  return [
    v === "down" ? "Why is it slowing?" : "Why is it climbing?",
    "Is it seasonal?",
    "Should I stock it?",
  ];
}
