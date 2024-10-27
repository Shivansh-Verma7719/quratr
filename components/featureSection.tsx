import { motion, useInView } from "framer-motion";
import {
  Smartphone,
  Users,
  Zap,
  TicketPercent,
//   SearchX,
//   MouseOff,
} from "lucide-react";
import { Iphone15Pro } from "./iPhone15pro";
import { useRef } from "react";
import swipeToVibe from "@/public/images/iPhone/swipe_to_vibe.jpg";
import socialExperiences from "@/public/images/iPhone/social.jpg";
import aiPoweredCuration from "@/public/images/iPhone/curations.jpg";
import curatedDiscounts from "@/public/images/iPhone/discount.jpg";

interface FeatureSection {
  title: string;
  description: string;
  icon: React.ElementType;
  imagePosition: "left" | "right";
  imageSrc: string;
}

const features: FeatureSection[] = [
  {
    title: "Swipe to Vibe",
    description:
      "Find your next experience with our intuitive, Tinder-like interface.",
    icon: Smartphone,
    imagePosition: "right",
    imageSrc: swipeToVibe.src,
  },
  {
    title: "Social Experiences with your tribe",
    description: "See what your friends and influencers are loving.",
    icon: Users,
    imagePosition: "left",
    imageSrc: socialExperiences.src,
  },
  {
    title: "AI-Powered Curation",
    description: "Get personalized recommendations based on your preferences.",
    icon: Zap,
    imagePosition: "right",
    imageSrc: aiPoweredCuration.src,
  },
  {
    title: "Curated Discounts",
    description:
      "Get exclusive discounts on the best experiences personalized to you.",
    icon: TicketPercent,
    imagePosition: "left",
    imageSrc: curatedDiscounts.src,
  },
  //   {
  //     title: "Eliminate Search",
  //     description: "Get what you want right in front of you.",
  //     icon: SearchX,
  //     imagePosition: 'right'
  //   },
  //   {
  //     title: "Stop scrolling together",
  //     description: "Share your incentives and go out on group experiences while having the option to discover together too",
  //     icon: MouseOff,
  //     imagePosition: 'left'
  //   }
];

const FeatureBlock = ({
  feature,
  index,
}: {
  feature: FeatureSection;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    // Increased top and bottom margins to trigger animations earlier
    margin: "-45% 0px -45% 0px",
    once: false,
  });

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${
        feature.imagePosition === "left" ? "lg:flex-row" : "lg:flex-row-reverse"
      } items-center gap-8 lg:gap-12`}
    >
      {/* Text Content */}
      <motion.div
        animate={{
          opacity: isInView ? 1 : 0,
          x: isInView ? 0 : feature.imagePosition === "left" ? -50 : 50,
        }}
        transition={{
          duration: 1, // Increased from 0.8 to 1
          ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smoother motion
        }}
        className="w-full lg:w-1/2 text-center lg:text-left"
      >
        <div className="flex items-center justify-center lg:justify-start mb-4">
          <feature.icon className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">{feature.title}</h3>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          {feature.description}
        </p>
      </motion.div>

      {/* iPhone 15 Pro */}
      <motion.div
        animate={{
          opacity: isInView ? 1 : 0,
          x: isInView ? 0 : feature.imagePosition === "left" ? 50 : -50,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="w-full lg:w-1/2 flex justify-center items-center"
      >
        <div className="relative">
          <Iphone15Pro
            key={index}
            width={440}
            height={882}
            src={feature.imageSrc}
            className="w-full h-auto max-w-[320px] sm:max-w-[440px]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeatureSection = () => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-6xl font-bold text-center mb-12 sm:mb-16">
          Connecting seekers to providers
        </h2>
        <div className="space-y-24 sm:space-y-32">
          {features.map((feature, index) => (
            <FeatureBlock key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
