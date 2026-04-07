import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { CompanionProps } from "@/types/types";

import LordIcon from "../lordIcon";

interface CompanionCardProps {
  companion: CompanionProps;
  showConvoButton?: boolean;
  enableNavigation?: boolean;
  enableHoverLift?: boolean;
}

interface CompanionCardMediaProps {
  companion: CompanionProps;
}

interface CompanionCardActionProps {
  cardHref: string;
  enableNavigation: boolean;
}

function CompanionCardMedia({ companion }: CompanionCardMediaProps) {
  return (
    <div className="relative aspect-square overflow-hidden">
      <Image
        src={companion.avatars.image_url}
        alt={companion.companion_name}
        fill
        className="object-cover transform transition-transform duration-500 group-hover:scale-105"
        style={{ willChange: "transform" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5">
        <LordIcon
          src="https://cdn.lordicon.com/zjuyeglr.json"
          trigger="hover"
          colors="primary:#e88c30,secondary:#e88c30,tertiary:#ebe6ef,quaternary:#e88c30"
          height={20}
          width={20}
        />
        <span className="text-sm font-medium">{companion.duration} min</span>
      </div>

      <div className="absolute bottom-4 left-4 rounded-full bg-white/10 px-3 py-1.5">
        <span className="text-sm font-medium capitalize">
          {companion.scene}
        </span>
      </div>

      <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <LordIcon
          src="https://cdn.lordicon.com/ewmfucya.json"
          trigger="hover"
          colors="primary:#e83a30,secondary:#e83a30,tertiary:#e83a30,quaternary:#e83a30,quinary:#f24c00,senary:#ffffff"
          height={30}
          width={30}
        />
      </div>
    </div>
  );
}

function CompanionCardAction({
  cardHref,
  enableNavigation,
}: CompanionCardActionProps) {
  const buttonContent = (
    <Button
      size="lg"
      className="h-10 w-full bg-linear-to-r from-amber-400 to-orange-500 text-md font-display text-black shadow-lg md:h-12"
      disabled={!enableNavigation}
    >
      <LordIcon
        src="https://cdn.lordicon.com/ckooqaow.json"
        trigger={enableNavigation ? "hover" : "loop"}
        colors="primary:#000000,secondary:#000000,tertiary:#000000,quaternary:#000000,quinary:#000000"
        height={20}
        width={20}
      />
      Convo
    </Button>
  );

  return enableNavigation ? (
    <Link href={cardHref} className="block">
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );
}

function CompanionCard({
  companion,
  showConvoButton = true,
  enableNavigation = true,
  enableHoverLift = true,
}: CompanionCardProps) {
  const cardHref = `/dashboard/${companion.id}`;
  const mediaContent = <CompanionCardMedia companion={companion} />;

  return (
    <motion.article
      whileHover={enableHoverLift ? { y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl"
      style={{ willChange: "transform" }}
    >
      {enableNavigation ? (
        <Link href={cardHref}>{mediaContent}</Link>
      ) : (
        mediaContent
      )}

      <div className="p-5 text-center">
        <h3 className="mb-3 text-xl text-white md:text-2xl">
          {companion.companion_name}
        </h3>

        {showConvoButton ? (
          <CompanionCardAction
            cardHref={cardHref}
            enableNavigation={enableNavigation}
          />
        ) : null}
      </div>
    </motion.article>
  );
}

export default memo(CompanionCard);
