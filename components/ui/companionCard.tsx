import React from "react";
import { Button } from "./button";
import Image from "next/image";
import { MockDataPrps } from "@/mock/data";
import Link from "next/link";

export default function CompanionCard({ mock }: { mock: MockDataPrps }) {
  return (
    <main className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-stone-200 shadow-sm  overflow-hidden transition-all duration-300 hover:shadow-lg  p-1 mt-2 sm:mt-5 rounded-2xl">
      <div className="w-full max-w-[320px] aspect-square relative ">
        <Image
          src={mock.image!}
          alt={mock.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      <div className="p-4 flex flex-col gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">{mock.name}</p>
          <p className="text-sm text-gray-500">{mock.location}</p>
        </div>
        <Link href={`/dashboard/${mock.name}`}>
          <Button
            className="
    w-full cursor-pointer
    transition-all duration-200
    hover:scale-[1.03]
    hover:bg-primary/90
    active:scale-[0.98]
    font-medium
    tracking-wide
  "
          >
            Let&apos;s Talk
          </Button>
        </Link>
      </div>
    </main>
  );
}
