import MarketingLayout from "./layout";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Scenario from "./components/Scenario";
import Demo from "./components/Demo";
import Footer from "./components/Footer";

export default async function Homepage() {
  return (
    <MarketingLayout>
      <Navbar />
      <Hero />
      <Scenario />
      <Demo />
      <Footer />
    </MarketingLayout>
  );
}
