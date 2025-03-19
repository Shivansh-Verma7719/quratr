"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import {
  UserProfile,
  updateUserProfile,
  updateOnboardingPreferences,
  fetchOnboardingPreferences,
  fetchUserProfile,
  OnboardingPreferences,
} from "./helpers";
import { useRouter } from "next/navigation";

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

export default function ProfileEditPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onboardingPreferences, setOnboardingPreferences] =
    useState<OnboardingPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfileData = async () => {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      const preferences = await fetchOnboardingPreferences();
      setOnboardingPreferences(preferences);
    };

    loadProfileData();
  }, []);

  const handleProfileChange = (key: keyof UserProfile, value: string) => {
    setUserProfile((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handlePreferenceChange = (questionIndex: number, value: number) => {
    const preferenceKey = (questionIndex + 1).toString();
    setOnboardingPreferences((prev) =>
      prev
        ? {
            ...prev,
            [preferenceKey]: value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (userProfile) {
        await updateUserProfile(userProfile);
      }
      if (onboardingPreferences) {
        await updateOnboardingPreferences(onboardingPreferences);
      }
      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex justify-center items-start py-7 px-5 min-h-screen w-full bg-background">
        <div className="w-full max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 text-center"
          >
            Edit Your Profile
          </motion.h1>
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-6">
                <CardBody>
                  <h2 className="text-xl font-semibold mb-4">
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Username"
                      value={userProfile?.username || ""}
                      onChange={(e) =>
                        handleProfileChange("username", e.target.value)
                      }
                    />
                    <Input
                      label="First Name"
                      value={userProfile?.first_name || ""}
                      onChange={(e) =>
                        handleProfileChange("first_name", e.target.value)
                      }
                    />
                    <Input
                      label="Last Name"
                      value={userProfile?.last_name || ""}
                      onChange={(e) =>
                        handleProfileChange("last_name", e.target.value)
                      }
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="mb-6">
                <CardBody>
                  <h2 className="text-xl font-semibold mb-4">
                    Onboarding Preferences
                  </h2>
                  <div className="space-y-4">
                    {onboardingQuestions.map((question, index) => (
                      <div key={index}>
                        <p className="mb-2">{question}</p>
                        <div className="flex space-x-4 justify-center">
                          {["No", "Yes"].map((option, optionIndex) => (
                            <Button
                              key={option}
                              color={
                                onboardingPreferences &&
                                onboardingPreferences[index + 1] === optionIndex
                                  ? "primary"
                                  : "default"
                              }
                              onPress={() =>
                                handlePreferenceChange(index, optionIndex)
                              }
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                color="primary"
                variant="flat"
                size="lg"
                isLoading={isLoading}
                className="w-full mb-8"
              >
                Save Changes
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
  );
}
