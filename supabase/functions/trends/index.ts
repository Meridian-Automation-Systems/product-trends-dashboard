// Supabase Edge Function: `trends`
// Scrapes Google Trends via SerpAPI for a keyword, normalizes the data,
// saves it to the `trend_searches` table, and returns it to the client.
//
// Secrets required (set with `supabase secrets set ...`):
//   SERPAPI_KEY                – your SerpAPI key
// Injected automatically by Supabase:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SERPAPI = "https://serpapi.com/search.json";

// Fetch one SerpAPI Google Trends "data_type" for the keyword.
async function serpapi(keyword: string, dataType: string) {
  const url = new URL(SERPAPI);
  url.searchParams.set("engine", "google_trends");
  url.searchParams.set("q", keyword);
  url.searchParams.set("data_type", dataType);
  url.searchParams.set("api_key", Deno.env.get("SERPAPI_KEY") ?? "");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`SerpAPI ${dataType} failed: ${res.status}`);
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { keyword } = await req.json();
    if (!keyword || typeof keyword !== "string") {
      return json({ error: "Missing 'keyword'." }, 400);
    }

    // Pull the three useful data types in parallel.
    const [timeseries, geo, related] = await Promise.all([
      serpapi(keyword, "TIMESERIES"),
      serpapi(keyword, "GEO_MAP_0"),
      serpapi(keyword, "RELATED_QUERIES"),
    ]);

    const data = {
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

    // Save the search using the service role (bypasses RLS for inserts).
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    await supabase.from("trend_searches").insert({ keyword, data });

    return json(data, 200);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
