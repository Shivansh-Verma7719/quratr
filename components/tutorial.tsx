import React, { useState } from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Repeat, Heart, ListCheck } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Swipe Right to Like",
    description: "Swipe right or tap the heart button to like places you want to visit. These places will appear in your curated list.",
    icon: <Heart className="w-12 h-12 text-pink-500" />,
  },
  {
    title: "Swipe Left to Skip",
    description: "Not interested? Simply swipe left to skip and move to the next place.",
    icon: <ArrowLeft className="w-12 h-12 text-gray-500" />,
  },
  {
    title: "Tap to Flip",
    description: "Tap on any card to flip it and see more details about the place, including the address and additional information.",
    icon: <Repeat className="w-12 h-12 text-blue-500" />,
  },
  {
    title: "Find Your Liked Places",
    description: "All your right-swiped places can be found in the Curated Places section. Access them anytime to view details or redeem exclusive discounts!",
    icon: <ListCheck className="w-12 h-12 text-purple-500" />,
  },
];

const Tutorial = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      hideCloseButton
      size="full"
      classNames={{
        backdrop: "bg-black/50",
        base: "bg-transparent",
        wrapper: "p-0",
      }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        {() => (
          <ModalBody className="p-0 bg-black/70">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-white"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  {tutorialSteps[currentStep].icon}
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-4">
                  {tutorialSteps[currentStep].title}
                </h2>
                
                <p className="mb-8 max-w-md px-4">
                  {tutorialSteps[currentStep].description}
                </p>

                <Button
                  color="primary"
                  variant="flat"
                  size="lg"
                  onPress={handleNext}
                  className="font-semibold"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Got it!" : "Next"}
                </Button>

                <div className="flex gap-2 mt-8">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === currentStep ? "bg-primary" : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Tutorial;
