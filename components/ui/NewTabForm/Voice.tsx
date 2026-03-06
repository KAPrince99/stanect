import React, { memo, useCallback, useMemo, useState } from "react";
import LordIcon from "../lordIcon";
import InputField from "./InputField";
import { useTabFormStore } from "@/store/useTabFormStore";
import { Crown, ShieldCheck } from "lucide-react";

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
      <div className="flex items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-display tracking-tight text-center bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Voice and Session Length
        </h2>
      </div>
      <div className="my-10">
        <div className="flex justify-start items-center gap-2 mb-4">
          <LordIcon
            src="https://cdn.lordicon.com/ckooqaow.json"
            trigger="hover"
            colors="primary:#e88c30,secondary:#e88c30,tertiary:#e88c30,quaternary:#ebe6ef,quinary:#f24c00"
            height={25}
            width={25}
          />
          <p className="text-white/90 text-lg font-medium">Voice</p>
        </div>
        <section className="my-5 flex items-center gap-4 bg-white/10 p-2 rounded-xl">
          <div
            className={`flex-1 py-3 text-center rounded-lg cursor-pointer font-medium ${
              voice === "male" ? "bg-white/10" : ""
            }`}
            onClick={() => setVoice("male")}
          >
            Male
          </div>
          <div
            className={`flex-1 py-3 text-center rounded-lg cursor-pointer font-medium ${
              voice === "female" ? "bg-white/10" : ""
            }`}
            onClick={() => setVoice("female")}
          >
            Female
          </div>
        </section>
      </div>

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
          className="h-14 text-lg"
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
        <div className="flex items-center gap-2 px-1 mt-2">
          {userPlan === "free" ? (
            <ShieldCheck className="w-3 h-3 text-amber-500" />
          ) : (
            <Crown className="w-3 h-3 text-emerald-400 animate-pulse" />
          )}
          <p
            className={`text-[10px] uppercase tracking-widest font-bold ${userPlan === "free" ? "text-white/50" : "text-emerald-400"}`}
          >
            {userPlan.toUpperCase()} Plan: Max {maxMinutes} Mins
          </p>
        </div>
      </section>
    </div>
  );
}

export default memo(Voice);
