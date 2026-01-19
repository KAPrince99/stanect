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
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { updateProfile } from "@/app/(app)/actions/update";
import { useQueryClient } from "@tanstack/react-query";
import { Userprops } from "@/types/types";
import LordIcon from "./lordIcon";

export default function UpdateProfile({ data }: { data: Userprops }) {
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

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

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", updatedName);
      formData.append("country", updatedLocation);
      if (imageFile) formData.append("image", imageFile);

      await updateProfile(formData, data?.profile_picture);

      await queryClient.invalidateQueries({ queryKey: ["users"] });

      console.log("✅ Profile updated");

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
            colors="primary:#ffffff,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30,quinary:#e88c30"
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
              disabled={loading}
              className="bg-linear-to-br from-[#0b1a36] via-[#0f2a5c] to-[#1e4ea8] text-white"
              onClick={() => imageInputRef.current?.click()}
            >
              Change Photo
            </Button>
          </div>

          <div className="flex items-center justify-around md:justify-start gap-8">
            <LordIcon
              src="https://cdn.lordicon.com/hhljfoaj.json"
              trigger="loop"
              colors="primary:#e88c30,secondary:#e88c30,tertiary:#e88c30"
              height={30}
              width={30}
              className="md:ml-4"
            />
            <input
              value={updatedName}
              disabled={loading}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Name"
              className="bg-transparent border-2 border-bg-linear-to-br from-[#0b1a36] via-[#0f2a5c] to-[#1e4ea8] p-2 rounded-md focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-around md:justify-start gap-8">
            <LordIcon
              src="https://cdn.lordicon.com/tyntlpjn.json"
              trigger="loop"
              colors="primary:#ffffff,secondary:#e88c30"
              height={30}
              width={30}
              className="md:ml-4"
            />
            <input
              value={updatedLocation}
              disabled={loading}
              onChange={(e) => setUpdatedLocation(e.target.value)}
              placeholder="Location"
              className="bg-transparent border-2 border-bg-linear-to-br from-[#0b1a36] via-[#0f2a5c] to-[#1e4ea8] p-2 rounded-md focus:outline-none "
            />
          </div>
        </div>

        <AlertDialogFooter className="flex flex-row justify-end">
          {!loading && (
            <AlertDialogCancel disabled={loading}>
              <LordIcon
                src="https://cdn.lordicon.com/pilfbsjh.json"
                trigger="loop"
                colors="primary:#ffffff,secondary:#e83a30,tertiary:#ffffff"
                height={35}
                width={35}
              />
            </AlertDialogCancel>
          )}

          <AlertDialogAction
            isPending={loading}
            onClick={handleContinue}
            className="bg-white flex items-center gap-2 hover:bg-white active:bg-orange-500 text-black px-6"
          >
            {loading ? (
              <LordIcon
                src="https://cdn.lordicon.com/veoztjjj.json"
                trigger="loop"
                colors="primary:#e88c30,secondary:#ffffff"
                height={35}
                width={35}
              />
            ) : (
              <>
                <LordIcon
                  src="https://cdn.lordicon.com/rnbuzxxk.json"
                  trigger="loop"
                  colors="primary:#ffffff,secondary:#2ca58d"
                  height={35}
                  width={35}
                />
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
