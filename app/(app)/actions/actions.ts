"use server";
import { fetchSubscriptionStatus } from "./subs";
import { buildAssistant } from "@/lib/buildAssistant";
import { createSupabaseClient } from "@/lib/supabase";
import { AvatarProps, CreateCompanionProps } from "@/types/types";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getUser(id?: string) {
  if (!id) return null;

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", id)
    .maybeSingle();

  if (error) {
    console.error("getUser error:", error.message);
    throw error;
  }

  return data;
}

export async function getAvatars(): Promise<AvatarProps[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("avatars").select("*");
  if (!data || error) if (error) throw new Error("Error fetching avatars");
  return (data ?? []) as AvatarProps[];
}

export async function getSingleAvatar(
  id?: string,
): Promise<AvatarProps | null> {
  const supabase = createSupabaseClient();

  if (id) {
    const { data, error } = await supabase
      .from("avatars")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) return data as AvatarProps;
  }

  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as AvatarProps | null) ?? null;
}

export async function getSingleCompanion(id: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select("*, avatars:avatar_id (image_url)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCompanions(id: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select("*, avatars:avatar_id (image_url)")
    .eq("owner_id", id);

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function createCompanion(formData: CreateCompanionProps) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await currentUser();
  const supabase = createSupabaseClient();

  const sub = await fetchSubscriptionStatus(userId);
  const userPlan = sub?.plan || "free";

  const limits: Record<string, number> = {
    free: 2,
    pro: 15,
    king: 60,
  };

  const maxAllowed = limits[userPlan] || 2;

  const requestedDuration = Number(formData.duration);

  const validatedDuration =
    requestedDuration > maxAllowed ? maxAllowed : requestedDuration;

  formData.duration = String(validatedDuration);

  if (!formData.avatar_id) {
    const { data: avatars, error: avatarsError } = await supabase
      .from("avatars")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1);

    if (avatarsError) {
      throw new Error("Failed to resolve default avatar");
    }

    const defaultAvatarId = avatars?.[0]?.id;
    if (!defaultAvatarId) {
      throw new Error("No avatars available for companion creation");
    }

    formData.avatar_id = defaultAvatarId;
  }

  const { data, error } = await supabase
    .from("companions")
    .insert({
      ...formData,
      owner_id: userId,
      username: user?.firstName,
    })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create a companion");

  const companion = data[0];

  const assistantConfig = buildAssistant(companion);

  const vapiRes = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assistantConfig),
  });

  const vapiData = await vapiRes.json();

  await supabase
    .from("companions")
    .update({ assistant_id: vapiData.id })
    .eq("id", companion.id);

  return {
    success: true,
    message: "Companion created successfully 🎉",
    data: companion,
    vapi: vapiData,
  };
}

export async function deleteCompanion(id: string) {
  const supbase = createSupabaseClient();
  const { error } = await supbase.from("companions").delete().eq("id", id);
  if (error) throw new Error("Failed to delete companion");
  return {
    success: true,
    message: "Companion deleted successfully🎉",
  };
}

export async function updateUserSeconds(secondsUsed: number) {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  if (!userId) return { error: "No user found" };

  const { data, error } = await supabase.rpc("increment_user_stats", {
    user_id: userId,
    seconds_to_add: secondsUsed,
  });

  if (error) {
    console.error("Supabase RPC Error:", error);
    return { error: error.message };
  }

  if (data?.success === false) {
    return { error: data.error };
  }

  return { success: true };
}

export async function fetchUserNecessities(userId: string) {
  const supabase = createSupabaseClient();
  const { data: userNeccesities, error } = await supabase
    .from("users")
    .select("plan, created_at, daily_seconds_used")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return userNeccesities;
}
