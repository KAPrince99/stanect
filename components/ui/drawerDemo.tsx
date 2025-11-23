"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AvatarProps } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DrawerDemoProps {
  setShowAnimation: (showAnimation: boolean) => void;
  avatars: AvatarProps[];
}

export function DrawerDemo({ setShowAnimation, avatars }: DrawerDemoProps) {
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-[#0072c3] cursor-pointer">Choose Avatar</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-xl">Select Avatar</DrawerTitle>
            <DrawerDescription>
              Chosen Avatar Image would represent your Companion
            </DrawerDescription>
          </DrawerHeader>
          <section className="bg-stone-100 grid grid-cols-4 gap-2 ">
            {avatars.map((avatar) => {
              const isSelected = selected === avatar.id;

              return (
                <div
                  key={avatar.id}
                  onClick={() => setSelected(avatar.id)}
                  className={`
                        relative aspect-square w-full  overflow-hidden cursor-pointer rounded-md
                        border-6 transition-all
                        ${isSelected ? " border-black" : " border-transparent"} 
                      `}
                >
                  <Image
                    src={avatar.image_url!}
                    alt={`${avatar.name}'s name`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 1440px) 25vw, 100vw"
                    priority
                  />
                </div>
              );
            })}
          </section>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setShowAnimation(true);
                  router.push(`?avatarId=${selected}`);
                }}
              >
                Submit
              </Button>
            </DrawerClose>

            {/* <Button
              variant="outline"
              className={`cursor-pointer ${
                finalSelect ? "bg-black text-white" : ""
              }`}
              disabled={!finalSelect}
              onClick={() => {
                setFinalSelect(false);
              }}
            >
              Undo
            </Button> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
