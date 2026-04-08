import MaskedDiv from "@/components/ui/masked-div";

import { FEATURED_VIDEO_SRC } from "./showcaseContent";

export function ShowcaseFeaturedVideo() {
  return (
    <div className="mt-10">
      <MaskedDiv maskType="type-2" className="mx-auto my-6 max-w-4xl">
        <video
          className="cursor-pointer transition-all duration-300"
          playsInline
          autoPlay
          loop
          muted
          preload="metadata"
        >
          <source src={FEATURED_VIDEO_SRC} type="video/mp4" />
        </video>
      </MaskedDiv>
    </div>
  );
}
