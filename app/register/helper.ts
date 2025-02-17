"use server";
import { createClient } from "@/utils/supabase/server";

type FormData = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userData.user?.id,
    username: formData.username,
    first_name: formData.firstName,
    last_name: formData.lastName,
    is_onboarded: false,
  });

  if (profileError) {
    console.log(profileError);
    return { success: false, error: profileError.message };
  }

  if (userData && userData.user) {
    return { success: true, error: null };
  }

  return { success: false, error: "An unexpected error occurred" };
}
