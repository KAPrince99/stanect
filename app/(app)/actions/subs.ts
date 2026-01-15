"use server";
import { createSupabaseClient } from "@/lib/supabase";

export async function fetchSubscriptionStatus(clerk_user_id: string) {
  // 1. Validate variables before calling the client
  if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    console.error(
      "DEV ERROR: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is undefined in .env.local"
    );
    return null;
  }

  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from("users")
      .select("plan, status")
      .eq("clerk_user_id", clerk_user_id)
      .maybeSingle();

    if (error) {
      console.error("Supabase API Error:", error.message);
      return null;
    }

    return data || null;
  } catch (err: any) {
    // This catches the "No suitable key" crash specifically
    console.error("Client Initialization Failed:", err.message);
    return null;
  }
}
