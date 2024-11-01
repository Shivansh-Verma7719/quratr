"use client";
import { createClient } from "@/utils/supabase/client";

export type User = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

export const getUser = async () => {
  const supabase = createClient();
  const { data: fetchedUser } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", fetchedUser?.user?.id)
    .single();

  const user: User = {
    username: userData?.username,
    first_name: userData?.first_name,
    last_name: userData?.last_name,
    email: fetchedUser?.user?.email || "",
  };

  return user;
};
