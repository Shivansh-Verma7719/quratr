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
      <body
      >
        {children}
        <SpeedInsights /> 
      </body>
    </html>
  );
}
