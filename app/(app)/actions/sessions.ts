"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

import { createSupabaseClient } from "@/lib/supabase";
import type { SessionProps } from "@/types/types";

const SESSION_SELECT =
  "id, vapi_call_id, owner_id, companion_id, assistant_id, duration_seconds, transcript, recap, started_at, ended_at, created_at";

const callIdSchema = z.string().trim().min(1).max(120);
const listSessionsSchema = z.object({
  companionId: z.string().trim().min(1).max(80).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export async function getSessionByCallId(callId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = callIdSchema.safeParse(callId);
  if (!parsed.success) throw new Error("Invalid call id");

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(SESSION_SELECT)
    .eq("vapi_call_id", parsed.data)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getSessionByCallId:", error.message);
    throw new Error("Unable to load session");
  }

  return (data as SessionProps | null) ?? null;
}

export async function listSessions(input?: {
  companionId?: string;
  limit?: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = listSessionsSchema.safeParse(input ?? {});
  if (!parsed.success) throw new Error("Invalid session query");

  const limit = parsed.data.limit ?? 20;
  const supabase = createSupabaseClient();

  let query = supabase
    .from("sessions")
    .select(SESSION_SELECT)
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (parsed.data.companionId) {
    query = query.eq("companion_id", parsed.data.companionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listSessions:", error.message);
    throw new Error("Unable to load sessions");
  }

  return (data ?? []) as SessionProps[];
}

export async function getCompanionSessions(companionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = z.string().trim().min(1).max(80).safeParse(companionId);
  if (!parsed.success) throw new Error("Invalid companion");

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(SESSION_SELECT)
    .eq("owner_id", userId)
    .eq("companion_id", parsed.data)
    .order("created_at", { ascending: true })
    .limit(20);

  if (error) {
    console.error("getCompanionSessions:", error.message);
    throw new Error("Unable to load sessions");
  }

  return ((data ?? []) as SessionProps[]).filter(
    (row) => row.companion_id === parsed.data,
  );
}
