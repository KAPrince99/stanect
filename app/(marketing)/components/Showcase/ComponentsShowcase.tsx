import { ShowcaseFeaturedVideo } from "./ShowcaseFeaturedVideo";
import { ShowcaseHeading } from "./ShowcaseHeading";
import { ShowcaseVideoGallery } from "./ShowcaseVideoGallery";

export default function ComponentsShowcase() {
  return (
    <section className="overflow-x-clip py-10 md:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <ShowcaseHeading />
          <ShowcaseFeaturedVideo />
          <ShowcaseVideoGallery />
        </div>
      </div>
    </section>
  );
}
