import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import SwipeCard from "./swipe-card";

// Importing types from your app
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

interface AgentMessageProps {
    content: string;
    isError?: boolean;
    response?: RecommendationResponse;
    onHelpfulFeedback?: () => void;
    onUnhelpfulFeedback?: () => void;
    className?: string;
}

export const AgentMessage: React.FC<AgentMessageProps> = ({
    content,
    isError = false,
    response,
    onHelpfulFeedback = () => { },
    onUnhelpfulFeedback = () => { },
    className = "",
}) => {
    const [cardsLoading, setCardsLoading] = useState(true);


    const handleLike = (id: number) => {
        console.log("Liked place:", id);
    };

    const handleDislike = (id: number) => {
        console.log("Disliked place:", id);
    };

    // Process recommendations and places
    const allRecommendations = React.useMemo(() => {
        if (!response) return [];

        // Get perfect matches from recommendations
        const perfectMatches = response.recommendations || [];

        // Get ids AND names of perfect matches to filter out duplicates
        const perfectMatchIds = new Set(perfectMatches.map(rec => rec.id));
        const perfectMatchNames = new Set(perfectMatches.map(rec => rec.name.toLowerCase().trim()));

        // Convert places to recommendation format for partial matches
        const partialMatches = (response.places || [])
            .filter(place =>
                // Filter out places already in recommendations by id OR name
                !perfectMatchIds.has(place.id) &&
                !perfectMatchNames.has(place.name.toLowerCase().trim())
            )
            .map(place => ({
                id: place.id,
                name: place.name,
                description: place.description || `${place.name} in ${place.address}`,
                match_reasons: [], // No match reasons for partial matches
                highlights: [], // No highlights for partial matches
                cuisine: place.cuisine,
                price_range: place.price ? `${"$".repeat(Math.min(Math.ceil(place.price / 300), 4))}` : undefined,
                location: place.address,
                image_url: place.image,
                isPartialMatch: true // Add flag to identify partial matches
            }));

        // Also ensure no duplicates within partial matches by name
        const uniquePartialMatches = [];
        const seenNames = new Set(perfectMatchNames);

        for (const match of partialMatches) {
            const lowerName = match.name.toLowerCase().trim();
            if (!seenNames.has(lowerName)) {
                seenNames.add(lowerName);
                uniquePartialMatches.push(match);
            }
        }

        return [...perfectMatches, ...uniquePartialMatches];
    }, [response]);

    // Check if we have recommendations to show
    const hasRecommendations = allRecommendations.length > 0;

    useEffect(() => {
        if (hasRecommendations) {
            // Show loading state for a minimum time to prevent flicker
            const timer = setTimeout(() => {
                setCardsLoading(false);
            }, 1000); // 1.5 seconds minimum loading time for better UX
            
            return () => clearTimeout(timer);
        }
    }, [hasRecommendations]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1] // Custom easing for smooth motion
            }}
            className={`flex justify-start relative ${className}`}
        >
            {/* Agent Avatar with elevated z-index to ensure visibility */}
            <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className={`absolute z-10 left-2 -top-4 h-7 w-7 rounded-full flex items-center justify-center ${isError ? "bg-red-500 shadow-sm" : "bg-secondary shadow-sm"
                    }`}
            >
                {isError ? (
                    <AlertCircle className="h-3.5 w-3.5 text-white" />
                ) : (
                    <MessageSquare className="h-3.5 w-3.5 text-white" />
                )}
            </motion.div>

            {/* Message Content with overflow handling */}
            <div
                className={`
                  ${hasRecommendations
                        ? 'max-w-[92%] md:max-w-[85%] lg:max-w-2xl'
                        : 'max-w-[85%] md:max-w-[75%] lg:max-w-[65%]'}
                  mb-2 rounded-2xl p-3 pt-4 shadow-sm mr-auto
                  ${isError
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-gray-800 dark:text-gray-100"
                        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                    }
                  will-change-[opacity,transform] overflow-hidden
                `}
            >
                <div className="space-y-4">
                    <p className="text-sm">{content}</p>

                    {/* Card container with overflow hidden */}
                    {hasRecommendations && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="mt-6 relative"
                        >
                            <SwipeCard
                                recommendations={allRecommendations}
                                onLike={handleLike}
                                onDislike={handleDislike}
                                isLoading={cardsLoading}
                                containerClassName="contained-swipe-card"
                            />
                        </motion.div>
                    )}

                    {/* Feedback buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex items-center justify-end space-x-1 pt-1"
                    >
                        <button
                            onClick={onHelpfulFeedback}
                            className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            title="Helpful"
                            aria-label="Mark as helpful"
                        >
                            <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                            onClick={onUnhelpfulFeedback}
                            className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            title="Not helpful"
                            aria-label="Mark as not helpful"
                        >
                            <ThumbsDown className="h-3 w-3" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default AgentMessage;