import type { Metadata } from "next";
import "@/app/globals.css";
import { isLoggedIn } from "@/utils/check_status/isLogged.in";
import { isOnboarded } from "@/utils/check_status/isOnboarded";
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
  const onboarded = await isOnboarded();

  if (!onboarded) {
    redirect('/app/onboarding');
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
