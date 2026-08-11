import type { Metadata } from "next";

import CompanyAbout from "./CompanyAbout";

export const metadata: Metadata = {
  title:
    "About Stanect – Solo-Built AI Voice Companion by Prince Amanor Kabutey",
  description:
    "Learn about Stanect, the solo-built AI voice companion by Prince Amanor Kabutey. Discover the mission, journey, and vision behind this product designed to help people practice conversations and gain confidence.",
  keywords: [
    "Stanect AI",
    "AI voice companion founder story",
    "Prince Amanor Kabutey",
    "solo developer AI app",
    "communication AI mission",
    "AI product journey",
  ],
  authors: [{ name: "Prince Amanor Kabutey" }],
  creator: "Prince Amanor Kabutey",
  metadataBase: new URL("https://www.stanect.com"),
  alternates: {
    canonical: "https://www.stanect.com/company",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "About Stanect – Solo-Built AI Voice Companion",
    description:
      "Discover the story, mission, and vision behind Stanect, the AI voice companion built by Prince Amanor Kabutey.",
    url: "https://www.stanect.com/company",
    siteName: "Stanect",
    images: [
      {
        url: "/founder_photo.jpg",
        width: 500,
        height: 500,
        alt: "Prince Amanor Kabutey, creator of Stanect AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Stanect – Solo-Built AI Voice Companion",
    description:
      "Meet Prince Amanor Kabutey, founder of Stanect AI. Learn about the journey, mission, and vision behind this AI-powered voice companion.",
    images: ["/founder_photo.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Stanect",
            url: "https://www.stanect.com",
            description:
              "Stanect is a solo-built AI-powered voice companion by Prince Amanor Kabutey, helping people practice conversations and gain confidence.",
            applicationCategory: "CommunicationApplication",
            operatingSystem: "Web",
            creator: {
              "@type": "Person",
              name: "Prince Amanor Kabutey",
              sameAs: "https://www.linkedin.com/in/prince-amanor-kabutey",
            },
          }),
        }}
      />
      <CompanyAbout />
    </>
  );
}
