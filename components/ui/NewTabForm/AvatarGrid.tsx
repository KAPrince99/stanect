"use client";
import { AvatarProps } from "@/types/types";
import { memo } from "react";
import AvatarCard from "./AvatarCard";
import { sl } from "zod/v4/locales";

interface AvatarGridProps {
  avatars: AvatarProps[] | undefined;
  selectedAvatarId: string | null;
  handleSelectAvatar: (id: string) => void;
}

function AvatarGrid({
  avatars,
  selectedAvatarId,
  handleSelectAvatar,
}: AvatarGridProps) {
  return (
    <div className="grid grid-cols-3 2xl:grid-cols-4 gap-6 max-w-4xl mx-auto px-8">
      {avatars?.map((avatar, index) => {
        return (
          <AvatarCard
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedAvatarId === avatar.id}
            handleSelectAvatar={handleSelectAvatar}
            index={index}
          />
        );
      })}
    </div>
  );
}

export default memo(AvatarGrid);
