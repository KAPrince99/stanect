"use client";

import Link from "next/link";
import LordIcon from "./lordIcon";

const icons = [
  { src: "https://cdn.lordicon.com/pgirtdfe.json", id: 1, href: "/dashboard" },
  { src: "https://cdn.lordicon.com/ytklkgsc.json", id: 2, href: "/pricing" },
  { src: "https://cdn.lordicon.com/ueoydrft.json", id: 3, href: "/new" },
];

export default function NavPill() {
  return (
    <div className="bg-stone-200 w-32 h-10 rounded-4xl flex justify-start items-center space-x-2 pl-2 fixed z-100 bottom-2 left-[34%]">
      {icons.map((icon, i) => (
        <div
          className="w-8 h-8 bg-white rounded-full  grid place-items-center"
          key={icon.id}
        >
          <Link href={icon.href}>
            <LordIcon
              src={icon.src}
              trigger="loop"
              state="hover-pinch"
              colors="primary:#121331,secondary:#4bb3fd,tertiary:#4bb3fd,quaternary:#4bb3fd,quinary:#3a3347,senary:#646e78,septenary:#ebe6ef"
              width={20}
              height={20}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
