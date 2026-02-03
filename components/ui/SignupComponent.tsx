"use client";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupComponent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl min-h-[650px] bg-white lg:bg-blue-500/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 lg:border-white/10">
      <div className="relative hidden lg:flex items-center justify-center bg-blue-500/10 p-12">
        <Link href="/">
          <Image
            src="/logo/logo.svg"
            alt="Stanect AI Logo"
            width={70}
            height={70}
            className="absolute top-10 left-10 opacity-20 bg-white rounded-xl p-2"
            priority
          />
        </Link>

        <div className="relative w-72 h-72 xl:w-96 xl:h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative w-full h-full"
          >
            <Image
              src="/avatars/transparent_avatar.png"
              alt="Signup avatar"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-center p-2 md:px-12 ">
        <div className="w-full max-w-[450px] flex items-center justify-center flex-col">
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/">
              <Image src="/logo/logo.svg" alt="Logo" width={50} height={50} />
            </Link>
          </div>

          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/login"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent w-full border-none",
                headerTitle: "text-2xl font-bold",
                scrollBox: "rounded-none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
