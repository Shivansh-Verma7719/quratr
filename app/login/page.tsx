'use client';
import React from 'react';
import LoginForm from './loginForm';
import Navbar from "@/components/navbar/index";
import Footer from "@/components/footer/index";
import { Providers } from '../providers';

const LoginPage: React.FC = () => {
  return (
    <Providers>
      <div className="min-h-screen font-sans overflow-x-hidden bg-background text-text">
        <Navbar />
        <main className="pt-[68px] container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <LoginForm />
        </main>
        <Footer />
      </div>
    </Providers>
  );
};

export default LoginPage;
