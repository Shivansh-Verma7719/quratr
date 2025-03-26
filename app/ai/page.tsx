import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AIRecommenderClient from "./ai-client";
import { UserProfile } from "@/app/ai";

export default async function AIPage() {
  // Initialize the server Supabase client
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Check if the user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Redirect to login if no user
    redirect("/login");
  }

  // Fetch the user profile
  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Prepare the user profile to be passed to client component
  let userProfile: UserProfile | null = null;
  
  if (!error && profileData) {
    userProfile = {
      id: profileData.id,
      username: profileData.username,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: user.email || '',
      avatar: profileData.avatar,
      is_onboarded: profileData.is_onboarded,
      created_at: profileData.created_at
    };
  }

  // Render the client component with pre-fetched user profile
  return <AIRecommenderClient userProfile={userProfile} />;
}