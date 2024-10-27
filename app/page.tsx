"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  // Smartphone,
  // Users,
  // Zap,
  // TicketPercent,
  // SearchX,
  // MouseOff
} from "lucide-react";
import Navbar from "@/components/navbar/index";
import Image from "next/image";
import { Providers } from "./providers";
import Footer from "@/components/footer/index";
import discoveryImage from "@/public/images/landing/2.jpg";
import FeatureSection from "@/components/featureSection";

export default function QuratrLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const aboutOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1]);

  return (
    <Providers>
      <div className="min-h-screen font-sans overflow-x-hidden">
        <Navbar />

        <main className="pt-[68px] bg-white">
          <motion.section
            id="hero"
            style={{
              scale: heroScale,
              position: "relative",
              overflow: "hidden",
            }}
            className="h-screen w-full p-0 text-center"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="z-0"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 flex z-20 flex-col items-center justify-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl text-white sm:text-5xl md:text-7xl font-bold mb-6"
              >
                Curate your next Experience
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-white mb-12"
              >
                Discover personalized experiences with a swipe
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <a href="/waitlist">
                  <button className="bg-[#fed4e4] text-black hover:scale-110 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all inline-flex items-center group">
                    Start Exploring
                    <ArrowRight className="ml-2 group-hover:animate-bounceHorizontal transition-transform duration-300" />
                  </button>
                </a>
              </motion.div>
            </div>
          </motion.section>
          {/*  */}
          <FeatureSection />
          {/* <motion.section
            id="features"
            className="bg-background text-text py-16 sm:py-24"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
                Connecting seekers to providers
              </h2>
              <div className="grid text-text grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                {[
                  {
                    icon: (
                      <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                    ),
                    title: "Swipe to Vibe",
                    description:
                      "Find your next experience with our intuitive, Tinder-like interface.",
                  },
                  {
                    icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />,
                    title: "Social Experiences with your tribe",
                    description:
                      "See what your friends and influencers are loving.",
                  },
                  {
                    icon: <Zap className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />,
                    title: "AI-Powered Curation",
                    description:
                      "Get personalized recommendations based on your preferences.",
                  },
                  {
                    icon: (
                      <TicketPercent className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                    ),
                    title: "Curated Discounts",
                    description:
                      "Get exclusive discounts on the best experiences personalized to you.",
                  },
                  {
                    icon: (
                      <SearchX className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                    ),
                    title: "Eliminate Search",
                    description: "Get what you want right in front of you.",
                  },
                  {
                    icon: (
                      <MouseOff className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                    ),
                    title: "Stop scrolling together",
                    description:
                      "Share your incentives and go out on group experiences while having the option to discover together too",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="text-text p-6 sm:p-8 rounded-2xl shadow-lg text-center border border-white cursor-pointer"
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
                    <p className="text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section> */}

          <motion.section
            style={{ opacity: aboutOpacity }}
            id="about"
            className="py-16 sm:py-24 bg-white"
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
                  <h2 className="md:text-5xl text-black text-4xl font-bold mb-4 sm:mb-6">
                    Redefining Discovery
                  </h2>
                  <p className="text-base sm:text-[1.3rem] text-gray-600 mb-6">
                    Quratr is leading the Consumer AI revolution, crafting
                    highly curated recommendations for the modern,
                    experience-driven generation.
                  </p>
                  {/* <button className="bg-[#fed4e4] text-black px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:scale-110 transition-all">
                    Learn More
                  </button> */}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className="lg:w-1/2"
                >
                  <Image
                    src={discoveryImage}
                    width={500}
                    height={500}
                    alt="Quratr App"
                    className="rounded-xl shadow-xl w-full max-w-4xl mx-auto"
                  />
                </motion.div>
              </div>
            </div>
          </motion.section>

          <motion.section
            style={{ scale: ctaScale }}
            id="waitlist"
            className="bg-background text-text py-16 sm:py-24"
          >
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
                Ready to redefine your experiences?
              </h2>
              <p className="text-lg sm:text-xl mb-8 sm:mb-12">
                Join Quratr today and start discovering personalized adventures.
              </p>
              <motion.a
                href="/waitlist"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#fed4e4] text-black px-6 py-2 rounded-full transition-all inline-block hover:scale-110"
              >
                Join the Waitlist
              </motion.a>
            </div>
          </motion.section>
          {/* <BackgroundLinesDemo /> */}
        </main>

        <Footer />

        <motion.div
          className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-[#fed4e4] text-black p-3 sm:p-4 rounded-full shadow-lg cursor-pointer"
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
    </Providers>
  );
}
