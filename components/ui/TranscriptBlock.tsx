"use client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import React from "react";
import { Button } from "./button";

type Message = {
  role: "assistant" | "user";
  content: string;
};

interface Props {
  showTranscript: boolean;
  setShowTranscript: (value: boolean) => void;
  isDesktop: boolean;
  transcriptRef: React.RefObject<HTMLDivElement | null>;
  messages: Message[];
  companionName: string;
}

export default function TranscriptBlock({
  showTranscript,
  setShowTranscript,
  isDesktop,
  transcriptRef,
  messages,
  companionName,
}: Props) {
  return (
    <AnimatePresence>
      {(showTranscript || isDesktop) && (
        <motion.div
          initial={isDesktop ? false : { opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3 }}
          className="w-full h-full overflow-y-auto lg:w-[300px] xl:w-sm flex flex-col backdrop-blur-lg border-l border-gray-700 shadow-2xl lg:shadow-none"
        >
          <div className="p-5 border-b border-gray-700 flex items-center justify-between shrink-0 bg-linear-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" /> Live Transcript
            </h2>
            {!isDesktop && (
              <Button
                className="p-2 rounded-full hover:text-white bg-transparent hover:bg-white/10"
                onClick={() => setShowTranscript(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse"
          >
            {messages.length === 0 ? (
              <div className="text-center text-stone-300 p-10 mt-auto">
                <p className="font-medium text-lg">
                  Your conversation will appear here.
                </p>
                <p className="text-sm mt-1">Ready to talk when you are.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-md transition-all duration-300 ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none font-medium"
                        : "bg-gray-700 text-gray-100 rounded-tl-none font-normal"
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 opacity-70">
                      {msg.role === "user" ? "You" : companionName}
                    </div>
                    {msg.content}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
