import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React, { useRef, memo, useEffect } from "react";
import { Button } from "./button";
import LordIcon from "./lordIcon";
import { useConvoStore } from "@/store/use-convo-store";
import { useVirtualizer } from "@tanstack/react-virtual";

interface Props {
  showTranscript: boolean;
  setShowTranscript: (value: boolean) => void;
  isDesktop: boolean;
  companionName: string;
}

function TranscriptBlock({
  showTranscript,
  setShowTranscript,
  isDesktop,
  companionName,
}: Props) {
  const { messages } = useConvoStore();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
    overscan: 5,
  });

  // Scroll to bottom on new message
  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {(showTranscript || isDesktop) && (
        <motion.div
          initial={isDesktop ? false : { opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="w-full h-full lg:w-[300px] xl:w-sm flex flex-col backdrop-blur-lg border-l border-gray-700 shadow-2xl lg:shadow-none"
        >
          <div className="p-5 border flex items-center justify-between shrink-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <LordIcon
                src="https://cdn.lordicon.com/zyyejanq.json"
                trigger="loop"
                colors="primary:#e88c30"
                height={30}
                width={30}
              />
              Live Transcript
            </h2>

            {!isDesktop && (
              <Button
                className="p-2 rounded-full hover:bg-white/10"
                onClick={() => setShowTranscript(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div ref={parentRef} className="flex-1 overflow-y-auto p-6">
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
                        className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-md ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-gray-700 text-gray-100 rounded-tl-none"
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1 opacity-70">
                          {msg.role === "user" ? "You" : companionName}
                        </div>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(TranscriptBlock);
