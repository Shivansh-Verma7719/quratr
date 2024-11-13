import { Providers } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CustomNavbar from "@/components/navbar";
import BottomNav from "@/components/bottomnav";
import Topbar from "@/components/topbar";
import MobileThemeSwitcher from "@/components/mobileThemeSwitcher";
import { Analytics } from "@vercel/analytics/react";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
// import { useUserStore } from "@/store/userStore";

const getUser = async () => {
  const supabase = createClient();
  const { data: fetchedUser } = await supabase.auth.getUser();
  return fetchedUser?.user;
};

export const getUserProfile: (
  user: User | null
) => Promise<UserProfile | null> = async (user: User | null) => {
  if (!user) {
    return null;
  }

  const supabase = createClient();

  const { data: userData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const userProfile: UserProfile = {
    username: userData?.username,
    first_name: userData?.first_name,
    last_name: userData?.last_name,
    email: userData?.email,
  };

  return userProfile;
};

export interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default async function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const userProfile = await getUserProfile(user);

  // useUserStore.getState().setUser(user);
  // useUserStore.getState().setUserProfile(userProfile);

  return (
    <>
      <Providers>
        <Topbar user={user} userProfile={userProfile} />
        <CustomNavbar user={user} />
        <main className="md:mt-[68px] mt-0 mb-16 md:mb-0 w-full h-full">
          {children}
        </main>
        <MobileThemeSwitcher />
        <BottomNav user={user} />
      </Providers>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
