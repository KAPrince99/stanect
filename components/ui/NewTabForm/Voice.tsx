import React, { memo, useCallback, useMemo, useState } from "react";
import LordIcon from "../lordIcon";
import InputField from "./InputField";
import { useTabFormStore } from "@/store/useTabFormStore";
import TabContentHeader from "./TabContentHeader";
import VoiceSelector from "./VoiceSelector";
import PlanLimitHint from "./PlanLimitHint";

function Voice() {
  const voice = useTabFormStore((s) => s.voice);
  const setVoice = useTabFormStore((s) => s.setVoice);

  const sessionLength = useTabFormStore((s) => s.sessionLength);
  const setSessionLength = useTabFormStore((s) => s.setSessionLength);
  const userPlan = useTabFormStore((s) => s.userPlan);
  const [sessionLengthError, setSessionLengthError] = useState<string>();

  const maxMinutes = useMemo(() => {
    if (userPlan === "king") return 60;
    if (userPlan === "pro") return 15;
    return 2;
  }, [userPlan]);

  const validateSessionLength = useCallback(
    (value: number | null) => {
      if (value === null) {
        setSessionLengthError("Session length is required");
        return;
      }

      if (!Number.isInteger(value)) {
        setSessionLengthError("Please enter a whole number");
        return;
      }

      if (value < 1) {
        setSessionLengthError("Min 1 minute");
        return;
      }

      if (value > maxMinutes) {
        setSessionLengthError(
          `Your ${userPlan} plan limit is ${maxMinutes} mins`,
        );
        return;
      }

      setSessionLengthError(undefined);
    },
    [maxMinutes, userPlan],
  );

  const handleSessionLengthChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value.trim();
      if (!raw) {
        setSessionLength(null);
        validateSessionLength(null);
        return;
      }

      const parsed = Number(raw);
      const nextValue = Number.isFinite(parsed) ? parsed : null;
      setSessionLength(nextValue);
      validateSessionLength(nextValue);
    },
    [setSessionLength, validateSessionLength],
  );

  return (
    <div className="max-w-2xl mx-auto px-8 ">
      <TabContentHeader title="Voice and Session Length" className="my-0" />
      <VoiceSelector voice={voice} onSelectVoice={setVoice} />

      <section className="my-10">
        <InputField
          label="Session Length (minutes)"
          type="number"
          min={1}
          max={maxMinutes}
          value={sessionLength ?? ""}
          onChange={handleSessionLengthChange}
          onBlur={() => validateSessionLength(sessionLength)}
          placeholder={`1 - ${maxMinutes}`}
          className="h-12 text-base"
          error={sessionLengthError}
          icon={
            <LordIcon
              src="https://cdn.lordicon.com/zjuyeglr.json"
              trigger="hover"
              colors="primary:#e88c30,secondary:#e88c30"
              height={25}
              width={25}
            />
          }
        />
        <PlanLimitHint userPlan={userPlan} maxMinutes={maxMinutes} />
      </section>
    </div>
  );
}

export default memo(Voice);
