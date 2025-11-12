"use client";
import * as motion from "motion/react-client";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-[150px] hidden sm:block overflow-y-auto">
      <div className="flex justify-center items-start mt-2">
        <Image src="/logo/logo.svg" alt="logo" height={35} width={35} />
      </div>
      <div className="flex justify-center items-start my-30">
        <motion.div
          className=" bg-gray-100/10 backdrop-blur-md hover:bg-gray-100 w-15 h-100  rounded-4xl flex flex-col justify-start items-center gap-y-2 pt-3 shadow-lg"
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
        >
          {Array.from({ length: 8 }).map((t, i) => (
            <motion.div
              key={i}
              className="w-10 h-10 bg-white grid place-items-center rounded-full cursor-pointer"
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.3 }}
              transition={{ duration: 1, type: "spring", stiffness: 300 }}
            >
              {i + 1}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </aside>
  );
}
