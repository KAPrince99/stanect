import { createClient } from "@supabase/supabase-js";

export const getSupabaseService = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SECRET_KEY!;

  if (!url || !key) {
    throw new Error(
      "Supabase Service Key is missing from Environment Variables",
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export const supabase = getSupabaseService();
