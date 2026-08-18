import { NextRequest, NextResponse } from "next/server";

import {
  durationSecondsFromVapiPayload,
  meterVerifiedCallUsage,
  resolveOwnerForAssistant,
} from "@/lib/call-metering";

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

  const seconds = durationSecondsFromVapiPayload(message);
  if (seconds <= 0) {
    return NextResponse.json({ ok: true, skipped: "no_duration" });
  }

  const ownerId = await resolveOwnerForAssistant(assistantId);
  if (!ownerId) {
    return NextResponse.json({ ok: true, skipped: "unknown_assistant" });
  }

  const result = await meterVerifiedCallUsage({
    callId,
    clerkUserId: ownerId,
    seconds,
    source: "vapi-webhook",
  });

  return NextResponse.json({ ok: true, result });
}
