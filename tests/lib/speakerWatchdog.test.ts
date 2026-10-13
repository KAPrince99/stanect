import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SPEAKER_STUCK_MS,
  createSpeakerWatchdog,
  transcriptRole,
} from "@/lib/speaker-watchdog";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("speaker watchdog", () => {
  it("fires once when nothing shows a sign of life for the whole window", () => {
    const onStuck = vi.fn();
    const dog = createSpeakerWatchdog(onStuck);

    dog.touch();
    vi.advanceTimersByTime(SPEAKER_STUCK_MS - 1);
    expect(onStuck).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onStuck).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(SPEAKER_STUCK_MS * 3);
    expect(onStuck).toHaveBeenCalledTimes(1);
  });

  it("never fires during a long answer that keeps showing signs of life", () => {
    const onStuck = vi.fn();
    const dog = createSpeakerWatchdog(onStuck);

    dog.touch();
    // 60 seconds of speech, a sign of life every second
    for (let second = 0; second < 60; second++) {
      vi.advanceTimersByTime(1000);
      dog.touch();
    }

    expect(onStuck).not.toHaveBeenCalled();
  });

  it("starts the clock again from the last sign of life", () => {
    const onStuck = vi.fn();
    const dog = createSpeakerWatchdog(onStuck);

    dog.touch();
    vi.advanceTimersByTime(SPEAKER_STUCK_MS - 100);
    dog.touch();
    vi.advanceTimersByTime(SPEAKER_STUCK_MS - 100);
    expect(onStuck).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(onStuck).toHaveBeenCalledTimes(1);
  });

  it("does not fire after cancel", () => {
    const onStuck = vi.fn();
    const dog = createSpeakerWatchdog(onStuck);

    dog.touch();
    dog.cancel();
    vi.advanceTimersByTime(SPEAKER_STUCK_MS * 2);

    expect(onStuck).not.toHaveBeenCalled();
  });

  it("can be cancelled when it was never started", () => {
    const dog = createSpeakerWatchdog(vi.fn());
    expect(() => dog.cancel()).not.toThrow();
  });

  it("can be restarted after it fired", () => {
    const onStuck = vi.fn();
    const dog = createSpeakerWatchdog(onStuck);

    dog.touch();
    vi.advanceTimersByTime(SPEAKER_STUCK_MS);
    dog.touch();
    vi.advanceTimersByTime(SPEAKER_STUCK_MS);

    expect(onStuck).toHaveBeenCalledTimes(2);
  });

  it("accepts a custom window", () => {
    const onStuck = vi.fn();
    const dog = createSpeakerWatchdog(onStuck, 200);

    dog.touch();
    vi.advanceTimersByTime(200);

    expect(onStuck).toHaveBeenCalledTimes(1);
  });
});

describe("transcriptRole", () => {
  it.each([
    [{ type: "transcript", role: "assistant", transcriptType: "partial" }, "assistant"],
    [{ type: "transcript", role: "user", transcriptType: "final" }, "user"],
    [{ type: "transcript[transcriptType='final']", role: "user" }, "user"],
  ])("finds whose transcript %j is", (message, expected) => {
    expect(transcriptRole(message)).toBe(expected);
  });

  it.each([
    null,
    undefined,
    "transcript",
    42,
    {},
    { type: "speech-update", role: "user" },
    { type: "transcript" },
    { type: "transcript", role: "narrator" },
  ])("returns null for %j", (message) => {
    expect(transcriptRole(message)).toBeNull();
  });
});
