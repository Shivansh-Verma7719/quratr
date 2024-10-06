import { createClient } from "@/utils/supabase/server";

export async function isLoggedIn() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return !!user;
}
