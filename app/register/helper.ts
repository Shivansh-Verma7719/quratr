'use server';
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type FormData = {
    username: string;
    email: string;
    password: string;
}

export async function signup(formData: FormData) {
    const supabase = createClient();

    const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                username: formData.username,
            },
        },
    });

    if (signUpError) {
        console.error(signUpError);
        return { error: signUpError.message };
    }

    if (userData && userData.user) {
        return { message: "Redirecting to onboarding" };
        redirect("/onboarding");
    }

    return { error: "Failed to sign up" };
}

export async function dummy(formData: FormData) {
    // Simulate a 5-second delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(formData);

    // Simulate a successful operation
    const success = false;

    if (success) {
        return { message: "Operation completed successfully" };
    } else {
        return { error: "Operation failed" };
    }
}
