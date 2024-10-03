// import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const redirectTo = request.nextUrl.clone();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    redirectTo.pathname = "/error";
    return NextResponse.redirect(redirectTo);
  }

  redirectTo.pathname = "/";
  return NextResponse.redirect(redirectTo);
}
