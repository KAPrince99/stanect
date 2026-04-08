import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

import { SHOWCASE_WORDS } from "./showcaseContent";

export function ShowcaseHeading() {
  return (
    <h2 className="mx-auto max-w-7xl bg-linear-to-r from-white via-white/90 to-white/50 bg-clip-text px-4 text-center text-2xl font-extrabold leading-tight tracking-tight text-transparent sm:text-2xl md:text-3xl lg:text-5xl 2xl:text-7xl">
      <span>Feel the spark. Build unshakable </span>
      <LayoutTextFlip text="" words={SHOWCASE_WORDS} />
      <span className="mt-2 block">Zero judgement.</span>
    </h2>
  );
}
