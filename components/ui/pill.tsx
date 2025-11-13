"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "./button";

export default function Pill() {
  return (
    <motion.div
      className="
        h-10 sm:h-12
        w-[98%] sm:w-[700px]
        bg-stone-200
        rounded-2xl
        flex justify-between items-center
        px-4
        
        
     
        transition-all duration-300 
      "
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.1 }}
    >
      {/* Left — Brand name (hidden on mobile) */}
      <div className="tracking-wide text-gray-500 font-medium hidden sm:block">
        Stanect
      </div>

      {/* Center — Logo (mobile only) */}
      <div className="flex justify-center items-center sm:hidden">
        <Image
          src="/logo/logo.svg"
          alt="Stanect logo"
          height={32}
          width={32}
          className="transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      {/* Right — Profile */}
      <div className="text-gray-500 text-sm sm:text-base font-medium hover:text-gray-200 transition-colors">
        <SignedOut>
          <SignInButton>
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </motion.div>
  );
}
