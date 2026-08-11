"use client";

import { SignOutButton, UserProfile } from "@clerk/nextjs";
import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

interface ProfileSecurityViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProfileSecurityView({ open, onOpenChange }: ProfileSecurityViewProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="type-meta cursor-pointer text-white/55 transition hover:text-white"
          >
            Manage account
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] w-[min(100%,42rem)] overflow-y-auto border-white/10 bg-zinc-950 p-0 text-white sm:max-w-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Manage account</DialogTitle>
          </DialogHeader>
          <div className="[&_.cl-card]:shadow-none [&_.cl-rootBox]:mx-auto">
            <UserProfile routing="hash" />
          </div>
        </DialogContent>
      </Dialog>

      <SignOutButton>
        <button
          type="button"
          className="type-meta cursor-pointer text-white/55 transition hover:text-white"
        >
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}

export default memo(ProfileSecurityView);
