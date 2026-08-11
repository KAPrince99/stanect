"use client";

import Image from "next/image";
import { memo, useEffect, useState } from "react";

interface UserAvatarViewProps {
  src: string;
  isFetching?: boolean;
  alt?: string;
}

function UserAvatarView({
  src,
  isFetching = false,
  alt = "User avatar",
}: UserAvatarViewProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setIsImageLoading(true);
    setImgSrc(src);
  }, [src]);

  return (
    <div
      className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-black/20 shadow-lg ring-2 ring-white/30 transition-all duration-300 ${
        isFetching ? "scale-95 opacity-70" : "scale-100 opacity-100"
      }`}
    >
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="32px"
        className={`object-cover transition-all duration-500 ease-out ${
          isImageLoading
            ? "scale-110 blur-sm grayscale"
            : "scale-100 blur-0 grayscale-0"
        }`}
        onLoadingComplete={() => setIsImageLoading(false)}
        onError={() => {
          setImgSrc("/avatars/avatar_0.jpg");
          setIsImageLoading(false);
        }}
        priority
      />

      {isFetching ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/50 border-t-white" />
        </div>
      ) : null}
    </div>
  );
}

export default memo(UserAvatarView);
