"use server";
import { fetchSubscriptionStatus } from "./subs";
import { buildAssistant } from "@/lib/buildAssistant";
import type { PlanType } from "@/lib/plan-limits";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { hasReachedCompanionLimit } from "@/lib/plan-utils";
import { createSupabaseClient } from "@/lib/supabase";
import {
  AssistantCompanionContext,
  AvatarProps,
  CreateCompanionProps,
} from "@/types/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

const createCompanionInputSchema = z.object({
  companion_name: z.string().trim().min(2).max(40),
  scene: z.string().trim().min(2).max(120),
  voice: z.enum(["male", "female"]),
  duration: z.coerce.number().int().min(1).max(120),
  avatar_id: z.string().optional(),
  country: z.string().optional(),
});

function getMaxSessionMinutes(plan: string) {
  const key = (plan === "pro" || plan === "king" ? plan : "free") as PlanType;
  return Math.floor(PLAN_LIMITS[key].sessionLimit / 60);
}

const USER_PROFILE_SELECT =
  "id, clerk_user_id, name, email, status, profile_picture, country, plan, total_lifetime_seconds, daily_seconds_used, created_at";

const AVATAR_SELECT = "id, name, image_url";

export async function getUser(_id?: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select(USER_PROFILE_SELECT)
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getUser error:", error.message);
    throw error;
  }

  return data;
}

export async function getAvatars(): Promise<AvatarProps[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("avatars").select(AVATAR_SELECT);
  if (!data || error) if (error) throw new Error("Error fetching avatars");
  return (data ?? []) as AvatarProps[];
}

export async function getCreateCompanionGate(_userId?: string) {
  const { userId } = await auth();
  if (!userId) {
    return { plan: "free" as PlanType, count: 0 };
  }

  const supabase = createSupabaseClient();

  const [{ data: userData }, { count, error: countError }] = await Promise.all([
    supabase
      .from("users")
      .select("plan")
      .eq("clerk_user_id", userId)
      .maybeSingle(),
    supabase
      .from("companions")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", userId),
  ]);

  if (countError) {
    throw new Error(countError.message);
  }

  return {
    plan: (userData?.plan || "free") as PlanType,
    count: count ?? 0,
  };
}

export async function getSingleAvatar(
  id?: string,
): Promise<AvatarProps | null> {
  const supabase = createSupabaseClient();

  if (id) {
    const { data, error } = await supabase
      .from("avatars")
      .select(AVATAR_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) return data as AvatarProps;
  }

  const { data, error } = await supabase
    .from("avatars")
    .select(AVATAR_SELECT)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as AvatarProps | null) ?? null;
}

export async function getSingleCompanion(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select("*, avatars:avatar_id (image_url)")
    .eq("id", id)
    .eq("owner_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCompanions(_id?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select("*, avatars:avatar_id (image_url)")
    .eq("owner_id", userId);

  if (error) throw new Error(error.message);

  return data ?? [];
}

async function resolveAvatarId(
  supabase: ReturnType<typeof createSupabaseClient>,
  avatarId?: string,
) {
  if (avatarId) return avatarId;

  const { data: avatar, error } = await supabase
    .from("avatars")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to resolve default avatar");
  }

  if (!avatar?.id) {
    throw new Error("No avatars available for companion creation");
  }

  return avatar.id;
}

async function createCompanionRecord(
  supabase: ReturnType<typeof createSupabaseClient>,
  payload: CreateCompanionProps & { country?: string },
  userId: string,
  username?: string | null,
) {
  const { data, error } = await supabase
    .from("companions")
    .insert({
      ...payload,
      owner_id: userId,
      username,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create a companion");
  }

  return data as AssistantCompanionContext & { id: string };
}

async function createAssistant(companion: AssistantCompanionContext) {
  if (!process.env.VAPI_PRIVATE_KEY) {
    throw new Error("Vapi private key is not configured");
  }

  const assistantConfig = buildAssistant(companion);

  const vapiRes = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assistantConfig),
  });

  if (!vapiRes.ok) {
    const errorText = await vapiRes.text();
    throw new Error(errorText || "Failed to create AI assistant");
  }

  const rawVapiData = (await vapiRes.json()) as Record<string, unknown>;
  const assistantId =
    typeof rawVapiData.id === "string" && rawVapiData.id.length > 0
      ? rawVapiData.id
      : null;

  if (!assistantId) {
    throw new Error("Assistant created without a valid id");
  }

  return {
    ...rawVapiData,
    id: assistantId,
  };
}

