import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resolvePlanLabel, resolvePracticeUsage } from "@/lib/practice-usage";

const NOW = new Date("2026-10-12T12:00:00.000Z");

describe("practice usage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("resolvePlanLabel", () => {
    it("names the known plans and falls back to Free", () => {
      expect(resolvePlanLabel("pro")).toBe("Pro");
      expect(resolvePlanLabel("KING")).toBe("King");
      expect(resolvePlanLabel(null)).toBe("Free");
      expect(resolvePlanLabel("starter")).toBe("Free");
    });
  });

  describe("resolvePracticeUsage", () => {
    it("marks paid plans as paid and ignores free-trial usage", () => {
      expect(
        resolvePracticeUsage({
          plan: "pro",
          created_at: "2020-01-01T00:00:00.000Z",
          daily_seconds_used: 10_000,
          last_usage_date: "2026-10-12",
        }),
      ).toEqual({ planLabel: "Pro", label: "Pro", tone: "paid" });

      expect(resolvePracticeUsage({ plan: "king" })).toEqual({
        planLabel: "King",
        label: "King",
        tone: "paid",
      });
    });

    it("blocks a free account whose trial has ended", () => {
      expect(
        resolvePracticeUsage({
          plan: "free",
          created_at: "2026-10-01T12:00:00.000Z",
          daily_seconds_used: 0,
          last_usage_date: "2026-10-12",
        }),
      ).toEqual({
        planLabel: "Free",
        label: "Trial ended · upgrade to continue",
        tone: "blocked",
      });
    });

    it("blocks a free account that has used today's credit", () => {
      expect(
        resolvePracticeUsage({
          plan: "free",
          created_at: "2026-10-10T12:00:00.000Z",
          daily_seconds_used: 360,
          last_usage_date: "2026-10-12",
        }),
      ).toEqual({
        planLabel: "Free",
        label: "Daily limit reached",
        tone: "blocked",
      });
    });

    it("warns when two minutes or less remain", () => {
      expect(
        resolvePracticeUsage({
          plan: "free",
          created_at: "2026-10-10T12:00:00.000Z",
          daily_seconds_used: 240,
          last_usage_date: "2026-10-12",
        }),
      ).toEqual({
        planLabel: "Free",
        label: "2 min left today",
        tone: "low",
      });
    });

    it("stays calm when more than two minutes remain", () => {
      expect(
        resolvePracticeUsage({
          plan: "free",
          created_at: "2026-10-10T12:00:00.000Z",
          daily_seconds_used: 0,
          last_usage_date: "2026-10-12",
        }),
      ).toEqual({
        planLabel: "Free",
        label: "6 min left today",
        tone: "ok",
      });
    });

    it("resets yesterday's usage before counting today's minutes", () => {
      expect(
        resolvePracticeUsage({
          plan: "free",
          created_at: "2026-10-10T12:00:00.000Z",
          daily_seconds_used: 360,
          last_usage_date: "2026-10-11",
        }),
      ).toEqual({
        planLabel: "Free",
        label: "6 min left today",
        tone: "ok",
      });
    });
  });
});
