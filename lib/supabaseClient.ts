import { createClient } from "@supabase/supabase-js";

// Browser-side Supabase client. Uses the public anon key, which is safe
// to expose. Row Level Security on the database protects your data.
// Fall back to harmless placeholders so `next build` never crashes when the
// env vars aren't present at build time. At runtime the real values (set in
// .env.local locally, or in the Vercel dashboard) are used; if they're absent,
// data fetches simply fail gracefully instead of breaking the whole app.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
