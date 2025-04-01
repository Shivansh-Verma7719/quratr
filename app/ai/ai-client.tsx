"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare } from "lucide-react";
import UserMessage from "@/components/ai/user_msg";
import AgentMessage from "@/components/ai/agent_msg";
// import Blobs from "@/components/ai/bg-blobs";
import { loadingMessages } from "@/app/ai/loadingMessages";
import { ShimmerText } from "@/components/ui/Shimmer";
import AIInputBox from "@/components/ai/input";
import { UserProfile, Conversation, RecommendationResponse } from "@/types/ai";

// Update the interface to include userAttributes
interface AIRecommenderClientProps {
  userProfile: UserProfile | null;
  userAttributes: number[];
}

export default function AIRecommenderClient({ userProfile, userAttributes }: AIRecommenderClientProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!query.trim()) return;

    // Add user message to conversation
    setConversations(prev => [
      ...prev,
      { type: "user", content: query, timestamp: new Date() }
    ]);

    setIsLoading(true);
    setError(null);

    // Reset input field and height
    setQuery("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const useDebug = process.env.NEXT_PUBLIC_ENV === "development";
      // const useDebug = true;

      // Use POST request with full payload
      const response = await fetch(`/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          userAttributes: userAttributes,
          debug: useDebug ? "true" : "false"
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data: RecommendationResponse = await response.json();

      // Add AI response to conversation
      setConversations(prev => [
        ...prev,
        {
          type: "agent",
          content: data.summary,
          response: data,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Please try again.";
      setError(errorMessage);

      // Add error message to conversation with error flag
      setConversations(prev => [
        ...prev,
        {
          type: "agent",
          content: "I'm sorry, I couldn't process your request.",
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);


  return (
    <div className="relative flex h-[90vh] w-full flex-col overflow-hidden bg-background">
      {/* <Blobs /> */}

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pt-5 pb-28"
      >
        {conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-xs sm:max-w-sm lg:max-w-md space-y-5 -mt-12"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 dark:bg-primary/15 shadow-lg">
                <MessageSquare className="h-10 w-10 text-primary dark:text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Quratr AI</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ask me about restaurants and cafes in Delhi NCR. I&apos;ll find the perfect spot for you!
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-xs font-medium text-primary dark:text-primary">Try asking:</p>
                {[
                  "Romantic rooftop dining in South Delhi",
                  "Family-friendly places in Gurgaon",
                  "Best coffee in Khan Market",
                  "Vegetarian restaurants in Noida",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(suggestion);
                      if (inputRef.current) {
                        inputRef.current.value = suggestion;
                        inputRef.current.style.height = "auto";
                        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
                        inputRef.current.focus();
                      }
                    }}
                    className="w-full rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-4 text-left text-xs text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4 px-3 pt-2">
            <AnimatePresence initial={false} mode="popLayout">
              {conversations.map((message, index) => (
                message.type === "user" ? (
                  <UserMessage
                    key={`user-${index}`}
                    content={message.content}
                    avatar={userProfile?.avatar}
                    firstName={userProfile?.first_name || ""}
                    lastName={userProfile?.last_name || ""}
                  />
                ) : (
                  <AgentMessage
                    key={`agent-${index}`}
                    content={message.content}
                    isError={message.isError}
                    response={message.response}
                    onHelpfulFeedback={() => {
                      console.log("Marked as helpful:", message);
                    }}
                    onUnhelpfulFeedback={() => {
                      console.log("Marked as not helpful:", message);
                    }}
                  />
                )
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="flex justify-start relative"
                >
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="absolute left-2 -top-4 h-7 z-10 w-7 rounded-full flex items-center justify-center bg-secondary/80 shadow-sm backdrop-blur-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-white" />
                  </motion.div>

                  <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%] mb-2 rounded-2xl p-3 pt-4 shadow-sm mr-auto bg-white/80 dark:bg-gray-900/80 border border-gray-200/70 dark:border-gray-700/70 text-gray-800 dark:text-gray-100 backdrop-blur-sm">
                    <div className="flex items-center min-h-[24px] ml-3">
                      <ShimmerText
                        messages={loadingMessages}
                        className="text-md font-medium"
                        displayTime={4}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <AIInputBox
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        inputRef={inputRef}
        placeholder="Ask about restaurants..."
      />
    </div>
  );
}