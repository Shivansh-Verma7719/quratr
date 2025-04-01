import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AIRecommenderClient from "./ai-client";
import { UserProfile } from "@/types/ai";

export default async function AIPage() {
  // Initialize the server Supabase client
  const supabase = await createClient();

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

  // Fetch the user preferences
  const { data: preferencesData, error: prefError } = await supabase
    .from("onboarding")
    .select("1, 2, 4, 9, 10")
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

  // Extract user attributes from preferences data
  const userAttributes = !prefError && preferencesData
    ? [
      preferencesData["1"] || 0,
      preferencesData["2"] || 0,
      preferencesData["4"] || 0,
      preferencesData["9"] || 0,
      preferencesData["10"] || 0
    ]
    : [0, 0, 0, 0, 0];

  // Render the client component with pre-fetched user profile and attributes
  return <AIRecommenderClient userProfile={userProfile} userAttributes={userAttributes} />;
}