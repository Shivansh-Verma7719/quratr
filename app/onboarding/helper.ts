import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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
        .from('users')
        .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
        })
        .eq('id', user.id);

    if (userUpdateError) {
        console.error(userUpdateError);
        redirect("/error");
    }

    const { error: onboardingError } = await supabase
        .from('onboarding')
        .insert({
            user_id: user.id,
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

    if (onboardingError) {
        console.error(onboardingError);
        redirect("/error");
    }

    redirect("/");
}
