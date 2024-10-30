import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CustomNavbar from "@/components/navbar";
import BottomNav from "@/components/bottomnav";
import Topbar from "@/components/topbar";
import { Providers } from "./providers";
import MobileThemeSwitcher from "@/components/mobileThemeSwitcher";
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
      <body>
        <Providers>
          <Topbar />
          <CustomNavbar />
          <main className="md:mt-[68px] mt-0 mb-16 md:mb-0 w-full h-full">
            {children}
          </main>
          <MobileThemeSwitcher />
          <BottomNav />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
