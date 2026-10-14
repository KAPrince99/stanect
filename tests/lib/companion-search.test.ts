import { describe, expect, it } from "vitest";

import {
  applyCompanionFilters,
  filterCompanions,
  matchCompanion,
} from "@/lib/companion-search";

const mia = { companion_name: "Mia", scene: "Gym" };
const alex = { companion_name: "Alex", scene: "Park" };

describe("companion search", () => {
  it("matches a companion name regardless of case", () => {
    expect(matchCompanion("mia", mia)).toBe(true);
    expect(matchCompanion("  MIA ", mia)).toBe(true);
    expect(matchCompanion("lex", alex)).toBe(true);
  });

  it("matches a scene", () => {
    expect(matchCompanion("gym", mia)).toBe(true);
    expect(matchCompanion("park", alex)).toBe(true);
    expect(matchCompanion("gym", alex)).toBe(false);
  });

  it("treats a blank query as a match for everyone", () => {
    expect(matchCompanion("", mia)).toBe(true);
    expect(matchCompanion("   ", alex)).toBe(true);
  });

  it("filters the list and leaves it untouched when the query is blank", () => {
    expect(filterCompanions([mia, alex], "Mia")).toEqual([mia]);
    expect(filterCompanions([mia, alex], "park")).toEqual([alex]);
    expect(filterCompanions([mia, alex], "")).toEqual([mia, alex]);
    expect(filterCompanions([mia, alex], "zzz")).toEqual([]);
  });

  it("narrows to favorites before applying the search query", () => {
    const miaCard = { id: "c1", ...mia };
    const alexCard = { id: "c2", ...alex };
    const favorites = new Set(["c1"]);

    expect(
      applyCompanionFilters([miaCard, alexCard], "", "all", favorites),
    ).toEqual([miaCard, alexCard]);
    expect(
      applyCompanionFilters([miaCard, alexCard], "", "favorites", favorites),
    ).toEqual([miaCard]);
    expect(
      applyCompanionFilters([miaCard, alexCard], "park", "favorites", favorites),
    ).toEqual([]);
    expect(
      applyCompanionFilters([miaCard, alexCard], "gym", "favorites", favorites),
    ).toEqual([miaCard]);
  });
});
