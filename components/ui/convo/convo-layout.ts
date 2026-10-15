/**
 * Globe fills leftover stage height and width, capped at the old 2xl size.
 * The stage is a size container so 100cqh / 100cqi track that hole, not the
 * window. Chrome's shorter viewport then shrinks the ball instead of
 * crushing the gap to Start Call.
 */
export const CONVO_GLOBE_STAGE =
  "@container relative mx-auto flex h-full min-h-0 w-full flex-1 items-center justify-center [container-type:size]";

export const CONVO_GLOBE_SIZE =
  "relative aspect-square size-[min(26rem,100cqi,100cqh)]";
