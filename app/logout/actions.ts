"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function logout() {
    const supabase = createClient();
  
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error)
      redirect("/error");
    }
  
    return 'Logged out';
  }