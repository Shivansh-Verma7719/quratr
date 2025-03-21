"use client";
import React, { useState, useEffect } from "react";
import { login } from "./actions";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  LockIcon,
  CheckCheck,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    router.prefetch("/discover");
  }, []);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (isForgotPassword) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    }
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 8
    );
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      // First check if user exists with this email
      const { data: userExists, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (lookupError) {
        console.error("Error checking user:", lookupError);
        setError("An error occurred while processing your request.");
        return;
      }

      if (!userExists) {
        // For security, don't reveal that the email doesn't exist
        // Instead, show a generic success message as if we sent the email
        setError(`Account does not exist for ${formData.email}`);
        return;
      }

      // User exists, proceed with password reset
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `http://localhost:3000/account/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(`Password reset link sent to ${formData.email}`);
      }
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    if (isForgotPassword) {
      await handleForgotPassword();
      return;
    } else {
      const response = await login(formData);
      if (response.success === false) {
        setError(response.error || "");
      } else {
        setSuccess("Login successful");
        router.push("/discover");
        router.refresh();
      }
    }

    setIsLoading(false);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setError("");
    setSuccess("");
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md overflow-hidden">
      <motion.div
        key={isForgotPassword ? "reset" : "login"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="mb-4 text-center"
      >
        <h2 className="text-2xl font-bold text-text">
          {isForgotPassword ? "Reset Your Password" : "Login to Your Account"}
        </h2>
      </motion.div>

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
        className="mb-4 w-full p-2"
        startContent={
          <MailIcon className="pointer-events-none text-2xl text-default-400" />
        }
      />

      <AnimatePresence mode="wait">
        {!isForgotPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
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
              className="w-full p-2"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 flex w-full justify-end items-center">
        <motion.button
          type="button"
          onClick={toggleForgotPassword}
          className="text-sm text-blue-500 hover:underline"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isForgotPassword ? "back" : "forgot"}
              initial={{ opacity: 0, x: isForgotPassword ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isForgotPassword ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {isForgotPassword ? "Back to Login" : "Forgot Password?"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          type="submit"
          className="w-full"
          color={success ? "success" : "primary"}
          isDisabled={!validateForm() || !!success}
          isLoading={isLoading}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={success ? "success" : (isForgotPassword ? "reset" : "login")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {success ? (
                <CheckCheck />
              ) : isForgotPassword ? (
                "Send Reset Link"
              ) : (
                "Login"
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Card radius="lg" className="bg-red-500/20" isBlurred shadow="sm">
              <CardHeader>
                <ShieldAlert className="mr-2 text-red-500" />
                <h1 className="text-red-500">Error</h1>
              </CardHeader>
              <CardBody>
                <p className="text-red-500">{error}</p>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Card radius="lg" className="bg-green-500/20" isBlurred shadow="sm">
              <CardHeader>
                <CheckCheck className="mr-2 text-green-500" />
                <h1 className="text-green-500">Success</h1>
              </CardHeader>
              <CardBody>
                <p className="text-green-500">{success}</p>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </motion.p>
    </form>
  );
};

export default LoginForm;