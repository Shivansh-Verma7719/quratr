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

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.password.length >= 8);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const response = await login(formData);
      if (response.success === false) {
        setError(response.error || "");
      } else {
        setSuccess("Login successful");
        router.push("/discover");
        router.refresh();
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <h2 className="mb-4 text-center text-2xl font-bold text-text">
        Login to Your Account
      </h2>
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
        className="mb-4 w-full p-2"
      />
      <Button
        type="submit"
        className="w-full"
        color={success ? "success" : "primary"}
        isDisabled={!validateForm()}
        isLoading={isLoading}
      >
        {success ? <CheckCheck /> : "Login"}
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

      <p className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
