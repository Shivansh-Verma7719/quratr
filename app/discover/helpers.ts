"use server";
import { createClient } from "@/utils/supabase/server";

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

  // Get all places
  const { data: placesData, error: placesError } = await supabase.from("places").select("*");
  if (placesError) {
    console.error("Error fetching places:", placesError);
    return null;
  }

  // Sort places by preferences in descending order
  const sortedPlaces = placesData.map((place: Place) => {
    let matchScore = 0;
    for (let i = 1; i <= 10; i++) {
      if (place[i.toString()] === preferencesData[i.toString()]) {
        matchScore++;
      }
    }
    return { ...place, matchScore };
  });

  sortedPlaces.sort((a: Place, b: Place) => (a.matchScore as number) - (b.matchScore as number));
  return sortedPlaces.map((place: Place) => ({
    id: place.id,
    name: place.name,
    image: place.image,
    tags: place.tags,
    rating: place.rating,
    location: place.location,
    group_experience: place.group_experience,
    matchScore: place.matchScore,
    isLastCard: false
  }));
}
