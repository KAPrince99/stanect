import React from "react";
import { Button } from "./button";
import Image from "next/image";
import { MockDataPrps } from "@/mock/data";

export default function CompanionCard({ mock }: { mock: MockDataPrps }) {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="relative aspect-square">
        <Image
          src={mock.image!}
          alt={mock.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      <div className="p-4 flex flex-col gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">{mock.name}</p>
          <p className="text-sm text-gray-500">{mock.location}</p>
        </div>
        <Button className="w-full">Let&apos;s Talk</Button>
      </div>
    </div>
  );
}
