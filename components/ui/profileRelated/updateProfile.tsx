"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "../alert-dialog";
import { Button } from "../button";
import { ChangeEvent, memo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { updateProfile } from "@/app/(app)/actions/update";
import { useQueryClient } from "@tanstack/react-query";
import { Userprops } from "@/types/types";
import LordIcon from "../lordIcon";
import { Camera, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import InputField from "../NewTabForm/InputField";

interface UpdateProfileProps {
  data: Userprops;
  userFirstNameInitial: string;
  user: ReturnType<typeof useUser>["user"];
}

function getInitialValues(
  data: Userprops,
  user: ReturnType<typeof useUser>["user"],
) {
  return {
    name: data?.name || user?.fullName || "",
    location: (data?.country ||
      (user?.publicMetadata?.country as string) ||
      "Earth") as string,
    previewUrl: data?.profile_picture || null,
  };
}

function UpdateProfile({
  data,
  userFirstNameInitial,
  user,
}: UpdateProfileProps) {
  const queryClient = useQueryClient();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const previewBlobRef = useRef<string | null>(null);

  const initialValues = getInitialValues(data, user);

  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialValues.previewUrl,
  );
  const [updatedName, setUpdatedName] = useState(initialValues.name);
  const [updatedLocation, setUpdatedLocation] = useState(
    initialValues.location,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const nextValues = getInitialValues(data, user);
      setUpdatedName(nextValues.name);
      setUpdatedLocation(nextValues.location);
      setPreviewUrl(nextValues.previewUrl);
      setImageFile(null);
    }
  }, [open, data, user]);

  useEffect(() => {
    return () => {
      if (previewBlobRef.current) {
        URL.revokeObjectURL(previewBlobRef.current);
      }
    };
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewBlobRef.current) {
      URL.revokeObjectURL(previewBlobRef.current);
    }

    const blob = URL.createObjectURL(file);
    previewBlobRef.current = blob;

    setImageFile(file);
    setPreviewUrl(blob);
  };

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const safeName = updatedName.trim();
      const safeLocation = updatedLocation.trim();

      if (!safeName) {
        toast.error("Name is required");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", safeName);
      formData.append("country", safeLocation || "Earth");
      if (imageFile) formData.append("image", imageFile);

      await updateProfile(formData, data?.profile_picture);

      await queryClient.invalidateQueries({
        queryKey: ["users", user?.id],
      });

      toast.success("Profile updated successfully");
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="type-cta h-11 w-full border-white/20 bg-white/5 px-8 text-white hover:bg-white/10 hover:text-white sm:w-auto"
        >
          Update Profile
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="gap-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-0 text-white shadow-2xl backdrop-blur-xl sm:max-w-md">
        <div className="h-1 bg-linear-to-r from-amber-400 via-orange-500 to-amber-400" />

        <div className="p-6 sm:p-8">
          <AlertDialogHeader className="space-y-2 text-center sm:text-center">
            <AlertDialogTitle className="type-title text-xl sm:text-2xl">
              Update your profile
            </AlertDialogTitle>
            <AlertDialogDescription className="type-body text-white/65">
              Refresh your photo, name, and location.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-8 space-y-5">
            <input
              ref={imageInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />

            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => imageInputRef.current?.click()}
                className="group relative h-24 w-24 rounded-full bg-linear-to-br from-amber-400 to-orange-600 p-1 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 disabled:opacity-60"
                aria-label="Change profile photo"
              >
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gray-900 text-3xl font-bold text-white">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                      unoptimized={previewUrl.startsWith("blob:")}
                    />
                  ) : (
                    <span>{userFirstNameInitial || "?"}</span>
                  )}
                </div>
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition group-hover:opacity-100">
                  <Camera className="h-5 w-5 text-white" />
                </span>
              </button>

              <Button
                type="button"
                size="sm"
                disabled={loading}
                onClick={() => imageInputRef.current?.click()}
                className="type-meta h-9 rounded-full border border-white/15 bg-white/5 px-4 text-white hover:bg-white/10"
              >
                Change photo
              </Button>
            </div>

            <InputField
              label="Name"
              icon={
                <LordIcon
                  src="https://cdn.lordicon.com/hhljfoaj.json"
                  trigger="hover"
                  colors="primary:#e88c30"
                  height={22}
                  width={22}
                />
              }
              value={updatedName}
              disabled={loading}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Your name"
              className="focus-visible:border-amber-400/40 focus-visible:ring-amber-400/20"
            />

            <InputField
              label="Location"
              icon={
                <LordIcon
                  src="https://cdn.lordicon.com/tyntlpjn.json"
                  trigger="hover"
                  colors="primary:#ffffff,secondary:#e88c30"
                  height={22}
                  width={22}
                />
              }
              value={updatedLocation}
              disabled={loading}
              onChange={(e) => setUpdatedLocation(e.target.value)}
              placeholder="Where you're based"
              className="focus-visible:border-amber-400/40 focus-visible:ring-amber-400/20"
            />
          </div>

          <AlertDialogFooter className="mt-8 gap-3 sm:justify-stretch">
            <AlertDialogCancel
              disabled={loading}
              className="type-label h-11 flex-1 rounded-full border-none bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleContinue}
              disabled={loading}
              className="type-cta h-11 flex-1 rounded-full border-none bg-linear-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/30 hover:from-amber-500 hover:to-orange-600"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save changes"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default memo(UpdateProfile);
