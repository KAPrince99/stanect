// buildAssistant.ts
import { CompanionProps } from "@/types/types";
import { buildPrompt } from "./buildPompt";

const voiceMapping = {
  male: {
    provider: "11labs",
    voiceId: process.env.MALE_VOICE_ID,
  },
  female: {
    provider: "11labs",
    voiceId: process.env.FEMALE_VOICE_ID,
  },
};
export function buildAssistant(companion: CompanionProps) {
  const voiceKey = companion.voice?.toLowerCase() as keyof typeof voiceMapping;

  // Fallback to female voice if invalid value
  const voiceConfig = voiceMapping[voiceKey] || voiceMapping["female"];

  const systemPrompt = buildPrompt(companion);

  return {
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
    },
    voice: {
      provider: voiceConfig.provider,
      voiceId: voiceConfig.voiceId, // CORRECTED
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
    },
    // firstMessage: `Hey ${companion.username}, I'm ${companion.companion_name}. Ready?`,
    clientMessages: [],
    serverMessages: [],
  };
}
