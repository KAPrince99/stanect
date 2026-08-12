"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRef, memo, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useConvoStore } from "@/store/use-convo-store";

import { Button } from "../button";
import LordIcon from "../lordIcon";

interface TranscriptPanelProps {
  companionName: string;
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
}

export function TranscriptPanel({
  companionName,
  showClose = false,
  onClose,
  className,
}: TranscriptPanelProps) {
  const { messages } = useConvoStore();
  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual is intentional for transcript rendering performance.
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
    overscan: 5,
  });

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <aside
      className={`flex h-full min-h-0 w-full flex-col border-white/10 bg-white/5 backdrop-blur-xl ${className ?? ""}`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-5">
        <h2 className="type-title flex items-center gap-2 text-lg">
          <LordIcon
            src="https://cdn.lordicon.com/zyyejanq.json"
            trigger="loop"
            colors="primary:#e88c30"
            height={30}
            width={30}
          />
          Live Transcript
        </h2>

        {showClose && onClose ? (
          <Button
            className="rounded-full p-2 hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        ) : null}
      </div>

      <div ref={parentRef} className="min-h-0 flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <p className="type-body pt-8 text-center text-white/40">
            Transcript appears when you start talking.
          </p>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const msg = messages[virtualRow.index];
              return (
                <div
                  key={msg.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${
                        msg.role === "user"
                          ? "rounded-br-none border border-amber-400/40 bg-amber-500/20 text-amber-50"
                          : "rounded-tl-none border border-white/10 bg-white/6 text-white/90"
                      }`}
                    >
                      <div className="type-meta mb-1 opacity-80">
                        {msg.role === "user" ? "You" : companionName}
                      </div>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

interface MobileTranscriptProps {
  showTranscript: boolean;
  setShowTranscript: (value: boolean) => void;
  companionName: string;
}

/** Full-screen transcript overlay for small viewports only. */
export function MobileTranscriptOverlay({
  showTranscript,
  setShowTranscript,
  companionName,
}: MobileTranscriptProps) {
  return (
    <AnimatePresence>
      {showTranscript ? (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="absolute inset-0 z-30 h-full w-full lg:hidden"
        >
          <TranscriptPanel
            companionName={companionName}
            showClose
            onClose={() => setShowTranscript(false)}
            className="border-l shadow-2xl"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default memo(TranscriptPanel);
