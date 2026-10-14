import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { memo } from "react";

import { usePrefetchRoute } from "@/hooks/usePrefetchRoute";
import { cn } from "@/lib/utils";
import { CompanionProps } from "@/types/types";

import CompanionOverviewCardContent from "./CompanionOverviewCardContent";
import CompanionOverviewCardMedia from "./CompanionOverviewCardMedia";

interface CompanionOverviewCardProps {
  companion: CompanionProps;
  showConvoButton?: boolean;
  enableNavigation?: boolean;
  enableHoverLift?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function CompanionOverviewCard({
  companion,
  showConvoButton = true,
  enableNavigation = true,
  enableHoverLift = true,
  isFavorite = false,
  onToggleFavorite,
}: CompanionOverviewCardProps) {
  const prefetchRoute = usePrefetchRoute();
  const cardHref = `/dashboard/${companion.id}`;
  const mediaContent = <CompanionOverviewCardMedia companion={companion} />;
  const intentHandlers = enableNavigation
    ? {
        onMouseEnter: () => prefetchRoute(cardHref),
        onFocus: () => prefetchRoute(cardHref),
        onTouchStart: () => prefetchRoute(cardHref),
      }
    : undefined;

  return (
    <motion.article
      whileHover={enableHoverLift ? { y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/5 shadow-xl"
      style={{ willChange: "transform" }}
      {...intentHandlers}
    >
      {enableNavigation ? (
        <Link href={cardHref} prefetch>
          {mediaContent}
        </Link>
      ) : (
        mediaContent
      )}

      {onToggleFavorite ? (
        // eslint-disable-next-line no-restricted-syntax -- portrait favorite toggle
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleFavorite();
          }}
          className={cn(
            "absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-opacity duration-200 hover:bg-black/75",
            "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100",
            isFavorite && "opacity-100",
          )}
        >
          <Heart
            className={cn(
              "size-4",
              isFavorite && "fill-amber-400 text-amber-400",
            )}
          />
        </button>
      ) : null}

      <CompanionOverviewCardContent
        cardHref={cardHref}
        companionName={companion.companion_name}
        showConvoButton={showConvoButton}
        enableNavigation={enableNavigation}
      />
    </motion.article>
  );
}

export default memo(CompanionOverviewCard);
