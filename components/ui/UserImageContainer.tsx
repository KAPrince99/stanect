"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function UserImageContainer() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const avatar = user?.imageUrl ?? "/avatars/avatar_0.jpg";
  return (
    <div
      className="
        relative 
        rounded-full 
        overflow-hidden 
        shrink-0
        h-7 w-7           
        md:h-8 md:w-8
       ring-2 ring-white/30
          shadow-lg shadow-black/40
          bg-black/20   
          cursor-pointer
          transition-transform
    hover:scale-105
      "
    >
      <Image
        src={avatar}
        alt="User avatar"
        fill
        className="object-cover"
        sizes="32px"
        priority
      />
    </div>
  );
}
