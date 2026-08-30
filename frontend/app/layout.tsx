import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TripNest | Plan trips with confidence", template: "%s | TripNest" },
  description: "Travel planning, destination discovery, and personalized trip management.",
  applicationName: "TripNest",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
