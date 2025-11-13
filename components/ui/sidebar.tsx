"use client";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import LordIcon from "./lordIcon";

const icons = [
  { src: "https://cdn.lordicon.com/pgirtdfe.json", id: 1, href: "/dashboard" },
  { src: "https://cdn.lordicon.com/ytklkgsc.json", id: 2, href: "/pricing" },
  { src: "https://cdn.lordicon.com/ueoydrft.json", id: 3, href: "/new" },
];

export default function Sidebar() {
  return (
    <aside className="w-[150px] hidden sm:block overflow-y-auto z-200 ">
      <div className="flex justify-center items-start mt-4">
        <Link href="/">
          <Image src="/logo/logo.svg" alt="logo" height={35} width={35} />
        </Link>
      </div>
      <div className="flex justify-center items-start my-7">
        <motion.div
          className=" bg-stone-200 backdrop-blur-md hover:bg-gray-100 w-15 h-40  rounded-4xl flex flex-col justify-start items-center gap-y-2 pt-3 shadow-lg"
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
        >
          {icons.map((icon) => (
            <motion.div
              key={icon.id}
              className="w-10 h-10 bg-white grid place-items-center rounded-full cursor-pointer hover:bg-gray-900/10"
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.3 }}
              transition={{ duration: 1, type: "spring", stiffness: 300 }}
            >
              <Link href={icon.href}>
                <LordIcon
                  src={icon.src}
                  trigger="loop"
                  state="hover-pinch"
                  colors="primary:#121331,secondary:#4bb3fd,tertiary:#4bb3fd,quaternary:#4bb3fd,quinary:#3a3347,senary:#646e78,septenary:#ebe6ef"
                  width={30}
                  height={30}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </aside>
  );
}
