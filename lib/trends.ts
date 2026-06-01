import { supabase } from "./supabaseClient";
import type { TrendsData, TrendSearchRow } from "./types";

// Calls the Next.js API route `/api/trends`, which scrapes Google Trends
// via SerpAPI (server-side) and returns the normalized data.
export async function fetchTrends(keyword: string): Promise<TrendsData> {
  const res = await fetch("/api/trends", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword }),
  });

  const data = await res.json();
  if (!res.ok || data?.error) {
    throw new Error(data?.error || "Failed to fetch trends.");
  }
  return data as TrendsData;
}

// Loads the most recent saved searches to show as quick links / history.
export async function fetchRecentSearches(
  limit = 8
): Promise<TrendSearchRow[]> {
  const { data, error } = await supabase
    .from("trend_searches")
    .select("id, keyword, created_at, data")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as TrendSearchRow[]) || [];
}

// Loads the full saved-search history (used by the History panel).
export async function fetchSearchHistory(
  limit = 200
): Promise<TrendSearchRow[]> {
  return fetchRecentSearches(limit);
}
