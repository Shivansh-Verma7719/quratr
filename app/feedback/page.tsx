'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCheck } from 'lucide-react';
import Navbar from "@/components/navbar/index";
import Footer from "@/components/footer/index";
import { Providers } from '../providers';
import { createClient } from '@/utils/supabase/client';

const questions = [
  {
    id: 1,
    question: "Email",
    type: 'email',
  },
  {
    id: 2,
    question: "Are you in college?",
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    id: 3,
    question: "Mention the name of your college or the name of your workplace (in case you are out of college).",
    type: 'text',
  },
  {
    id: 4,
    question: "Do you feel like going out to eat, drink, play sport and watch movies more often than before?",
    type: 'radio',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 5,
    question: "Do you think it is easy to find the best place to go to, the next brand to buy and so on?",
    type: 'radio',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 6,
    question: "Do you want to see what you want, right now right in front of you?",
    type: 'radio',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 7,
    question: "Would you be encouraged or excited to get a discount on the experiences we craft? P.S. we'd self learn from your preferences",
    type: 'radio',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 8,
    question: "Do you have to spend some time and effort in searching, taking recommendations from friends or seeing reviews for where to go or what to buy?",
    type: 'radio',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 9,
    question: "Do you spend time researching about what product is right for you in terms of ingredients etc.?",
    type: 'radio',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 10,
    question: "Do you window shop experiences like restaurants, cafes, movies, online brand purchases etc.?",
    type: 'radio',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 11,
    question: "Would you be excited to have a tinder like profile where you can swipe right or left on experiences (restaurants, events etc.) and get incentivized after every 2-3 swipes with a discount/coupon code for you to enjoy the experience?",
    type: 'radio',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 12,
    question: "Do you think you'd want to use an AI to curate your next experience?",
    type: 'radio',
    options: ['Yes', 'No', 'Worth a shot'],
  },
  {
    id: 13,
    question: "We want to hear, tell us more about what you think of us.....",
    type: 'textarea',
  },
];

const FeedbackForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
    '10': '',
    '11': '',
    '12': '',
    '13': '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);  

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isCurrentStepValid = () => {
    const currentQuestion = questions[currentStep];
    const answer = answers[currentQuestion.id.toString() as keyof typeof answers];
    
    switch (currentQuestion.type) {
      case 'email':
        return validateEmail(answer);
      case 'text':
      case 'textarea':
        return answer.trim() !== '';
      case 'radio':
        return answer !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isCurrentStepValid() && currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (!answers['1'] || !validateEmail(answers['1'])) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      const feedbackData: Record<string, string> = {
        email: answers['1'],
        '2': answers['2'],
        '3': answers['3'],
        '4': answers['4'],
        '5': answers['5'],
        '6': answers['6'],
        '7': answers['7'],
        '8': answers['8'],
        '9': answers['9'],
        '10': answers['10'],
        '11': answers['11'],
        '12': answers['12'],
        '13': answers['13'],
      };

      const { data, error } = await supabase
        .from('feedback')
        .insert([feedbackData]);

      if (error) throw error;

      console.log('Feedback submitted successfully:', data);
      setIsSubmitted(true);
      // Reset form or navigate to a thank you page
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
      setCurrentStep(0);
      setIsSubmitted(false);
      setAnswers({
        '1': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
        '6': '',
        '7': '',
        '8': '',
        '9': '',
        '10': '',
        '11': '',
        '12': '',
        '13': '',
      });
    }
  };

  const renderQuestion = (question: { id: number; question: string; type: string; options?: undefined; } | { id: number; question: string; type: string; options: string[]; }) => {
    switch (question.type) {
      case 'email':
      case 'text':
        return (
          <input
            type={question.type}
            value={answers[question.id.toString() as keyof typeof answers] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required={question.type === 'email'}
          />
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={answers[String(question.id) as keyof typeof answers] === option}
                  onChange={() => handleAnswer(question.id, option)}
                  className="form-radio h-5 w-5 text-[#fed4e4]"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'textarea':
        return (
          <textarea
            value={answers[String(question.id) as keyof typeof answers] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Providers>
      <div className="min-h-screen font-sans overflow-x-hidden bg-background text-text">
        <Navbar />
        <main className="pt-[68px]">
          <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="bg-background p-8 rounded-lg shadow-lg dark:shadow-gray-800 w-full max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 text-center">Quratr Feedback</h1>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">{questions[currentStep].question}</h2>
                  {renderQuestion(questions[currentStep])}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full flex items-center disabled:opacity-50"
                >
                  <ArrowLeft className="mr-2" /> Previous
                </button>
                {currentStep === questions.length - 1 ? (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isCurrentStepValid()}
                    whileHover={{ scale: isCurrentStepValid() ? 1.05 : 1 }}
                    whileTap={{ scale: isCurrentStepValid() ? 0.95 : 1 }}
                    className={`bg-[#fed4e4] text-black px-6 py-2 rounded-full transition-all ${
                      isCurrentStepValid()
                        ? "hover:scale-110"
                        : "opacity-50 cursor-not-allowed"
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
                          Submitting...
                        </motion.span>
                      ) : isSubmitted ? (
                        <motion.span
                          key="submitted"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <CheckCheck className="w-5 h-5" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Submit
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleNext}
                    disabled={!isCurrentStepValid()}
                    whileHover={{ scale: isCurrentStepValid() ? 1.05 : 1 }}
                    whileTap={{ scale: isCurrentStepValid() ? 0.95 : 1 }}
                    className={`bg-[#fed4e4] text-black px-4 py-2 rounded-full flex items-center transition-all ${
                      isCurrentStepValid()
                        ? "hover:scale-110"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    Next <ArrowRight className="ml-2" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  );
};

export default FeedbackForm;
