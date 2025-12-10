import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./providers/queryProvider";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";

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

export const metadata = {
  title: "StaNect",
  description: "Speak with confidence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <head>
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
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
