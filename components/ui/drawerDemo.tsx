"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "./button";
import Image from "next/image";
import { AvatarProps } from "@/types/types";

interface AvatarDrawerProps {
  avatars: AvatarProps[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function AvatarDrawer({
  avatars,
  selected,
  onSelect,
}: AvatarDrawerProps) {
  const [localSelected, setLocalSelected] = useState<string | null>(selected);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-[#0072c3]">Choose Avatar</Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <section className="grid grid-cols-4 gap-2">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`relative aspect-square w-full rounded-md cursor-pointer border-2 transition ${
                  localSelected === avatar.id
                    ? "border-black"
                    : "border-transparent"
                }`}
                onClick={() => setLocalSelected(avatar.id)}
              >
                <Image
                  src={avatar.image_url}
                  alt={avatar.name || "Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </section>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  if (localSelected) onSelect(localSelected);
                }}
              >
                Submit
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
