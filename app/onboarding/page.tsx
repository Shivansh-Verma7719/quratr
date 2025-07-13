"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, PartyPopper, ShieldAlert, User, UserIcon } from "lucide-react";
import Footer from "@/components/footer/index";
import { submitOnboarding } from "./helper";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Input } from "@heroui/input";
import { IconSwipe } from "@tabler/icons-react";
import SwipeCard from "@/components/swipe/SwipeCard";
import { createClient } from "@/utils/supabase/client";
import { normalizeVector, updateUserVector, createZeroVector } from "@/utils/vectors/util";
import Image from "next/image";

interface Place {
  id: number;
  name: string;
  description: string;
  cuisine?: string;
  address?: string;
  city?: string;
  image_url?: string;
  rating?: number;
  likes?: number;
  price?: number;
  tags?: string;
  group_experience?: string;
}

interface PlaceWithEmbedding extends Place {
  embedding: number[];
}

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [section, setSection] = useState("profile"); // 'profile' or 'swipe'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    avatarUrl: "",
  });
  const [places, setPlaces] = useState<PlaceWithEmbedding[]>([]);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [userVector, setUserVector] = useState<number[]>(createZeroVector(1536));
  const [swipeCount, setSwipeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);

  const placeIds = [165, 216, 206, 1918]; // The specific place IDs to fetch

  // Function to fetch places and their embeddings
  const fetchPlacesWithEmbeddings = async () => {
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
          .not("id", "in", `(${finalPlacesData.map(p => p.id).join(",")})`)
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
      const finalPlaceIds = finalPlacesData.map(p => p.id);

      // Fetch embeddings for these places
      const { data: embeddingsData, error: embeddingsError } = await supabase
        .from("place_vectors")
        .select("place_id, embedding")
        .in("place_id", finalPlaceIds);

      if (embeddingsError) {
        console.error("Error fetching embeddings:", embeddingsError);
        setError("Failed to load place embeddings");
        return;
      }

      // Combine places with their embeddings
      const placesWithEmbeddings: PlaceWithEmbedding[] = finalPlacesData.map(place => {
        const embeddingData = embeddingsData.find(e => e.place_id === place.id);
        return {
          ...place,
          embedding: embeddingData?.embedding || createZeroVector(1536)
        };
      });

      setPlaces(placesWithEmbeddings);
    } catch (error) {
      console.error("Error in fetchPlacesWithEmbeddings:", error);
      setError("Failed to load places data");
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // Function to handle swipe actions
  const handleSwipe = (place: Place, liked: boolean) => {
    const placeWithEmbedding = places.find(p => p.id === place.id);
    if (!placeWithEmbedding) return;

    // Update the user vector based on the swipe using utility function
    setUserVector(prevVector => updateUserVector(prevVector, placeWithEmbedding.embedding, liked));

    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    setCurrentSwipeIndex(prev => prev + 1);

    // Auto-submit when all places are swiped
    if (newSwipeCount >= places.length && places.length > 0) {
      setTimeout(() => {
        handleSubmit();
      }, 1000); // Small delay to show completion message
    }
  };

  const handleLike = (place: Place) => handleSwipe(place, true);
  const handleDislike = (place: Place) => handleSwipe(place, false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsPageLoading(true);
        const supabase = createClient();

        // Step 1: Get the authenticated user
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          console.error("Error fetching user:", userError);
          setError("Authentication error. Please try logging in again.");
          setIsPageLoading(false);
          return;
        }

        const userId = userData.user.id;
        const metadata = userData.user.user_metadata || {};

        // Step 2: Check if user profile exists and onboarding status
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("avatar, is_onboarded, first_name, last_name, username")
          .eq("id", userId)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" - expected for new users
          console.error("Error fetching profile:", profileError);
          setError("Error loading your profile data.");
          setIsPageLoading(false);
          return;
        }

        // Step 3: Handle already onboarded users
        if (profileData?.is_onboarded === true) {
          console.log("User already onboarded, redirecting to discover");

          // Optional: Update avatar if user has one from OAuth but not in profile
          if (!profileData.avatar && (metadata.avatar_url || metadata.picture)) {
            const avatarUrl = metadata.avatar_url || metadata.picture;

            await supabase
              .from("profiles")
              .update({ avatar: avatarUrl })
              .eq("id", userId);
          }

          // Redirect to discover page
          router.push("/discover");
          return;
        }

        // Step 4: Handle new or not-yet-onboarded users
        // Pre-fill the form with data from OAuth metadata if available
        let firstName = "";
        let lastName = "";
        let avatarUrl = "";

        // If not in profile, try to get from OAuth metadata
        if (metadata.full_name || metadata.name) {
          const fullName = (metadata.full_name || metadata.name).split(" ");
          firstName = fullName[0] || "";
          lastName = fullName.slice(1).join(" ") || "";
        }

        // Get avatar from OAuth if not already set
        if (!avatarUrl && (metadata.avatar_url || metadata.picture)) {
          avatarUrl = metadata.avatar_url || metadata.picture || "";
        }

        // Update form with prefilled data
        setFormData(prev => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          username: profileData?.username || prev.username,
          avatarUrl: avatarUrl || prev.avatarUrl,
        }));

        setIsPageLoading(false);
      } catch (error) {
        console.error("Unexpected error during user status check:", error);
        setError("An unexpected error occurred. Please try again.");
        setIsPageLoading(false);
      }
    };

    checkUserStatus();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.username.trim() !== ""
    );
  };

  const handleNext = () => {
    if (section === "profile" && validateProfile()) {
      setSection("swipe");
      fetchPlacesWithEmbeddings();
    }
  };

  const handlePrevious = () => {
    if (section === "swipe") {
      setSection("profile");
    }
  };

  const handleSubmit = async () => {
    if (swipeCount >= places.length && places.length > 0) { // User has swiped on all places
      setIsLoading(true);
      try {
        // Normalize the user vector
        const normalizedVector = normalizeVector(userVector);

        const result = await submitOnboarding({
          ...formData,
          userVector: normalizedVector
        });

        if (result.success) {
          setSuccess(true);
          setTimeout(() => router.push("/discover"), 1500);
        } else {
          setError(result.error?.message || "Failed to submit onboarding");
        }
      } catch (error) {
        console.error("Failed to submit onboarding:", error);
        setError("Failed to submit onboarding. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderProfileSection = () => {
    return (
      <motion.div
        key="profile"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-4"
      >
        <h2 className="mb-6 text-xl font-bold text-center">Tell us about yourself</h2>

        {/* Avatar preview if available from OAuth */}
        {formData.avatarUrl && (
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-2">
              <Image
                src={formData.avatarUrl}
                alt="Profile avatar"
                fill
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <Input
          isRequired
          type="text"
          variant="bordered"
          label="First Name"
          labelPlacement="outside"
          placeholder="Enter your first name"
          startContent={<User className="text-default-400" size={16} />}
          value={formData.firstName}
          onChange={handleInputChange}
          name="firstName"
          className="w-full p-2 text-text"
        />

        <Input
          isRequired
          type="text"
          variant="bordered"
          label="Last Name"
          labelPlacement="outside"
          placeholder="Enter your last name"
          startContent={<User className="text-default-400" size={16} />}
          value={formData.lastName}
          onChange={handleInputChange}
          name="lastName"
          className="w-full p-2 text-text"
        />

        <Input
          isRequired
          type="text"
          variant="bordered"
          label="Username"
          labelPlacement="outside"
          placeholder="Choose a username"
          description="This will be your unique identifier on the platform"
          startContent={<UserIcon className="text-default-400" size={16} />}
          value={formData.username}
          onChange={handleInputChange}
          name="username"
          className="w-full p-2 text-text"
        />
      </motion.div>
    );
  };

  const renderSwipeSection = () => {
    if (isLoadingPlaces) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-4 text-center"
        >
          <h2 className="mb-6 text-xl font-bold">Loading places...</h2>
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-64 w-full bg-gray-300 rounded-lg mb-4"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          </div>
        </motion.div>
      );
    }

    if (places.length === 0) {
      return (
        <motion.div
          key="error"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-4 text-center"
        >
          <h2 className="mb-6 text-xl font-bold text-red-500">Failed to load places</h2>
          <p>Please try again later.</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        key="swipe"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-4"
      >
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Discover Your Taste</h2>
          <p className="text-gray-600 mt-2">
            Swipe right ❤️ if you like the place, left ❌ if you don&apos;t
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {swipeCount} of {places.length} places reviewed
          </p>
        </div>

        {swipeCount < places.length ? (
          <div className="h-[400px] flex items-center justify-center">
            <SwipeCard
              places={places.slice(currentSwipeIndex, currentSwipeIndex + 1)}
              onLike={handleLike}
              onDislike={handleDislike}
              isLoading={isLoadingPlaces}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              🎉 Perfect! We&apos;ve learned your preferences
            </h3>
            <p className="text-gray-600 mb-6">
              Your taste profile has been created based on your swipes.
              Redirecting you to discover amazing places...
            </p>
            {isLoading && (
              <div className="animate-pulse">
                <div className="h-4 w-48 bg-gray-300 rounded mx-auto"></div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const getProgressPercentage = () => {
    if (section === "profile") {
      return 20;
    } else {
      return 20 + (swipeCount / Math.max(places.length, 1)) * 80;
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
          <p className="mt-4 text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-text">
      <main className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-md">
          <div className="mb-8 h-2 rounded-full bg-gray-200">
            <motion.div
              className="h-2 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>

          <AnimatePresence mode="wait">
            {section === "profile" ? renderProfileSection() : renderSwipeSection()}
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            {section === "swipe" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handlePrevious}
                className="flex items-center rounded-full bg-gray-300 px-4 py-2 text-gray-700"
              >
                <ArrowLeft className="mr-2" /> Previous
              </motion.button>
            )}

            {section === "profile" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleNext}
                className={`ml-auto flex items-center rounded-full bg-blue-500 px-4 py-2 text-white ${!validateProfile() ? "cursor-not-allowed opacity-50" : ""
                  }`}
                disabled={!validateProfile()}
              >
                Next <ArrowRight className="ml-2" />
              </motion.button>
            )}
          </div>

          {success && (
            <Card
              radius="lg"
              className="mt-4 bg-green-500/20"
              isBlurred
              shadow="sm"
            >
              <CardHeader>
                <PartyPopper className="mr-2 text-green-500" />
                <h1 className="text-green-500">Onboarded!</h1>
              </CardHeader>
              <CardBody>
                <b>Begin your curated journey!</b>
                <Button
                  color="primary"
                  className="mt-2"
                  variant="flat"
                  startContent={<IconSwipe />}
                  as="a"
                  href="/discover"
                >
                  Start Swiping
                </Button>
              </CardBody>
            </Card>
          )}

          {error && (
            <Card
              radius="lg"
              className="mt-4 bg-red-500/20"
              isBlurred
              shadow="sm"
            >
              <CardHeader>
                <ShieldAlert className="mr-2 text-red-500" />
                <h1 className="text-red-500">Error</h1>
              </CardHeader>
              <CardBody>
                <p className="text-red-500">{error}</p>
              </CardBody>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OnboardingPage;