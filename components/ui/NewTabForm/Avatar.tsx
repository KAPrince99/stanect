"use client";

import { getAvatars } from "@/app/(app)/actions/actions";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";
import AvatarGrid from "./AvatarGrid";
import { useTabFormStore } from "@/store/useTabFormStore";

function Avatar() {
  const selectedAvatarId = useTabFormStore((state) => state.selectedAvatarId);

  const setSelectedAvatarId = useTabFormStore(
    (state) => state.setSelectedAvatarId,
  );

  const {
    data: avatars,
    isLoading: avatarsLoading,
    error,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAvatars,
    staleTime: Infinity,
    gcTime: Infinity,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (!avatars?.length) return;

    const hasValidSelection = selectedAvatarId
      ? avatars.some((avatar) => avatar.id === selectedAvatarId)
      : false;

    if (!hasValidSelection) {
      setSelectedAvatarId(avatars[0].id);
    }
  }, [avatars, selectedAvatarId, setSelectedAvatarId]);

  if (avatarsLoading && !avatars) return <LoadingSpinner />;
  if (error) return <div>Error loading avatars</div>;

  return (
    <div>
      <div className="flex items-center justify-center my-4">
        <h2 className="text-5xl md:text-4xl font-display tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Choose Your Muse
        </h2>
      </div>

      <AvatarGrid
        avatars={avatars}
        selectedAvatarId={selectedAvatarId}
        handleSelectAvatar={setSelectedAvatarId}
      />
    </div>
  );
}

export default memo(Avatar);
