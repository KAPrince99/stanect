"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { motion } from "framer-motion";
import { Loader2, MoveRight, Sparkles } from "lucide-react";
import LordIcon from "../lordIcon";
import { Button } from "../button";
import { motionTransition, motionVariants } from "@/lib/motion";

export default function Fresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStartSetup = () => {
    startTransition(() => {
      router.push("/new");
    });
  };

  return (
    <motion.div
      variants={motionVariants.fadeUp}
      initial="hidden"
      animate="visible"
      transition={motionTransition.soft}
      className="flex flex-col items-center justify-center py-1 lg:-ml-35"
    >
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 md:px-10 md:py-12 text-center shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-1.5 text-xs tracking-wide uppercase text-amber-300 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          New Companion Setup
        </div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
          className="mb-4"
        >
          <LordIcon
            src="https://cdn.lordicon.com/opeotjej.json"
            trigger="loop"
            colors="primary:#e88c30,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30"
            height={120}
            width={120}
          />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-display tracking-tight bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Create your first companion
        </h2>

        <p className="mt-4 text-white/70 text-base md:text-lg max-w-xl mx-auto">
          Build a personalized AI companion with your preferred voice, scene,
          and style in a guided setup.
        </p>

        <div className="mt-8">
          <Button
            type="button"
            size="lg"
            className="h-12 px-8 md:px-10 text-sm md:text-base font-bold bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black shadow-2xl shadow-amber-500/40 cursor-pointer"
            onClick={handleStartSetup}
            disabled={isPending}
          >
            Start Companion Setup
            {isPending ? (
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            ) : (
              <MoveRight className="w-5 h-5 ml-2" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
