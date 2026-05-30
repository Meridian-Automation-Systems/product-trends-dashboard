# Product Trends Dashboard

Search a product keyword → pull live **Google Trends** data via **SerpAPI** →
visualize it with charts → ask a built-in **AI assistant** what it means.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Recharts ·
Supabase (Postgres + Edge Functions) · OpenAI.

## How it works

```
Browser (Next.js)
  │  POST /api/trends  { keyword }
  ▼
Next.js API Route (/api/trends)  ──►  SerpAPI (Google Trends)
  │  optionally saves normalized data to `trend_searches` (if service role key is set)
  ▼
Postgres  ◄── browser reads recent searches (anon key, RLS read-only)

Sliding AI panel ──► /api/agent (Next.js) ──► OpenAI   (key stays server-side)
```

The **SerpAPI key** and **OpenAI key** never touch the browser — they stay
on the Next.js server.

> **Alternative deployment:** A Supabase Edge Function
> (`supabase/functions/trends/`) is also included. You can deploy it and call
> it via `supabase.functions.invoke("trends", ...)` instead of the Next.js
> API route if you prefer a serverless approach.

## Project structure

```
app/
  globals.css
  layout.tsx
  page.tsx                 Home / landing
  dashboard/page.tsx       The dashboard
  api/agent/route.ts       OpenAI assistant endpoint (server-side)
components/                SearchBar, charts, StatCards, AgentPanel, DashboardClient
lib/                       supabase client, types, trends helpers
supabase/
  functions/trends/        Edge Function (SerpAPI scraper)
  migrations/              Database schema
```

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SERPAPI_KEY=your-serpapi-key
OPENAI_API_KEY=sk-...
```

Optionally, to enable search history persistence from the Next.js API route:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find the Supabase values in your project dashboard under
**Project Settings → API**.

### 3. Database

Apply the migration in `supabase/migrations/0001_create_trend_searches.sql`.
Either paste it into the **SQL Editor** in your Supabase dashboard, or with the
CLI:

```bash
supabase link --project-ref YOUR-PROJECT-REF
supabase db push
```

### 4. Edge Function

Set the SerpAPI secret and deploy the function:

```bash
supabase secrets set SERPAPI_KEY=your-serpapi-key
supabase functions deploy trends
```

(`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.)

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000 and click into the dashboard.

## Notes

- Each keyword search makes **3 SerpAPI calls** (timeseries, region, related
  queries), so watch your SerpAPI quota.
- The AI assistant uses `gpt-4o-mini` by default — change the model in
  `app/api/agent/route.ts`.
