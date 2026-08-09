"use client";

import { getAvatars } from "@/app/(app)/actions/actions";
import { useTabFormStore } from "@/store/useTabFormStore";
import type { AvatarProps } from "@/types/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useEffect } from "react";

import LoadingSpinner from "../LoadingSpinner";
import AvatarGrid from "./AvatarGrid";
import TabContentHeader from "./TabContentHeader";

function seedAvatarQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  avatars: AvatarProps[],
) {
  if (!avatars.length) return;

  for (const avatar of avatars) {
    queryClient.setQueryData(["avatar", avatar.id], avatar);
  }

  queryClient.setQueryData(["avatar", "default"], avatars[0]);
}

function Avatar() {
  const queryClient = useQueryClient();
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

    seedAvatarQueries(queryClient, avatars);

    const hasValidSelection = selectedAvatarId
      ? avatars.some((avatar) => avatar.id === selectedAvatarId)
      : false;

    if (!hasValidSelection) {
      setSelectedAvatarId(avatars[0].id);
    }
  }, [avatars, queryClient, selectedAvatarId, setSelectedAvatarId]);

  useEffect(() => {
    if (!selectedAvatarId || !avatars?.length) return;

    const selected = avatars.find((avatar) => avatar.id === selectedAvatarId);
    if (selected) {
      queryClient.setQueryData(["avatar", selectedAvatarId], selected);
    }
  }, [avatars, queryClient, selectedAvatarId]);

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
