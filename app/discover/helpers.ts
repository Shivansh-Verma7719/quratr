import { createClient } from "@/utils/supabase/client";

export async function getUser() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }
    return data;
}

export async function getUserPreferences(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("onboarding").select("*").eq("user_id", id);
    if (error) {
        console.error("Error fetching user preferences:", error);
        return null;
    }
    console.log(data)
    return data;
}
