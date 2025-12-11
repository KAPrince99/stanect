import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "./button";

interface Props {
  setShowTranscript: (value: boolean) => void;
}

export default function TranscriptToggle({ setShowTranscript }: Props) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          className="p-4 rounded-full bg-amber-700 hover:bg-gray-600 shadow-xl shadow-gray-700/50 border border-gray-600"
          onClick={() => setShowTranscript(true)}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    </>
  );
}
