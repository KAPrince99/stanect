"use client";

import { createCompanion, getSingleAvatar } from "@/app/(app)/actions/actions";
import { companionSchema } from "@/schemas/newCompanionSchema";
import { useTabFormStore } from "@/store/useTabFormStore";
import { CompanionProps, CreateCompanionProps } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { memo, useMemo } from "react";
import { toast } from "sonner";

import LoadingSpinner from "../LoadingSpinner";
import PreviewView from "./PreviewView";

interface PreviewProps {
  onEditStep?: (index: number) => void;
}

function Preview({ onEditStep }: PreviewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    companionName,
    scene,
    voice,
    selectedAvatarId,
    sessionLength,
    reset,
  } = useTabFormStore();

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
    initialData: () =>
      selectedAvatarId
        ? queryClient.getQueryData(["avatar", selectedAvatarId])
        : queryClient.getQueryData(["avatar", "default"]),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(
        selectedAvatarId ? ["avatar", selectedAvatarId] : ["avatar", "default"],
      )?.dataUpdatedAt,
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

  const validationIssues = useMemo(() => {
    const result = companionSchema.safeParse({
      avatarId: selectedAvatar?.id ?? selectedAvatarId ?? "",
      companionName,
      scene,
      voice,
      sessionLength,
    });

    if (result.success) return [] as string[];
    return result.error.issues.map((issue) => issue.message);
  }, [
    companionName,
    scene,
    voice,
    sessionLength,
    selectedAvatar,
    selectedAvatarId,
  ]);

  const mutation = useMutation({
    mutationFn: (payload: CreateCompanionProps) => createCompanion(payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["companions"] });
      queryClient.invalidateQueries({ queryKey: ["createCompanionGate"] });
      toast.success("Companion created successfully");
      const createdCompanionId = result?.data?.id;
      reset();
      router.replace(
        createdCompanionId ? `/dashboard/${createdCompanionId}` : "/dashboard",
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create companion");
    },
  });

  const handleCreateCompanion = () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar first");
      onEditStep?.(0);
      return;
    }

    if (validationIssues.length > 0) {
      toast.error("Please fix the highlighted fields before continuing");
      return;
    }

    mutation.mutate({
      avatar_id: selectedAvatar.id,
      companion_name: companionName.trim(),
      scene: scene.trim(),
      voice: voice ?? "female",
      duration: String(sessionLength ?? 1),
    });
  };

  if (isLoading && !selectedAvatar) return <LoadingSpinner />;
  if (error) return <p className="text-red-300">Unable to load preview.</p>;
  if (!previewCompanion) {
    return <p className="text-white/70">No avatar available for preview.</p>;
  }

  return (
    <PreviewView
      previewCompanion={previewCompanion}
      validationIssues={validationIssues}
      isCreating={mutation.isPending}
      onEditStep={onEditStep}
      onCreate={handleCreateCompanion}
    />
  );
}

export default memo(Preview);
