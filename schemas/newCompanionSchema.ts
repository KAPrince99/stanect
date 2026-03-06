import { z } from "zod";

export const companionNameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters");

export const sceneSchema = z
  .string()
  .min(2, "Scene must be at least 2 characters");

export const sessionLengthSchema = z
  .number()
  .min(1, "Session length must be at least 1 minute")
  .max(120, "Session length cannot exceed 120 minutes");

export const companionSchema = z.object({
  avatarId: z.string().min(1),

  companionName: companionNameSchema,

  scene: sceneSchema,

  voice: z.enum(["male", "female"]),

  sessionLength: sessionLengthSchema,
});
