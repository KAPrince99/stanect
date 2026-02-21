"use client";

import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useState } from "react";
import DesktopAvatarSelection from "./desktopAvatarSelection";
import AvatarForm from "./avatarForm";
import { getAvatars } from "@/app/(app)/actions/actions";
import { fetchSubscriptionStatus } from "@/app/(app)/actions/subs"; // Added this
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Added this
import LoadingSpinner from "./LoadingSpinner";

function CreateCompanion() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch Avatars
  const {
    data: avatars,
    isLoading: avatarsLoading,
    error,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAvatars,
    staleTime: Infinity,
  });

  // Fetch User Subscription Plan
  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ["userPlan", user?.id],
    queryFn: () => fetchSubscriptionStatus(user?.id || ""),
    enabled: !!user?.id,
    staleTime: Infinity,
  });

  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(
    () => searchParams.get("avatarId") || null,
  );

  const handleSelectAvatar = useCallback(
    (id: string) => {
      setSelectedAvatarId(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("avatarId", id);
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (selectedAvatarId) return;
    if (avatars && avatars.length > 0) {
      const firstId = avatars[0].id;
      setSelectedAvatarId(firstId);
      handleSelectAvatar(firstId);
    }
  }, [avatars, selectedAvatarId, handleSelectAvatar]);

  if (avatarsLoading || subLoading) return <LoadingSpinner />;

  if (error || !avatars)
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <p className="text-white/70 text-xl">Failed to load avatars...</p>
      </div>
    );

  // Extract the plan safely, default to free
  const currentPlan = (subData?.plan as "free" | "pro" | "king") || "free";

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent rounded-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <DesktopAvatarSelection
          avatars={avatars}
          selected={selectedAvatarId}
          onSelect={handleSelectAvatar}
        />
        <div className="flex items-center justify-center md:p-5 lg:p-16">
          <AvatarForm
            avatars={avatars}
            selectedAvatarId={selectedAvatarId}
            userPlan={currentPlan}
          />
        </div>
      </div>
    </div>
  );
}
export default memo(CreateCompanion);
