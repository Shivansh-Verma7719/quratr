// New file: app/api/search/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import sampleResponse from "./sample-response.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const debug = searchParams.get("debug");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  // Return sample response in debug mode
  if (debug === "true") {
    console.log("Returning sample response data for debugging");
    // Add a small delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json(sampleResponse);
  }

  try {
    const response = await axios.get(`http://api.quratr.com/v1/search`, {
      params: { query },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch data from the API" },
      { status: 500 }
    );
  }
}
