import { createClient } from "@/utils/supabase/server";

export async function isOnboarded() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("id", user?.id)
    .single();

  if (profileError) {
    console.error("Error checking onboarding status:", profileError);
    return false;
  }

    return profileData?.is_onboarded;
}
