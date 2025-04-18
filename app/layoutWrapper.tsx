import { Providers } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CustomNavbar from "@/components/navbar";
import BottomNav from "@/components/bottomnav";
import Topbar from "@/components/topbar";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import MyStatsig from "./my-statsig";

const getUser = async () => {
  const supabase = await createClient();
  const { data: fetchedUser } = await supabase.auth.getUser();
  // Debugging line
  // console.log("Fetched user:", fetchedUser);
  return fetchedUser?.user;
};

export const getUserProfile: (
  user: User | null
) => Promise<UserProfile | null> = async (user: User | null) => {
  if (!user) {
    return null;
  }

  const supabase = await createClient();

  const { data: userData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const userProfile: UserProfile = {
    id: user?.id,
    username: userData?.username,
    first_name: userData?.first_name,
    last_name: userData?.last_name,
    email: userData?.email,
    avatar: userData?.avatar,
  };

  return userProfile;
};

export interface UserProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export default async function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const userProfile = await getUserProfile(user);

  return (
    <>
      <MyStatsig user={user || ({ id: "" } as User)}>
        <Providers attribute="class" defaultTheme="system">
          <Topbar user={user} userProfile={userProfile} />
          <CustomNavbar user={user} />
          <main className="mt-0 h-full w-full md:mb-0 md:mt-[68px]">
            {children}
          </main>
          <BottomNav user={user} />
        </Providers>
        <SpeedInsights />
      </MyStatsig>
    </>
  );
}
