import { createClient } from "@supabase/supabase-js";

// Browser-side Supabase client. Uses the public anon key, which is safe
// to expose. Row Level Security on the database protects your data.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
