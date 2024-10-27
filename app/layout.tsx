import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Home",
  description: "Quratr - Your ultimate platform for curated experiecd nces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
      >
        {children}
        <SpeedInsights /> 
      </body>
    </html>
  );
}
