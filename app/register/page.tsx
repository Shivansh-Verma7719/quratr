"use client";
import React from "react";
import RegisterForm from "./registerForm";
import Footer from "@/components/footer/index";
import { Providers } from "../providers";

const RegisterPage: React.FC = () => {
  return (
    <Providers>
      <div className="min-h-screen overflow-x-hidden bg-background font-sans text-text">
        {/* <Navbar /> */}
        <main className="container mx-auto px-4 py-16 sm:px-6">
          <RegisterForm />
        </main>
        <Footer />
      </div>
    </Providers>
  );
};

export default RegisterPage;
