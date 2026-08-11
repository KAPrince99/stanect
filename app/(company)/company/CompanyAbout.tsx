"use client";

import { MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { motionTransition } from "@/lib/motion";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...motionTransition.soft, delay: i * 0.08 },
  }),
};

export default function CompanyAbout() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      {/* Atmosphere — still black, not flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(232,140,48,0.12),transparent_55%),radial-gradient(ellipse_70%_50%_at_10%_90%,rgba(30,78,168,0.18),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.35)_100%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-6 py-7 sm:px-10 lg:px-14">
        <motion.header
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <Link href="/" className="type-brand tracking-tight text-white">
            Stanect
          </Link>
          <Link
            href="/"
            className="type-meta text-white/45 transition hover:text-white"
          >
            Back to home
          </Link>
        </motion.header>

        <section className="grid flex-1 grid-cols-1 items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-10">
          <div className="max-w-xl">
            <motion.p
              custom={1}
              variants={fade}
              initial="hidden"
              animate="visible"
              className="type-meta mb-6 uppercase tracking-[0.2em] text-[#e88c30]/90"
            >
              Solo-built product
            </motion.p>

            <motion.h1
              custom={2}
              variants={fade}
              initial="hidden"
              animate="visible"
              className="font-display text-[clamp(2.75rem,7vw,5rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-white"
            >
              Small project.
              <br />
              <span className="text-white/40">Big vision.</span>
            </motion.h1>

            <motion.p
              custom={3}
              variants={fade}
              initial="hidden"
              animate="visible"
              className="type-body mt-8 max-w-md text-[1.05rem] leading-8 text-white/65"
            >
              Stanect helps people practice real conversations with AI voice
              companions — built end-to-end by one engineer, from idea to live
              calls.
            </motion.p>

            <motion.div
              custom={4}
              variants={fade}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/"
                className="type-cta inline-flex h-12 items-center gap-2 bg-[#e88c30] px-7 text-black transition hover:bg-[#f0a45a]"
              >
                Try Stanect
                <MoveRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/KAPrince99/stanect"
                target="_blank"
                rel="noopener noreferrer"
                className="type-cta inline-flex h-12 items-center gap-2 border border-white/20 px-7 text-white/80 transition hover:border-white/40 hover:text-white"
              >
                GitHub
              </Link>
            </motion.div>

            <motion.div
              custom={5}
              variants={fade}
              initial="hidden"
              animate="visible"
              className="mt-14 flex items-center gap-6 border-t border-white/10 pt-6"
            >
              <div>
                <p className="type-meta uppercase tracking-wider text-white/35">
                  Founder
                </p>
                <p className="type-label mt-1 text-white">
                  Prince Amanor Kabutey
                </p>
              </div>
              <div className="h-8 w-px bg-white/15" aria-hidden />
              <div>
                <p className="type-meta uppercase tracking-wider text-white/35">
                  Role
                </p>
                <p className="type-label mt-1 text-white/80">
                  Software Engineer
                </p>
              </div>
            </motion.div>
          </div>

          <motion.aside
            custom={2}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="w-full justify-self-center lg:justify-self-end"
          >
            <div className="relative mx-auto aspect-square w-full max-w-[min(100%,32rem)] overflow-hidden bg-zinc-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
              <Image
                src="/founder_photo.jpg"
                alt="Prince Amanor Kabutey, founder of Stanect"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 512px"
                className="object-cover object-center"
              />
            </div>
            <p className="type-meta mt-4 text-center text-white/40 lg:text-left">
              Accra · Building Stanect in public
            </p>
          </motion.aside>
        </section>
      </div>
    </div>
  );
}
