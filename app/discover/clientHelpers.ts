"use client";
import { createClient } from "@/utils/supabase/client";

export async function likePlace(placeId: string) {
  const supabase = createClient();
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return null;
  }

  // Get user ID from session
  const userId = data.session?.user?.id;
  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  const { error } = await supabase.rpc("like_place", {
    p_user_id: userId,
    p_place_id: placeId,
  });

  if (error) {
    console.error("Error liking place:", error);
    return null;
  }
  return "success";
}

export async function dislikePlace(placeId: string) {
  const supabase = createClient();
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return null;
  }

  // Get user ID from session
  const userId = data.session?.user?.id;
  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  const { error } = await supabase.rpc("dislike_place", {
    p_user_id: userId,
    p_place_id: placeId,
  });

  if (error) {
    console.error("Error disliking place:", error);
    return null;
  }
  return "success";
}
