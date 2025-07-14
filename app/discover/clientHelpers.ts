"use client";
import { createClient } from "@/utils/supabase/client";

interface Place {
  place_id: number;
  name: string;
  image: string;
  rating: string;
  cuisine: string[];
  price: number;
  description: string;
  address: string;
  city: string;
  similarity: number;
}

export async function getUserVector(): Promise<number[] | null> {
  const supabase = createClient();
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return null;
  }

  const userId = data.session?.user?.id;
  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  const { data: userData, error } = await supabase
    .from("profiles")
    .select("vector_v2")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user vector:", error);
    return null;
  }

  return userData?.vector_v2 || null;
}

export async function updateUserVector(newVector: number[]): Promise<boolean> {
  const supabase = createClient();
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return false;
  }

  const userId = data.session?.user?.id;
  if (!userId) {
    console.error("No authenticated user found");
    return false;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ vector_v2: newVector })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user vector:", error);
    return false;
  }

  return true;
}

export async function fetchPlacesChunk(
  limit: number = 10,
  offset: number = 0
): Promise<Place[] | null> {
  try {
    const response = await fetch(
      `/api/recommendations?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      console.error("Failed to fetch recommendations:", response.statusText);
      return null;
    }

    const result = await response.json();

    if (result.error) {
      console.error("Error from recommendations API:", result.error);
      return null;
    }

    return result.places || [];
  } catch (error) {
    console.error("Error fetching places chunk:", error);
    return null;
  }
}

export async function getPlaceEmbedding(
  placeId: number
): Promise<number[] | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("place_vectors")
    .select("embedding")
    .eq("place_id", placeId)
    .single();

  if (error) {
    console.error("Error fetching place embedding:", error);
    return null;
  }

  return data?.embedding || null;
}

export function updateVector(
  current: number[],
  embedding: number[],
  signal: number,
  alpha: number = 0.1
): number[] {
  const updated = current.map(
    (u, i) => u + alpha * signal * (embedding[i] || 0)
  );
  const norm = Math.hypot(...updated) || 1;
  return updated.map((x) => x / norm);
}

export async function likePlace(placeId: string) {
  const supabase = createClient();
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return null;
  }

  // Get user ID from session
  const userId = data.session?.user?.id;
  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  const { error } = await supabase.rpc("like_place", {
    p_user_id: userId,
    p_place_id: placeId,
  });

  if (error) {
    console.error("Error liking place:", error);
    return null;
  }
  return "success";
}

export async function dislikePlace(placeId: string) {
  const supabase = createClient();
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return null;
  }

  // Get user ID from session
  const userId = data.session?.user?.id;
  if (!userId) {
    console.error("No authenticated user found");
    return null;
  }

  const { error } = await supabase.rpc("dislike_place", {
    p_user_id: userId,
    p_place_id: placeId,
  });

  if (error) {
    console.error("Error disliking place:", error);
    return null;
  }
  return "success";
}
