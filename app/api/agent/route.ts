import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { TrendsData } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Build a compact, token-friendly summary of the dashboard so the model has
// real context without us dumping the entire raw dataset.
function buildContext(trends: TrendsData | null): string {
  if (!trends) return "No keyword has been searched yet.";

  const series = trends.interest_over_time;
  const values = series.map((p) => p.value);
  const peak = values.length ? Math.max(...values) : 0;
  const avg = values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;
  const regions = trends.interest_by_region
    .slice(0, 5)
    .map((r) => `${r.location} (${r.value})`)
    .join(", ");
  const top = trends.top_queries.slice(0, 8).map((q) => q.query).join(", ");
  const rising = trends.rising_queries.slice(0, 8).map((q) => q.query).join(", ");

  return [
    `Keyword: "${trends.keyword}"`,
    `Search interest (0-100): peak ${peak}, average ${avg}, over ${series.length} data points.`,
    `Top regions: ${regions || "n/a"}.`,
    `Top related queries: ${top || "n/a"}.`,
    `Rising queries: ${rising || "n/a"}.`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server." },
        { status: 500 }
      );
    }

    const { messages, trends } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
      trends: TrendsData | null;
    };

    const systemPrompt = `You are an e-commerce product-research assistant embedded in a trends dashboard.
You help the user interpret Google Trends data for product keywords: seasonality, momentum,
geographic demand, and related/rising searches that hint at new product or marketing angles.
Be concise, practical, and specific. Base your analysis on the dashboard context below.

DASHBOARD CONTEXT
${buildContext(trends)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.4,
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Agent request failed." },
      { status: 500 }
    );
  }
}
