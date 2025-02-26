"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, PartyPopper, ShieldAlert } from "lucide-react";
import Footer from "@/components/footer/index";
import { submitOnboarding, checkOnboardingStatus } from "./helper";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { IconSwipe } from "@tabler/icons-react";

const onboardingQuestions = [
  "You like night clubs?",
  "You're ready to spend for premium experiences?",
  "Do you like spending time alone at cafés?",
  "Are you looking for hidden gems?",
  "Are you looking to do cool things with new people?",
];

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    onboardingAnswers: Array(5).fill(""),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkStatus = async () => {
      const response = await checkOnboardingStatus();
      if (response.success === true) {
        router.push("/discover");
        // router.refresh();
      }
    };
    checkStatus();
  }, [router]);

  const handleOnboardingAnswer = (answer: string) => {
    const newAnswers = [...formData.onboardingAnswers];
    newAnswers[step] = answer;
    setFormData({ ...formData, onboardingAnswers: newAnswers });
  };

  const validateStep = () => {
    return formData.onboardingAnswers[step] !== "";
  };

  const handleNext = () => {
    if (validateStep() && step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (step === 4 && validateAllSteps()) {
      setIsLoading(true);
      console.log(formData);
      await submitOnboarding(formData)
        .then((result) => {
          if (result.success) {
            // router.push("/discover");
            // router.refresh();
            setSuccess(true);
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

  const renderStep = () => {
    if (step >= 0 && step <= 4) {
      return (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <h2 className="mb-4 text-xl font-bold">
            {onboardingQuestions[step]}
          </h2>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOnboardingAnswer("Yes")}
              className={`rounded px-4 py-2 text-black ${
                formData.onboardingAnswers[step] === "Yes"
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            >
              Yes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOnboardingAnswer("No")}
              className={`rounded px-4 py-2 text-black ${
                formData.onboardingAnswers[step] === "No"
                  ? "bg-red-500"
                  : "bg-gray-200"
              }`}
            >
              No
            </motion.button>
          </div>
        </motion.div>
      );
    }
  };

  const validateAllSteps = () => {
    return formData.onboardingAnswers.every((answer) => answer !== "");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-text">
      {/* <Navbar /> */}
      <main className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-md">
          <div className="mb-8 h-2 rounded-full bg-gray-200">
            <motion.div
              className="h-2 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          <div className="mt-8 flex justify-between">
            {step > 0 && (
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
            {step < 4 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleNext}
                className={`ml-auto flex items-center rounded-full bg-blue-500 px-4 py-2 text-white ${
                  !validateStep() ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={!validateStep()}
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
                className={`ml-auto flex items-center rounded-full bg-green-500 px-4 py-2 text-white ${
                  !validateAllSteps() ? "cursor-not-allowed opacity-50" : ""
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
      <Footer />
    </div>
  );
};

export default OnboardingPage;
