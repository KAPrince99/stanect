"use server";
import { createSupabaseClient } from "@/lib/supabase"; // this should use the anon key + auth token
export async function fetchSubscriptionStatus(clerk_user_id: string) {
  const supabase = await createSupabaseClient(); // this will attach user's token from Clerk
  const { data, error } = await supabase
    .from("users")
    .select("plan, status")
    .eq("clerk_user_id", clerk_user_id)
    .maybeSingle();

  if (error) {
    console.error(
      "Supabase error fetching subscription status:",
      error.message
    );
    throw new Error(error.message);
  }
  return data || null;
}
