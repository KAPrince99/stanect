import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  canUserCall,
  effectiveDailySecondsUsed,
  getMaxCompanions,
  hasReachedCompanionLimit,
  isTrialExpired,
  readLastUsageDate,
  utcDateKey,
} from "@/lib/plan-utils";

const NOW = new Date("2026-10-12T12:00:00.000Z");

describe("plan utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("utcDateKey", () => {
    it("uses today in UTC when no date is passed", () => {
      expect(utcDateKey()).toBe("2026-10-12");
    });

    it("returns the UTC calendar day for a valid timestamp", () => {
      expect(utcDateKey("2026-01-03T00:30:00.000Z")).toBe("2026-01-03");
    });

    it("falls back to today when the timestamp is invalid", () => {
      expect(utcDateKey("not-a-date")).toBe("2026-10-12");
    });
  });

  describe("readLastUsageDate", () => {
    it("returns a stored YYYY-MM-DD value", () => {
      expect(readLastUsageDate({ last_usage_date: "2026-10-11" })).toBe(
        "2026-10-11",
      );
    });

    it("returns null for missing or malformed metadata", () => {
      expect(readLastUsageDate(null)).toBeNull();
      expect(readLastUsageDate("2026-10-11")).toBeNull();
      expect(readLastUsageDate({})).toBeNull();
      expect(readLastUsageDate({ last_usage_date: "10/11/2026" })).toBeNull();
      expect(readLastUsageDate({ last_usage_date: 20261011 })).toBeNull();
    });
  });

  describe("effectiveDailySecondsUsed", () => {
    it("counts seconds recorded today", () => {
      expect(
        effectiveDailySecondsUsed({
          daily_seconds_used: 120,
          last_usage_date: "2026-10-12",
        }),
      ).toBe(120);
    });

    it("ignores seconds recorded on an earlier day", () => {
      expect(
        effectiveDailySecondsUsed({
          daily_seconds_used: 360,
          last_usage_date: "2026-10-11",
        }),
      ).toBe(0);
    });

    it("counts stored seconds when no usage date is present", () => {
      expect(effectiveDailySecondsUsed({ daily_seconds_used: 90 })).toBe(90);
    });

    it("clamps negative usage to zero", () => {
      expect(
        effectiveDailySecondsUsed({
          daily_seconds_used: -20,
          last_usage_date: "2026-10-12",
        }),
      ).toBe(0);
    });
  });

  describe("isTrialExpired", () => {
    it("stays open through the seventh day", () => {
      expect(isTrialExpired("2026-10-05T12:00:00.000Z")).toBe(false);
    });

    it("expires once the account is older than seven days", () => {
      expect(isTrialExpired("2026-10-05T11:59:59.000Z")).toBe(true);
      expect(isTrialExpired("2026-10-01T12:00:00.000Z")).toBe(true);
    });
  });

  describe("canUserCall", () => {
    it("allows pro and king even after the trial and daily cap", () => {
      const exhausted = {
        created_at: "2020-01-01T00:00:00.000Z",
        daily_seconds_used: 10_000,
        last_usage_date: "2026-10-12",
      };

      expect(canUserCall({ plan: "pro", ...exhausted })).toEqual({
        allowed: true,
      });
      expect(canUserCall({ plan: "KING", ...exhausted })).toEqual({
        allowed: true,
      });
    });

    it("allows a free account inside the trial and under the daily cap", () => {
      expect(
        canUserCall({
          plan: "free",
          created_at: "2026-10-10T12:00:00.000Z",
          daily_seconds_used: 359,
          last_usage_date: "2026-10-12",
        }),
      ).toEqual({ allowed: true });
    });

    it("treats a missing plan as free", () => {
      expect(
        canUserCall({
          created_at: "2026-10-10T12:00:00.000Z",
          daily_seconds_used: 0,
        }),
      ).toEqual({ allowed: true });
    });

    it("blocks a free account after the trial", () => {
      expect(
        canUserCall({
          plan: "free",
          created_at: "2026-10-01T12:00:00.000Z",
          daily_seconds_used: 0,
          last_usage_date: "2026-10-12",
        }),
      ).toEqual({ allowed: false, reason: "TRIAL_EXPIRED" });
    });

    it("blocks a free account once today's credit is spent", () => {
      expect(
        canUserCall({
          plan: "free",
          created_at: "2026-10-10T12:00:00.000Z",
          daily_seconds_used: 360,
          last_usage_date: "2026-10-12",
        }),
      ).toEqual({ allowed: false, reason: "DAILY_LIMIT_REACHED" });
    });

    it("starts a new daily credit when the last usage date is yesterday", () => {
      expect(
        canUserCall({
          plan: "free",
          created_at: "2026-10-10T12:00:00.000Z",
          daily_seconds_used: 360,
          last_usage_date: "2026-10-11",
        }),
      ).toEqual({ allowed: true });
    });
  });

  describe("companion limits", () => {
    it("reads the cap for each plan", () => {
      expect(getMaxCompanions("free")).toBe(1);
      expect(getMaxCompanions("pro")).toBe(100);
      expect(getMaxCompanions("king")).toBe(500);
    });

    it("is reached only at the plan cap", () => {
      expect(hasReachedCompanionLimit(0, "free")).toBe(false);
      expect(hasReachedCompanionLimit(1, "free")).toBe(true);
      expect(hasReachedCompanionLimit(99, "pro")).toBe(false);
      expect(hasReachedCompanionLimit(100, "pro")).toBe(true);
      expect(hasReachedCompanionLimit(499, "king")).toBe(false);
      expect(hasReachedCompanionLimit(500, "king")).toBe(true);
    });
  });
});
