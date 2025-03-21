"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  CheckCheck,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    // Password must be at least 8 characters
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    // Password must contain at least one uppercase letter, one lowercase letter, and one number
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return false;
    }

    // Passwords must match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password updated successfully!");
        // Wait 2 seconds before redirecting to login
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="mx-auto overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 text-center"
          >
            <h2 className="text-2xl font-bold text-text">Reset Your Password</h2>
            <p className="mt-2 text-default-500">
              Enter a new password for your account
            </p>
          </motion.div>

          <div className="space-y-4">
            <Input
              isRequired
              variant="bordered"
              label="New Password"
              labelPlacement="outside"
              description="Min. 8 characters with uppercase, lowercase and number"
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

            <Input
              isRequired
              variant="bordered"
              label="Confirm Password"
              labelPlacement="outside"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleConfirmVisibility}
                  aria-label="toggle confirm password visibility"
                >
                  {isConfirmVisible ? (
                    <EyeIcon className="pointer-events-none text-2xl text-default-400" />
                  ) : (
                    <EyeOffIcon className="pointer-events-none text-2xl text-default-400" />
                  )}
                </button>
              }
              startContent={
                <LockIcon className="pointer-events-none text-2xl text-default-400" />
              }
              type={isConfirmVisible ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              name="confirmPassword"
              className="w-full p-2"
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <Button
              type="submit"
              className="w-full"
              color={success ? "success" : "primary"}
              isDisabled={!formData.password || !formData.confirmPassword}
              isLoading={isLoading}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={success ? "success" : "reset"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {success ? <CheckCheck /> : "Update Password"}
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
                    <p className="text-green-500 mt-1">Redirecting to login...</p>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}