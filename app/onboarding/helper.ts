"use client";
import { createClient } from "@/utils/supabase/client";
import { Place } from "@/types/place";
import { calculateGlobalMean } from "@/utils/vectors/utils";

type OnboardingData = {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string; // Optional avatar URL from OAuth
  userVector: number[]; // 1536-dimensional normalized vector
};

// Prepare profile data
type ProfileData = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  is_onboarded: boolean;
  vector_v2: number[];
  avatar?: string;
  email: string;
};

export async function submitOnboarding(formData: OnboardingData) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.id || !user.email) {
    console.log("User not found", userError);
    return { success: false, error: userError };
  }

  console.log("Submitting onboarding for user:", user.id);

  const profileData: ProfileData = {
    id: user.id,
    username: formData.username,
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: user.email,
    is_onboarded: true,
    vector_v2: formData.userVector, // Store the normalized 1536-dimensional vector
  };

  // Only add avatar if it exists
  if (formData.avatarUrl) {
    profileData.avatar = formData.avatarUrl;
  }

  // Update profile with user details and vector
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert<ProfileData>(profileData);

  console.log("Profile data:", profileData);
  console.log("Profile update error:", profileError);

  if (profileError) {
    console.log("Profile update error:", profileError);
    return { success: false, error: profileError };
  }

  return { success: true, error: null };
}

const placeIds = [165, 216, 206, 1918]; // The specific place IDs to fetch

// Function to fetch places and their embeddings
export const fetchPlacesWithEmbeddings = async (
  setIsLoadingPlaces: (loading: boolean) => void,
  setError: (error: string) => void,
  setPlaces: (places: Place[]) => void,
  setUserVector?: (vector: number[]) => void // Optional callback to set user vector
) => {
  try {
    setIsLoadingPlaces(true);
    const supabase = createClient();

    // First try to fetch the specific places
    const { data: placesData, error: placesError } = await supabase
      .from("placesv2")
      .select("*")
      .in("id", placeIds);

    if (placesError) {
      console.error("Error fetching places:", placesError);
      setError("Failed to load places data");
      return;
    }

    // If we don't have enough places, fetch some random ones
    let finalPlacesData = placesData || [];
    if (finalPlacesData.length < 4) {
      const { data: randomPlaces, error: randomError } = await supabase
        .from("placesv2")
        .select("*")
        .not("id", "in", `(${finalPlacesData.map((p) => p.id).join(",")})`)
        .limit(4 - finalPlacesData.length);

      if (!randomError && randomPlaces) {
        finalPlacesData = [...finalPlacesData, ...randomPlaces];
      }
    }

    if (finalPlacesData.length === 0) {
      setError("No places available for onboarding");
      return;
    }

    // Get the actual place IDs we'll be using
    const finalPlaceIds = finalPlacesData.map((p) => p.id);

    // Fetch embeddings for these places
    const { data: embeddingsData, error: embeddingsError } = await supabase
      .from("place_vectors")
      .select("place_id, embedding")
      .in("place_id", finalPlaceIds);

    if (embeddingsError || !embeddingsData) {
      console.error("Error fetching embeddings:", embeddingsError);
      setError("Failed to load place embeddings");
      return;
    }
    console.log(
      "Embedding dimensions:",
      embeddingsData.map((e) => e.embedding.length)
    );

    // Combine places with their embeddings
    const placesWithEmbeddings: Place[] = finalPlacesData.map((place) => {
      const embeddingData = embeddingsData.find((e) => e.place_id === place.id);
      return {
        ...place,
        embedding: embeddingData?.embedding,
      };
    });

    setPlaces(placesWithEmbeddings);

    // Initialize user vector with global mean if callback provided
    if (setUserVector) {
      const validEmbeddings = placesWithEmbeddings
        .map((place) => place.embedding)
        .filter(
          (embedding): embedding is number[] =>
            embedding !== undefined &&
            embedding !== null &&
            embedding.length > 0
        );

      if (validEmbeddings.length > 0) {
        try {
          const globalMeanVector = calculateGlobalMean(validEmbeddings);

          console.log(
            "Initialized user vector with global mean:",
            globalMeanVector
          );
          setUserVector(globalMeanVector);
        } catch (error) {
          console.error("Error calculating global mean:", error);
          // Fall back to zero vector if global mean calculation fails
        }
      }
    }
  } catch (error) {
    console.error("Error in fetchPlacesWithEmbeddings:", error);
    setError("Failed to load places data");
  } finally {
    setIsLoadingPlaces(false);
  }
};
