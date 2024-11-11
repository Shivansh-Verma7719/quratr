"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, PartyPopper, ShieldAlert } from "lucide-react";
import Footer from "@/components/footer/index";
import { submitOnboarding, checkOnboardingStatus } from "./helper";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { IconSwipe } from "@tabler/icons-react";

const onboardingQuestions = [
  "You like night clubs?",
  "You’re the ready to spend for premium experiences?",
  "You like spending time alone at cafés?",
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
          <h2 className="text-xl font-bold mb-4">
            {onboardingQuestions[step]}
          </h2>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOnboardingAnswer("Yes")}
              className={`px-4 py-2 rounded text-black ${
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
              className={`px-4 py-2 rounded text-black ${
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
    <div className="min-h-screen font-sans overflow-x-hidden bg-background text-text">
      {/* <Navbar /> */}
      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-md mx-auto">
          <div className="mb-8 bg-gray-200 h-2 rounded-full">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handlePrevious}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full flex items-center"
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
                className={`bg-blue-500 text-white px-4 py-2 rounded-full flex items-center ml-auto ${
                  !validateStep() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!validateStep()}
              >
                Next <ArrowRight className="ml-2" />
              </motion.button>
            ) : (
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="flat"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading || !validateAllSteps()}
                className={`bg-green-500 text-white px-4 py-2 rounded-full flex items-center ml-auto ${
                  !validateAllSteps() ? "opacity-50 cursor-not-allowed" : ""
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
                <PartyPopper className="text-green-500 mr-2" />
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
                <ShieldAlert className="text-red-500 mr-2" />
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
