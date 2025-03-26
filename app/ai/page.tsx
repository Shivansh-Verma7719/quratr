"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare } from "lucide-react";
import UserMessage from "@/components/ai/user_msg";
import AgentMessage from "@/components/ai/agent_msg";
import Blobs from "@/components/ai/bg-blobs";
import { createClient } from "@/utils/supabase/client";
import { loadingMessages } from "./loadingMessages";
import { ShimmerText } from "@/components/ui/Shimmer";

// Define properly typed interfaces for API response
interface PlaceRanking {
  similarity_score: number;
  relevance_score: number;
  final_score: number;
}

interface Place {
  id: number;
  name: string;
  address: string;
  city: string;
  cuisine: string;
  tags: string;
  rating: number | null;
  price: number;
  description: string | null;
  image: string;
  ranking: PlaceRanking;
}

interface RecommendationResult {
  id: number;
  name: string;
  description: string;
  match_reasons: string[];
  highlights: string[];
  cuisine?: string;
  price_range?: string;
  location?: string;
  atmosphere?: string;
  image_url?: string;
}

interface QueryIntent {
  original_query: string;
  cuisine_types: string[];
  locations: string[];
  price_range: string | null;
  atmosphere: string | null;
  occasion: string | null;
  dietary_preferences: string[];
  expanded_queries: string[];
}

interface RecommendationResponse {
  query: string;
  intent: QueryIntent;
  places: Place[];
  recommendations: RecommendationResult[];
  summary: string;
  markdown_response: string | null;
}

interface Conversation {
  type: "user" | "agent";
  content: string;
  response?: RecommendationResponse;
  timestamp: Date;
  isError?: boolean;
}

// Add this interface for UserProfile
interface UserProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  is_onboarded?: boolean;
  created_at?: string;
}

export default function AIRecommenderPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Add state for user profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClient();

      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Get profile data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (!error && data) {
        setUserProfile({
          id: data.id,
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          email: userData.user.email || '',
          avatar: data.avatar,
          is_onboarded: data.is_onboarded,
          created_at: data.created_at
        });
      }
    };

    fetchUserProfile();
  }, []);

  // Auto-grow textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setQuery(textarea.value);
  };

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
      // Update in your handleSubmit function  
      const useDebug = process.env.NEXT_PUBLIC_ENV === "development";
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}${useDebug ? "&debug=true" : ""}`);
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

  // Handle Cmd/Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inputRef.current === document.activeElement &&
        (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [query]);

  return (
    <div className="relative flex h-[90vh] w-full flex-col overflow-hidden bg-background/95">

      <Blobs />

      {/* Messages Container - Laptop optimized with better max-width */}
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
                      // Add your feedback handling logic here
                      console.log("Marked as helpful:", message);
                    }}
                    onUnhelpfulFeedback={() => {
                      // Add your feedback handling logic here
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
                  {/* Agent Avatar with subtle animation */}
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="absolute left-2 -top-4 h-7 z-10 w-7 rounded-full flex items-center justify-center bg-secondary/80 shadow-sm backdrop-blur-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-white" />
                  </motion.div>

                  {/* Message Content with refined shimmering text */}
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

      {/* Input Area - Fixed above the bottom navbar with improved contrast and laptop optimization */}
      <div className="fixed bottom-[2.5rem] z-30 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-bacground p-3 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md focus-within:ring-2 focus-within:ring-primary/30">
            <textarea
              ref={inputRef}
              value={query}
              onChange={handleTextareaInput}
              placeholder="Ask about restaurants..."
              rows={1}
              className="max-h-[100px] min-h-[44px] w-full resize-none bg-transparent px-4 py-3 pr-16 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />

            <div className="hidden md:flex absolute right-20 text-xs text-gray-400 items-center">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">Ctrl</kbd>
              <span className="mx-0.5">+</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Enter</kbd>
            </div>

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  if (inputRef.current) {
                    inputRef.current.style.height = "auto";
                    inputRef.current.focus();
                  }
                }}
                className="absolute bottom-[10px] right-12 rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute bottom-[6px] right-2 rounded-full bg-primary p-2 text-white opacity-90 transition-opacity hover:opacity-100 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 rounded-md bg-red-50 dark:bg-red-900/20 p-2 text-xs text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800"
            >
              {error}
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}