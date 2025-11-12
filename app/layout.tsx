import "./globals.css";

export const metadata = {
  title: "Tiny Voice",
  description: "Your AI voice companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
