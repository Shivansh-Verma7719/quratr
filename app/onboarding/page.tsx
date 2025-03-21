"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, PartyPopper, ShieldAlert, User, UserIcon } from "lucide-react";
import Footer from "@/components/footer/index";
import { submitOnboarding, checkOnboardingStatus } from "./helper";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { IconSwipe } from "@tabler/icons-react";
import QuestionCard from "@/components/ui/Question";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const onboardingQuestions = [
  "You like night clubs?",
  "You're ready to spend for premium experiences?",
  "Do you like spending time alone at cafés?",
  "Are you looking for hidden gems?",
  "Are you looking to do cool things with new people?",
];

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [section, setSection] = useState("profile"); // 'profile' or 'questions'
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    avatarUrl: "",
    onboardingAnswers: Array(5).fill(""),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        console.error("Error fetching user:", error);
        return;
      }

      // Check if user is already onboarded
      const onboardingResponse = await checkOnboardingStatus();
      if (onboardingResponse.success === true) {
        router.push("/discover");
        return;
      }

      // Extract metadata from OAuth if available
      const metadata = data.user.user_metadata;

      if (metadata) {
        // Handle name - try full_name first, then name
        let firstName = "";
        let lastName = "";

        if (metadata.full_name || metadata.name) {
          const fullName = (metadata.full_name || metadata.name).split(" ");
          firstName = fullName[0] || "";
          lastName = fullName.slice(1).join(" ") || "";
        }

        // Check for avatar URL
        const avatarUrl = metadata.avatar_url || metadata.picture || "";

        // Pre-fill the form data with available information
        setFormData(prev => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          avatarUrl: avatarUrl || prev.avatarUrl,
          // Don't pre-fill username as it needs to be chosen by the user
        }));
      }

      setHasLoadedUserData(true);
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnboardingAnswer = (answer: string) => {
    const newAnswers = [...formData.onboardingAnswers];
    newAnswers[step] = answer;
    setFormData({ ...formData, onboardingAnswers: newAnswers });
  };

  const validateProfile = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.username.trim() !== ""
    );
  };

  const validateStep = () => {
    return formData.onboardingAnswers[step] !== "";
  };

  const handleNext = () => {
    if (section === "profile") {
      if (validateProfile()) {
        setSection("questions");
      }
    } else if (validateStep() && step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (section === "questions") {
      if (step > 0) {
        setStep(step - 1);
      } else {
        setSection("profile");
      }
    }
  };

  const validateAllSteps = () => {
    return (
      validateProfile() &&
      formData.onboardingAnswers.every((answer) => answer !== "")
    );
  };

  const handleSubmit = async () => {
    if (step === 4 && validateAllSteps()) {
      setIsLoading(true);
      await submitOnboarding(formData)
        .then((result) => {
          if (result.success) {
            setSuccess(true);
            router.push("/discover");
            router.refresh();
          } else {
            setError(result.error?.message || "Failed to submit onboarding");
          }
        })
        .catch((error) => {
          console.error("Failed to submit onboarding:", error);
          setError("Failed to submit onboarding");
        })
        .finally(() => {
          setIsLoading(false);
        });
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

  const renderQuestionsSection = () => {
    if (step >= 0 && step <= 4) {
      return (
        <QuestionCard
          question={onboardingQuestions[step]}
          currentAnswer={formData.onboardingAnswers[step]}
          onAnswerChange={handleOnboardingAnswer}
        />
      );
    }
  };

  const getProgressPercentage = () => {
    if (section === "profile") {
      return 10;
    } else {
      return 20 + ((step + 1) / 5) * 80;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-text">
      {/* Only render the main content after we've checked user data */}
      {hasLoadedUserData && (
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
              {section === "profile" ? renderProfileSection() : renderQuestionsSection()}
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              {(section === "questions" || step > 0) && (
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

              {(section === "profile" || step < 4) ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleNext}
                  className={`ml-auto flex items-center rounded-full bg-blue-500 px-4 py-2 text-white ${(section === "profile" && !validateProfile()) ||
                    (section === "questions" && !validateStep())
                    ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  disabled={(section === "profile" && !validateProfile()) ||
                    (section === "questions" && !validateStep())}
                >
                  Next <ArrowRight className="ml-2" />
                </motion.button>
              ) : (
                <Button
                  onPress={handleSubmit}
                  color="primary"
                  variant="flat"
                  size="lg"
                  isLoading={isLoading}
                  disabled={isLoading || !validateAllSteps()}
                  className={`ml-auto flex items-center rounded-full bg-green-500 px-4 py-2 text-white ${!validateAllSteps() ? "cursor-not-allowed opacity-50" : ""
                    }`}
                >
                  Submit
                </Button>
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
      )}
      <Footer />
    </div>
  );
};

export default OnboardingPage;