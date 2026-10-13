import { describe, expect, it } from "vitest";

import {
  levelFromRms,
  localAudioTrack,
  rmsFromSamples,
} from "@/lib/mic-level";

describe("rmsFromSamples", () => {
  it("is 0 for silence and for an empty list", () => {
    expect(rmsFromSamples([])).toBe(0);
    expect(rmsFromSamples([0, 0, 0, 0])).toBe(0);
  });

  it("is 1 for a full-scale square wave", () => {
    expect(rmsFromSamples([1, -1, 1, -1])).toBe(1);
  });

  it("is louder for a louder wave", () => {
    expect(rmsFromSamples([0.1, -0.1, 0.1, -0.1])).toBeLessThan(
      rmsFromSamples([0.4, -0.4, 0.4, -0.4]),
    );
  });
});

describe("levelFromRms", () => {
  it("is 0 for silence and for bad numbers", () => {
    expect(levelFromRms(0)).toBe(0);
    expect(levelFromRms(-0.1)).toBe(0);
    expect(levelFromRms(Number.NaN)).toBe(0);
  });

  it("reaches 1 at a typical loud speaking RMS and never goes past it", () => {
    expect(levelFromRms(0.08)).toBe(1);
    expect(levelFromRms(0.5)).toBe(1);
  });

  it("is well above the speaking-ring start level for quiet speech", () => {
    // Voice activity turns the ring on at 0.04. Quiet speech (~0.02 RMS)
    // must still clear that, or we are back to waiting on the server.
    expect(levelFromRms(0.02)).toBeGreaterThan(0.04);
  });
});

describe("localAudioTrack", () => {
  const track = { kind: "audio", readyState: "live" } as MediaStreamTrack;

  it("prefers Daily's persistentTrack", () => {
    const daily = {
      participants: () => ({
        local: { tracks: { audio: { persistentTrack: track, track: {} } } },
      }),
    };

    expect(localAudioTrack(daily)).toBe(track);
  });

  it("falls back to track when persistentTrack is missing", () => {
    const daily = {
      participants: () => ({
        local: { tracks: { audio: { track } } },
      }),
    };

    expect(localAudioTrack(daily)).toBe(track);
  });

  it.each([null, undefined, {}, { participants: () => ({}) }])(
    "returns null when Daily has no local audio (%j)",
    (daily) => {
      expect(localAudioTrack(daily)).toBeNull();
    },
  );
});
