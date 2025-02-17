"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import discoveryImage from "@/public/images/landing/2.jpg";
import { Spinner, Skeleton } from "@heroui/react";

const DynamicFeatureSection = dynamic(
  () => import("@/components/featureSection"),
  {
    loading: () => (
      <div className="flex h-[600px] items-center justify-center">
        <Spinner />
      </div>
    ),
    ssr: false,
  }
);

const DynamicFooter = dynamic(() => import("@/components/footer"), {
  ssr: true,
});

export default function QuratrLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroBorderRadius = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  const aboutOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1]);

  const VideoSkeleton = () => {
    return (
      <div className="absolute inset-0 flex h-screen w-full items-center justify-center">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
    );
  };

  useEffect(() => {
    let startTime: number;
    const duration = 5000; // 5 seconds
    const startSpeed = 1;
    const endSpeed = 0.4;

    const animatePlaybackSpeed = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Calculate current speed using easeOut function for smooth deceleration
      const currentSpeed =
        startSpeed - (startSpeed - endSpeed) * easeOutQuad(progress);

      if (videoRef.current) {
        videoRef.current.playbackRate = currentSpeed;
        setPlaybackRate(currentSpeed);
      }

      if (progress < 1) {
        requestAnimationFrame(animatePlaybackSpeed);
      }
    };

    // Easing function for smooth transition
    function easeOutQuad(x: number): number {
      return 1 - (1 - x) * (1 - x);
    }

    requestAnimationFrame(animatePlaybackSpeed);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <div className="bg-white">
        <motion.section
          id="hero"
          style={{
            scale: heroScale,
            borderRadius: heroBorderRadius,
            position: "relative",
            overflow: "hidden",
          }}
          className="h-screen w-full p-0 text-center"
        >
          <Suspense fallback={<VideoSkeleton />}>
            <script>
              {`
              document.addEventListener('DOMContentLoaded', function() {
                var video = document.querySelector('video');
                video.playbackRate = ${playbackRate};
              });
            `}
            </script>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
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
          </Suspense>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6 text-4xl font-bold text-white sm:text-5xl md:text-7xl"
            >
              Curate your next Experience
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-12 text-lg text-white sm:text-xl md:text-2xl"
            >
              Discover personalized experiences with a swipe
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <a href="/login">
                <button className="group inline-flex items-center rounded-full bg-[#fed4e4] px-6 py-3 text-base text-black transition-all hover:scale-110 sm:px-8 sm:py-4 sm:text-lg">
                  Start Exploring
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:animate-bounceHorizontal" />
                </button>
              </a>
            </motion.div>
          </div>
        </motion.section>
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
      <DynamicFooter />
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
