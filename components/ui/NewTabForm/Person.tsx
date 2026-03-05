"use client";

import React, { memo, useCallback, useState } from "react";
import LordIcon from "../lordIcon";
import InputField from "./InputField";
import { useTabFormStore } from "@/store/useTabFormStore";
import { companionNameSchema, sceneSchema } from "@/schemas/newCompanionSchema";

function Person() {
  const companionName = useTabFormStore((s) => s.companionName);
  const scene = useTabFormStore((s) => s.scene);

  const setCompanionName = useTabFormStore((s) => s.setCompanionName);
  const setScene = useTabFormStore((s) => s.setScene);

  const [errors, setErrors] = useState<{
    companionName?: string;
    scene?: string;
  }>({});

  const validateCompanionName = useCallback((value: string) => {
    const result = companionNameSchema.safeParse(value);

    setErrors((prev) => ({
      ...prev,
      companionName: result.success
        ? undefined
        : result.error.issues[0]?.message,
    }));
  }, []);

  const validateScene = useCallback((value: string) => {
    const result = sceneSchema.safeParse(value);

    setErrors((prev) => ({
      ...prev,
      scene: result.success ? undefined : result.error.issues[0]?.message,
    }));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center my-4">
        <h2 className="text-5xl md:text-4xl font-display tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Create Your Character
        </h2>
      </div>

      <div className="max-w-2xl mx-auto px-8 my-10 space-y-6">
        <InputField
          label="Companion Name"
          value={companionName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setCompanionName(value);
            validateCompanionName(value);
          }}
          onBlur={() => validateCompanionName(companionName)}
          placeholder="Sophia • Alex • Mia..."
          className="h-14 text-lg"
          error={errors.companionName}
          icon={
            <LordIcon
              src="https://cdn.lordicon.com/hhljfoaj.json"
              trigger="hover"
              colors="primary:#e88c30,secondary:#e88c30,tertiary:#e88c30"
              height={25}
              width={25}
            />
          }
        />

        <InputField
          label="Meeting Scene"
          value={scene}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setScene(value);
            validateScene(value);
          }}
          onBlur={() => validateScene(scene)}
          placeholder="Gym • Coffee Shop • Bookstore..."
          className="h-14 placeholder:text-md text-lg"
          error={errors.scene}
          icon={
            <LordIcon
              src="https://cdn.lordicon.com/dhmavvpz.json"
              trigger="hover"
              colors="primary:#e88c30,secondary:#e88c30"
              height={25}
              width={25}
            />
          }
        />
      </div>
    </div>
  );
}

export default memo(Person);
