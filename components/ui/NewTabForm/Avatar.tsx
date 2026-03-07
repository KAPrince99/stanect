"use client";

import { getAvatars } from "@/app/(app)/actions/actions";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";
import AvatarGrid from "./AvatarGrid";
import { useTabFormStore } from "@/store/useTabFormStore";
import TabContentHeader from "./TabContentHeader";

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
      <TabContentHeader title="Choose Your Muse" />

      <AvatarGrid
        avatars={avatars}
        selectedAvatarId={selectedAvatarId}
        handleSelectAvatar={setSelectedAvatarId}
      />
    </div>
  );
}

export default memo(Avatar);
