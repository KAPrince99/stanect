"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(app)/actions/actions";
import Image from "next/image";
import { useState } from "react";

export default function UserImageContainer() {
  const { user, isLoaded } = useUser();
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { data: supabaseUser, isFetching } = useQuery({
    queryKey: ["users", user?.id],
    queryFn: () => getUser(user?.id as string),
    enabled: !!user?.id,
  });

  if (!isLoaded)
    return <div className="h-8 w-8 rounded-full bg-gray-800 animate-pulse" />;

  const avatar =
    supabaseUser?.profile_picture || user?.imageUrl || "/avatars/avatar_0.jpg";

  return (
    <div
      className={`
        relative rounded-full overflow-hidden shrink-0 h-8 w-8
        ring-2 ring-white/30 shadow-lg bg-black/20 transition-all duration-300
        ${isFetching ? "opacity-70 scale-95" : "opacity-100 scale-100"}
      `}
    >
      <Image
        key={avatar}
        src={avatar}
        alt="User avatar"
        fill
        className={`
          object-cover transition-all duration-500 ease-in-out
          ${
            isImageLoading
              ? "scale-110 blur-sm grayscale"
              : "scale-100 blur-0 grayscale-0"
          }
        `}
        sizes="32px"
        onLoad={() => setIsImageLoading(false)}
        onLoadingComplete={() => setIsImageLoading(false)}
        priority
      />

      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
