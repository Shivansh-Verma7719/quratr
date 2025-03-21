"use server";
import { createClient } from "@/utils/supabase/server";

type FormData = {
  email: string;
  password: string;
};

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const { data: userData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (signUpError) {
    console.log(signUpError);
    return { success: false, error: signUpError.message };
  }

  if (userData && userData.user) {
    return { success: true, error: null };
  }

  return { success: false, error: "An unexpected error occurred" };
}
