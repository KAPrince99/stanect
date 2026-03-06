'use client";';
import { AvatarProps } from "@/types/types";
import Image from "next/image";
import React, { memo } from "react";

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
    <div
      key={avatar.id}
      className={`group relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 transition-all duration-300 cursor-pointer ${
        isSelected ? "ring-amber-600" : "ring-white/30"
      }`}
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export default memo(AvatarCard);
