"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "@/components/footer/index";
import { submitOnboarding, checkOnboardingStatus } from "./helper";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

const onboardingQuestions = [
  "You're more of a club kinda person than a starbucks kinda person?",
  "You're the 'I live for experiences and am ready to spend for premium experiences' kinds?",
  "You're the 'ambivert but going out with friends is more my thing' kinds?",
  "You're the 'I just want to sit alone and do nothing or some work on my laptop' kinds?",
  "You were in the queue to get Coldplay tickets right?",
  "You feel blue Tokai>Bohca anyday?",
  "You're the ggn types?",
  "You're the 'I go out to south/central Delhi' kinds?",
  "You die to get hidden gems in and around NCR—'always out of home on weekends' kinds?",
  "You're adventurous and want to do new things with new people?",
];

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    onboardingAnswers: Array(10).fill(""),
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const response = await checkOnboardingStatus();
      if (response.success === true) {
        router.push("/discover");
        router.refresh();
      }
    };
    checkStatus();
  }, []);

  const handleOnboardingAnswer = (answer: string) => {
    const newAnswers = [...formData.onboardingAnswers];
    newAnswers[step] = answer;
    setFormData({ ...formData, onboardingAnswers: newAnswers });
  };

  const validateStep = () => {
    return formData.onboardingAnswers[step] !== "";
  };

  const handleNext = () => {
    if (validateStep() && step < 9) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 9 && validateAllSteps()) {
      setIsLoading(true);
      const result = await submitOnboarding(formData);
      if (result.success === false) {
        console.log(result.error);
      } else {
        router.push("/discover");
        router.refresh();
      }
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    if (step >= 0 && step <= 9) {
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
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-8 bg-gray-200 h-2 rounded-full">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / 10) * 100}%` }}
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
            {step < 9 ? (
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
                type="submit"
                color="primary"
                variant="flat"
                size="lg"
                disabled={isLoading || !validateAllSteps()}
                className={`bg-green-500 text-white px-4 py-2 rounded-full flex items-center ml-auto ${
                  !validateAllSteps() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default OnboardingPage;
