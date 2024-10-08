"use client";
import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface GoogleCaptchaWrapperProps {
  children: React.ReactNode;
}

const GoogleCaptchaWrapper: React.FC<GoogleCaptchaWrapperProps> = ({ children }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default GoogleCaptchaWrapper;
