// Shared types for the trends dashboard.

// A single point on the "interest over time" line chart.
export interface TimelinePoint {
  date: string; // human-readable date label from Google Trends
  value: number; // search interest 0-100
}

// One region's interest for the "interest by region" chart.
export interface RegionPoint {
  location: string;
  value: number; // 0-100
}

// A related / rising query.
export interface RelatedQuery {
  query: string;
  value: number; // popularity (top) or % growth (rising)
}

// The normalized payload returned by the `trends` Edge Function and
// stored in Supabase. This is what the whole dashboard renders from.
export interface TrendsData {
  keyword: string;
  interest_over_time: TimelinePoint[];
  interest_by_region: RegionPoint[];
  top_queries: RelatedQuery[];
  rising_queries: RelatedQuery[];
}

// A saved search row from the `trend_searches` table.
export interface TrendSearchRow {
  id: string;
  keyword: string;
  created_at: string;
  data: TrendsData;
}

// One message in the assistant conversation.
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
