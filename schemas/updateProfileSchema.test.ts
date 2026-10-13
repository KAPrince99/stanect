import { describe, expect, it } from "vitest";

import { updateProfileSchema } from "./updateProfileSchema";

describe("update profile schema", () => {
  it("trims the name and defaults a missing country to Earth", () => {
    expect(updateProfileSchema.parse({ name: "  Ada  " })).toEqual({
      name: "Ada",
      country: "Earth",
    });
  });

  it("trims a provided country", () => {
    expect(
      updateProfileSchema.parse({ name: "Ada", country: "  Nigeria  " }),
    ).toEqual({
      name: "Ada",
      country: "Nigeria",
    });
  });

  it("rejects a blank name", () => {
    const result = updateProfileSchema.safeParse({ name: "   " });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Name is required");
    }
  });

  it("rejects a blank country and a name longer than 80 characters", () => {
    expect(
      updateProfileSchema.safeParse({ name: "Ada", country: "   " }).success,
    ).toBe(false);
    expect(
      updateProfileSchema.safeParse({ name: "A".repeat(81) }).success,
    ).toBe(false);
    expect(updateProfileSchema.safeParse({ name: "A".repeat(80) }).success).toBe(
      true,
    );
  });
});
