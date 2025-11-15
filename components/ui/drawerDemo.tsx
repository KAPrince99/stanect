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
import { mockData } from "@/mock/data";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export function DrawerDemo({
  setShowAnimation,
}: {
  setShowAnimation: (showAnimation: boolean) => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  // const urlSelected = params.get("selectedAvatar");

  const [selected, setSelected] = useState<string | null>(null);
  const [finalSelect, setFinalSelect] = useState(false);
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
              Image would represent your Companion
            </DrawerDescription>
          </DrawerHeader>
          <section className="bg-stone-100 grid grid-cols-4 gap-2 ">
            {mockData.map((data) => {
              const isSelected = selected === data.image;

              return (
                <div
                  key={data.name}
                  onClick={() => !finalSelect && setSelected(data.image)}
                  className={`
                        relative aspect-square w-20  overflow-hidden cursor-pointer rounded-md
                        border-6 transition-all
                        ${
                          isSelected ? " border-black" : " border-transparent"
                        } ${
                    finalSelect && !isSelected ? "border-transparent" : ""
                  }
                      `}
                >
                  <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              );
            })}
          </section>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                disabled={finalSelect || selected === null}
                className="cursor-pointer"
                onClick={() => {
                  setFinalSelect(true);
                  setShowAnimation(true);
                  router.push(`?selectedAvatar=${selected}`);
                }}
              >
                Submit
              </Button>
            </DrawerClose>

            <Button
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
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
