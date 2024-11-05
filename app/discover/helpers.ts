"use client";
import { createClient } from "@/utils/supabase/client";

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  [key: string]: string | number | boolean | null | undefined;
  locality: string;
  group_experience: string;
  rating: number;
  tags: string;
  city_name: string;
  matchScore: number;
  isLastCard?: boolean;
  address: string;
}

interface CityLocalityMap {
  [key: string]: string[];
}

export async function sortPlacesByPreferences(): Promise<{
  sortedPlaces: Place[];
  cityLocalityMap: CityLocalityMap;
} | null> {
  const supabase = createClient();

  // Get user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  // fetch concurrently
  const [
    { data: preferencesData, error: preferencesError },
    { data: dislikedPlacesData, error: dislikedPlacesError },
    { data: likedPlacesData, error: likedPlacesError },
    { data: placesData, error: placesError },
  ] = await Promise.all([
    supabase.from("onboarding").select("*").eq("id", userData.user.id).single(),
    supabase
      .from("dislikes")
      .select("place_id")
      .eq("user_id", userData.user.id),
    supabase.from("likes").select("place_id").eq("user_id", userData.user.id),
    supabase.from("places").select("*"),
  ]);

  if (preferencesError) {
    console.error("Error fetching user preferences:", preferencesError);
    return null;
  }

  if (dislikedPlacesError) {
    console.error("Error fetching disliked places:", dislikedPlacesError);
    return null;
  }

  if (likedPlacesError) {
    console.error("Error fetching liked places:", likedPlacesError);
    return null;
  }

  if (placesError) {
    console.error("Error fetching places:", placesError);
    return null;
  }

  const dislikedPlaceIds = dislikedPlacesData.map(
    (dislike: { place_id: string }) => dislike.place_id
  );

  const likedPlaceIds = likedPlacesData.map(
    (like: { place_id: string }) => like.place_id
  );

  // Print places with null city_name
  // placesData.forEach((place: Place) => {
  //   if (!place.city_name) {
  //     console.log("Place with null city_name:", {
  //       id: place.id,
  //       name: place.name,
  //       locality: place.locality
  //     });
  //   }
  // });

  // Combine disliked and liked place IDs
  const excludedPlaceIds = new Set([...dislikedPlaceIds, ...likedPlaceIds]);

  // Filter out disliked and liked places
  const filteredPlaces = placesData.filter(
    (place: Place) => !excludedPlaceIds.has(place.id)
  );

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
    (a: Place, b: Place) => (b.matchScore as number) - (a.matchScore as number)
  );

  // Print Max Match Score
  // console.log(
  //   "Max Match Score:",
  //   Math.max(...sortedPlaces.map((place: Place) => place.matchScore))
  // );

  // console.log(placesData);
  const cityLocalityMap = createCityLocalityMap(placesData);

  const finalSortedPlaces = sortedPlaces.map((place: Place) => ({
    id: place.id,
    name: place.name,
    image: place.image,
    tags: place.tags,
    rating: place.rating,
    locality: place.locality,
    group_experience: place.group_experience,
    matchScore: place.matchScore,
    isLastCard: false,
    address: place.address,
    description: place.description,
    city_name: place.city_name,
  }));

  return {
    sortedPlaces: finalSortedPlaces,
    cityLocalityMap,
  };
}

export function createCityLocalityMap(places: Place[]): CityLocalityMap {
  return places.reduce((acc: CityLocalityMap, place) => {
    // Get city name directly from place.city_name
    let cityName = place.city_name;
    let locality = place.locality;

    if (!cityName || !locality) {
      return acc;
    }

    cityName = cityName.trim();
    locality = locality.trim();

    if (!acc[cityName]) {
      acc[cityName] = [];
    }

    // Only add locality if it's not already in the array
    if (!acc[cityName].includes(locality)) {
      acc[cityName].push(locality);
    }

    return acc;
  }, {});
}
