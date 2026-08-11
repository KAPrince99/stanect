"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

import { motionTransition } from "@/lib/motion";

interface AuthStageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthStage({
  title,
  description,
  children,
}: AuthStageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition.soft}
      className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-2"
    >
      <aside className="relative hidden flex-col justify-between border-r border-white/10 bg-black/20 p-10 lg:flex xl:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(232,140,48,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_90%,rgba(30,78,168,0.35),transparent_50%)]"
        />

        <Link
          href="/"
          className="type-brand relative z-10 tracking-tight text-white transition hover:text-white/85"
        >
          Stanect
        </Link>

        <div className="relative z-10 max-w-sm">
          <h1 className="font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-white">
            {title}
          </h1>
          <p className="type-body mt-4 text-[1.05rem] leading-7 text-white/65">
            {description}
          </p>
        </div>

        <p className="type-meta relative z-10 text-white/35">
          AI voice companions for real conversations
        </p>
      </aside>

      <div className="flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 md:px-12">
        <div className="flex w-full max-w-[400px] flex-col items-center">
          <div className="mb-8 flex w-full flex-col items-center lg:hidden">
            <Link href="/" className="type-brand text-white">
              Stanect
            </Link>
            <p className="type-body mt-2 text-center text-white/60">{title}</p>
          </div>

          {children}
        </div>
      </div>
    </motion.div>
  );
}
