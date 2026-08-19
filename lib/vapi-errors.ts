export function getVapiErrorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;

    if (record.error && typeof record.error === "object") {
      const nested = record.error as Record<string, unknown>;
      if (typeof nested.message === "string") return nested.message;
    }

    if (typeof record.message === "string") return record.message;
  }

  try {
    return JSON.stringify(error ?? "");
  } catch {
    return "";
  }
}

/** Daily/Vapi noise on normal hangup, max-duration end, or double-destroy. */
export function isBenignVapiHangupError(error: unknown) {
  const text = getVapiErrorText(error).toLowerCase();
  if (!text) return false;

  return (
    /meeting ended in error/.test(text) ||
    /meeting has ended/.test(text) ||
    /meeting ended/.test(text) ||
    /meeting has been destroyed/.test(text) ||
    /ejection/.test(text) ||
    /call has ended/.test(text) ||
    /already ended/.test(text)
  );
}
