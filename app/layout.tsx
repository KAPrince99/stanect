import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./providers/queryProvider";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";
import type { Metadata } from "next"; // Import Metadata type

// Primary font (body + UI)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

// Display font (hero titles, big text)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["700"],
});

// *** START PWA METADATA MIGRATION ***

export const metadata: Metadata = {
  title: "StaNect",
  description: "Stanect - AI-powered voice companion",
  // PWA & THEME COLOR METADATA
  manifest: "/manifest.json", // Next.js links to your dynamic app/manifest.ts
  themeColor: "#0b1a36", // Sets the theme color for the browser/status bar
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
  // FAVICON
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png", // Standard touch icon
  },
  // APPLE-SPECIFIC PWA METADATA (These are not directly supported in the metadata object)
  // The remaining iOS tags need to be manually placed in the <head> or handled by the App Router.
  // We'll keep the few manual tags that Metadata API doesn't handle easily below.
};

// *** END PWA METADATA MIGRATION ***

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {/*
          *** MANUAL <HEAD> TAGS FOR iOS PWA SUPPORT ***
          The following tags MUST remain here because the Next.js Metadata API
          does not currently support them directly (like apple-mobile-web-app-capable).
          ALL other PWA meta tags have been moved to 'export const metadata' above.
        */}
        <head>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="apple-mobile-web-app-title" content="Stanect" />
          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="/icon-512x512.png"
          />
          {/* iOS Splash Screens (Must be links, so they stay here) */}
          <link
            rel="apple-touch-startup-image"
            href="/splash/splash-1170x2532.png"
            media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/splash/splash-1284x2778.png"
            media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
          />
        </head>
        <body>
          <ScrollToTop />
          <QueryProvider>{children}</QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
