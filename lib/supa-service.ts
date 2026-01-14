import { createClient } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  throw new Error("supabaseAdmin should only be used on the server!");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
