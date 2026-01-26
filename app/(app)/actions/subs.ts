"use server";
import { createSupabaseClient } from "@/lib/supabase";

export async function fetchSubscriptionStatus(clerk_user_id: string) {
  if (!clerk_user_id) return null;

  try {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("plan, status, metadata, updated_at")
      .eq("clerk_user_id", clerk_user_id)
      .maybeSingle();

    if (error || !data) return { plan: "free", status: "active", metadata: {} };

    if (data.status === "pending") {
      const lastUpdate = new Date(data.updated_at || new Date()).getTime();
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (now - lastUpdate > fiveMinutes) {
        supabase
          .from("users")
          .update({ status: "active" })
          .eq("clerk_user_id", clerk_user_id)
          .then(() => console.log("Database synced: Pending -> Active"));
      }

      return { ...data, status: "active" };
    }

    return data;
  } catch (err) {
    return { plan: "free", status: "active", metadata: {} };
  }
}
