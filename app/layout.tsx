import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./providers/queryProvider";
import "./globals.css";

export const metadata = {
  title: "StaNect",
  description: "Your AI voice companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth">
        <body>
          <QueryProvider>{children}</QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
