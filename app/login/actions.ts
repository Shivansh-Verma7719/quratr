"use server";
import { createClient } from "@/utils/supabase/server";

export async function login(data: { email: string; password: string }) {
  const supabase = createClient();

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  console.log(user);

  if (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }
  const { data: { user: tuser } } = await supabase.auth.getUser();
  console.log("User data:", tuser);

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