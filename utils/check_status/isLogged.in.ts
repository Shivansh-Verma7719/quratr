import { createClient } from "@/utils/supabase/server";
import { NextRequest } from 'next/server';

export async function isLoggedIn(request: NextRequest) {
  const protectedPages = ["/discover", "/feed/", "/feed/new", "/onboarding"];
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error checking user login status:', error.message);
    return false;
  }

  const urlPath = new URL(request.url).pathname;
  const isProtectedPage = protectedPages.some(page => urlPath.startsWith(page));

  return !!user && isProtectedPage;
}
