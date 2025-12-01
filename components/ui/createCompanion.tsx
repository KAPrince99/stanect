"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DesktopAvatarSelection from "./desktopAvatarSelection";
import AvatarForm from "./avatarForm";
import { getAvatars } from "@/app/(app)/actions/actions";
import CreateComponentSkeleton from "./createComponentSkeleton";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateCompanion() {
  const {
    data: avatars,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAvatars,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  // Update URL when avatar changes
  const handleSelectAvatar = (id: string) => {
    setSelectedAvatarId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("avatarId", id);
    router.replace(`?${params.toString()}`);
  };

  // Initialize from URL
  useEffect(() => {
    const id = searchParams.get("avatarId");
    if (id) {
      setSelectedAvatarId(id);
    } else if (avatars && avatars.length > 0) {
      setSelectedAvatarId(avatars[0].id);
      handleSelectAvatar(avatars[0].id);
    }
  }, [searchParams, avatars]);

  if (isLoading) return <CreateComponentSkeleton />;

  if (error || !avatars)
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <p className="text-white/70 text-xl">Failed to load avatars...</p>
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent rounded-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <DesktopAvatarSelection
          avatars={avatars}
          selected={selectedAvatarId}
          onSelect={handleSelectAvatar} // updated handler
        />
        <div className="flex items-center justify-center  md:p-5 lg:p-16">
          <AvatarForm avatars={avatars} selectedAvatarId={selectedAvatarId} />
        </div>
      </div>
    </div>
  );
}
