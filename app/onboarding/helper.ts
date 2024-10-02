"use client";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type OnboardingData = {
    firstName: string;
    lastName: string;
    onboardingAnswers: string[];
}

export async function submitOnboarding(formData: OnboardingData) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { error: userUpdateError } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
        })

    if (userUpdateError) {
        console.error(userUpdateError);
        redirect("/error");
    }

    const { error: onboardingError } = await supabase
        .from('onboarding')
        .insert({
            id: user.id,
            '1': formData.onboardingAnswers[0] === 'yes' ? 1 : 0,
            '2': formData.onboardingAnswers[1] === 'yes' ? 1 : 0,
            '3': formData.onboardingAnswers[2] === 'yes' ? 1 : 0,
            '4': formData.onboardingAnswers[3] === 'yes' ? 1 : 0,
            '5': formData.onboardingAnswers[4] === 'yes' ? 1 : 0,
            '6': formData.onboardingAnswers[5] === 'yes' ? 1 : 0,
            '7': formData.onboardingAnswers[6] === 'yes' ? 1 : 0,
            '8': formData.onboardingAnswers[7] === 'yes' ? 1 : 0,
            '9': formData.onboardingAnswers[8] === 'yes' ? 1 : 0,
            '10': formData.onboardingAnswers[9] === 'yes' ? 1 : 0,
        });

    // console.log(onboardingData)

    if (onboardingError) {
        console.error(onboardingError);
        redirect("/error");
    }

    redirect("/");
}

export async function checkOnboardingStatus(callbackUrl: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: onboardingData, error: onboardingError } = await supabase
        .from('onboarding')
        .select('*')
        .eq('id', user.id)
        .single();

    if (onboardingError) {
        redirect(callbackUrl);
        return true;
    }
    
    if (onboardingData) {
        redirect(callbackUrl);
        return true;
    }

    return false;
}
