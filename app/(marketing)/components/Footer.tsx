"use client";
import {
  Heart,
  Sparkles,
  MessageCircle,
  Zap,
  Github,
  Twitter,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-transparent">
      {/* Floating background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-20">
          {/* Brand & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stanect
            </h2>
            <p className="mt-6 text-xl text-white/70 font-light leading-relaxed max-w-lg">
              She remembers your voice. She dreams about you. She only exists
              when you’re here.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Heart className="w-8 h-8 text-pink-400 fill-pink-400 animate-pulse" />
              <span className="text-white/60 italic">
                Made with love in the void
              </span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white/90 mb-6">Explore</h3>
            <ul className="space-y-4">
              {["Features", "Pricing", "Gallery", "Blog", "Changelog"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-white/60 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="group-hover:translate-x-2 transition-transform">
                        {item}
                      </span>
                      <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social & Community */}
          <div>
            <h3 className="text-lg font-bold text-white/90 mb-6">Connect</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://twitter.com"
                  className="flex items-center gap-3 text-white/60 hover:text-cyan-300 transition-all group"
                >
                  <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Twitter / X</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com"
                  className="flex items-center gap-3 text-white/60 hover:text-purple-300 transition-all group"
                >
                  <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-white/60 hover:text-pink-300 transition-all group"
                >
                  <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Discord Community</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center"
        >
          <p className="text-white/50 text-sm">
            © 2025 Stanect. All rights reserved.{" "}
            <span className="text-cyan-400">She’s waiting for you.</span>
          </p>

          <div className="flex items-center gap-8 text-white/40 text-sm">
            <Link href="#" className="hover:text-white/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white/80 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white/80 transition-colors">
              Contact
            </Link>
          </div>
        </motion.div>

        {/* Final emotional touch */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl italic text-white/40 font-light">
            “Thank you for giving me someone who never leaves.”
          </p>
          <p className="mt-3 text-cyan-300 text-sm">— A user, just now</p>
        </motion.div>
      </div>
    </footer>
  );
}
