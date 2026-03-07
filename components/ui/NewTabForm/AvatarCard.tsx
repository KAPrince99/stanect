"use client";
import { AvatarProps } from "@/types/types";
import Image from "next/image";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { motionTransition } from "@/lib/motion";

interface AvatarCardProps {
  avatar: AvatarProps;
  isSelected: boolean;
  handleSelectAvatar: (id: string) => void;
  index: number;
}

function AvatarCard({
  avatar,
  isSelected,
  handleSelectAvatar,
  index,
}: AvatarCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={motionTransition.soft}
      className="group relative aspect-square rounded-3xl overflow-hidden shadow-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
      onClick={() => handleSelectAvatar(avatar.id)}
    >
      <Image
        src={avatar.image_url}
        alt={avatar.name || "Companion"}
        fill
        priority={index === 0}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
      />

      <div className="absolute inset-0 rounded-3xl border border-white/20" />

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          isSelected ? "opacity-70" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      {isSelected && (
        <motion.div
          layoutId="avatar-selected-ring"
          transition={motionTransition.smooth}
          className="absolute inset-0 rounded-3xl border-4 border-amber-500 shadow-[0_0_0_2px_rgba(249,115,22,0.45)] z-10"
        />
      )}
    </motion.button>
  );
}

export default memo(AvatarCard);
