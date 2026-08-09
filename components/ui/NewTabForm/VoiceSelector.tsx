import React, { memo } from "react";
import { motion } from "framer-motion";
import LordIcon from "../lordIcon";
import { motionTransition } from "@/lib/motion";

interface VoiceSelectorProps {
  voice: "male" | "female" | null;
  onSelectVoice: (voice: "male" | "female") => void;
}

function VoiceSelector({ voice, onSelectVoice }: VoiceSelectorProps) {
  return (
    <div className="my-10">
      <div className="flex justify-start items-center gap-2 mb-4">
        <LordIcon
          src="https://cdn.lordicon.com/ckooqaow.json"
          trigger="hover"
          colors="primary:#e88c30,secondary:#e88c30,tertiary:#e88c30,quaternary:#ebe6ef,quinary:#f24c00"
          height={25}
          width={25}
        />
        <p className="type-label">Voice</p>
      </div>

      <section className="my-5 flex items-center gap-4 bg-white/10 p-2 rounded-xl">
        {(["male", "female"] as const).map((value) => {
          const isActive = voice === value;

          return (
            <motion.button
              key={value}
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={motionTransition.soft}
              className={`type-label relative flex-1 cursor-pointer rounded-lg py-3 text-center capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 ${
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
