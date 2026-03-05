"use client";
import { getAvatars } from "@/app/(app)/actions/actions";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { memo, useCallback, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { useRouter, useSearchParams } from "next/navigation";

function Avatar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch Avatars
  const {
    data: avatars,
    isLoading: avatarsLoading,

    error,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAvatars,
    staleTime: Infinity,
  });

  const selectedAvatarId = searchParams.get("avatarId");

  const handleSelectAvatar = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("avatarId", id);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  useEffect(() => {
    if (!searchParams.get("avatarId") && avatars?.length) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("avatarId", avatars[0].id);

      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [avatars, searchParams, router]);

  if (avatarsLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading avatars</div>;
  return (
    <div>
      <div className="flex items-center justify-center my-4">
        <h2 className="text-5xl md:text-4xl font-display tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Choose Your Muse
        </h2>
      </div>
      <div className="grid grid-cols-3 2xl:grid-cols-4 gap-6 max-w-4xl mx-auto px-8">
        {avatars?.map((avatar) => {
          const isSelected = selectedAvatarId === avatar.id;
          return (
            <div
              key={avatar.id}
              className={`relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 transition-all duration-300 cursor-pointer ${
                isSelected ? "ring-amber-600" : "ring-white/30"
              }`}
              onClick={() => handleSelectAvatar(avatar.id)}
            >
              <Image
                src={avatar.image_url}
                alt={avatar.name || "Companion"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default memo(Avatar);
