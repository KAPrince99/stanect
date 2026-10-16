"use client";
import { AvatarProps } from "@/types/types";
import { memo } from "react";
import AvatarCard from "./AvatarCard";
import { AVATAR_PICKER_GRID } from "./avatar-layout";

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
    <div className={AVATAR_PICKER_GRID}>
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
