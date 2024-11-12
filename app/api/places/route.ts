import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { usePlacesStore } from "@/store/placeStore";

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

function createCityLocalityMap(places: Place[]): CityLocalityMap {
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

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const supabase = createClient();
    
    // Get user ID from headers
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        {
          data: null,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // fetch user-specific data and cached places concurrently
    const [
      { data: preferencesData, error: preferencesError },
      { data: dislikedPlacesData, error: dislikedPlacesError },
      { data: likedPlacesData, error: likedPlacesError },
      placesData,
    ] = await Promise.all([
      supabase
        .from("onboarding")
        .select("*")
        .eq("id", userId)
        .single(),
      supabase
        .from("dislikes")
        .select("place_id")
        .eq("user_id", userId),
      supabase.from("likes").select("place_id").eq("user_id", userId),
      usePlacesStore.getState().fetchPlaces(), // Use the cached places
    ]);

    switch (true) {
      case !!preferencesError:
        console.error("Error fetching user preferences:", preferencesError);
        return NextResponse.json(
          {
            data: null,
            error: "Error fetching user preferences",
          },
          { status: 500 }
        );
      case !!dislikedPlacesError:
        console.error("Error fetching disliked places:", dislikedPlacesError);
        return NextResponse.json(
          {
            data: null,
            error: "Error fetching disliked places",
          },
          { status: 500 }
        );
      case !!likedPlacesError:
        console.error("Error fetching liked places:", likedPlacesError);
        return NextResponse.json(
          {
            data: null,
            error: "Error fetching liked places",
          },
          { status: 500 }
        );
      case !placesData:
        console.error("Error fetching places:");
        return NextResponse.json(
          {
            data: null,
            error: "Error fetching places",
          },
          { status: 500 }
        );
    }

    // Sort places by preferences in descending order
    const sortedPlaces = placesData.reduce((acc: Place[], place: Place) => {
      // Skip if place is in excluded set
      if (
        dislikedPlacesData.some(
          (dislike: { place_id: string }) => dislike.place_id === place.id
        ) ||
        likedPlacesData.some(
          (like: { place_id: string }) => like.place_id === place.id
        )
      ) {
        return acc;
      }

      // Calculate match score
      let matchScore = 0;
      const columnsToCheck = ["1", "2", "4", "9", "10"];

      columnsToCheck.forEach((column) => {
        if (place[column] === preferencesData[column]) {
          matchScore++;
        }
      });

      // Insert place with match score into the accumulator array in sorted order
      const placeWithScore = { ...place, matchScore };
      const insertIndex = acc.findIndex(
        (p: Place) => p.matchScore < matchScore
      );

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

    return NextResponse.json({
      data: sortedPlaces,
      cityLocalityMap,
      error: null,
    });
  } catch (error) {
    console.error("Error in places API:", error);
    return NextResponse.json(
      {
        data: null,
        error: "Failed to fetch places",
      },
      {
        status: 500,
      }
    );
  }
}
