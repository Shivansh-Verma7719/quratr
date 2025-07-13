"use client";
import { createClient } from "@/utils/supabase/client";

type OnboardingData = {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string; // Optional avatar URL from OAuth
  userVector: number[]; // 1536-dimensional normalized vector
};

// Prepare profile data
type ProfileData = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  is_onboarded: boolean;
  vector: number[];
  avatar?: string;
  email: string;
};

export async function submitOnboarding(formData: OnboardingData) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.id || !user.email) {
    console.log("User not found", userError);
    return { success: false, error: userError };
  }

  // Use the normalized user vector directly
  const vectorValues = formData.userVector;

  const profileData: ProfileData = {
    id: user.id,
    username: formData.username,
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: user.email,
    is_onboarded: true,
    vector: vectorValues, // Store the normalized 1536-dimensional vector
  };

  // Only add avatar if it exists
  if (formData.avatarUrl) {
    profileData.avatar = formData.avatarUrl;
  }

  // Update profile with user details and vector
  const { error: profileError } = await supabase
    .from("profiles")
    .insert(profileData);

  if (profileError) {
    console.log("Profile update error:", profileError);
    return { success: false, error: profileError };
  }

  // Note: Removed old onboarding table insertion since we're using vector-based preferences now

  return { success: true, error: null };
}
