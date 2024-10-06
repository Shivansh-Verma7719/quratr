import React, { useState } from "react";
import { signup } from "./helper";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  UserIcon,
  LockIcon,
  CheckCheck,
  ShieldAlert,
  UserPen
} from "lucide-react";
import PasswordStrengthBar from "react-password-strength-bar";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.username.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const response = await signup(formData);
      if (response.success === false) {
        setError(response.error || "");
      } else {
        setSuccess("Redirecting...");
        router.push("/app/onboarding");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>
      <Input
        type="text"
        isRequired
        isClearable
        variant="bordered"
        label="First Name"
        value={formData.firstName}
        startContent={
          <UserPen className="text-2xl text-default-400 pointer-events-none" />
        }
        labelPlacement="outside"
        onChange={handleInputChange}
        name="firstName"
        className="w-full p-2 mb-4"
      />
      <Input
        type="text"
        isRequired
        isClearable
        variant="bordered"
        label="Last Name"
        value={formData.lastName}
        startContent={
          <UserPen className="text-2xl text-default-400 pointer-events-none" />
        }
        labelPlacement="outside"
        onChange={handleInputChange}
        name="lastName"
        className="w-full p-2 mb-4"
      />
      <Input
        type="text"
        isRequired
        isClearable
        variant="bordered"
        label="Username"
        value={formData.username}
        startContent={
          <UserIcon className="text-2xl text-default-400 pointer-events-none" />
        }
        labelPlacement="outside"
        onChange={handleInputChange}
        name="username"
        className="w-full p-2 mb-4"
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
        className="w-full p-2 mb-4"
        startContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none" />
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
              <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        startContent={
          <LockIcon className="text-2xl text-default-400 pointer-events-none" />
        }
        type={isVisible ? "text" : "password"}
        value={formData.password}
        onChange={handleInputChange}
        name="password"
        className="w-full p-2 mb-4"
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
              <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
        startContent={
          <LockIcon className="text-2xl text-default-400 pointer-events-none" />
        }
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className="w-full p-2 mb-4"
      />
      <PasswordStrengthBar password={formData.password} />
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
            <ShieldAlert className="text-red-500 mr-2" />
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

export default RegisterForm;
