import { NextResponse } from "next/server";

interface Place {
  id: string;
  city_name: string;
  locality: string;
}

interface CityLocalityMap {
  [key: string]: string[];
}

function createCityLocalityMap(places: Place[]): CityLocalityMap {
  return places.reduce((acc: CityLocalityMap, place) => {
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

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Get places from request payload
    const { places } = await request.json();

    if (!places || !Array.isArray(places)) {
      return NextResponse.json(
        {
          data: null,
          error: "Invalid places data",
        },
        { status: 400 }
      );
    }

    const cityLocalityMap = createCityLocalityMap(places);

    return NextResponse.json({
      data: cityLocalityMap,
      error: null,
    });
  } catch (error) {
    console.error("Error in locality map API:", error);
    return NextResponse.json(
      {
        data: null,
        error: `Failed to generate locality map: ${error}`,
      },
      { status: 500 }
    );
  }
}
