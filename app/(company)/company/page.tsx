import { MoveRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";

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
    canonical: "https://www.stanect.com/about",
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
    url: "https://www.stanect.com/about",
    siteName: "Stanect",
    images: [
      {
        url: "/avatars/avatar_0.jpg",
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
    images: ["/avatars/avatar_0.jpg"],
  },
};

export default function AboutPage() {
  return (
    <main className="flex flex-col p-5 overflow-y-auto text-gray-200">
      {/* Structured Data for About page */}
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

      <header className="text-sm mb-4">
        <Link href="/" className="hover:underline">
          Stanect Software Inc.
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 place-content-center gap-10 my-10">
        {/* Main Content */}
        <article>
          <h1 className="text-5xl font-bold max-w-sm">
            Small Project. Big Vision.
          </h1>

          <p className="max-w-xl text-lg my-10 leading-10">
            Stanect is a solo-built AI voice companion created by Prince Amanor
            Kabutey, designed to help people practice real conversations and
            gain confidence in communication. This page shares the journey,
            mission, and vision behind the product.
          </p>

          <p className="max-w-xl text-lg leading-10">
            From idea to deployment, Stanect was built end-to-end by a solo
            developer, combining frontend, backend, and AI voice technology to
            create a meaningful experience for users.
          </p>

          <div className="max-w-xl text-lg leading-10 my-6 space-y-3">
            <Link
              href="https://www.stanect.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 underline"
            >
              Try Stanect AI Voice Companion <MoveRight />
            </Link>

            <Link
              href="https://github.com/KAPrince99/stanect"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 underline"
            >
              Stanect AI on GitHub <MoveRight />
            </Link>
          </div>
        </article>

        {/* Image / Visual */}
        <aside className="flex items-center justify-center">
          <Image
            src="/avatars/avatar_0.jpg"
            alt="Prince Amanor Kabutey, solo developer and creator of Stanect AI"
            width={500}
            height={500}
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="rounded-lg object-cover"
          />
        </aside>
      </section>
    </main>
  );
}
