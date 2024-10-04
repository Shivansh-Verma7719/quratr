"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(data: { email: string; password: string }) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.log(error.message);
    return error.message;
  }

  return redirect("/discover");
}

export async function isLoggedIn() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/discover");
  }
}