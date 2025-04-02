import React, { useEffect, useState } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  scrollProgress: MotionValue<number>;
}

// Enhanced gradient overlay with depth
const AnimatedGradient = () => (
  <div className="absolute inset-0 z-10 bg-gradient-to-b from-purple-900/40 via-fuchsia-800/30 to-pink-800/40 opacity-70 will-change-transform">
    <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
  </div>
);

const Hero: React.FC<HeroProps> = ({ scrollProgress }) => {
  // Container ref for section-specific scroll measurements
  const [viewportHeight, setViewportHeight] = useState(0);
  
  useEffect(() => {
    // Set initial viewport height and update on resize
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    
    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  // Transform values based on scroll progress with parallax effects
  const heroScale = useTransform(scrollProgress, [0, 0.2], [1, 0.9]);
  const heroBorderRadius = useTransform(scrollProgress, [0, 0.2], [0, 50]);
  
  // Parallax effect for background image (moves slower than scroll)
  const backgroundY = useTransform(
    scrollProgress, 
    [0, 1], 
    [0, viewportHeight * 0.5]
  );
  
  // Parallax effects for decorative elements
  const floatingElementY1 = useTransform(
    scrollProgress, 
    [0, 0.5], 
    [0, -viewportHeight * 0.15]
  );
  
  const floatingElementY2 = useTransform(
    scrollProgress, 
    [0, 0.5], 
    [0, viewportHeight * 0.2]
  );
  
  const floatingOpacity = useTransform(scrollProgress, [0, 0.35], [1, 0]);
  
  // Content parallax (moves faster for enhanced depth perception)
  const contentY = useTransform(
    scrollProgress, 
    [0, 0.3], 
    [0, -viewportHeight * 0.1]
  );

  return (
    <motion.section
      id="hero"
      style={{
        scale: heroScale,
        borderRadius: heroBorderRadius,
      }}
      className="relative h-screen w-full overflow-hidden p-0 text-center"
    >
      {/* Background image with parallax */}
      <motion.div 
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: backgroundY }}
      >
        <Image
          src="/images/landing/3.jpg"
          alt="Discover experiences with Quratr"
          fill
          priority={true}
          sizes="100vw"
          quality={85}
          className="object-cover object-center scale-110" // Scale up slightly to prevent edge visibility during parallax
        />
      </motion.div>

      {/* Gradient overlay */}
      <AnimatedGradient />

      {/* Parallax floating decorative elements */}
      <motion.div
        className="absolute right-[15%] top-1/4 z-20 hidden lg:block will-change-transform"
        style={{ 
          y: floatingElementY1, 
          opacity: floatingOpacity,
          x: useTransform(scrollProgress, [0, 0.5], [0, 40]),
        }}
      >
        <div className="h-48 w-48 rounded-full bg-pink-400/30 backdrop-blur-xl" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-[10%] z-20 hidden lg:block will-change-transform"
        style={{ 
          y: floatingElementY2,
          opacity: floatingOpacity,
          x: useTransform(scrollProgress, [0, 0.5], [0, -60]),
        }}
      >
        <div className="h-32 w-32 rounded-full bg-purple-400/30 backdrop-blur-xl" />
      </motion.div>

      {/* Additional floating element for enhanced depth */}
      <motion.div
        className="absolute top-[60%] left-[60%] z-20 hidden lg:block will-change-transform"
        style={{ 
          y: useTransform(scrollProgress, [0, 0.5], [0, -100]),
          opacity: floatingOpacity,
          scale: useTransform(scrollProgress, [0, 0.5], [1, 0.8]),
        }}
      >
        <div className="h-24 w-24 rounded-full bg-blue-400/30 backdrop-blur-xl" />
      </motion.div>

      {/* Hero content with parallax effect */}
      <motion.div 
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 will-change-transform"
        style={{ y: contentY }}
      >
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
          className="mb-12 max-w-xl text-lg text-white sm:text-xl md:text-2xl"
        >
          Discover personalized experiences with a swipe
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link href="/login">
            <motion.button
              className="group inline-flex items-center rounded-full bg-[#fed4e4] px-6 py-3 text-base text-black transition-all hover:scale-110 sm:px-8 sm:py-4 sm:text-lg"
              whileHover={{
                boxShadow: "0 0 25px rgba(254, 212, 228, 0.7)",
                scale: 1.05
              }}
              whileTap={{ scale: 0.98 }}
            >
              Start Exploring
              <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;