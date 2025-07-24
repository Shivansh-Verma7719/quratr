"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, PartyPopper, ShieldAlert, User, UserIcon } from "lucide-react";
import { submitOnboarding, fetchPlacesWithEmbeddings } from "./helper";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Input,
  Alert
} from "@heroui/react";
import { IconSwipe } from "@tabler/icons-react";
import SwipeCard from "@/components/swipe/SwipeCard";
import { createClient } from "@/utils/supabase/client";
import { updateUserVector, createZeroVector } from "@/utils/vectors/utils";
import Image from "next/image";
import { Place } from "@/types/place";


const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [section, setSection] = useState("profile"); // 'profile' or 'swipe'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    avatarUrl: "",
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const [userVector, setUserVector] = useState<number[]>(createZeroVector(1536));
  const [swipeCount, setSwipeCount] = useState(0);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Function to handle swipe actions
  const handleSwipe = (place: Place, liked: boolean) => {
    const likedPlace = places.find(p => p.id === place.id);
    if (!likedPlace) return;

    // Update the user vector based on the swipe using utility function
    setUserVector(prevVector => updateUserVector(prevVector, likedPlace.embedding || createZeroVector(1536), liked));

    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);

    // Auto-submit when all places are swiped
    if (newSwipeCount >= places.length && places.length > 0) {
      handleSubmit();
      console.log("User vector after swiping:", userVector);
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
      fetchPlacesWithEmbeddings(setIsLoadingPlaces, setError, setPlaces, setUserVector);
      // Open the modal to show progress after moving to swipe section
      setTimeout(() => onOpen(), 1000);
    }
  };

  const handlePrevious = () => {
    if (section === "swipe") {
      setSection("profile");
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("User vector:", userVector);

      const result = await submitOnboarding({
        ...formData,
        userVector: userVector
      });

      if (result.success) {
        setSuccess(true);
        console.log("Onboarding submitted successfully redirecting to discover");
        setTimeout(() => router.push("/discover"), 1500);
      } else {
        setError(result.error?.message || "Failed to submit onboarding");
      }
    } catch (error) {
      console.error("Failed to submit onboarding:", error);
      setError("Failed to submit onboarding. Please try again.");
    }
  };

  const renderProfileSection = () => {
    return (
      <motion.div
        key="profile"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-4 mt-10"
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

        <div className=" relative">
          <div className="flex items-center justify-center">
            <SwipeCard
              places={places}
              onLike={handleLike}
              onDislike={handleDislike}
              isLoading={isLoadingPlaces}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  const getProgressPercentage = () => {
    if (section === "profile") {
      return 50; // First step: profile completion
    } else {
      // Second step: swipe progress (50% + swipe completion percentage)
      return 50 + (swipeCount / Math.max(places.length, 1)) * 50;
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
      <div className="w-full h-full mx-auto px-4 sm:px-6">
        <div className="mx-auto">

          <AnimatePresence mode="wait">
            {section === "profile" ? renderProfileSection() : renderSwipeSection()}
          </AnimatePresence>

          {/* Floating Progress Button - Always visible except when completed */}
          {!(swipeCount >= places.length && places.length > 0) && (
            <motion.div
              className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={onOpen}
                className="flex items-center justify-center bg-background/80 backdrop-blur-md rounded-full px-4 py-4 shadow-lg border border-default-200 cursor-pointer hover:bg-background/90 transition-colors"
              >
                <Progress
                  value={getProgressPercentage()}
                  className="w-32"
                  color={swipeCount >= places.length && places.length > 0 ? "success" : "primary"}
                  size="md"
                />
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex justify-between">
            {section === "swipe" && (
              <motion.div
                className="fixed bottom-14 left-6 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="button"
                  onPress={handlePrevious}
                  isIconOnly
                  radius="full"
                  className="bg-gray-300 text-gray-700 shadow-lg"
                >
                  <ArrowLeft />
                </Button>
              </motion.div>
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
      </div>

      {/* Progress Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        backdrop="blur"
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">
                  {section === "profile" ? "Profile Setup" : "Taste Discovery"}
                </h3>
                <p className="text-sm text-gray-600">
                  {section === "profile"
                    ? "Complete your profile information"
                    : "Help us learn your preferences by swiping"}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Onboarding Progress</span>
                      <span>{Math.round(getProgressPercentage())}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-default-200 dark:bg-default-300">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${swipeCount >= places.length && places.length > 0 ? "bg-success-500" : "bg-primary-500"
                          }`}
                        style={{ width: `${getProgressPercentage()}%` }}
                      />
                    </div>
                  </div>

                  {/* Step Information */}
                  <div className="space-y-3">
                    <Alert
                      color={section === "profile" ? "primary" : "success"}
                      variant="faded"
                      title="Profile Information"
                      description="Name and username setup"
                      radius="full"
                    />

                    <Alert
                      color={section === "swipe" ? "primary" : swipeCount >= places.length && places.length > 0 ? "success" : "secondary"}
                      variant={section === "swipe" ? "faded" : "flat"}
                      title="Taste Preferences"
                      radius="full"
                      description="Swipe through places to build your profile"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={onClose}
                  className="w-full"
                >
                  {section === "profile" ? "Continue Setup" : "Continue Swiping"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OnboardingPage;