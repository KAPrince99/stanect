"use client";
import { getSingleAvatar } from "@/app/(app)/actions/actions";
import { useTabFormStore } from "@/store/useTabFormStore";
import { CompanionProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import CompanionCard from "../HomeDashboard/companionCard";
import LoadingSpinner from "../LoadingSpinner";

function Preview() {
  const companionName = useTabFormStore((s) => s.companionName);
  const scene = useTabFormStore((s) => s.scene);
  const voice = useTabFormStore((s) => s.voice);
  const selectedAvatarId = useTabFormStore((s) => s.selectedAvatarId);
  const sessionLength = useTabFormStore((s) => s.sessionLength);

  const {
    data: selectedAvatar,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["avatar", selectedAvatarId ?? "default"],
    queryFn: () => getSingleAvatar(selectedAvatarId ?? undefined),
    staleTime: Infinity,
    gcTime: Infinity,
    placeholderData: (prev) => prev,
  });

  const previewCompanion = useMemo<CompanionProps | null>(() => {
    if (!selectedAvatar) return null;

    return {
      id: "preview",
      avatar_id: selectedAvatar.id,
      avatars: { image_url: selectedAvatar.image_url },
      companion_name: companionName || "Your Companion",
      scene: scene || "Your Scene",
      voice: voice || "female",
      duration: String(sessionLength ?? 1),
      owner_id: "preview",
      country: "",
      username: "You",
      assistant_id: "",
    };
  }, [companionName, scene, voice, sessionLength, selectedAvatar]);

  if (isLoading && !selectedAvatar) return <LoadingSpinner />;
  if (error) return <p className="text-red-300">Unable to load preview.</p>;
  if (!previewCompanion)
    return <p className="text-white/70">No avatar available for preview.</p>;

  return (
    <main className="space-y-8">
      <div className="max-w-[300px] mx-auto">
        <CompanionCard companion={previewCompanion} />
      </div>
    </main>
  );
}
export default memo(Preview);
