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
        className="rounded-full border border-gray-600 bg-amber-700 p-4 shadow-xl shadow-gray-700/50 hover:bg-gray-600"
        onClick={() => setShowTranscript(true)}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </motion.div>
  );
}
