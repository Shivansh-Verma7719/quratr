import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function isOnboarded(request: NextRequest) {
  const onboardedPages = ["/discover", "/feed/", "/feed/new", "/profile/edit"];
  const urlPath = new URL(request.url).pathname;
  const isOnboardedPage = onboardedPages.some(page => urlPath.startsWith(page));

  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return false;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error checking onboarding status:", profileError);
    return false;
  }

  return profileData?.is_onboarded && isOnboardedPage;
}
