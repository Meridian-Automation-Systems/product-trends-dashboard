import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { TrendsData } from "@/lib/types";

const SERPAPI = "https://serpapi.com/search.json";

// Fetch one SerpAPI Google Trends "data_type" for the keyword.
async function serpapi(keyword: string, dataType: string) {
  const url = new URL(SERPAPI);
  url.searchParams.set("engine", "google_trends");
  url.searchParams.set("q", keyword);
  url.searchParams.set("data_type", dataType);
  url.searchParams.set("api_key", process.env.SERPAPI_KEY ?? "");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`SerpAPI ${dataType} failed: ${res.status}`);
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SERPAPI_KEY) {
      return NextResponse.json(
        { error: "SERPAPI_KEY is not set in .env.local." },
        { status: 500 }
      );
    }

    const { keyword } = await req.json();
    if (!keyword || typeof keyword !== "string") {
      return NextResponse.json({ error: "Missing 'keyword'." }, { status: 400 });
    }

    // Pull the three useful data types in parallel.
    const [timeseries, geo, related] = await Promise.all([
      serpapi(keyword, "TIMESERIES"),
      serpapi(keyword, "GEO_MAP_0"),
      serpapi(keyword, "RELATED_QUERIES"),
    ]);

    const data: TrendsData = {
      keyword,
      interest_over_time: (timeseries.interest_over_time?.timeline_data ?? []).map(
        (t: any) => ({
          date: t.date,
          value: t.values?.[0]?.extracted_value ?? 0,
        })
      ),
      interest_by_region: (geo.interest_by_region ?? []).map((r: any) => ({
        location: r.location,
        value: r.extracted_value ?? r.value ?? 0,
      })),
      top_queries: (related.related_queries?.top ?? []).map((q: any) => ({
        query: q.query,
        value: q.extracted_value ?? q.value ?? 0,
      })),
      rising_queries: (related.related_queries?.rising ?? []).map((q: any) => ({
        query: q.query,
        value: q.extracted_value ?? q.value ?? 0,
      })),
    };

    // Optional: save the search to Supabase if a service-role key is present.
    // Without it we still return data — the dashboard just won't persist history.
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (serviceKey && supabaseUrl) {
      try {
        const supabase = createClient(supabaseUrl, serviceKey);
        await supabase.from("trend_searches").insert({ keyword, data });
      } catch {
        /* persistence is best-effort — never fail the request over it */
      }
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to fetch trends." },
      { status: 500 }
    );
  }
}
