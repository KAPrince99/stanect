"use client";

import React, { memo, useCallback, useMemo, useState } from "react";

import { PLAN_LIMITS, type PlanType } from "@/lib/plan-limits";
import LordIcon from "../lordIcon";
import InputField from "./InputField";
import { useTabFormStore } from "@/store/useTabFormStore";
import TabContentHeader from "./TabContentHeader";
import VoiceSelector from "./VoiceSelector";
import PlanLimitHint from "./PlanLimitHint";
import { DASHBOARD_SEARCH_HEIGHT } from "../HomeDashboard/dashboard-layout";
import { lordColors } from "@/lib/brand";

function getMaxMinutes(plan: string) {
  const key = (plan === "pro" || plan === "king" ? plan : "free") as PlanType;
  return Math.floor(PLAN_LIMITS[key].sessionLimit / 60);
}

function Voice() {
  const voice = useTabFormStore((s) => s.voice);
  const setVoice = useTabFormStore((s) => s.setVoice);
  const sessionLength = useTabFormStore((s) => s.sessionLength);
  const setSessionLength = useTabFormStore((s) => s.setSessionLength);
  const userPlan = useTabFormStore((s) => s.userPlan);
  const [sessionLengthError, setSessionLengthError] = useState<string>();

  const maxMinutes = useMemo(() => getMaxMinutes(userPlan), [userPlan]);

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
    <div className="mx-auto max-w-2xl">
      <TabContentHeader title="Voice and Session Length" className="my-0" />
      <VoiceSelector voice={voice} onSelectVoice={setVoice} />

      <section className="my-6 sm:my-10">
        <InputField
          label="Session Length (minutes)"
          type="number"
          min={1}
          max={maxMinutes}
          value={sessionLength ?? ""}
          onChange={handleSessionLengthChange}
          onBlur={() => validateSessionLength(sessionLength)}
          placeholder={`1 - ${maxMinutes}`}
          className={`${DASHBOARD_SEARCH_HEIGHT} text-base`}
          error={sessionLengthError}
          icon={
            <LordIcon
              src="https://cdn.lordicon.com/zjuyeglr.json"
              trigger="hover"
              colors={lordColors({ primary: "accent", secondary: "accent" })}
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
