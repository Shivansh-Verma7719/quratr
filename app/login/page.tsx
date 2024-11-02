"use client";
import React from "react";
import LoginForm from "./loginForm";
import Footer from "@/components/footer/index";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-background text-text">
      <main className="container mx-auto px-4 sm:px-6 py-16">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
