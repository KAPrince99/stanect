import {
  callTimestampsFromVapiPayload,
  durationSecondsFromVapiPayload,
} from "@/lib/call-metering";
import { supabase as serviceSupabase } from "@/lib/supa-service";
import type { SessionProps, SessionTranscriptLine } from "@/types/types";

const SESSION_SELECT =
  "id, vapi_call_id, owner_id, companion_id, assistant_id, duration_seconds, transcript, recap, started_at, ended_at, created_at";

const MAX_TRANSCRIPT_TURNS = 200;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeRole(value: unknown): SessionTranscriptLine["role"] | null {
  const role = String(value ?? "").toLowerCase();
  if (role === "user") return "user";
  if (role === "assistant" || role === "bot" || role === "ai") {
    return "assistant";
  }
  return null;
}

function lineFromRecord(
  row: Record<string, unknown>,
): SessionTranscriptLine | null {
  const role = normalizeRole(row.role);
  const content = (
    readString(row.content) ||
    readString(row.message) ||
    readString(row.transcript) ||
    ""
  ).trim();

  if (!role || !content) return null;
  return { role, content };
}

function parseMessageArray(value: unknown): SessionTranscriptLine[] {
  if (!Array.isArray(value)) return [];

  const lines: SessionTranscriptLine[] = [];
  for (const item of value) {
    const row = asRecord(item);
    if (!row) continue;
    const line = lineFromRecord(row);
    if (line) lines.push(line);
  }
  return lines.slice(-MAX_TRANSCRIPT_TURNS);
}

export function parseSessionTranscript(
  payload: unknown,
): SessionTranscriptLine[] {
  const root = asRecord(payload) ?? {};
  const artifact = asRecord(root.artifact);
  const call = asRecord(root.call);

  const candidates = [
    artifact?.messagesOpenAIFormatted,
    artifact?.messages,
    root.messages,
    call?.messages,
  ];

  for (const candidate of candidates) {
    const lines = parseMessageArray(candidate);
    if (lines.length > 0) return lines;
  }

  const transcript =
    readString(root.transcript) || readString(artifact?.transcript);
  if (!transcript) return [];

  return [{ role: "assistant", content: transcript.slice(0, 8000) }];
}

function parseStoredTranscript(value: unknown): SessionTranscriptLine[] {
  return parseMessageArray(value);
}

function parseIso(value: string | null): string | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

function mergeSessionRow(
  existing: Partial<SessionProps> | null,
  incoming: {
    ownerId: string;
    companionId: string;
    assistantId: string | null;
    durationSeconds: number;
    transcript: SessionTranscriptLine[];
    startedAt: string | null;
    endedAt: string | null;
  },
) {
  const existingTranscript = parseStoredTranscript(existing?.transcript);
  const transcript =
    incoming.transcript.length > existingTranscript.length
      ? incoming.transcript
      : existingTranscript;

  const existingDuration = Math.max(0, Number(existing?.duration_seconds ?? 0));
  const durationSeconds = Math.min(
    3600,
    Math.max(existingDuration, incoming.durationSeconds),
  );

  return {
    owner_id: incoming.ownerId,
    companion_id: incoming.companionId,
    assistant_id: incoming.assistantId || existing?.assistant_id || null,
    duration_seconds: durationSeconds,
    transcript,
    started_at: existing?.started_at || incoming.startedAt,
    ended_at: existing?.ended_at || incoming.endedAt,
    updated_at: new Date().toISOString(),
  };
}

export async function upsertSession(input: {
  vapiCallId: string;
  ownerId: string;
  companionId: string;
  assistantId?: string | null;
  payload: unknown;
}): Promise<
  | { success: true; id: string; durationSeconds: number }
  | { success: false; reason: string }
> {
  const vapiCallId = input.vapiCallId.trim();
  if (!vapiCallId || !input.ownerId || !input.companionId) {
    return { success: false, reason: "invalid_input" };
  }

  const timestamps = callTimestampsFromVapiPayload(input.payload);
  const incoming = {
    ownerId: input.ownerId,
    companionId: input.companionId,
    assistantId: input.assistantId ?? null,
    durationSeconds: durationSecondsFromVapiPayload(input.payload),
    transcript: parseSessionTranscript(input.payload),
    startedAt: parseIso(timestamps.startedAt),
    endedAt: parseIso(timestamps.endedAt),
  };

  const { data: existing, error: existingError } = await serviceSupabase
    .from("sessions")
    .select(SESSION_SELECT)
    .eq("vapi_call_id", vapiCallId)
    .maybeSingle();

  if (existingError) {
    console.error("Failed to load session for upsert:", existingError);
    return { success: false, reason: "session_lookup_failed" };
  }

  const merged = mergeSessionRow(
    existing as Partial<SessionProps> | null,
    incoming,
  );

  const { data, error } = await serviceSupabase
    .from("sessions")
    .upsert(
      {
        ...(existing?.id ? { id: existing.id } : {}),
        vapi_call_id: vapiCallId,
        ...merged,
      },
      { onConflict: "vapi_call_id" },
    )
    .select("id, duration_seconds")
    .maybeSingle();

  if (error || !data?.id) {
    console.error("Failed to persist session:", error);
    return { success: false, reason: "session_upsert_failed" };
  }

  return {
    success: true,
    id: data.id as string,
    durationSeconds: Number(data.duration_seconds ?? merged.duration_seconds),
  };
}
