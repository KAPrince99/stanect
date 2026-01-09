"use client";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoginComponent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2  w-full max-w-5xl lg:bg-blue-500 rounded-3xl shadow-2xl overflow-hidden">
      <div className="relative hidden md:flex items-center justify-center lg:bg-blue-500">
        <div className="relative w-full h-full max-w-xl max-h-xl p-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
            className="w-full h-full"
          >
            <Image
              src="/avatars/transparent_avatar.png"
              alt="Login avatar"
              fill
              className="object-contain drop-shadow-2xl "
              priority
            />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-center p-5 md:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
