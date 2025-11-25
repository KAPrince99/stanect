// components/dashboard/companion-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanionProps } from "@/types/types";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Timer } from "lucide-react";

export default function CompanionCard({
  companion,
}: {
  companion: CompanionProps;
}) {
  return (
    <motion.article
      whileHover={{ y: -12 }}
      className="group relative bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-500"
    >
      <Link href={`/dashboard/${companion.id}`}>
        <div className="relative aspect-square">
          <Image
            src={companion.avatars.image_url}
            alt={companion.companion_name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Duration Badge */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">
              {companion.duration} min
            </span>
          </div>

          {/* Scene Tag */}
          <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
            <span className="text-sm font-medium capitalize">
              {companion.scene}
            </span>
          </div>

          {/* Hover Heart */}
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            className="absolute top-4 right-4"
          >
            <Heart className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg" />
          </motion.div>
        </div>
      </Link>

      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          {companion.companion_name}
        </h3>

        <Link href={`/dashboard/${companion.id}`}>
          <Button
            size="lg"
            className="w-full mt-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold text-lg h-14 shadow-xl"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Let&apos;s Talk
          </Button>
        </Link>
      </div>
    </motion.article>
  );
}
