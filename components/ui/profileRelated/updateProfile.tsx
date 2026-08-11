"use client";

import { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import { updateProfile } from "@/app/(app)/actions/update";
import { Userprops } from "@/types/types";
import UpdateProfileDialog from "./UpdateProfileDialog";

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
    <UpdateProfileDialog
      open={open}
      onOpenChange={setOpen}
      userFirstNameInitial={userFirstNameInitial}
      previewUrl={previewUrl}
      updatedName={updatedName}
      updatedLocation={updatedLocation}
      loading={loading}
      imageInputRef={imageInputRef}
      onImageChange={handleImageChange}
      onNameChange={setUpdatedName}
      onLocationChange={setUpdatedLocation}
      onSave={handleContinue}
    />
  );
}

export default memo(UpdateProfile);
