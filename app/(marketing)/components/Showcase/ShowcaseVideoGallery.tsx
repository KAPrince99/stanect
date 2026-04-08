import { ShowcaseVideoTile } from "./ShowcaseVideoTile";
import { SHOWCASE_MOSAIC_VIDEOS } from "./showcaseContent";

export function ShowcaseVideoGallery() {
  return (
    <div className="-mt-4 flex items-center justify-center gap-6 md:-mt-16 md:gap-10 lg:-mt-20 lg:gap-14">
      {SHOWCASE_MOSAIC_VIDEOS.map((video) => (
        <ShowcaseVideoTile
          key={video.src}
          src={video.src}
          size={video.size}
          maskType={video.maskType}
          className={video.className}
        />
      ))}
    </div>
  );
}
