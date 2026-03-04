import { getAvatars } from "@/app/(app)/actions/actions";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function Avatar() {
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
        {avatars?.map((avatar) => (
          <div
            key={avatar.id}
            className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/30 transition-all duration-300 cursor-pointer"
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
        ))}
      </div>
    </div>
  );
}
