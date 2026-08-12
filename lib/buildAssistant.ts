// buildAssistant.ts
import { AssistantCompanionContext } from "@/types/types";
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

type BuildAssistantInput = AssistantCompanionContext & {
  id?: string;
  owner_id?: string;
};

function resolveVapiServerUrl() {
  return (
    process.env.VAPI_SERVER_URL ||
    (process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/vapi/webhook`
      : null)
  );
}

export function buildAssistant(companion: BuildAssistantInput) {
  const voiceKey = companion.voice?.toLowerCase() as keyof typeof voiceMapping;

  // Fallback to female voice if invalid value
  const voiceConfig = voiceMapping[voiceKey] || voiceMapping["female"];

  const systemPrompt = buildPrompt(companion);
  const serverUrl = resolveVapiServerUrl();

  return {
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
    },
    voice: {
      provider: voiceConfig.provider,
      voiceId: voiceConfig.voiceId,
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
    clientMessages: [
      "transcript",
      "conversation-update",
      "function-call",
      "hang",
      "model-output",
      "speech-update",
      "status-update",
      "transfer-update",
      "tool-calls",
      "user-interrupted",
      "voice-input",
      "workflow.node.started",
    ],
    serverMessages: serverUrl ? ["end-of-call-report"] : [],
    ...(serverUrl
      ? {
          serverUrl,
        }
      : {}),
    metadata: {
      companion_id: companion.id ?? null,
      owner_id: companion.owner_id ?? null,
    },
  };
}
