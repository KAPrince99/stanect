import MarketingLayout from "./layout";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default async function Homepage() {
  return (
    <MarketingLayout>
      <Navbar />
      <Hero />
    </MarketingLayout>
  );
}
