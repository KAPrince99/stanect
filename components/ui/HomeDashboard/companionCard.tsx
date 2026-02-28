import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanionProps } from "@/types/types";
import { motion } from "framer-motion";
import LordIcon from "../lordIcon";
import { memo } from "react";

function CompanionCard({ companion }: { companion: CompanionProps }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl"
      style={{ willChange: "transform" }}
    >
      <Link href={`/dashboard/${companion.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={companion.avatars.image_url}
            alt={companion.companion_name}
            fill
            className="object-cover transform transition-transform duration-500 group-hover:scale-105"
            style={{ willChange: "transform" }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute top-4 left-4 bg-black/70 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <LordIcon
              src="https://cdn.lordicon.com/zjuyeglr.json"
              trigger="loop"
              colors="primary:#e88c30,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30"
              height={20}
              width={20}
            />
            <span className="text-sm font-medium">
              {companion.duration} min
            </span>
          </div>

          <div className="absolute bottom-4 left-4 bg-white/10 px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium capitalize">
              {companion.scene}
            </span>
          </div>

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <LordIcon
              src="https://cdn.lordicon.com/ewmfucya.json"
              trigger="loop"
              colors="primary:#e83a30,secondary:#e83a30,tertiary:#e83a30,quaternary:#e83a30,quinary:#f24c00,senary:#ffffff"
              height={30}
              width={30}
            />
          </div>
        </div>
      </Link>

      <div className="p-5 text-center">
        <h3 className="text-xl md:text-2xl text-white mb-3">
          {companion.companion_name}
        </h3>

        <Link href={`/dashboard/${companion.id}`}>
          <Button
            size="lg"
            className="w-full h-10 md:h-12 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-display cursor-pointer text-md shadow-lg"
          >
            <LordIcon
              src="https://cdn.lordicon.com/ckooqaow.json"
              trigger="loop"
              colors="primary:#000000,secondary:#000000,tertiary:#000000,quaternary:#000000,quinary:#000000"
              height={20}
              width={20}
            />
            Convo
          </Button>
        </Link>
      </div>
    </motion.article>
  );
}
export default memo(CompanionCard);
