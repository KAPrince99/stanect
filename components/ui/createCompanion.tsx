"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import DesktopAvatarSelection from "./desktopAvatarSelection";
import AvatarForm from "./avatarForm";
import { getAvatars } from "@/app/(app)/actions/actions";
import CreateComponentSkeleton from "./createComponentSkeleton";
import { Sparkles } from "lucide-react";

export default function CreateCompanion() {
  const {
    data: avatars,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAvatars,
  });

  if (isLoading) return <CreateComponentSkeleton />;
  if (error || !avatars) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] flex items-center justify-center">
        <div className="text-white/70 text-xl">Failed to load avatars...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8] overflow-hidden rounded-xl">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="absolute top-20 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
          }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="absolute bottom-10 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT: Avatar Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative hidden lg:flex items-center justify-center p-10"
        >
          <div className="max-w-5xl w-full">
            <DesktopAvatarSelection avatars={avatars} />
          </div>
        </motion.div>

        {/* RIGHT: Form */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex items-center justify-center p-6 md:p-10 lg:p-16"
        >
          <div className="w-full max-w-2xl">
            <AvatarForm avatars={avatars} />
          </div>
        </motion.div>
      </div>

      {/* Mobile Avatar Picker (bottom sheet trigger) */}
      <AnimatePresence>
        {!avatars?.find(
          (a) =>
            a.id === new URLSearchParams(window.location.search).get("avatarId")
        ) && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 lg:hidden"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document.getElementById("mobile-avatar-drawer")?.showModal?.()
              }
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold px-10 py-5 rounded-full shadow-2xl flex items-center gap-3 text-lg"
            >
              <Sparkles className="w-6 h-6" />
              Choose Your Companion
              <Sparkles className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Divider Line (desktop only) */}
      <div className="hidden lg:block fixed left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />
    </div>
  );
}
