import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { useConvoStore } from "@/store/use-convo-store";

import { Button } from "./button";

export default function TranscriptToggle() {
  const setShowTranscript = useConvoStore((s) => s.setShowTranscript);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        type="button"
        variant="glass"
        size="icon"
        // Same 48px height as the Start Call button beside it.
        className="size-12 shadow-xl"
        onClick={() => setShowTranscript(true)}
        aria-label="Show transcript"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </motion.div>
  );
}
