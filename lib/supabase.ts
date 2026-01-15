import { auth } from "@clerk/nextjs/server";

import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  // if (process.env.NODE_ENV === "production") {
  //   console.log("--- Supabase Env Check ---");
  //   console.log("URL exists:", !!url);
  //   console.log("Key Name Used: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  //   console.log("Key Prefix:", key ? key.slice(0, 14) : "UNDEFINED");
  //   console.log("Key Length:", key ? key.length : 0);
  //   console.log("--------------------------");
  // }

  if (!url || !key) {
    throw new Error(
      `Supabase Key or URL is missing. Check if NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is set in production.`
    );
  }
  return createClient(
    url,
    key,

    {
      async accessToken() {
        return (await auth()).getToken();
      },
    }
  );
};
