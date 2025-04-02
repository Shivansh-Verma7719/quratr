"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import discoveryImage from "@/public/images/landing/2.jpg";
import DynamicFeatureSection from "@/components/featureSection";
import Hero from "@/components/ui/Hero";
import Footer from "@/components/footer";


export default function QuratrLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const aboutOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1]);

  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <div className="bg-background">
        <Hero
          scrollProgress={scrollYProgress}
          />
        {/*  */}
        <DynamicFeatureSection />

        <motion.section
          style={{ opacity: aboutOpacity }}
          id="about"
          className="bg-white py-16 sm:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center lg:flex-row">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                className="mb-8 lg:mb-0 lg:w-1/2"
              >
                <h2 className="mb-4 text-4xl font-bold text-black sm:mb-6 md:text-5xl">
                  Redefining Discovery
                </h2>
                <p className="mb-6 text-base text-gray-600 sm:text-[1.3rem]">
                  Quratr is leading the Consumer AI revolution, crafting highly
                  curated recommendations for the modern, experience-driven
                  generation.
                </p>
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
                  className="mx-auto w-full max-w-4xl rounded-xl shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          style={{ scale: ctaScale }}
          id="waitlist"
          className="bg-background py-16 text-text sm:py-24"
        >
          <div className="container mx-auto px-4 text-center sm:px-6">
            <h2 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl">
              Ready to redefine your experiences?
            </h2>
            <p className="mb-8 text-lg sm:mb-12 sm:text-xl">
              Join Quratr today and start discovering personalized adventures.
            </p>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block rounded-full bg-[#fed4e4] px-6 py-2 text-black transition-all hover:scale-110"
            >
              Sign Up
            </motion.a>
          </div>
        </motion.section>
        {/* <BackgroundLinesDemo /> */}
      </div>
      <Footer />
      <motion.div
        className="fixed bottom-4 right-4 hidden cursor-pointer rounded-full bg-[#fed4e4] p-3 text-black shadow-lg sm:bottom-8 sm:right-8 sm:p-4 md:block"
        style={{
          opacity: scrollY > 200 ? 1 : 0,
          pointerEvents: scrollY > 200 ? "auto" : "none",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowRight className="h-5 w-5 rotate-[-90deg] transform sm:h-6 sm:w-6" />
      </motion.div>
    </div>
  );
}
