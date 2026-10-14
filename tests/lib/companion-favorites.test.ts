import { afterEach, describe, expect, it } from "vitest";

import {
  clearLocalFavoriteCompanionIds,
  getLocalFavoriteCompanionIds,
  mergeFavoriteIds,
  parseFavoriteCompanionIds,
  readFavoriteCompanionIdsFromMetadata,
  toggleFavoriteId,
} from "@/lib/companion-favorites";

describe("companion favorites", () => {
  afterEach(() => {
    localStorage.removeItem("stanect:favoriteCompanionIds");
  });

  it("parses only non-empty strings and caps at 500", () => {
    expect(parseFavoriteCompanionIds(null)).toEqual([]);
    expect(parseFavoriteCompanionIds(["c1", "", 2, "c2"])).toEqual(["c1", "c2"]);
    expect(parseFavoriteCompanionIds(Array.from({ length: 501 }, (_, i) => `c${i}`))).toHaveLength(
      500,
    );
  });

  it("reads favorite ids from user metadata", () => {
    expect(readFavoriteCompanionIdsFromMetadata(null)).toEqual([]);
    expect(
      readFavoriteCompanionIdsFromMetadata({
        favorite_companion_ids: ["c1", "c2"],
        last_usage_date: "2026-01-01",
      }),
    ).toEqual(["c1", "c2"]);
  });

  it("toggles an id on and off", () => {
    expect(toggleFavoriteId([], "c1")).toEqual({
      ids: ["c1"],
      isFavorite: true,
    });
    expect(toggleFavoriteId(["c1", "c2"], "c1")).toEqual({
      ids: ["c2"],
      isFavorite: false,
    });
  });

  it("merges lists without duplicates", () => {
    expect(mergeFavoriteIds(["c1"], ["c1", "c2"], [])).toEqual(["c1", "c2"]);
  });

  it("reads leftover local ids and clears them", () => {
    localStorage.setItem(
      "stanect:favoriteCompanionIds",
      JSON.stringify(["c1", "c2"]),
    );
    expect(getLocalFavoriteCompanionIds()).toEqual(["c1", "c2"]);
    clearLocalFavoriteCompanionIds();
    expect(getLocalFavoriteCompanionIds()).toEqual([]);
  });

  it("ignores broken storage instead of throwing", () => {
    localStorage.setItem("stanect:favoriteCompanionIds", "{not-json");
    expect(getLocalFavoriteCompanionIds()).toEqual([]);
  });
});
