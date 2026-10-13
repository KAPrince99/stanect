import { describe, expect, it, vi } from "vitest";

import {
  createLevelSmoother,
  publishVoiceLevel,
  subscribeVoiceLevel,
} from "@/lib/voice-level";

describe("level smoother", () => {
  it("stays at zero for silence", () => {
    const smoother = createLevelSmoother(0.25);

    expect(smoother.next(0)).toBe(0);
    expect(smoother.next(0)).toBe(0);
  });

  it("reaches full size at the full-scale level and never goes past it", () => {
    const smoother = createLevelSmoother(0.25, { attack: 1 });

    expect(smoother.next(0.25)).toBeCloseTo(1);
    expect(smoother.next(0.9)).toBeCloseTo(1);
    expect(smoother.next(50)).toBeCloseTo(1);
  });

  it("shows quiet speech clearly, louder than a straight line would", () => {
    const smoother = createLevelSmoother(0.25, { attack: 1 });

    // A straight line would give 0.04 / 0.25 = 0.16.
    expect(smoother.next(0.04)).toBeGreaterThan(0.3);
  });

  it("is louder for louder voices", () => {
    const quiet = createLevelSmoother(0.25, { attack: 1 }).next(0.03);
    const medium = createLevelSmoother(0.25, { attack: 1 }).next(0.1);
    const loud = createLevelSmoother(0.25, { attack: 1 }).next(0.2);

    expect(quiet).toBeLessThan(medium);
    expect(medium).toBeLessThan(loud);
  });

  it("rises faster than it falls, so it swells with the voice without flickering", () => {
    const smoother = createLevelSmoother(0.25, { attack: 0.7, release: 0.25 });

    const afterRise = smoother.next(0.25);
    const afterFall = smoother.next(0);

    expect(afterRise).toBeGreaterThan(0.6); // most of the way up in one reading
    expect(afterFall).toBeGreaterThan(afterRise * 0.6); // but only part of the way down
    expect(afterFall).toBeLessThan(afterRise);
  });

  it("eventually settles back to silence", () => {
    const smoother = createLevelSmoother(0.25);
    smoother.next(0.25);

    let level = 1;
    for (let i = 0; i < 60; i++) level = smoother.next(0);

    expect(level).toBeLessThan(0.01);
  });

  it("never returns anything outside 0 to 1", () => {
    const smoother = createLevelSmoother(0.25);

    for (const raw of [-5, -0.1, 0, 0.1, 0.25, 3, 1000]) {
      const level = smoother.next(raw);
      expect(level).toBeGreaterThanOrEqual(0);
      expect(level).toBeLessThanOrEqual(1);
    }
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "treats a bad reading (%s) as silence",
    (bad) => {
      const smoother = createLevelSmoother(0.25, { attack: 1, release: 1 });
      smoother.next(0.25);

      expect(smoother.next(bad)).toBe(0);
    },
  );

  it("starts again from zero after a reset", () => {
    const smoother = createLevelSmoother(0.25, { attack: 1 });
    smoother.next(0.25);

    smoother.reset();

    // Without the reset this would fall only part of the way, not to zero.
    expect(smoother.next(0)).toBe(0);
  });
});

describe("voice level bus", () => {
  it("delivers a level to listeners of that role only", () => {
    const user = vi.fn();
    const assistant = vi.fn();
    const offUser = subscribeVoiceLevel("user", user);
    const offAssistant = subscribeVoiceLevel("assistant", assistant);

    publishVoiceLevel("user", 0.4);

    expect(user).toHaveBeenCalledWith(0.4);
    expect(assistant).not.toHaveBeenCalled();

    offUser();
    offAssistant();
  });

  it("stops delivering after unsubscribe", () => {
    const listener = vi.fn();
    const off = subscribeVoiceLevel("assistant", listener);

    off();
    publishVoiceLevel("assistant", 0.9);

    expect(listener).not.toHaveBeenCalled();
  });

  it("delivers to every listener", () => {
    const a = vi.fn();
    const b = vi.fn();
    const offA = subscribeVoiceLevel("user", a);
    const offB = subscribeVoiceLevel("user", b);

    publishVoiceLevel("user", 0.2);

    expect(a).toHaveBeenCalledWith(0.2);
    expect(b).toHaveBeenCalledWith(0.2);

    offA();
    offB();
  });

  it("does nothing when nobody is listening", () => {
    expect(() => publishVoiceLevel("user", 0.5)).not.toThrow();
  });
});
