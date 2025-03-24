"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, ChevronDown, X, MessageSquare, User, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";
import Image from "next/image";

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

export default function AIRecommenderPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);      
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
          content: `I'm sorry, I couldn't process your request. ${errorMessage}`, 
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
      {/* Enhanced background blobs with much higher visibility - work in both modes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 -left-10 h-[300px] w-[300px] rounded-full bg-primary/40 dark:bg-primary/25 blur-[60px]"
          animate={{ 
            x: [0, 20, -20, 0], 
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.9, 1] 
          }} 
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-secondary/40 dark:bg-secondary/30 blur-[70px]"
          animate={{ 
            x: [0, -30, 15, 0], 
            y: [0, 20, -30, 0],
            scale: [1, 0.9, 1.05, 1] 
          }} 
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 h-[200px] w-[200px] rounded-full bg-blue-400/30 dark:bg-blue-500/20 blur-[50px]"
          animate={{ 
            x: [0, 30, -15, 0], 
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1] 
          }} 
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Messages Container - Light/dark responsive */}
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
              className="max-w-xs space-y-5 -mt-12"
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
                    className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 px-4 text-left text-xs text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4 px-3 pt-2">
            <AnimatePresence initial={false}>
              {conversations.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} relative`}
                >
                  {/* Avatar for user or agent */}
                  <div className={`absolute ${message.type === "user" ? "right-2" : "left-2"} -top-4 h-7 w-7 rounded-full flex items-center justify-center ${
                    message.type === "user" 
                      ? "bg-primary shadow-sm" 
                      : message.isError 
                        ? "bg-red-500 shadow-sm" 
                        : "bg-secondary shadow-sm"
                  }`}>
                    {message.type === "user" ? (
                      <User className="h-3.5 w-3.5 text-white" />
                    ) : message.isError ? (
                      <AlertCircle className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <MessageSquare className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>

                  <div
                    className={`
                      max-w-[85%] mb-2 rounded-2xl p-3 pt-4 shadow-sm
                      ${message.type === "user" 
                        ? "bg-primary/95 text-white ml-auto" 
                        : message.isError
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mr-auto text-gray-800 dark:text-gray-100"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-auto text-gray-800 dark:text-gray-100"
                      }
                    `}
                  >
                    {message.type === "user" ? (
                      <p className="text-sm">{message.content}</p>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Recommendations Display */}
                        {message.response && (
                          <div className="mt-4 space-y-4">
                            {message.response.recommendations.map((place) => (
                              <div key={place.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
                                {place.image_url && (
                                  <div className="relative h-44 w-full overflow-hidden">
                                    <Image
                                      src={place.image_url}
                                      alt={place.name}
                                      fill
                                      sizes="(max-width: 640px) 85vw, 400px"
                                      className="object-cover"
                                    />
                                    {place.price_range && (
                                      <div className="absolute right-2 top-2 rounded-full bg-black/80 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                                        {place.price_range}
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <div className="p-3">
                                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{place.name}</h3>
                                  
                                  {place.cuisine && place.location && (
                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                      {place.cuisine.split(',')[0]} • {place.location}
                                    </p>
                                  )}
                                  
                                  <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">{place.description}</p>
                                  
                                  <div className="mt-3">
                                    <details className="group text-xs">
                                      <summary className="flex cursor-pointer items-center font-medium text-primary dark:text-primary">
                                        <ChevronDown className="mr-1 h-3 w-3 transition-transform group-open:rotate-180" />
                                        See details
                                      </summary>
                                      
                                      <div className="mt-2 space-y-2 pl-4 text-xs">
                                        {/* Match reasons */}
                                        {place.match_reasons && place.match_reasons.length > 0 && (
                                          <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200">Perfect match because:</p>
                                            <ul className="mt-1 list-disc space-y-1 pl-4 text-gray-600 dark:text-gray-400">
                                              {place.match_reasons.map((reason, idx) => (
                                                <li key={idx}>{reason}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        {/* Highlights */}
                                        {place.highlights && place.highlights.length > 0 && (
                                          <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200">Highlights:</p>
                                            <ul className="mt-1 list-disc space-y-1 pl-4 text-gray-600 dark:text-gray-400">
                                              {place.highlights.map((highlight, idx) => (
                                                <li key={idx}>{highlight}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        {place.atmosphere && (
                                          <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-medium text-gray-800 dark:text-gray-200">Vibe:</span> {place.atmosphere}
                                          </p>
                                        )}
                                      </div>
                                    </details>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Feedback buttons */}
                        <div className="flex items-center justify-end space-x-1 pt-1">
                          <button 
                            className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            title="Helpful"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button 
                            className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            title="Not helpful"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm ml-8">
                    <div className="absolute left-2 -top-2 h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                      <MessageSquare className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <p className="text-xs text-gray-600 dark:text-gray-300">Finding recommendations...</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed above the bottom navbar with improved contrast */}
      <div className="fixed bottom-[2.5rem] left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-bacground p-3 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="relative flex items-center overflow-hidden rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md focus-within:ring-2 focus-within:ring-primary/30">
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