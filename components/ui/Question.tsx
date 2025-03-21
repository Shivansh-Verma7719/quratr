import React from "react";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: string;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full"
    >
      <h2 className="mb-4 text-xl font-bold">{question}</h2>
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswerChange("Yes")}
          className={`rounded px-4 py-2 text-black ${
            currentAnswer === "Yes" ? "bg-green-500" : "bg-gray-200"
          }`}
        >
          Yes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswerChange("No")}
          className={`rounded px-4 py-2 text-black ${
            currentAnswer === "No" ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          No
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuestionCard;