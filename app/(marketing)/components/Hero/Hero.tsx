import { HeroBadge } from "./HeroBadge";
import { HeroCTA } from "./HeroCTA";
import { HeroHeadline } from "./HeroHeadline";
import { HeroTrustSignal } from "./HeroTrustSignal";

export default function Hero() {
  return (
    <section className="relative mt-25 bg-transparent">
      <div className="relative z-10 container mx-auto px-6 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <HeroBadge />
          <HeroHeadline />
          <HeroCTA />
          <HeroTrustSignal />
        </div>
      </div>
    </section>
  );
}
