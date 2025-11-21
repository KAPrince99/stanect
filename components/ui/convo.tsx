"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "./button";
import DeleteCompanionButton from "@/components/ui/deleteCompanionButton";
import { useQuery } from "@tanstack/react-query";

import { getSingleCompanion } from "@/app/(app)/actions/actions";
import ConvoSkeleton from "./convoSkeleton";

export default function Convo({ id }: { id: string }) {
  const { user } = useUser();
  const { data: companion, isLoading } = useQuery({
    queryKey: ["companion", id],
    queryFn: async () => getSingleCompanion(id),
  });
  console.log("COMPANION DATA:", companion);

  if (!user) return null;
  if (isLoading) return <ConvoSkeleton />;
  if (!companion) return <div>Companion not found</div>;

  const { avatars, name } = companion;
  const companionImageUrl = avatars?.image_url;
  const imageUrl = user.imageUrl ?? "/avatar-placeholder.png";
  const firstName = user.firstName ?? "User";

  return (
    <div className="flex flex-col md:flex-row h-[80vh] bg-gray-900 text-white w-full rounded-xl overflow-hidden shadow-xl">
      {/* LEFT SIDE */}
      <div className="flex flex-col flex-1 p-4 md:p-8 space-y-6 overflow-y-auto scrollbar-hide">
        {/* HEADER */}
        <div className="flex justify-center items-center pt-2 text-center">
          <div>
            <p className="text-gray-400 text-lg">Calling...</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {name}
            </h1>
          </div>
        </div>

        {/* VIDEOS */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* COMPANION VIDEO */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-gray-800">
            {companionImageUrl && (
              <Image
                src={companionImageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>

          {/* USER VIDEO */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-gray-800 hidden md:block">
            <Image
              src={imageUrl}
              alt={firstName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center pt-4">
          <div className="flex justify-between items-center w-full max-w-md gap-6">
            {/* Mic */}
            <Button className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-lg flex items-center justify-center transition cursor-pointer">
              Mic
            </Button>

            {/* End Call */}
            <Button className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl flex items-center justify-center transition font-semibold cursor-pointer">
              End
            </Button>

            {/* More */}
            <Button className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-lg flex items-center justify-center transition cursor-pointer">
              More
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: TRANSCRIPT */}
      <aside className="w-full md:w-1/3 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto scrollbar-hide hidden md:flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200">Transcript</h2>
          <DeleteCompanionButton id={id} />
        </div>

        <div className="flex-1 space-y-4 mt-4 text-gray-300">
          <p>
            <span className="font-semibold text-white">{name}:</span> Lorem
            ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <p>
            <span className="font-semibold text-white">You:</span> Proin a magna
            a mi cursus fermentum.
          </p>

          {/* More transcript entries can go here */}
        </div>
      </aside>
    </div>
  );
}
