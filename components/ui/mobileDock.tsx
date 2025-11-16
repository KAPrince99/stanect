"use client";

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import LordIcon from "./lordIcon";


interface IconsProps {
  src: string;
  id: number;
  href: string;
}

function DockIcon({ icon }: { icon: IconsProps }) {
 
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    // wait 250ms before scaling
    timerRef.current = setTimeout(() => {
      controls.start({ scale: 1.4 });
    }, 250);
  };

  const endPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    controls.start({ scale: 1 });
  };

  return (
    <motion.div
      className="w-10 h-10 bg-stone-100 rounded-full grid place-items-center"
      animate={controls}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerCancel={endPress}
      onPointerLeave={endPress}
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
  );
}

export default function MobileDock({ icons }: { icons: IconsProps[] }) {
  return (
    <div className="bg-stone-100 w-36 h-13 rounded-4xl flex justify-start items-center space-x-2 px-2 fixed z-100 bottom-6 left-[34%] sm:hidden  border-2 shadow-xl">
      {icons.map((icon) => (
        <DockIcon key={icon.id} icon={icon} />
      ))}
    </div>
  );
}
