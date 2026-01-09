import MarketingLayout from "./layout";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ComponentsShowcase from "./components/ComponentsShowcase";
import { AppleCardsCarouselDemo } from "./components/CardsCarousel";
import Pricing from "./components/Pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stanect – AI Voice Companion to Practice Real Conversations",
  description:
    "Stanect is a full-stack AI-powered voice companion that helps people practice conversations, improve communication skills, and gain confidence. Try Stanect today!",
  keywords: [
    "AI voice companion",
    "conversation practice AI",
    "communication confidence app",
    "AI communication coach",
    "practice conversations with AI",
    "solo developer AI project",
    "Stanect AI",
  ],
  authors: [{ name: "Prince Amanor Kabutey" }],
  metadataBase: new URL("https://www.stanect.com"),
  openGraph: {
    title: "Stanect – AI Voice Companion",
    description:
      "Practice real conversations and build confidence with Stanect — a solo-built AI voice companion.",
    url: "https://www.stanect.com",
    siteName: "Stanect",
    images: [
      {
        url: "/og/stanect-og.png",
        width: 1200,
        height: 630,
        alt: "Stanect AI Voice Companion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stanect – AI Voice Companion",
    description:
      "Practice conversations, improve social skills, and gain confidence with Stanect AI.",
    images: ["/og/stanect-og.png"],
  },
};

export default function Homepage() {
  return (
    <MarketingLayout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Stanect",
            url: "https://www.stanect.com",
            description:
              "Stanect is a full-stack AI-powered voice companion that helps people practice conversations, improve communication skills, and gain confidence.",
            applicationCategory: "CommunicationApplication",
            operatingSystem: "Web",
            creator: {
              "@type": "Person",
              name: "Prince Amanor Kabutey",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              url: "https://www.stanect.com",
            },
          }),
        }}
      />

      {/* Page content */}
      <Navbar />
      <Hero />
      <ComponentsShowcase />
      <AppleCardsCarouselDemo />
      <Pricing />
      <Footer />
    </MarketingLayout>
  );
}
