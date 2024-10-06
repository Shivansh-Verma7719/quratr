"use server";
import { createClient } from "@/utils/supabase/server";

export async function login(data: { email: string; password: string }) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function isLoggedIn() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return { success: true, error: null };
  }
  return { success: false, error: "User not found" };
}