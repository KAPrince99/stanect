import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (process.env.NODE_ENV === "production") {
    console.log("--- Supabase Env Check ---");
    console.log("URL exists:", !!url);
    console.log("Key Prefix:", key ? key.slice(0, 14) : "UNDEFINED");
    console.log("--------------------------");
  }

  if (!url || !key) {
    throw new Error("Supabase Key or URL is missing in production.");
  }

  return createClient(url, key, {
    global: {
      // For the 2026 Asymmetric keys, injecting the token via the fetch header
      // is the most stable way to ensure Clerk & Supabase handshake correctly.
      fetch: async (url, options = {}) => {
        const { getToken } = await auth();
        // NOTE: Ensure you have a JWT Template named 'supabase' in Clerk Dashboard
        const clerkToken = await getToken({ template: "supabase" });

        const headers = new Headers(options.headers);
        if (clerkToken) {
          headers.set("Authorization", `Bearer ${clerkToken}`);
        }
        headers.set("apikey", key);

        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });
};
