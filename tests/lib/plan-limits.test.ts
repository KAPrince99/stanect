import { describe, expect, it } from "vitest";

import { PLAN_LIMITS } from "@/lib/plan-limits";

describe("PLAN_LIMITS", () => {
  it("caps free accounts at one companion, 6 daily minutes, and a 2 minute session", () => {
    expect(PLAN_LIMITS.free).toEqual({
      name: "Free",
      maxCompanions: 1,
      dailyLimit: 360,
      sessionLimit: 120,
    });
  });

  it("caps pro at 100 companions and a 15 minute session", () => {
    expect(PLAN_LIMITS.pro).toEqual({
      name: "Pro",
      maxCompanions: 100,
      sessionLimit: 900,
    });
  });

  it("caps king at 500 companions and a 60 minute session", () => {
    expect(PLAN_LIMITS.king).toEqual({
      name: "King",
      maxCompanions: 500,
      sessionLimit: 3600,
    });
  });
});
