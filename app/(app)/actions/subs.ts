"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

export async function fetchSubscriptionStatus(_clerk_user_id?: string) {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("plan, status, metadata, updated_at")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error || !data) return { plan: "free", status: "active", metadata: {} };

    if (data.status === "pending") {
      const lastUpdate = new Date(data.updated_at || new Date()).getTime();
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (now - lastUpdate > fiveMinutes) {
        await supabase
          .from("users")
          .update({ status: "active" })
          .eq("clerk_user_id", userId);
        return { ...data, status: "active" };
      }
    }

    return data;
  } catch {
    return { plan: "free", status: "active", metadata: {} };
  }
}

export async function clearPendingPaymentStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("users")
    .update({ status: "active" })
    .eq("clerk_user_id", userId)
    .eq("status", "pending");

  if (error) throw new Error(error.message);
  return { success: true };
}
