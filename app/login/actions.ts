"use server";
import { createClient } from "@/utils/supabase/server";

export async function login(data: { email: string; password: string }) {
  const supabase = await createClient();

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