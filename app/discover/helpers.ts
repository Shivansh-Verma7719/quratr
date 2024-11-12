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

  switch (true) {
    case !!preferencesError:
      console.error("Error fetching user preferences:", preferencesError);
      return null;
    case !!dislikedPlacesError:
      console.error("Error fetching disliked places:", dislikedPlacesError); 
      return null;
    case !!likedPlacesError:
      console.error("Error fetching liked places:", likedPlacesError);
      return null;
    case !!placesError:
      console.error("Error fetching places:", placesError);
      return null;
  }

  // Sort places by preferences in descending order
  const sortedPlaces = placesData.reduce((acc, place: Place) => {
    // Skip if place is in excluded set
    if (
      dislikedPlacesData.some((dislike: { place_id: string }) => dislike.place_id === place.id) ||
      likedPlacesData.some((like: { place_id: string }) => like.place_id === place.id)
    ) {
      return acc;
    }

    // Calculate match score
    let matchScore = 0;
    const columnsToCheck = ['1', '2', '4', '9', '10'];
    
    columnsToCheck.forEach(column => {
      if (place[column] === preferencesData[column]) {
        matchScore++;
      }
    });

    // Insert place with match score into the accumulator array in sorted order
    const placeWithScore = { ...place, matchScore };
    const insertIndex = acc.findIndex((p: Place) => p.matchScore < matchScore);
    
    if (insertIndex === -1) {
      acc.push(placeWithScore);
    } else {
      acc.splice(insertIndex, 0, placeWithScore);
    }

    return acc;
  }, [] as Place[]);

  // Print Max Match Score
  // console.log(
  //   "Max Match Score:",
  //   Math.max(...sortedPlaces.map((place: Place) => place.matchScore))
  // );

  const cityLocalityMap = createCityLocalityMap(placesData);

  return {
    sortedPlaces,
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
