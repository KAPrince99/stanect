import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  VOICE_ACTIVITY,
  createVoiceActivityDetector,
} from "@/lib/voice-activity";

const { onLevel, offLevel, onLevelWhileAssistant, holdMs } = VOICE_ACTIVITY;
const loud = onLevel * 2;
const between = (onLevel + offLevel) / 2; // above "off", below "on"
const silent = 0;

function setup() {
  const onChange = vi.fn();
  const detector = createVoiceActivityDetector(onChange);
  return { onChange, detector };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("voice activity detector", () => {
  it("starts right away when the mic gets loud, with no waiting", () => {
    const { onChange, detector } = setup();

    detector.push(loud);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it("stays off for background noise below the start level", () => {
    const { onChange, detector } = setup();

    detector.push(onLevel / 2);
    detector.push(silent);
    vi.advanceTimersByTime(holdMs * 3);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("only reports the start once while the user keeps talking", () => {
    const { onChange, detector } = setup();

    for (let i = 0; i < 20; i++) detector.push(loud);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("ends only after the mic has stayed quiet for the hold time", () => {
    const { onChange, detector } = setup();
    detector.push(loud);

    detector.push(silent);
    vi.advanceTimersByTime(holdMs - 1);
    expect(onChange).toHaveBeenCalledTimes(1); // still counted as talking

    vi.advanceTimersByTime(1);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("does not flicker off in the pause between words", () => {
    const { onChange, detector } = setup();
    detector.push(loud);

    // quiet gap shorter than the hold, then talking again
    detector.push(silent);
    vi.advanceTimersByTime(holdMs / 2);
    detector.push(loud);
    vi.advanceTimersByTime(holdMs * 2);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it("keeps going on a level between the two thresholds (hysteresis)", () => {
    const { onChange, detector } = setup();

    // Not loud enough to start...
    detector.push(between);
    expect(onChange).not.toHaveBeenCalled();

    // ...but once talking, the same level is enough to keep going.
    detector.push(loud);
    detector.push(between);
    vi.advanceTimersByTime(holdMs * 3);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it("can start again after finishing", () => {
    const { onChange, detector } = setup();

    detector.push(loud);
    detector.push(silent);
    vi.advanceTimersByTime(holdMs);
    detector.push(loud);

    expect(onChange.mock.calls.map(([active]) => active)).toEqual([
      true,
      false,
      true,
    ]);
  });

  it("ends even if no more readings arrive", () => {
    const { onChange, detector } = setup();
    detector.push(loud);
    detector.push(silent); // last reading, then the stream goes silent

    vi.advanceTimersByTime(holdMs);

    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  describe("while the companion is talking", () => {
    it("ignores a level that could just be her voice leaking into the mic", () => {
      const { onChange, detector } = setup();

      detector.push(loud, { assistantSpeaking: true });

      expect(loud).toBeLessThan(onLevelWhileAssistant);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("still starts for a clearly louder voice, so interrupting her works", () => {
      const { onChange, detector } = setup();

      detector.push(onLevelWhileAssistant, { assistantSpeaking: true });

      expect(onChange).toHaveBeenLastCalledWith(true);
    });

    it("keeps the normal lower bar once the user is already talking", () => {
      const { onChange, detector } = setup();
      detector.push(onLevelWhileAssistant, { assistantSpeaking: true });

      detector.push(between, { assistantSpeaking: true });
      vi.advanceTimersByTime(holdMs * 3);

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("reset and dispose", () => {
    it("reset stops immediately and reports it when the user was talking", () => {
      const { onChange, detector } = setup();
      detector.push(loud);

      detector.reset();

      expect(onChange).toHaveBeenLastCalledWith(false);
    });

    it("reset reports nothing when the user was not talking", () => {
      const { onChange, detector } = setup();

      detector.reset();

      expect(onChange).not.toHaveBeenCalled();
    });

    it("reset cancels a pending end, so it is not reported twice", () => {
      const { onChange, detector } = setup();
      detector.push(loud);
      detector.push(silent);

      detector.reset();
      vi.advanceTimersByTime(holdMs * 2);

      expect(onChange.mock.calls.map(([active]) => active)).toEqual([
        true,
        false,
      ]);
    });

    it("starts clean after a reset", () => {
      const { onChange, detector } = setup();
      detector.push(loud);
      detector.reset();

      detector.push(loud);

      expect(onChange.mock.calls.map(([active]) => active)).toEqual([
        true,
        false,
        true,
      ]);
    });

    it("dispose cancels a pending end without reporting anything", () => {
      const { onChange, detector } = setup();
      detector.push(loud);
      detector.push(silent);

      detector.dispose();
      vi.advanceTimersByTime(holdMs * 2);

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])(
    "ignores a bad reading (%s)",
    (reading) => {
      const { onChange, detector } = setup();

      detector.push(reading);

      expect(onChange).not.toHaveBeenCalled();
    },
  );
});
