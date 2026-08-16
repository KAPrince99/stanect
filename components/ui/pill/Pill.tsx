"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";

import PillBrand from "./PillBrand";
import PillSignInButton from "./PillSignInButton";
import PillSignedInActions from "./PillSignedInActions";

export default function Pill() {
  return (
    <div className="group relative flex h-14 w-full items-center justify-between overflow-hidden rounded-full border border-white/20 bg-white/10 px-6 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-transform duration-200 hover:scale-[1.01] sm:h-16 sm:px-10">
      <div className="pointer-events-none absolute inset-0 scale-150 bg-linear-to-r from-amber-400/10 via-orange-500/10 to-pink-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <PillBrand />

      <div className="z-10 flex items-center gap-3 sm:gap-4">
        <SignedOut>
          <PillSignInButton />
        </SignedOut>

        <SignedIn>
          <PillSignedInActions />
        </SignedIn>
      </div>
    </div>
  );
}
