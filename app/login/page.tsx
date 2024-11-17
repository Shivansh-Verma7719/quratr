"use client";
import React from "react";
import LoginForm from "./loginForm";
import Footer from "@/components/footer/index";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-text">
      <main className="container mx-auto px-4 py-16 sm:px-6">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
