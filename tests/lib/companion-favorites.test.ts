import { afterEach, describe, expect, it } from "vitest";

import {
  getFavoriteCompanionIds,
  toggleFavoriteCompanion,
} from "@/lib/companion-favorites";

describe("companion favorites", () => {
  afterEach(() => {
    localStorage.removeItem("stanect:favoriteCompanionIds");
  });

  it("starts empty and toggles an id on and off", () => {
    expect(getFavoriteCompanionIds()).toEqual([]);
    expect(toggleFavoriteCompanion("c1")).toBe(true);
    expect(getFavoriteCompanionIds()).toEqual(["c1"]);
    expect(toggleFavoriteCompanion("c2")).toBe(true);
    expect(getFavoriteCompanionIds()).toEqual(["c1", "c2"]);
    expect(toggleFavoriteCompanion("c1")).toBe(false);
    expect(getFavoriteCompanionIds()).toEqual(["c2"]);
  });

  it("ignores broken storage instead of throwing", () => {
    localStorage.setItem("stanect:favoriteCompanionIds", "{not-json");
    expect(getFavoriteCompanionIds()).toEqual([]);
  });
});
