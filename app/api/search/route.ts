import { NextResponse } from "next/server";
import axios from "axios";
import sampleResponse from "./sample-response.json";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, userAttributes } = body;
    const debug = body.debug;

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

    // Prepare the request payload
    const payload = {
      query: query,
      user_attributes: userAttributes || [0, 0, 0, 0, 0],
    };

    // console.log("Sending request to API:", payload);

    const response = await axios.post(
      `http://api.quratr.com/v1/search`,
      payload
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch data from the API" },
      { status: 500 }
    );
  }
}
