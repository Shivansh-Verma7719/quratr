"use client";
import { createClient } from "@/utils/supabase/client";

type OnboardingData = {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string; // Optional avatar URL from OAuth
  onboardingAnswers: string[];
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

  // Convert onboarding answers to float array for vector field
  const vectorValues = formData.onboardingAnswers.map((answer) =>
    answer === "Yes" ? 1.0 : 0.0
  );

  const profileData: ProfileData = {
    id: user.id,
    username: formData.username,
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: user.email,
    is_onboarded: true,
    vector: vectorValues, // Store the vector representation of user preferences
  };

  // Only add avatar if it exists
  if (formData.avatarUrl) {
    profileData.avatar = formData.avatarUrl;
  }

  // Update profile with user details and vector
  const { error: profileError } = await supabase
    .from("profiles")
    .insert(profileData)

  if (profileError) {
    console.log("Profile update error:", profileError);
    return { success: false, error: profileError };
  }

  // Insert onboarding answers
  const { error: onboardingError } = await supabase.from("onboarding").insert({
    id: user.id,
    "1": formData.onboardingAnswers[0] === "Yes" ? 1 : 0,
    "2": formData.onboardingAnswers[1] === "Yes" ? 1 : 0,
    "4": formData.onboardingAnswers[2] === "Yes" ? 1 : 0,
    "9": formData.onboardingAnswers[3] === "Yes" ? 1 : 0,
    "10": formData.onboardingAnswers[4] === "Yes" ? 1 : 0,
  });

  if (onboardingError) {
    console.log("Onboarding error:", onboardingError);
    return { success: false, error: onboardingError };
  }

  return { success: true, error: null };
}