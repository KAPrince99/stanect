import { supabase as serviceSupabase } from "@/lib/supa-service";

const METERED_CALLS_KEY = "metered_call_ids";
const METERED_CALLS_MAX = 40;

function clampSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.min(Math.floor(seconds), 3600);
}

export function durationSecondsFromIso(
  startedAt?: string | null,
  endedAt?: string | null,
) {
  if (!startedAt || !endedAt) return 0;
  const start = Date.parse(startedAt);
  const end = Date.parse(endedAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return 0;
  }
  return clampSeconds((end - start) / 1000);
}

/**
 * Idempotent usage meter keyed by Vapi call id.
 * Uses users.metadata.metered_call_ids as a short ring buffer (no new table).
 */
export async function meterVerifiedCallUsage(input: {
  callId: string;
  clerkUserId: string;
  seconds: number;
  source: "vapi-api" | "vapi-webhook";
}) {
  const seconds = clampSeconds(input.seconds);
  if (!input.callId || !input.clerkUserId || seconds <= 0) {
    return { success: false as const, reason: "invalid_input" as const };
  }

  const { data: user, error: userError } = await serviceSupabase
    .from("users")
    .select("clerk_user_id, metadata")
    .eq("clerk_user_id", input.clerkUserId)
    .maybeSingle();

  if (userError || !user) {
    return { success: false as const, reason: "user_not_found" as const };
  }

  const metadata =
    user.metadata && typeof user.metadata === "object"
      ? (user.metadata as Record<string, unknown>)
      : {};
  const prior = Array.isArray(metadata[METERED_CALLS_KEY])
    ? (metadata[METERED_CALLS_KEY] as unknown[]).filter(
        (id): id is string => typeof id === "string",
      )
    : [];

  if (prior.includes(input.callId)) {
    return { success: true as const, deduped: true as const };
  }

  const nextIds = [...prior, input.callId].slice(-METERED_CALLS_MAX);

  const { error: metaError } = await serviceSupabase
    .from("users")
    .update({
      metadata: {
        ...metadata,
        [METERED_CALLS_KEY]: nextIds,
        last_metered_call_id: input.callId,
        last_metered_source: input.source,
        last_metered_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", input.clerkUserId);

  if (metaError) {
    console.error("Failed to record metered call id:", metaError);
    return { success: false as const, reason: "metadata_update_failed" as const };
  }

  const { data, error } = await serviceSupabase.rpc("increment_user_stats", {
    user_id: input.clerkUserId,
    seconds_to_add: seconds,
  });

  if (error) {
    console.error("increment_user_stats failed:", error);
    return { success: false as const, reason: "rpc_failed" as const };
  }

  if (data?.success === false) {
    return { success: false as const, reason: "rpc_rejected" as const };
  }

  return { success: true as const, deduped: false as const, seconds };
}

export async function resolveOwnerForAssistant(assistantId: string) {
  if (!assistantId) return null;

  const { data, error } = await serviceSupabase
    .from("companions")
    .select("owner_id")
    .eq("assistant_id", assistantId)
    .maybeSingle();

  if (error || !data?.owner_id) return null;
  return data.owner_id as string;
}

export async function fetchVapiCall(callId: string) {
  if (!process.env.VAPI_PRIVATE_KEY) {
    throw new Error("Vapi private key is not configured");
  }

  const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch Vapi call");
  }

  return (await response.json()) as {
    id?: string;
    assistantId?: string;
    startedAt?: string;
    endedAt?: string;
    metadata?: Record<string, unknown>;
  };
}
