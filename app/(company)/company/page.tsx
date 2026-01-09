import { MoveRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Stanect – AI Voice Companion for Practicing Real Conversations",
  description:
    "Stanect is an AI-powered voice companion that helps people practice conversations, improve communication skills, and gain confidence. Built solo by Prince Amanor Kabutey.",
  keywords: [
    "AI voice companion",
    "conversation practice AI",
    "communication confidence app",
    "AI for social skills",
    "AI communication coach",
    "voice AI practice app",
    "AI confidence building tool",
    "practice conversations with AI",
    "AI speaking practice software",
    "solo developer AI project",
    "Stanect AI",
  ],
  authors: [{ name: "Prince Amanor Kabutey" }],
  creator: "Prince Amanor Kabutey",
  metadataBase: new URL("https://www.stanect.com"),
  alternates: {
    canonical: "https://www.stanect.com/",
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
    title: "Stanect – AI Voice Companion",
    description:
      "Practice real conversations, improve communication skills, and build confidence with Stanect — a solo-built AI voice companion.",
    url: "https://www.stanect.com/",
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
      "An AI-powered voice companion that helps you practice conversations and communicate confidently.",
    images: ["/og/stanect-og.png"],
  },
};

export default function Page() {
  return (
    <main className="flex flex-col p-5 overflow-y-auto text-gray-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Stanect",
            applicationCategory: "CommunicationApplication",
            operatingSystem: "Web",
            description:
              "Stanect is an AI-powered voice companion that helps users practice conversations and improve communication confidence.",
            url: "https://www.stanect.com/",
            creator: {
              "@type": "Person",
              name: "Prince Amanor Kabutey",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
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
        <article>
          <h1 className="text-5xl font-bold max-w-sm">
            Small Project. Crazy Impact.
          </h1>

          <p className="max-w-xl text-lg my-10 leading-10">
            Stanect is a solo-built AI voice companion designed to help people
            practice real conversations and build confidence in how they
            communicate. Whether you're preparing to talk to friends, strangers,
            family, or professional contacts, Stanect creates safe, realistic
            voice scenarios to help you grow naturally.
          </p>

          <p className="max-w-xl text-lg leading-10">
            Built end-to-end by a solo developer, Stanect combines modern
            frontend engineering, scalable backend systems, and real-time AI
            voice technology. From idea to deployment, every part of Stanect was
            crafted with care, performance, and real user impact in mind.
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
