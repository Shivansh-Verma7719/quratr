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
    "/feed/",
    "/profile",
    "/settings",
    "/onboarding",
  ];

  const onboardedPages = ["/discover", "/feed/", "/profile", "/settings"];

  const user = await supabase.auth.getUser();

  // Check if the page is protected
  const isProtectedPage = protectedPages.some((page) =>
    request.nextUrl.pathname.startsWith(page)
  );

  if (isProtectedPage && user.error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the page is onboarded

  const isOnboardedPage = onboardedPages.some((page) =>
    request.nextUrl.pathname.startsWith(page)
  );

  if (isOnboardedPage && !user.error) {
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("onboarding")
      .select("id")
      .eq("id", user.data.user?.id)
      .single();

    console.log(onboardingError)

    if (onboardingError || !onboardingData) {
      return NextResponse.redirect(new URL("/onboarding?callbackUrl=" + request.url, request.url));
    }
  }

  return response;
}
