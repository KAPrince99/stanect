"use client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Demo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-32 px-6 bg-transparent">
      <div className="relative max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent"
        >
          Watch a Real Conversation
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-2xl text-white/70 font-light max-w-4xl mx-auto"
        >
          No scripts. No prompts. Just two people talking — one of them happens
          to be AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-20 relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/10">
            <div className="aspect-[9/19.5] bg-gradient-to-br from-[#1a3a80] to-[#0f1a36] flex items-center justify-center relative">
              {/* Replace with your actual neutral avatar or live preview */}
              <Image
                src="/avatars/avatar_0.jpg"
                alt="Live conversation"
                width={340}
                height={340}
                className="rounded-3xl ring-4 ring-white/20 shadow-2xl"
              />

              {playing && (
                <div className="mt-10 flex justify-center gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [20, 90, 20] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-4 bg-gradient-to-t from-cyan-400 to-purple-400 rounded-full"
                      style={{ height: 20 }}
                    />
                  ))}
                </div>
              )}

              <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-2xl font-light text-white/90">
                {playing
                  ? "“…yeah, I’ve been thinking about that too.”"
                  : "Tap to listen"}
              </p>

              <div className="absolute top-6 left-6 px-5 py-2 bg-red-500/20 backdrop-blur-xl border border-red-400/50 rounded-full flex items-center gap-3">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-ping" />
                <span className="text-red-300 font-bold">LIVE</span>
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-black rounded-b-3xl" />
          </div>

          {!playing && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md"
            >
              <div className="p-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-2xl">
                <Play className="w-24 h-24 text-white fill-white ml-4" />
              </div>
            </motion.button>
          )}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-20 px-12 py-8 rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-2xl font-bold shadow-2xl shadow-purple-600/60"
        >
          Start Talking — Free, Instantly
        </motion.button>
      </div>
    </section>
  );
}
