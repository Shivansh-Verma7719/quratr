"use server";
import { createClient } from "@/utils/supabase/server";

type OnboardingData = {
  onboardingAnswers: string[];
};

export async function submitOnboarding(formData: OnboardingData) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log("User not found", userError);
    return { success: false, error: userError };
  }

  const { error: onboardingError } = await supabase.from("onboarding").insert({
    id: user.id,
    "1": formData.onboardingAnswers[0] === "Yes" ? 1 : 0,
    "2": formData.onboardingAnswers[1] === "Yes" ? 1 : 0,
    "3": formData.onboardingAnswers[2] === "Yes" ? 1 : 0,
    "4": formData.onboardingAnswers[3] === "Yes" ? 1 : 0,
    "5": formData.onboardingAnswers[4] === "Yes" ? 1 : 0,
    "6": formData.onboardingAnswers[5] === "Yes" ? 1 : 0,
    "7": formData.onboardingAnswers[6] === "Yes" ? 1 : 0,
    "8": formData.onboardingAnswers[7] === "Yes" ? 1 : 0,
    "9": formData.onboardingAnswers[8] === "Yes" ? 1 : 0,
    "10": formData.onboardingAnswers[9] === "Yes" ? 1 : 0,
  });

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ is_onboarded: true })
    .eq("id", user?.id);

  if (profileError) {
    console.log(profileError);
    return { success: false, error: profileError };
  }

  if (onboardingError) {
    console.log(onboardingError);
    return { success: false, error: onboardingError };
  }

  return { success: true, error: null };
}

export async function checkOnboardingStatus() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const { data: onboardingData, error: onboardingError } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("id", user.id)
    .single();

  if (onboardingData && onboardingData.is_onboarded) {
    return { success: true, error: null };
  }

  if (onboardingError) {
    return { success: false, error: onboardingError };
  }

  return { success: false, error: "Onboarding not found" };
}
