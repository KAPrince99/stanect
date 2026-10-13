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
import { lordColors } from "@/lib/brand";

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
          variant="secondary"
          size="md"
          className="w-full sm:w-auto"
        >
          Update Profile
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="gap-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-0 text-white shadow-2xl backdrop-blur-xl sm:max-w-md">
        <div className="h-1 bg-linear-to-r from-brand-from via-brand-to to-brand-from" />

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
              {/* eslint-disable-next-line no-restricted-syntax -- round avatar picker, not a standard button */}
              <button
                type="button"
                disabled={loading}
                onClick={() => imageInputRef.current?.click()}
                className="group relative h-24 w-24 rounded-full bg-linear-to-br from-brand-from to-brand-to-hover p-1 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 disabled:opacity-60"
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
                variant="secondary"
                size="sm"
                disabled={loading}
                onClick={() => imageInputRef.current?.click()}
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
                  colors={lordColors({ primary: "accent" })}
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
                  colors={lordColors({ primary: "white", secondary: "accent" })}
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
              variant="secondary"
              size="md"
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              variant="primary"
              size="md"
              onClick={onSave}
              disabled={loading}
              className="flex-1 shadow-lg shadow-amber-500/30"
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
