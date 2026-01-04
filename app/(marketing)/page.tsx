import MarketingLayout from "./layout";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ComponentsShowcase from "./components/ComponentsShowcase";
import { AppleCardsCarouselDemo } from "./components/CardsCarousel";
import Pricing from "./components/Pricing";

export default function Homepage() {
  return (
    <MarketingLayout>
      <Navbar />
      <Hero />
      <ComponentsShowcase />
      <AppleCardsCarouselDemo />
      <Pricing />
      <Footer />
    </MarketingLayout>
  );
}
