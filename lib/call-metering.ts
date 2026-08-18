import { supabase as serviceSupabase } from "@/lib/supa-service";

const METERED_CALLS_KEY = "metered_call_ids";
const LAST_USAGE_DATE_KEY = "last_usage_date";
const METERED_CALLS_MAX = 40;

export type VapiCallRecord = {
  id?: string;
  assistantId?: string;
  status?: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
};

function clampSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.min(Math.floor(seconds), 3600);
}

function utcDateKey(iso?: string | null) {
  const date = iso ? new Date(iso) : new Date();
  if (!Number.isFinite(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
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

export function durationSecondsFromVapiPayload(payload: unknown) {
  const root = asRecord(payload) ?? {};
  const call = asRecord(root.call) ?? root;

  const fromIso = durationSecondsFromIso(
    readString(root.startedAt) ?? readString(call.startedAt),
    readString(root.endedAt) ?? readString(call.endedAt),
  );
  if (fromIso > 0) return fromIso;

  const durationSeconds =
    readNumber(root.durationSeconds) ?? readNumber(call.durationSeconds);
  if (durationSeconds && durationSeconds > 0) {
    return clampSeconds(durationSeconds);
  }

  const durationMs = readNumber(root.durationMs) ?? readNumber(call.durationMs);
  if (durationMs && durationMs > 0) {
    return clampSeconds(durationMs / 1000);
  }

  return 0;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Idempotent usage meter keyed by Vapi call id.
 * Writes daily_seconds_used in the same update as the dedupe marker so a
 * failed RPC cannot lock the call as "already metered" at 0 seconds.
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
    .select(
      "clerk_user_id, metadata, daily_seconds_used, total_lifetime_seconds",
    )
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

  const currentDaily = Math.max(0, Number(user.daily_seconds_used ?? 0));
  const currentLifetime = Math.max(0, Number(user.total_lifetime_seconds ?? 0));

  if (prior.includes(input.callId)) {
    return {
      success: true as const,
      deduped: true as const,
      seconds: 0,
      dailySecondsUsed: currentDaily,
      totalLifetimeSeconds: currentLifetime,
    };
  }

  const today = utcDateKey();
  const lastUsageDate =
    typeof metadata[LAST_USAGE_DATE_KEY] === "string"
      ? metadata[LAST_USAGE_DATE_KEY]
      : null;
  const nextDaily =
    lastUsageDate === today ? currentDaily + seconds : seconds;
  const nextLifetime = currentLifetime + seconds;

  const meteredAt = new Date().toISOString();
  const nextIds = [...prior, input.callId].slice(-METERED_CALLS_MAX);

  const { error: updateError } = await serviceSupabase
    .from("users")
    .update({
      daily_seconds_used: nextDaily,
      total_lifetime_seconds: nextLifetime,
      metadata: {
        ...metadata,
        [METERED_CALLS_KEY]: nextIds,
        [LAST_USAGE_DATE_KEY]: today,
        last_metered_call_id: input.callId,
        last_metered_source: input.source,
        last_metered_at: meteredAt,
      },
      updated_at: meteredAt,
    })
    .eq("clerk_user_id", input.clerkUserId);

  if (updateError) {
    console.error("Failed to record call usage:", updateError);
    return { success: false as const, reason: "usage_update_failed" as const };
  }

  return {
    success: true as const,
    deduped: false as const,
    seconds,
    dailySecondsUsed: nextDaily,
    totalLifetimeSeconds: nextLifetime,
  };
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

  return (await response.json()) as VapiCallRecord;
}

export async function fetchVapiCallUntilEnded(callId: string) {
  let last: VapiCallRecord | null = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    last = await fetchVapiCall(callId);
    if (durationSecondsFromVapiPayload(last) > 0) return last;
    if (last.endedAt) return last;
    await sleep(1000);
  }

  return last;
}

export async function findLatestEndedCallForAssistant(assistantId: string) {
  if (!process.env.VAPI_PRIVATE_KEY || !assistantId) return null;

  const url = new URL("https://api.vapi.ai/call");
  url.searchParams.set("limit", "8");
  url.searchParams.set("assistantId", assistantId);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json: unknown = await response.json();
  const rows = Array.isArray(json)
    ? json
    : Array.isArray(asRecord(json)?.results)
      ? (asRecord(json)?.results as unknown[])
      : Array.isArray(asRecord(json)?.data)
        ? (asRecord(json)?.data as unknown[])
        : [];

  const calls = rows
    .map((row) => asRecord(row))
    .filter((record): record is Record<string, unknown> => Boolean(record))
    .filter((record) => readString(record.assistantId) === assistantId)
    .map((record) => record as VapiCallRecord);

  return (
    calls.find((call) => durationSecondsFromVapiPayload(call) > 0) ??
    calls[0] ??
    null
  );
}
