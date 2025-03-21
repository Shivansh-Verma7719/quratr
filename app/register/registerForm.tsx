"use client";
import React, { useState, useEffect } from "react";
import { signup } from "./helper";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import GoogleCaptchaWrapper from "@/app/googleCaptchaWrapper";
import { Checkbox } from "@heroui/checkbox";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  LockIcon,
  CheckCheck,
  ShieldAlert,
} from "lucide-react";
import PasswordStrengthBar from "react-password-strength-bar";
import Link from "next/link";
import { motion } from "framer-motion";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    router.prefetch("/onboarding");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "termsAccepted") {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.termsAccepted
    );
  };

  const handleGoogleSignIn = async () => {
    setError("");

    try {
      const nextUrl = '/onboarding';
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${nextUrl}`,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
      // No need to set success or handle loading state here as we're redirecting to Google
    } catch (e) {
      setError("Failed to connect with Google. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setError("Please check the captcha");
      return;
    }

    const token = await executeRecaptcha("register");

    const res = await axios.post("/api/registerFormSubmit", { token });

    if (res.data.success) {
      if (validateForm()) {
        setIsLoading(true);
        const response = await signup(formData);
        if (response.success === false) {
          setError(response.error || "");
        } else {
          setSuccess("Redirecting...");
          router.push("/onboarding");
          router.refresh();
        }
        setIsLoading(false);
      }
    } else {
      setError("Please check the captcha your score is " + res.data.score);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <h2 className="mb-4 text-center text-2xl font-bold text-text">
        Create Your Account
      </h2>
      <p className="mb-6 text-center text-sm text-gray-500">
        Enter your email and password to get started. You&apos;ll complete your profile in the next step.
      </p>

      <Input
        type="email"
        isRequired
        isClearable
        variant="bordered"
        label="Email"
        value={formData.email}
        name="email"
        labelPlacement="outside"
        onChange={handleInputChange}
        className="mb-4 w-full p-2 text-text"
        startContent={
          <MailIcon className="pointer-events-none text-2xl text-default-400" />
        }
      />

      <Input
        isRequired
        variant="bordered"
        label="Password"
        labelPlacement="outside"
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
            aria-label="toggle password visibility"
          >
            {isVisible ? (
              <EyeIcon className="pointer-events-none text-2xl text-default-400" />
            ) : (
              <EyeOffIcon className="pointer-events-none text-2xl text-default-400" />
            )}
          </button>
        }
        startContent={
          <LockIcon className="pointer-events-none text-2xl text-default-400" />
        }
        type={isVisible ? "text" : "password"}
        value={formData.password}
        onChange={handleInputChange}
        name="password"
        className="mb-4 w-full p-2 text-text"
      />

      <Input
        isRequired
        variant="bordered"
        label="Confirm Password"
        labelPlacement="outside"
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
            aria-label="toggle password visibility"
          >
            {isVisible ? (
              <EyeIcon className="pointer-events-none text-2xl text-default-400" />
            ) : (
              <EyeOffIcon className="pointer-events-none text-2xl text-default-400" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
        startContent={
          <LockIcon className="pointer-events-none text-2xl text-default-400" />
        }
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className="mb-4 w-full p-2 text-text"
      />

      <PasswordStrengthBar password={formData.password} />

      <div className="mb-4 flex items-center">
        <Checkbox
          id="termsCheckbox"
          name="termsAccepted"
          color="primary"
          onChange={handleInputChange}
        />
        <label htmlFor="termsCheckbox" className="ml-2 text-sm">
          I agree to the{" "}
          <Link
            href="/termsandconditions"
            className="text-primary hover:underline"
          >
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy_policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full"
        color={success ? "success" : "primary"}
        isDisabled={!validateForm()}
        isLoading={isLoading}
      >
        {success ? <CheckCheck /> : "Continue to Profile Setup"}
      </Button>

      {error && (
        <Card radius="lg" className="mt-4 bg-red-500/20" isBlurred shadow="sm">
          <CardHeader>
            <ShieldAlert className="mr-2 text-red-500" />
            <h1 className="text-red-500">Error</h1>
          </CardHeader>
          <CardBody>
            <p className="text-red-500">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Separator before Google login */}
      <div className="flex items-center my-4 mt-6">
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
        <span className="px-3 text-sm text-gray-500 dark:text-gray-400">OR</span>
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
      </div>

      {/* Google Sign Up Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          type="button"
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
          variant="bordered"
          onPress={handleGoogleSignIn}
          startContent={
            <Image
              src="/images/google.png"
              alt="Google logo"
              width={20}
              height={20}
              className="mr-1"
            />
          }
          disabled={isLoading}
        >
          Sign up with Google
        </Button>
      </motion.div>

      {/* Link to login page */}
      <motion.p
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </motion.p>
    </form>
  );
};

const RegisterFormPage: React.FC = () => {
  return (
    <GoogleCaptchaWrapper>
      <RegisterForm />
    </GoogleCaptchaWrapper>
  );
};

export default RegisterFormPage;