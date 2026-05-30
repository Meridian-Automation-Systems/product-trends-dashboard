-- Stores each Google Trends search and its normalized data payload.
create table if not exists public.trend_searches (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Fast "most recent searches" lookups.
create index if not exists trend_searches_created_at_idx
  on public.trend_searches (created_at desc);

-- Row Level Security: let the browser (anon key) read the history,
-- while inserts happen only from the Edge Function (service role,
-- which bypasses RLS). This keeps writes server-side.
alter table public.trend_searches enable row level security;

drop policy if exists "Public read access" on public.trend_searches;
create policy "Public read access"
  on public.trend_searches
  for select
  using (true);
