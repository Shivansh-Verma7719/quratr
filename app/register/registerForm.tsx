"use client";
import React, { useState, useEffect } from "react";
import { signup } from "./helper";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import GoogleCaptchaWrapper from "@/app/googleCaptchaWrapper";
import { Checkbox } from "@nextui-org/checkbox";

import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  UserIcon,
  LockIcon,
  CheckCheck,
  ShieldAlert,
  UserPen,
} from "lucide-react";
import PasswordStrengthBar from "react-password-strength-bar";
import Link from "next/link";
const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
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
    router.prefetch("/discover");
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
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.username.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.termsAccepted
    );
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
      <Input
        type="text"
        isRequired
        isClearable
        variant="bordered"
        label="First Name"
        value={formData.firstName}
        startContent={
          <UserPen className="pointer-events-none text-2xl text-default-400" />
        }
        labelPlacement="outside"
        onChange={handleInputChange}
        name="firstName"
        className="mb-4 w-full p-2 text-text"
      />
      <Input
        type="text"
        isRequired
        isClearable
        variant="bordered"
        label="Last Name"
        value={formData.lastName}
        startContent={
          <UserPen className="pointer-events-none text-2xl text-default-400" />
        }
        labelPlacement="outside"
        onChange={handleInputChange}
        name="lastName"
        className="mb-4 w-full p-2 text-text"
      />
      <Input
        type="text"
        isRequired
        isClearable
        variant="bordered"
        label="Username"
        value={formData.username}
        startContent={
          <UserIcon className="pointer-events-none text-2xl text-default-400" />
        }
        labelPlacement="outside"
        onChange={handleInputChange}
        name="username"
        className="mb-4 w-full p-2 text-text"
      />
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
        {success ? <CheckCheck /> : "Register"}
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
