import React from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";

interface Props {
  link: string;
  name: string;
}

export default function LinkComponent({ link, name }: Props) {
  return (
    <>
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <div className="cursor-pointer group">
          <MoveRight className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:text-orange-500 group-hover:rotate-25 transition-all duration-300 " />
          <p className="text-2xl md:text-xl lg:text-2xl ml-10 group-hover:text-orange-500 group-hover:underline transition-all duration-300">
            {name}
          </p>
        </div>
      </Link>
    </>
  );
}
