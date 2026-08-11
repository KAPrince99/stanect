"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";
import { Button } from "../button";
import { ChangeEvent, memo, RefObject } from "react";
import Image from "next/image";
import LordIcon from "../lordIcon";
import { Camera, Loader2 } from "lucide-react";
import InputField from "../NewTabForm/InputField";

interface UpdateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userFirstNameInitial: string;
  previewUrl: string | null;
  updatedName: string;
  updatedLocation: string;
  loading: boolean;
  imageInputRef: RefObject<HTMLInputElement | null>;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function UpdateProfileDialog({
  open,
  onOpenChange,
  userFirstNameInitial,
  previewUrl,
  updatedName,
  updatedLocation,
  loading,
  imageInputRef,
  onImageChange,
  onNameChange,
  onLocationChange,
  onSave,
}: UpdateProfileDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
              onChange={onImageChange}
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
              onChange={(e) => onNameChange(e.target.value)}
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
              onChange={(e) => onLocationChange(e.target.value)}
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
              onClick={onSave}
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

export default memo(UpdateProfileDialog);
