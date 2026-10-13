import { describe, expect, it } from "vitest";

import {
  isBenignVapiHangupError,
  isUnsupportedAudioProcessorWarning,
} from "@/lib/vapi-errors";

const DAILY_WARNING =
  "Ignoring settings for browser- or platform-unsupported input processor(s): audio";

describe("unsupported audio processor warning", () => {
  it("recognises Daily's noise cancellation warning", () => {
    expect(isUnsupportedAudioProcessorWarning(DAILY_WARNING)).toBe(true);
  });

  it("recognises it however the text is wrapped or cased", () => {
    expect(isUnsupportedAudioProcessorWarning(new Error(DAILY_WARNING))).toBe(true);
    expect(
      isUnsupportedAudioProcessorWarning({ message: DAILY_WARNING.toUpperCase() }),
    ).toBe(true);
    expect(
      isUnsupportedAudioProcessorWarning(`[daily] ${DAILY_WARNING} (see docs)`),
    ).toBe(true);
  });

  it.each([
    "Meeting ended in error",
    "Failed to get user media",
    "Microphone permission denied",
    "Camera error",
    "",
    null,
    undefined,
    42,
  ])("does not hide a real problem (%s)", (value) => {
    expect(isUnsupportedAudioProcessorWarning(value)).toBe(false);
  });

  it("is a different thing from a normal hangup", () => {
    expect(isBenignVapiHangupError(DAILY_WARNING)).toBe(false);
    expect(isUnsupportedAudioProcessorWarning("Meeting has ended")).toBe(false);
  });
});
