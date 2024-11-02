"use client";
import { createClient } from "@/utils/supabase/client";

export async function likePlace(placeId: string) {
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      return null;
    }
    const user = userData.user;
    const { error } = await supabase.from("likes").insert({
      user_id: user.id,
      place_id: placeId,
    });
  
    if (error) {
      console.error("Error liking place:", error);
      return null;
    }
    return "success";
  }
  
  export async function dislikePlace(placeId: string) {
    const supabase = createClient();
  
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      return null;
    }
    const user = userData.user;
  
    const { error } = await supabase.from("dislikes").insert({
      user_id: user.id,
      place_id: placeId,
    });
    if (error) {
      console.error("Error disliking place:", error);
      return null;
    }
    return "success";
  }