async function attachAssistant(
  supabase: ReturnType<typeof createSupabaseClient>,
  companionId: string,
  assistantId: string,
) {
  const { error } = await supabase
    .from("companions")
    .update({ assistant_id: assistantId })
    .eq("id", companionId);

  if (error) {
    throw new Error("Failed to attach assistant to companion");
  }
}

export async function createCompanion(formData: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await currentUser();
  const supabase = createSupabaseClient();

  const parsed = createCompanionInputSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message || "Invalid companion data",
    );
  }

  const normalizedInput = parsed.data;

  const sub = await fetchSubscriptionStatus(userId);
  const userPlan = (sub?.plan || "free") as PlanType;

  const { count } = await supabase
    .from("companions")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  if (hasReachedCompanionLimit(count ?? 0, userPlan)) {
    throw new Error("Companion limit reached for your plan");
  }

  const maxAllowed = getMaxSessionMinutes(userPlan);
  const safeDuration = Math.min(normalizedInput.duration, maxAllowed);
  const avatarId = await resolveAvatarId(supabase, normalizedInput.avatar_id);
  const country = normalizedInput.country?.trim() || "United States";

  const payload: CreateCompanionProps & { country?: string } = {
    avatar_id: avatarId,
    companion_name: normalizedInput.companion_name,
    scene: normalizedInput.scene,
    voice: normalizedInput.voice,
    duration: String(safeDuration),
    country,
  };

  const companion = await createCompanionRecord(
    supabase,
    payload,
    userId,
    user?.firstName,
  );

  try {
    const vapiData = await createAssistant(companion);
    await attachAssistant(supabase, companion.id, vapiData.id);

    return {
      success: true,
      message: "Companion created successfully 🎉",
      data: companion,
      vapi: vapiData,
    };
  } catch (error) {
    await supabase.from("companions").delete().eq("id", companion.id);
    throw error instanceof Error
      ? error
      : new Error("Failed to complete companion setup");
  }
}

export async function deleteCompanion(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (!id) throw new Error("Companion id is required");

  // Service client bypasses RLS after we verify ownership with Clerk.
  // Publishable-key deletes fail when there is no DELETE policy on companions.
  const { supabase } = await import("@/lib/supa-service");

  const { data: companion, error: fetchError } = await supabase
    .from("companions")
    .select("id, owner_id, assistant_id")
    .eq("id", id)
    .eq("owner_id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("deleteCompanion fetch error:", fetchError);
    throw new Error(fetchError.message || "Failed to find companion");
  }

  if (!companion) {
    throw new Error("Companion not found or you do not have permission");
  }

  const { data: deleted, error: deleteError } = await supabase
    .from("companions")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    console.error("deleteCompanion delete error:", deleteError);
    throw new Error(deleteError.message || "Failed to delete companion");
  }

  if (!deleted) {
    throw new Error("Companion could not be deleted");
  }

  // Best-effort cleanup of the Vapi assistant; DB row is already gone.
  if (companion.assistant_id && process.env.VAPI_PRIVATE_KEY) {
    try {
      await fetch(
        `https://api.vapi.ai/assistant/${companion.assistant_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
          },
        },
      );
    } catch (error) {
      console.error("Failed to delete Vapi assistant:", error);
    }
  }

  return {
    success: true,
    message: "Companion deleted successfully",
  };
}

const updateUserSecondsSchema = z.number().finite().min(0).max(3600);

export async function updateUserSeconds(secondsUsed: number) {
  const { userId } = await auth();
  if (!userId) return { error: "No user found" };

  const parsed = updateUserSecondsSchema.safeParse(secondsUsed);
  if (!parsed.success) {
    return { error: "Invalid usage duration" };
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.rpc("increment_user_stats", {
    user_id: userId,
    seconds_to_add: Math.floor(parsed.data),
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

export async function fetchUserNecessities(_userId?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();
  const { data: userNeccesities, error } = await supabase
    .from("users")
    .select("plan, created_at, daily_seconds_used")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return userNeccesities;
}
