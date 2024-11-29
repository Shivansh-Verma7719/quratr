"use client";
import { createClient } from "@/utils/supabase/client";

export async function likePlace(placeId: string) {
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      return null;
    }
    
    const { error } = await supabase
      .rpc('like_place', {
        p_user_id: userData.user.id,
        p_place_id: placeId
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

    const { error } = await supabase
      .rpc('dislike_place', {
        p_user_id: userData.user.id,
        p_place_id: placeId
      });

    if (error) {
      console.error("Error disliking place:", error);
      return null;
    }
    return "success";
}