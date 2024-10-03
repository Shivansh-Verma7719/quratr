"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type FormData = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function signup(formData: FormData) {
  const supabase = createClient();

  const { data: userData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (signUpError) {
    console.error(signUpError);
    return { error: signUpError.message };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userData.user?.id,
    username: formData.username,
    first_name: formData.firstName,
    last_name: formData.lastName,
    is_onboarded: false,
  });

  if (profileError) {
    console.error(profileError);
    return { error: profileError.message };
  }

  if (userData && userData.user) {
    redirect("/onboarding");
    return { error: null };
  }

  return { error: "An unexpected error occurred" };
}

// export async function dummy(formData: FormData) {
//     // Simulate a 5-second delay
//     await new Promise(resolve => setTimeout(resolve, 5000));
//     console.log(formData);

//     // Simulate a successful operation
//     const success = false;

//     if (success) {
//         return { message: "Operation completed successfully" };
//     } else {
//         return { error: "Operation failed" };
//     }
// }
