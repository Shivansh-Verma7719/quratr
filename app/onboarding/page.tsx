'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from "@/components/navbar/index";
import Footer from "@/components/footer/index";
import { Providers } from '../providers';
import { submitOnboarding, checkOnboardingStatus } from './helper';

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
  "You're adventurous and want to do new things with new people?"
];

const OnboardingPage: React.FC = () => {

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    onboardingAnswers: Array(10).fill('')
  });
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = useSearchParams().get("callbackUrl") as string;

  useEffect(() => { 
    if (callbackUrl) {
      console.log(callbackUrl);
      checkOnboardingStatus(callbackUrl);
    }
  }, [callbackUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnboardingAnswer = (answer: string) => {
    const newAnswers = [...formData.onboardingAnswers];
    newAnswers[step - 2] = answer;
    setFormData({ ...formData, onboardingAnswers: newAnswers });
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return formData.firstName.trim() !== '' && formData.lastName.trim() !== '';
      case 1:
        return true; // Onboarding intro step
      default:
        return formData.onboardingAnswers[step - 2] !== '';
    }
  };

  const handleNext = () => {
    if (validateStep() && step < 11) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (step === 11) {
      await submitOnboarding(formData);
    }
    setIsLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2 className="text-2xl font-bold mb-4">Your Name</h2>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full p-2 mb-4 border rounded"
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2 className="text-2xl font-bold mb-4">Onboarding</h2>
            <p className="mb-4">Let&apos;s get to know you better! Answer the following questions:</p>
          </motion.div>
        );
      default:
        if (step >= 2 && step <= 11) {
          const questionIndex = step - 2;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-xl font-bold mb-4">{onboardingQuestions[questionIndex]}</h2>
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOnboardingAnswer('Yes')}
                  className={`px-4 py-2 rounded ${
                    formData.onboardingAnswers[questionIndex] === 'Yes'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOnboardingAnswer('No')}
                  className={`px-4 py-2 rounded ${
                    formData.onboardingAnswers[questionIndex] === 'No'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          );
        }
    }
  };

  return (
    <Providers>
      <div className="min-h-screen font-sans overflow-x-hidden bg-background text-text">
        <Navbar />
        <main className="pt-[68px] container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <React.Suspense fallback={<div>Loading...</div>}>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-8 bg-gray-200 h-2 rounded-full">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 11) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
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
              {step < 11 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleNext}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-full flex items-center ml-auto ${
                    !validateStep() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!validateStep()}
                >
                  Next <ArrowRight className="ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center ml-auto"
                >
                  Submit
                </motion.button>
              )}
            </div>
          </form>
          </React.Suspense>
        </main>
        <Footer />
      </div>
    </Providers>
  );
};

export default OnboardingPage;
