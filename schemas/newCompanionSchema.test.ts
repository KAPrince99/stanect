import { describe, expect, it } from "vitest";

import {
  companionNameSchema,
  companionSchema,
  sceneSchema,
  sessionLengthSchema,
} from "./newCompanionSchema";

const validCompanion = {
  avatarId: "avatar_1",
  companionName: "Mia",
  scene: "Gym",
  voice: "female" as const,
  sessionLength: 15,
};

describe("new companion schema", () => {
  it("accepts a complete companion", () => {
    expect(companionSchema.safeParse(validCompanion).success).toBe(true);
  });

  it("requires a companion name of at least two characters", () => {
    const missing = companionNameSchema.safeParse("A");

    expect(missing.success).toBe(false);
    if (!missing.success) {
      expect(missing.error.issues[0]?.message).toBe(
        "Name must be at least 2 characters",
      );
    }
  });

  it("requires a scene of at least two characters", () => {
    const missing = sceneSchema.safeParse("A");

    expect(missing.success).toBe(false);
    if (!missing.success) {
      expect(missing.error.issues[0]?.message).toBe(
        "Scene must be at least 2 characters",
      );
    }
  });

  it("keeps session length between 1 and 120 minutes", () => {
    expect(sessionLengthSchema.safeParse(1).success).toBe(true);
    expect(sessionLengthSchema.safeParse(120).success).toBe(true);

    const tooShort = sessionLengthSchema.safeParse(0);
    const tooLong = sessionLengthSchema.safeParse(121);

    expect(tooShort.success).toBe(false);
    expect(tooLong.success).toBe(false);
    if (!tooShort.success) {
      expect(tooShort.error.issues[0]?.message).toBe(
        "Session length must be at least 1 minute",
      );
    }
    if (!tooLong.success) {
      expect(tooLong.error.issues[0]?.message).toBe(
        "Session length cannot exceed 120 minutes",
      );
    }
  });

  it("rejects a missing avatar and an unknown voice", () => {
    expect(
      companionSchema.safeParse({ ...validCompanion, avatarId: "" }).success,
    ).toBe(false);
    expect(
      companionSchema.safeParse({ ...validCompanion, voice: "other" }).success,
    ).toBe(false);
  });
});
