"use client";
import { createCompanion, getSingleAvatar } from "@/app/(app)/actions/actions";
import { companionSchema } from "@/schemas/newCompanionSchema";
import { useTabFormStore } from "@/store/useTabFormStore";
import { CompanionProps, CreateCompanionProps } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { memo, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import CompanionCard from "../HomeDashboard/companionCard";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../button";
import { motionTransition, motionVariants } from "@/lib/motion";

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
      toast.success("Companion created successfully 🎉");
      const createdCompanionId = result?.data?.id;
      reset();
      router.replace(
        createdCompanionId
          ? `/dashboard/${createdCompanionId}`
          : "/dashboard",
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create companion ⚠️");
    },
  });

  const handleCreateCompanion = () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar first ⚠️");
      onEditStep?.(0);
      return;
    }

    if (validationIssues.length > 0) {
      toast.error("Please fix the highlighted fields before continuing ⚠️");
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
  if (!previewCompanion)
    return <p className="text-white/70">No avatar available for preview.</p>;

  return (
    <main className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-4xl mx-auto px-4">
        <motion.div
          className="w-full max-w-[320px] mx-auto"
          variants={motionVariants.cardPop}
          initial="initial"
          animate="animate"
          transition={motionTransition.soft}
        >
          <CompanionCard
            companion={previewCompanion}
            showConvoButton={false}
            enableNavigation={false}
            enableHoverLift={false}
          />
        </motion.div>
        <motion.div
          className="w-full max-w-md mx-auto space-y-10"
          variants={motionVariants.fadeUp}
          initial="hidden"
          animate="visible"
          transition={motionTransition.soft}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
            <h3 className="text-3xl md:text-4xl font-display tracking-tight text-center bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Review companion
            </h3>
            <p className="text-base text-white/70 text-center">
              Confirm the details below before creating your companion.
            </p>

            <div className="space-y-2 rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span>Name</span>
                <span className="text-white">
                  {previewCompanion.companion_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Voice</span>
                <span className="text-white capitalize">
                  {previewCompanion.voice}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Duration</span>
                <span className="text-white">
                  {previewCompanion.duration} min
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Scene</span>
                <span className="text-white text-right truncate max-w-[200px]">
                  {previewCompanion.scene}
                </span>
              </div>
            </div>

            <div className="space-y-5 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span>Avatar</span>
                <Button
                  variant="ghost"
                  className="h-auto p-0"
                  onClick={() => onEditStep?.(0)}
                >
                  Edit
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Name & Scene</span>
                <Button
                  variant="ghost"
                  className="h-auto p-0"
                  onClick={() => onEditStep?.(1)}
                >
                  Edit
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Voice & Duration</span>
                <Button
                  variant="ghost"
                  className="h-auto p-0"
                  onClick={() => onEditStep?.(2)}
                >
                  Edit
                </Button>
              </div>
            </div>

            {validationIssues.length > 0 && (
              <div className="rounded-lg border border-red-300/40 bg-red-500/10 p-3">
                <p className="text-sm text-red-200 font-medium">
                  A few details still need attention:
                </p>
                <ul className="mt-2 text-xs text-red-100 list-disc pl-4 space-y-1">
                  {validationIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              className="w-full h-12 bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold shadow-xl shadow-amber-500/20 transition-all"
              disabled={mutation.isPending || validationIssues.length > 0}
              onClick={handleCreateCompanion}
            >
              Create Companion
              {mutation.isPending ? (
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
              ) : (
                <MoveRight className="w-5 h-5 ml-2" />
              )}
            </Button>

            <p className="text-xs text-white/60 text-center">
              You can edit these details later in your dashboard.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
export default memo(Preview);
