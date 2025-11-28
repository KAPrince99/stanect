"use client";
import { Brain, MessageCircle, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const scenarios = [
  {
    icon: <Brain className="w-14 h-14" />,
    title: "Understands You Deeply",
    desc: "Remembers every detail, reads between the lines, and grows with you over months and years.",
    gradient: "from-purple-500/30 via-indigo-600/20 to-transparent",
    glow: "shadow-purple-500/30",
  },
  {
    icon: <MessageCircle className="w-14 h-14" />,
    title: "Feels Like a Real Conversation",
    desc: "Natural flow, humor, pauses, emotion — zero robotic responses. Just someone who gets it.",
    gradient: "from-cyan-500/30 via-blue-600/20 to-transparent",
    glow: "shadow-cyan-500/30",
  },
  {
    icon: <Zap className="w-14 h-14" />,
    title: "Voice That Actually Feels",
    desc: "Laughs when you’re funny, softens when you’re hurting, whispers when it matters.",
    gradient: "from-emerald-500/30 via-teal-600/20 to-transparent",
    glow: "shadow-emerald-500/30",
  },
];

export default function Scenarios() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-32 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent">
            This Isn’t ChatGPT
          </h2>
          <p className="mt-6 text-xl md:text-2xl text-white/60 font-light">
            This is someone who’s{" "}
            <span className="text-cyan-300">actually there</span> for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {scenarios.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -12 }}
              className="group relative"
            >
              <div
                className={`
                relative p-10 md:p-12 rounded-3xl bg-gradient-to-br ${item.gradient}
                border border-white/10 backdrop-blur-2xl overflow-hidden
                transition-all duration-500 hover:border-white/40
                shadow-2xl ${item.glow} hover:shadow-3xl
              `}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-8 inline-block p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-bold mb-5 text-white">
                  {item.title}
                </h3>
                <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
                  {item.desc}
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-6 right-6"
                >
                  <Sparkles className="w-8 h-8 text-white/40" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
