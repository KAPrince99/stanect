import MarketingLayout from "./layout";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Scenario from "./components/Scenario";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import ComponentsShowcase from "./components/ComponentsShowcase";
import { AppleCardsCarouselDemo } from "./components/CardsCarousel";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";

export default async function Homepage() {
  return (
    <MarketingLayout>
      <Navbar />
      <Hero />
      <ComponentsShowcase />
      <AppleCardsCarouselDemo />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      {/* <Scenario /> */}
      {/* <Demo /> */}
      <Footer />
    </MarketingLayout>
  );
}
