// app/(marketing)/pricing/page.tsx
import PricingPage from "@/components/ui/PricingPage";
import React from "react";
import type { Metadata } from "next";

/* Page-level SEO metadata */
export const metadata: Metadata = {
  title: "Pricing – Stanect AI Voice Companion Plans",
  description:
    "Explore Stanect AI subscription plans. Choose the perfect plan to practice conversations, improve communication skills, and gain confidence.",
  keywords: [
    "Stanect AI pricing",
    "AI voice companion subscription",
    "communication AI plans",
    "Stanect plans",
    "AI social skills app pricing",
  ],
  authors: [{ name: "Prince Amanor Kabutey" }],
  metadataBase: new URL("https://www.stanect.com"),
  openGraph: {
    title: "Pricing – Stanect AI Voice Companion",
    description:
      "Choose your subscription plan for Stanect AI, the voice companion that helps you practice conversations and build confidence.",
    url: "https://www.stanect.com/pricing",
    siteName: "Stanect",
    images: [
      {
        url: "/og/pricing-og.png",
        width: 1200,
        height: 630,
        alt: "Stanect AI Pricing Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing – Stanect AI Voice Companion",
    description:
      "View Stanect AI subscription plans and choose the best one for practicing conversations and gaining confidence.",
    images: ["/og/pricing-og.png"],
  },
};

export default function Page() {
  return (
    <main className="mb-30 md:mb-15">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Stanect AI Voice Companion",
            url: "https://www.stanect.com/pricing",
            description:
              "Stanect AI subscription plans for practicing conversations and improving communication skills.",
            brand: {
              "@type": "Organization",
              name: "Stanect Software Inc.",
              url: "https://www.stanect.com",
            },
            offers: [
              {
                "@type": "Offer",
                name: "Free Plan",
                price: "0",
                priceCurrency: "USD",
                url: "https://www.stanect.com/pricing",
              },
              {
                "@type": "Offer",
                name: "Pro Plan",
                price: "9.99",
                priceCurrency: "USD",
                url: "https://www.stanect.com/pricing",
              },
              {
                "@type": "Offer",
                name: "King Plan",
                price: "19.99",
                priceCurrency: "USD",
                url: "https://www.stanect.com/pricing",
              },
            ],
          }),
        }}
      />

      <PricingPage />
    </main>
  );
}
