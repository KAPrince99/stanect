"use client";

import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import LordIcon from "../lordIcon";
import { motionTransition } from "@/lib/motion";
import { lordColors } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { DASHBOARD_SEARCH_HEIGHT } from "../HomeDashboard/dashboard-layout";

interface VoiceSelectorProps {
  voice: "male" | "female" | null;
  onSelectVoice: (voice: "male" | "female") => void;
}

function VoiceSelector({ voice, onSelectVoice }: VoiceSelectorProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="my-10">
      <div className="flex justify-start items-center gap-2 mb-4">
        <LordIcon
          src="https://cdn.lordicon.com/ckooqaow.json"
          trigger="hover"
          colors={lordColors({ primary: "accent", secondary: "accent", tertiary: "accent", quaternary: "cream", quinary: "flame" })}
          height={25}
          width={25}
        />
        <p className="type-label">Voice</p>
      </div>

      <section
        role="group"
        aria-label="Voice"
        onFocus={() => setIsFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsFocused(false);
          }
        }}
        className={cn(
          "my-5 flex items-stretch gap-4 rounded-xl border border-white/20 bg-white/10 p-1.5",
          DASHBOARD_SEARCH_HEIGHT,
          isFocused && "animate-search-border",
        )}
      >
        {(["male", "female"] as const).map((value) => {
          const isActive = voice === value;

          return (
            <motion.button
              key={value}
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={motionTransition.soft}
              className={`type-label relative flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg py-0 text-center capitalize focus-visible:outline-none focus-visible:ring-0 ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              }`}
              onClick={() => onSelectVoice(value)}
            >
              {isActive && (
                <motion.span
                  layoutId="voice-active-pill"
                  transition={motionTransition.smooth}
                  className="absolute inset-0 rounded-lg border border-white/20 bg-white/12"
                />
              )}

              <span className="relative z-10">{value}</span>
            </motion.button>
          );
        })}
      </section>
    </div>
  );
}

export default memo(VoiceSelector);
