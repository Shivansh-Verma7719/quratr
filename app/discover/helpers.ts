"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data;
}

export async function getUserPreferences(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("onboarding")
    .select("*")
    .eq("id", id);
  if (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }
  console.log(data);
  return data;
}

export async function getAllPlaces() {
  const supabase = createClient();
  const { data, error } = await supabase.from("places").select("*");
  if (error) {
    console.error("Error fetching places:", error);
    return null;
  }
  return data;
}

interface Place {
  name: string;
  address?: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface Preferences {
  [key: string]: string | number | boolean | null | undefined;
}

export async function sortPlacesByPreferences(places: Place[], preferences: Preferences) {
  const sortedPlaces = places.map(place => {
    let matchScore = 0;
    for (let i = 1; i <= 10; i++) {
      if (place[i.toString()] === preferences[i.toString()]) {
        matchScore++;
      }
    }
    return { ...place, matchScore };
  });

  sortedPlaces.sort((a, b) => b.matchScore - a.matchScore);
  return sortedPlaces;
}
