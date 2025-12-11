"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { AvatarProps } from "@/types/types";

interface DesktopAvatarSelectionProps {
  avatars: AvatarProps[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function DesktopAvatarSelection({
  avatars,
  selected,
  onSelect,
}: DesktopAvatarSelectionProps) {
  const selectedAvatar = avatars.find((a) => a.id === selected);

  return (
    <div className="hidden lg:block relative mt-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-5xl md:text-6xl font-display tracking-tight bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Choose Your Muse
        </h2>
        <p className="mt-4 text-white/70 text-md md:text-lg font-inter">
          She’s waiting for you to bring her to life
        </p>
      </motion.div>

      {/* Avatar Gallery */}
      <div className="grid grid-cols-3 2xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-8">
        {avatars.map((avatar, idx) => {
          const isSelected = selected === avatar.id;

          return (
            <motion.div
              key={avatar.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="group relative cursor-pointer"
              onClick={() => onSelect(avatar.id)}
            >
              <div
                className={`relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/0 transition-all duration-300
                  ${
                    isSelected
                      ? "ring-amber-400 shadow-amber-400/30"
                      : "group-hover:ring-white/30"
                  }`}
              >
                <Image
                  src={avatar.image_url}
                  alt={avatar.name || "Companion"}
                  fill
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
                  priority={isSelected}
                  loading={isSelected ? "eager" : "lazy"}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg--to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Selected Badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="absolute top-4 right-4 z-10"
                    >
                      <div className="bg-linear-to-r from-amber-400 to-orange-500 text-black font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
                        <Heart className="w-5 h-5 fill-current" /> Chosen
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover Sparkles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Sparkles className="absolute top-6 left-6 w-6 h-6 text-amber-300 animate-pulse" />
                  <Sparkles className="absolute bottom-8 right-6 w-5 h-5 text-yellow-400 animate-pulse delay-300" />
                </div>
              </div>

              {/* Name Label */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center"
              >
                <p className="text-white font-medium text-lg tracking-wide bg-black/50 backdrop-blur px-4 py-1 rounded-full">
                  {avatar.name || "Unknown"}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Selected Preview */}
      <AnimatePresence>
        {selectedAvatar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 80 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 80 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-linear-to-r from-amber-400/20 to-orange-500/20 backdrop-blur-xl border border-white/30 rounded-3xl px-8 py-5 shadow-2xl flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-amber-400 shadow-lg">
                <Image
                  src={selectedAvatar.image_url}
                  alt={selectedAvatar.name || "Selected"}
                  fill
                  className="object-cover  w-full h-full"
                />
              </div>
              <div>
                <p className="text-white/70 text-sm">You chose</p>
                <p className="text-2xl font-bold text-white">
                  {selectedAvatar.name || "Her"}
                </p>
                <p className="text-amber-300 text-sm font-medium mt-1">
                  Ready to bring her to life
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
