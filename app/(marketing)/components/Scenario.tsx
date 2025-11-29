"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  HeartHandshake,
  Users,
  Sparkles,
  CloudMoon,
  BrainCircuit,
} from "lucide-react";

const scenarios = [
  {
    title: "Practice Real Conversations",
    description:
      "When talking to people makes your chest tighten… she helps your words flow naturally.",
    icon: MessageCircle,
    gradient: "from-cyan-500/20 to-blue-600/10",
  },
  {
    title: "Express Yourself Better",
    description:
      "Say what you truly feel — she helps you rehearse difficult conversations with people you care about.",
    icon: HeartHandshake,
    gradient: "from-pink-500/20 to-rose-600/10",
  },
  {
    title: "Make Friends with Ease",
    description:
      "If making friends feels impossible, she guides you through small, safe, confidence-building steps.",
    icon: Users,
    gradient: "from-purple-500/20 to-indigo-600/10",
  },
  {
    title: "Prepare for High-Pressure Moments",
    description:
      "Interviews, tough calls, confrontations — practice them with her until you feel ready.",
    icon: Sparkles,
    gradient: "from-amber-500/20 to-orange-600/10",
  },
  {
    title: "Speak Again After Burnout",
    description:
      "On days your mind goes quiet and you don’t know what to say, she listens gently and patiently.",
    icon: CloudMoon,
    gradient: "from-slate-500/20 to-zinc-700/10",
  },
  {
    title: "Learn Healthy Communication",
    description:
      "Build real communication skills — clarity, empathy, emotional awareness — all in a safe space.",
    icon: BrainCircuit,
    gradient: "from-emerald-500/20 to-teal-600/10",
  },
];

export default function Scenarios() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Lightweight Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [-80, 80, -80], y: [-40, 60, -40] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-24 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ x: [60, -60, 60], y: [40, -70, 40] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent">
            Feel the spark. Build unshakable confidence. Zero judgment.
          </h2>
          <p className="mt-8 text-xl md:text-2xl text-white/60 font-light max-w-4xl mx-auto">
            Whether it's social anxiety, emotional burnout, or just feeling lost
            in conversations —{" "}
            <span className="text-cyan-300 font-medium">
              she meets you exactly where you are
            </span>
            .
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, i) => {
            const Icon = scenario.icon;

            return (
              <motion.div
                key={scenario.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="relative group"
              >
                <div
                  className={`
                    p-8 rounded-3xl 
                    bg-gradient-to-br ${scenario.gradient}
                    border border-white/10 backdrop-blur-xl
                    shadow-lg hover:shadow-2xl
                    transition-all duration-300
                  `}
                >
                  {/* Icon — now static for performance */}
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {scenario.title}
                  </h3>

                  <p className="text-lg text-white/70 leading-relaxed">
                    {scenario.description}
                  </p>

                  {/* Static decorative sparkle */}
                  <Sparkles className="w-6 h-6 text-white/30 absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-24"
        >
          <p className="text-2xl italic text-white/50 font-light">
            “For the first time in years, I didn’t feel alone in a
            conversation.”
          </p>
          <p className="mt-4 text-cyan-300 text-lg">— Someone just like you</p>
        </motion.div>
      </div>
    </section>
  );
}
