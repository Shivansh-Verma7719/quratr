import type { Metadata } from "next";
import "@/app/globals.css";
import { isLoggedIn } from "@/utils/check_status/isLogged.in";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
  description: "Quratr - Your ultimate platform for curated experinces.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect('/login');
  }
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}