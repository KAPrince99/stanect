let vapiInstance: VapiSDK | null = null;

export function extractVapiCallId(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (typeof record.callId === "string" && record.callId.trim()) {
    return record.callId.trim();
  }
  if (typeof record.id === "string" && record.id.trim()) {
    return record.id.trim();
  }
  if (record.call && typeof record.call === "object") {
    return extractVapiCallId(record.call);
  }

  return null;
}

export interface VapiSDK {
  start: (
    assistantId: string,
    options: { maxDurationSeconds: number },
  ) => Promise<unknown>;
  stop: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  off: (event: string, cb: (...args: unknown[]) => void) => void;
}

export async function getVapiSdk(): Promise<VapiSDK> {
  if (vapiInstance) return vapiInstance;

  if (!process.env.NEXT_PUBLIC_VAPI_API_KEY) {
    throw new Error("VAPI API key missing");
  }

  const { default: Vapi } = await import("@vapi-ai/web");
  vapiInstance = new Vapi(
    process.env.NEXT_PUBLIC_VAPI_API_KEY!,
  ) as unknown as VapiSDK;

  return vapiInstance;
}
