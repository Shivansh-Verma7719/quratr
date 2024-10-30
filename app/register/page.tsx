'use client';
import React from 'react';
import RegisterForm from './registerForm';
// import Navbar from "@/components/navbar/index";
import Footer from "@/components/footer/index";
import { Providers } from '../providers';

const RegisterPage: React.FC = () => {
  return (
    <Providers>
      <div className="min-h-screen font-sans overflow-x-hidden bg-background text-text">
        {/* <Navbar /> */}
        <main className="container mx-auto px-4 sm:px-6 py-16">
          <RegisterForm />
        </main>
        <Footer />
      </div>
    </Providers>
  );
};

export default RegisterPage;
