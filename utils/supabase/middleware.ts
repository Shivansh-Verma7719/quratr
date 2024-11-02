import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );
  const protectedPages = [
    "/discover",
    "/curated",
    "/feed/",
    "/profile",
    // "/settings",
    "/onboarding",
  ];

  const onboardedPages = [
    "/discover",
    "/curated",
    "/profile/edit",
  ];

  const user = await supabase.auth.getUser();

  const isProtectedPage = protectedPages.some((page) =>
    request.nextUrl.pathname.startsWith(page)
  );

  if (isProtectedPage && !user.data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the user is onboarded

  const isOnboardedPage = onboardedPages.some((page) =>
    request.nextUrl.pathname.startsWith(page)
  );

  if (isOnboardedPage && user.data.user) {
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("profiles")
      .select("is_onboarded")
      .eq("id", user.data.user.id)
      .single();

    if (onboardingError) {
      console.log("middleware error");
      console.error(onboardingError);
      return NextResponse.redirect(new URL("/error", request.url));
    }
    if (onboardingData && !onboardingData.is_onboarded) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return response;
}