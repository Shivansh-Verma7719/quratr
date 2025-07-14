import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get user ID from session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = sessionData.session.user.id;

    // Call the recommend RPC function
    const { data: places, error } = await supabase.rpc("recommend", {
      user_id: userId,
      limit_count: limit,
      offset_count: offset,
    });

    if (error) {
      console.error("Error calling recommend function:", error);
      return NextResponse.json(
        { error: "Failed to fetch recommendations" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      places: places || [],
      error: null,
    });
  } catch (error) {
    console.error("Error in recommendations API:", error);
    return NextResponse.json(
      { error: `Failed to fetch recommendations: ${error}` },
      { status: 500 }
    );
  }
}
