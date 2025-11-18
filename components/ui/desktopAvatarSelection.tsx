"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AvatarProps } from "@/types/types";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";

export default function DesktopAvatarSelection({
  avatars,
}: {
  avatars: AvatarProps[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const urlSelected = params.get("avatarId");

  const [selected, setSelected] = useState<string | null>(urlSelected);

  useEffect(() => {
    if (selected !== urlSelected) {
      router.replace(`?avatarId=${selected}`);
    }
  }, [selected]);

  return (
    <main className="hidden lg:block">
      <Card className="bg-stone-100">
        <CardHeader>
          <CardTitle className="text-2xl">Select Avatar</CardTitle>
          <CardDescription>
            Chosen Avatar Image would represent your Companion
          </CardDescription>
        </CardHeader>
        <section className="bg-stone-100 grid grid-cols-3 2xl:grid-cols-4 gap-2 ">
          {avatars?.map((avatar) => {
            const isSelected = selected === avatar.id;

            return (
              <div
                role="button"
                key={avatar.id}
                onClick={() => setSelected(avatar.id)}
                className={`
              relative aspect-square w-full  overflow-hidden cursor-pointer rounded-md
              border-6 transition-all hover:scale-[1.03]
              ${isSelected ? " border-black" : " border-transparent"}
            `}
              >
                <Image
                  src={avatar.image_url!}
                  alt={avatar.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 1440px) 25vw, 100vw"
                  priority
                />
              </div>
            );
          })}
        </section>
      </Card>
    </main>
  );
}
