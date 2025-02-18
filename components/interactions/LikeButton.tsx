import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
  onUnlike: () => void;
}

const Confetti = ({ isActive }: { isActive: boolean }) => {
  const particles = Array.from({ length: 16 });
  const colors = ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-pink-500"];

  const particleColors = particles.map(
    (_, index) => colors[Math.floor(index % colors.length)]
  );

  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {particles.map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 30 + 10),
                y: -40 - Math.random() * 8,
                scale: 1,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className={`absolute h-2 w-4 ${particleColors[i]}`}
              style={{
                transformOrigin: "center center",
                borderRadius: "9999px",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  onLike,
  onUnlike,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 500);
      onLike();
    } else {
      onUnlike();
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={handleLike}
      className="relative flex items-center gap-1 rounded-full p-2 transition-colors"
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className="relative h-7 w-7 transition-colors"
          fill={isLiked ? "#f43f5e" : "none"}
          stroke={isLiked ? "#f43f5e" : "gray"}
        />
        <Confetti isActive={showConfetti} />
      </motion.div>
    </motion.button>
  );
};
