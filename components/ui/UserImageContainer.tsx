"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(app)/actions/actions";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

export default function UserImageContainer() {
  const { user, isLoaded } = useUser();

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>("/avatars/avatar_0.jpg");

  const userId = user?.id;

  const { data: supabaseUser, isFetching } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId && isLoaded,
    staleTime: Infinity,
  });

  const avatar = useMemo(() => {
    if (supabaseUser?.profile_picture) return supabaseUser.profile_picture;
    if (user?.imageUrl) return user.imageUrl;
    return "/avatars/avatar_0.jpg";
  }, [supabaseUser?.profile_picture, user?.imageUrl]);

  useEffect(() => {
    setIsImageLoading(true);
    setImgSrc(avatar);
  }, [avatar]);

  if (!isLoaded) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-800 animate-pulse shrink-0" />
    );
  }

  return (
    <div
      className={`
        relative rounded-full overflow-hidden shrink-0 h-8 w-8
        ring-2 ring-white/30 shadow-lg bg-black/20 transition-all duration-300
        ${isFetching ? "opacity-70 scale-95" : "opacity-100 scale-100"}
      `}
    >
      <Image
        src={imgSrc}
        alt="User avatar"
        fill
        sizes="32px"
        className={`
          object-cover transition-all duration-500 ease-out
          ${
            isImageLoading
              ? "scale-110 blur-sm grayscale"
              : "scale-100 blur-0 grayscale-0"
          }
        `}
        onLoadingComplete={() => setIsImageLoading(false)}
        onError={() => {
          setImgSrc("/avatars/avatar_0.jpg");
          setIsImageLoading(false);
        }}
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
