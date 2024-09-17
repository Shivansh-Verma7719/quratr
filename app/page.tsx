"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Smartphone, Users, Zap } from "lucide-react";
import Navbar from "@/components/navbar/index";
import Image from "next/image";
import Footer from "@/components/footer/index";

export default function QuratrLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const featureY = useTransform(scrollYProgress, [0.2, 0.4], [100, 0]);
  const aboutOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      
      <Navbar />

      <main className="pt-24">
        <motion.section
          style={{ scale: heroScale }}
          className="container mx-auto px-4 sm:px-6 py-12 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
          >
            Connecting seekers to providers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12"
          >
            Discover personalized experiences with a swipe
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <button className="bg-black text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-colors inline-flex items-center group">
              Start Exploring
              <ArrowRight className="ml-2 group-hover:animate-bounceHorizontal transition-transform duration-300" />
            </button>
          </motion.div>
        </motion.section>

        <motion.section
          style={{ y: featureY }}
          id="features"
          className="bg-gray-50 py-16 sm:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
              Why Quratr?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {[
                {
                  icon: (
                    <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                  ),
                  title: "Swipe to Discover",
                  description:
                    "Find your next adventure with our intuitive, Tinder-like interface.",
                },
                {
                  icon: <Zap className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />,
                  title: "AI-Powered Curation",
                  description:
                    "Get personalized recommendations based on your preferences.",
                },
                {
                  icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />,
                  title: "Social Experiences",
                  description:
                    "See what your friends and influencers are loving.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    backgroundColor: "#f8f8f8",
                  }}
                  transition={{ duration: 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center cursor-pointer"
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          style={{ opacity: aboutOpacity }}
          id="about"
          className="py-16 sm:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                className="lg:w-1/2 mb-8 lg:mb-0"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
                  Redefining Discovery
                </h2>
                <p className="text-base sm:text-xl text-gray-600 mb-6">
                  Quratr is leading the Consumer AI revolution, crafting highly
                  curated recommendations for the modern, experience-driven
                  generation.
                </p>
                <button className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-gray-800 transition-colors">
                  Learn More
                </button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="lg:w-1/2"
              >
                <Image
                  src=""
                  width={400}
                  height={400}
                  alt="Quratr App"
                  className="rounded-lg shadow-xl w-full max-w-md mx-auto"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          style={{ scale: ctaScale }}
          className="bg-gray-900 text-white py-16 sm:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
              Ready to redefine your experiences?
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12">
              Join Quratr today and start discovering personalized adventures.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Get Early Access
            </motion.button>
          </div>
        </motion.section>
      </main>

      <Footer />

      <motion.div
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-black text-white p-3 sm:p-4 rounded-full shadow-lg cursor-pointer"
        style={{
          opacity: scrollY > 200 ? 1 : 0,
          pointerEvents: scrollY > 200 ? "auto" : "none",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowRight className="transform rotate-[-90deg] w-5 h-5 sm:w-6 sm:h-6" />
      </motion.div>
    </div>
  );
}
