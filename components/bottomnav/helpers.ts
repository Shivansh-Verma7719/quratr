"use client";
import { createClient } from "@/utils/supabase/client";

export const checkLoggedIn = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
};
