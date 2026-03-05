import React, { memo, useCallback, useState } from "react";
import LordIcon from "../lordIcon";
import InputField from "./InputField";
import { useTabFormStore } from "@/store/useTabFormStore";
import { sessionLengthSchema } from "@/schemas/newCompanionSchema";

function Voice() {
  const voice = useTabFormStore((s) => s.voice);
  const setVoice = useTabFormStore((s) => s.setVoice);

  const sessionLength = useTabFormStore((s) => s.sessionLength);
  const setSessionLength = useTabFormStore((s) => s.setSessionLength);
  const [sessionLengthError, setSessionLengthError] = useState<string>();

  const validateSessionLength = useCallback((value: number | null) => {
    if (value === null) {
      setSessionLengthError("Session length is required");
      return;
    }

    const result = sessionLengthSchema.safeParse(value);
    setSessionLengthError(
      result.success ? undefined : result.error.issues[0]?.message,
    );
  }, []);

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
        <h2 className="text-5xl md:text-4xl font-display tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Choose Your Preferred Voice
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
          <p className="font-inter">Voice</p>
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
          max={120}
          value={sessionLength ?? ""}
          onChange={handleSessionLengthChange}
          onBlur={() => validateSessionLength(sessionLength)}
          placeholder="Enter session length..."
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
      </section>
    </div>
  );
}

export default memo(Voice);
