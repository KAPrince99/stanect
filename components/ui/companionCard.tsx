import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanionProps } from "@/types/types";
import { motion } from "framer-motion";
import { Heart, Mic, Timer } from "lucide-react";

export default function CompanionCard({
  companion,
}: {
  companion: CompanionProps;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }} // smaller movement = smoother
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl"
      style={{ willChange: "transform" }} // GPU-accelerated
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

          {/* Simple overlay (no blur!) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Duration */}
          <div className="absolute top-4 left-4 bg-black/70 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">
              {companion.duration} min
            </span>
          </div>

          {/* Scene Tag */}
          <div className="absolute bottom-4 left-4 bg-white/10 px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium capitalize">
              {companion.scene}
            </span>
          </div>

          {/* Hover Heart (CSS only – MUCH cheaper) */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Heart className="w-7 h-7 text-red-500 fill-red-500" />
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
            <Mic className="w-10 h-5 mr-2" />
            Let&apos;s Talk
          </Button>
        </Link>
      </div>
    </motion.article>
  );
}
