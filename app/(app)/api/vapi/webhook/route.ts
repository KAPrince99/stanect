import { NextRequest, NextResponse } from "next/server";

import {
  durationSecondsFromVapiPayload,
  meterVerifiedCallUsage,
  resolveCompanionForAssistant,
} from "@/lib/call-metering";
import { upsertSession } from "@/lib/sessions";

function verifyVapiWebhook(req: NextRequest) {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) {
    // Allow in development only when secret is unset — production should set it.
    return process.env.NODE_ENV !== "production";
  }

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  return token === secret;
}

export async function POST(req: NextRequest) {
  if (!verifyVapiWebhook(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message =
    body &&
    typeof body === "object" &&
    "message" in body &&
    body.message &&
    typeof body.message === "object"
      ? (body.message as Record<string, unknown>)
      : (body as Record<string, unknown>);

  if (message?.type !== "end-of-call-report") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const call =
    message.call && typeof message.call === "object"
      ? (message.call as Record<string, unknown>)
      : {};

  const callId = typeof call.id === "string" ? call.id : null;
  const assistantId =
    typeof call.assistantId === "string" ? call.assistantId : null;

  if (!callId || !assistantId) {
    return NextResponse.json({ ok: true, skipped: "missing_ids" });
  }

  const companion = await resolveCompanionForAssistant(assistantId);
  if (!companion) {
    return NextResponse.json({ ok: true, skipped: "unknown_assistant" });
  }

  const persist = await upsertSession({
    vapiCallId: callId,
    ownerId: companion.owner_id,
    companionId: companion.id,
    assistantId,
    payload: message,
  });

  if (!persist.success) {
    console.error("vapi webhook persist:", persist.reason);
  }

  const seconds = durationSecondsFromVapiPayload(message);
  if (seconds <= 0) {
    if (!persist.success) {
      return NextResponse.json({ ok: false, persist }, { status: 500 });
    }
    return NextResponse.json({
      ok: true,
      persist,
      skipped: "no_duration",
    });
  }

  const result = await meterVerifiedCallUsage({
    callId,
    clerkUserId: companion.owner_id,
    seconds,
    source: "vapi-webhook",
  });

  return NextResponse.json({ ok: true, persist, result });
}
