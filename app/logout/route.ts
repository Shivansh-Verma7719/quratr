// import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    return NextResponse.redirect('/error');
  }

  const redirectTo = "/error";
  return NextResponse.redirect(redirectTo);
}
