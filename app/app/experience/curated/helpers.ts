import { createClient } from "@/utils/supabase/client";

export async function fetchLikedPlaces() {
  const supabase = createClient();

  // Get user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  // Get liked places
  const { data: likedPlacesData, error: likedPlacesError } = await supabase
    .from("likes")
    .select("place_id")
    .eq("user_id", userData.user.id);

  if (likedPlacesError) {
    console.error("Error fetching liked places:", likedPlacesError);
    return null;
  }

  const likedPlaceIds = likedPlacesData.map(
    (like: { place_id: string }) => like.place_id
  );

  // Fetch details of liked places
  const { data: placesData, error: placesError } = await supabase
    .from("places")
    .select("*")
    .in("id", likedPlaceIds);

  if (placesError) {
    console.error("Error fetching place details:", placesError);
    return null;
  }

  return placesData;
}

export async function fetchUsername() {
  const supabase = createClient();

  // Get user
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  const { data: usernameData, error: usernameError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userData.user.id)
    .single();

  if (usernameError) {
    console.error("Error fetching username:", usernameError);
    return null;
  }
  return usernameData.username || "User";
}
