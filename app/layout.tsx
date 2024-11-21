import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";

export const metadata: Metadata = {
  title: "Home",
  description: "Quratr - Your ultimate platform for curated experiecd nces.",
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
    <html>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
