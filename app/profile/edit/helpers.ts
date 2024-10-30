import { createClient } from "@/utils/supabase/client";

export interface UserProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

export async function updateUserEmail(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({ email: email });

  if (error) {
    console.error("Error updating user email:", error);
    return null;
  }

  return "Email updated successfully";
}

export async function updateUserProfile(updatedProfile: Partial<UserProfile>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .update(updatedProfile)
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }

  return data;
}

export interface OnboardingPreferences {
  id: string;
  created_at: string;
  [key: string]: number | string;
}

export async function updateOnboardingPreferences(
  preferences: Partial<OnboardingPreferences>
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("onboarding")
    .upsert({ id: user.id, ...preferences })
    .single();

  if (error) {
    console.error("Error updating onboarding preferences:", error);
    return null;
  }

  return data;
}

export async function fetchOnboardingPreferences(): Promise<OnboardingPreferences | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("onboarding")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching onboarding preferences:", error);
    return null;
  }
  return data;
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
    
  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
  };
}

export async function fetchUserEmail(): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user email:", error);
    return null;
  }

  return data.user?.email || null;
}

