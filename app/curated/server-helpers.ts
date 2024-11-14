import { createClient } from "@/utils/supabase/server";

export interface Place {
  id: string;
  name: string;
  image: string;
  tags: string;
  rating: number;
  location: string;
  group_experience: string;
  address: string;
}

export async function getInitialLikedPlacesAndUsername(): Promise<{
  places: Place[];
  username: string;
}> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return { places: [], username: "" };

  // Get username
  const { data: usernameData, error: usernameError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (usernameError) return { places: [], username: "" };

  // Get initial liked places
  const { data: likedPlacesData, error: likedPlacesError } = await supabase
    .from("likes")
    .select("place_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(0, 9);

  if (likedPlacesError) return { places: [], username: "" };

  const likedPlaceIds = likedPlacesData.map((like) => like.place_id);
  if (likedPlaceIds.length === 0) return { places: [], username: "" };

  // Fetch details of liked places
  const { data: placesData, error: placesError } = await supabase
    .from("places")
    .select("*")
    .in("id", likedPlaceIds);

  if (placesError) return { places: [], username: "" };

  const sortedPlaces = likedPlaceIds
    .map((id) => placesData?.find((place) => place.id === id))
    .filter((place): place is Place => place !== undefined);

  return {
    places: sortedPlaces || [],
    username: usernameData.username || "",
  };
}
