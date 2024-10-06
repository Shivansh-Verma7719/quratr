"use client";
import { createClient } from "@/utils/supabase/client";

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  [key: string]: string | number | boolean | null | undefined;
  isLastCard?: boolean;
}

export async function sortPlacesByPreferences() {
  const supabase = createClient();

  // Get user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  // Get user preferences
  const { data: preferencesData, error: preferencesError } = await supabase
    .from("onboarding")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (preferencesError) {
    console.error("Error fetching user preferences:", preferencesError);
    return null;
  }

  // Get disliked places
  const { data: dislikedPlacesData, error: dislikedPlacesError } = await supabase
    .from("dislikes")
    .select("place_id")
    .eq("user_id", userData.user.id);

  if (dislikedPlacesError) {
    console.error("Error fetching disliked places:", dislikedPlacesError);
    return null;
  }

  const dislikedPlaceIds = dislikedPlacesData.map((dislike: { place_id: string }) => dislike.place_id);

  // Get liked places
  const { data: likedPlacesData, error: likedPlacesError } = await supabase
    .from("likes")
    .select("place_id")
    .eq("user_id", userData.user.id);

  if (likedPlacesError) {
    console.error("Error fetching liked places:", likedPlacesError);
    return null;
  }

  const likedPlaceIds = likedPlacesData.map((like: { place_id: string }) => like.place_id);

  // Combine disliked and liked place IDs
  const excludedPlaceIds = new Set([...dislikedPlaceIds, ...likedPlaceIds]);

  // Get all places
  const { data: placesData, error: placesError } = await supabase
    .from("places")
    .select("*");
  if (placesError) {
    console.error("Error fetching places:", placesError);
    return null;
  }

  // Filter out disliked and liked places
  const filteredPlaces = placesData.filter((place: Place) => !excludedPlaceIds.has(place.id));

  // Sort places by preferences in descending order
  const sortedPlaces = filteredPlaces.map((place: Place) => {
    let matchScore = 0;
    for (let i = 1; i <= 10; i++) {
      if (place[i.toString()] === preferencesData[i.toString()]) {
        matchScore++;
      }
    }
    return { ...place, matchScore };
  });

  sortedPlaces.sort(
    (a: Place, b: Place) => (a.matchScore as number) - (b.matchScore as number)
  );
  return sortedPlaces.map((place: Place) => ({
    id: place.id,
    name: place.name,
    image: place.image,
    tags: place.tags,
    rating: place.rating,
    location: place.location,
    group_experience: place.group_experience,
    matchScore: place.matchScore,
    isLastCard: false,
  }));
}

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
