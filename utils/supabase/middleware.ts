import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const protectedPages = [
    "/discover",
    "/curated",
    "/feed/",
    "/profile",
    "/api/places",
    "/onboarding",
  ];

  const apiPages = ["/api/places"];

  const onboardedPages = ["/discover", "/curated", "/profile/edit", "/group_swipe"];

  const loginPages = ["/login", "/register"];

  const user = await supabase.auth.getUser();

  const isProtectedPage = protectedPages.some((page) =>
    request.nextUrl.pathname.startsWith(page)
  );

  if (isProtectedPage && !user.data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isLoginPage = loginPages.some((page) =>
    request.nextUrl.pathname.startsWith(page)
  );

  if (isLoginPage && user.data.user) {
    return NextResponse.redirect(new URL("/discover", request.url));
  }

  // set api user-id header
  if (apiPages.some((page) => request.nextUrl.pathname.startsWith(page))) {
    supabaseResponse.headers.set("user-id", user.data.user?.id || "");
    return supabaseResponse;
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

    if (onboardingError && isOnboardedPage) {
      console.log("middleware error");
      console.error(onboardingError);
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    if (onboardingData && !onboardingData.is_onboarded) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return supabaseResponse;
}
