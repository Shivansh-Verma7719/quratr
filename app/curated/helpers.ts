import { createClient } from "@/utils/supabase/client";
import { Place } from "./server-helpers";

export async function fetchMoreLikedPlaces(
  start: number,
  limit: number
): Promise<Place[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return [];

  const { data: likedPlacesData, error: likedPlacesError } = await supabase
    .from("likes")
    .select("place_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(start, start + limit - 1);

  if (likedPlacesError) return [];

  const likedPlaceIds = likedPlacesData.map((like) => like.place_id);
  if (likedPlaceIds.length === 0) return [];

  const { data: placesData, error: placesError } = await supabase
    .from("places")
    .select("*")
    .in("id", likedPlaceIds);

  if (placesError) return [];

  return placesData.reverse() || [];
}

// Add this new function to helpers.ts
export async function deleteLikedPlace(placeId: string) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) return false;
  
  const { error } = await supabase
    .from("likes")
    .delete()
    .match({ user_id: user.id, place_id: placeId });
    
  return !error;
}