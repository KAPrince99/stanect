"use server";

import { createSupabaseClient } from "@/lib/supabase";

export async function getSubscriptionStatus(clerk_user_id: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("plan, status")
    .eq("clerk_user_id", clerk_user_id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}
