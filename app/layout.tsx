import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Quratr",
    template: "%s | Quratr",
  },
  description:
    "Discover and explore personalized experiences with Quratr. Your ultimate platform for curated adventures, local discoveries, and memorable moments.",
  keywords: [
    "experiences",
    "curated",
    "discovery",
    "local",
    "adventures",
    "personalized",
  ],
  authors: [{ name: "Quratr" }],
  openGraph: {
    title: "Quratr - Your Personalized App for Curated Experiences",
    description:
      "Discover personalized experiences with a swipe. Join Quratr today!",
    url: "https://quratr.com",
    siteName: "Quratr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://quratr.com/images/logo.png",
        alt: "Quratr - Your Personalized App for Curated Experiences",
      },
    ],
    site: "@quratr",
    title: "Quratr - Your Personalized App for Curated Experiences",
    description:
      "Discover personalized experiences with a swipe. Join Quratr today!",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
