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
} from "./alert-dialog";
import { Button } from "./button";
import { ChangeEvent, memo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { updateProfile } from "@/app/(app)/actions/update";
import { useQueryClient } from "@tanstack/react-query";
import { Userprops } from "@/types/types";
import LordIcon from "./lordIcon";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

function UpdateProfile({
  data,
  userFirstNameInitial,
}: {
  data: Userprops;
  userFirstNameInitial: string;
}) {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const previewBlobRef = useRef<string | null>(null);

  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    data?.profile_picture || null,
  );
  const [updatedName, setUpdatedName] = useState(data?.name || "");
  const [updatedLocation, setUpdatedLocation] = useState(data?.country || "");
  const [loading, setLoading] = useState(false);

  /* ---------------- Sync state when dialog opens ---------------- */

  useEffect(() => {
    if (open) {
      setUpdatedName(data?.name || "");
      setUpdatedLocation(data?.country || "");
      setPreviewUrl(data?.profile_picture || null);
      setImageFile(null);
    }
  }, [open, data]);

  /* ---------------- Cleanup blob preview ---------------- */

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

      const formData = new FormData();
      formData.append("name", updatedName);
      formData.append("country", updatedLocation);
      if (imageFile) formData.append("image", imageFile);

      await updateProfile(formData, data?.profile_picture);

      /* precise invalidation */
      await queryClient.invalidateQueries({
        queryKey: ["users", user?.id],
      });

      setOpen(false);
    } catch (err) {
      console.error("❌ Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="px-8 max-sm:w-full h-12 text-base font-semibold text-white">
          <LordIcon
            src="https://cdn.lordicon.com/cbtlerlm.json"
            trigger="loop"
            colors="primary:#ffffff,secondary:#e88c30"
            height={20}
            width={20}
          />
          Update Profile
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update your profile</AlertDialogTitle>
          <AlertDialogDescription>
            Changes are saved securely.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <input
            ref={imageInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 relative">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                  unoptimized={previewUrl.startsWith("blob:")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-500">
                  {userFirstNameInitial || "?"}
                </div>
              )}
            </div>

            <Button
              type="button"
              disabled={loading}
              onClick={() => imageInputRef.current?.click()}
            >
              Change Photo
            </Button>
          </div>

          {/* Name */}
          <div className="flex items-center gap-4">
            <LordIcon
              src="https://cdn.lordicon.com/hhljfoaj.json"
              trigger="loop"
              colors="primary:#e88c30"
              height={28}
              width={28}
            />
            <input
              value={updatedName}
              disabled={loading}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Name"
              className="bg-transparent border border-white/20 p-2 rounded-md focus:outline-none"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-4">
            <LordIcon
              src="https://cdn.lordicon.com/tyntlpjn.json"
              trigger="loop"
              colors="primary:#ffffff,secondary:#e88c30"
              height={28}
              width={28}
            />
            <input
              value={updatedLocation}
              disabled={loading}
              onChange={(e) => setUpdatedLocation(e.target.value)}
              placeholder="Location"
              className="bg-transparent border border-white/20 p-2 rounded-md focus:outline-none"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleContinue}
            className="bg-black text-white px-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default memo(UpdateProfile);
