"use client";
import { createClient } from "@/utils/supabase/client";
import { GroupMatchesResponse } from "./page";

export async function fetchGroupMatches(
  userIds: string[]
): Promise<GroupMatchesResponse> {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (!userData || userError) {
    console.error("No user found");
    return { places: [], likedByGroup: [] };
  }

  // Fetch all dislikes from selected users
  const { data: dislikes } = await supabase
    .from("dislikes")
    .select("place_id")
    .in("user_id", [userIds, userData.user.id]);

  // Get disliked place IDs
  const dislikedPlaceIds = new Set(dislikes?.map((d) => d.place_id) || []);

  // Fetch all likes from selected users
  const { data: likes } = await supabase
    .from("likes")
    .select("place_id")
    .in("user_id", userIds);

  // Get liked place IDs
  const likedPlaceIds = [...new Set(likes?.map((l) => l.place_id) || [])];

  // Fetch places excluding disliked ones
  const { data: places } = await supabase
    .from("places")
    .select("*")
    .not("id", "in", `(${Array.from(dislikedPlaceIds).join(",")})`);

    // console.log(places);
    // console.log(likedPlaceIds);

  return {
    places: places || [],
    likedByGroup: likedPlaceIds,
  };
}
