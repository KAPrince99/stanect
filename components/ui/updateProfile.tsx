"use client";

import { Edit3 } from "lucide-react";
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
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { updateProfile } from "@/app/(app)/actions/update";
import { useQueryClient } from "@tanstack/react-query";
import { Userprops } from "@/types/types";

export default function UpdateProfile({ data }: { data: Userprops }) {
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    data?.profile_picture || null
  );
  const [updatedName, setUpdatedName] = useState(data?.name || "");
  const [updatedLocation, setUpdatedLocation] = useState(data?.country || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", updatedName);
      formData.append("country", updatedLocation);
      if (imageFile) formData.append("image", imageFile);

      await updateProfile(formData, data?.profile_picture);

      // Sync TanStack Query state
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("✅ Profile updated");
    } catch (err) {
      console.error("❌ Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="px-8 max-sm:w-full h-12 text-base font-semibold text-white">
          <Edit3 className="w-5 h-5 mr-2" /> Update Profile
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
          />

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
                  No Image
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
            >
              Change Photo
            </Button>
          </div>

          <input
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Name"
            className="bg-transparent border border-gray-700 p-2 rounded-md"
          />
          <input
            value={updatedLocation}
            onChange={(e) => setUpdatedLocation(e.target.value)}
            placeholder="Location"
            className="bg-transparent border border-gray-700 p-2 rounded-md"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
