"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from "lucide-react";

import UserButton from "@/components/ui/UserButton";

import UploadButton from "./uploadButton";

export default function Pill() {
  return (
    <div className="group relative flex h-14 w-full items-center justify-between overflow-hidden rounded-full border border-white/20 bg-white/10 px-6 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-transform duration-200 hover:scale-[1.01] sm:h-16 sm:px-10">
      <div className="pointer-events-none absolute inset-0 scale-150 bg-linear-to-r from-amber-400/10 via-orange-500/10 to-pink-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <Link
        href="/"
        className="group z-10 flex items-center no-underline outline-none focus:outline-none"
      >
        <div className="type-brand">
          <span className="bg-linear-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
            Stanect
          </span>
        </div>
      </Link>

      <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
        <UploadButton />
      </div>

      <div className="z-10 flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button
              type="button"
              className="type-cta flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-black shadow-xl transition-transform hover:scale-105 hover:shadow-amber-500/50"
            >
              <LogIn className="h-5 w-5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="relative hidden lg:flex">
            <UserButton />
            <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-black bg-emerald-400 shadow-lg" />
          </div>
          <span className="h-4 w-4 rounded-full border bg-emerald-400 shadow-lg lg:hidden" />
        </SignedIn>
      </div>
    </div>
  );
}
