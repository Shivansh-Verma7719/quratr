"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCheck } from "lucide-react";
import Footer from "@/components/footer/index";
import { createClient } from "@/utils/supabase/client";

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("waitlist")
        .insert([{ email: email }]);

      if (error) throw error;

      console.log("Successfully added to waitlist:", data);
      setEmail("");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding to waitlist:", error);
    } finally {
      setIsSubmitting(false);
      setIsEmailValid(false);
      //   setIsSubmitted(false);
    }
  };

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-background font-sans text-text">
        {/* <Navbar /> */}
        <main>
          <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto w-full max-w-2xl rounded-lg bg-background p-8 shadow-lg dark:shadow-gray-800">
              <h1 className="mb-6 text-center text-3xl font-bold">
                Join the Quratr Waitlist
              </h1>
              <p className="mb-8 text-center text-lg">
                Be the first to experience personalized adventures with Quratr.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                    style={{ display: isSubmitted ? "none" : "block" }}
                  >
                    Email Address
                  </label>
                  <input
                    hidden={isSubmitted}
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full rounded-md border border-gray-300 bg-background p-3 text-text"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isEmailValid}
                  whileHover={{ scale: isEmailValid ? 1.05 : 1 }}
                  whileTap={{ scale: isEmailValid ? 0.95 : 1 }}
                  className={`flex w-full items-center justify-center rounded-full bg-[#fed4e4] px-6 py-3 text-black transition-all ${
                    isEmailValid
                      ? "hover:scale-110"
                      : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isSubmitting ? (
                      <motion.span
                        key="submitting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Joining...
                      </motion.span>
                    ) : isSubmitted ? (
                      <motion.span
                        key="submitted"
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <CheckCheck className="h-5 w-5" />
                        <p className="text-center">Joined!</p>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        Join Waitlist <ArrowRight className="ml-2" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 text-center text-green-500"
                >
                  Thank you for joining our waitlist! We&apos;ll keep you
                  updated.
                </motion.p>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default WaitlistForm;
