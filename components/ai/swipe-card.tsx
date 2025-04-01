import React, { useState, useEffect, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
import ReactCardFlip from "react-card-flip";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/react";
import {
    CircleCheck,
    HomeIcon,
    Sparkles,
    Star
} from "lucide-react";

// Update RecommendationResult interface to include isPartialMatch
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
    isLastCard?: boolean;
    isPartialMatch?: boolean;
}

interface SwipeCardProps {
    recommendations: RecommendationResult[];
    onLike?: (id: number) => void;
    onDislike?: (id: number) => void;
    containerClassName?: string;
    isLoading?: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
    recommendations,
    onLike = () => { },
    onDislike = () => { },
    containerClassName = "",
    isLoading: externalLoading = false,
}) => {
    // Add a last card to show "All Caught Up!" message
    const allRecommendations = useMemo(() => {
        const lastCard: RecommendationResult = {
            id: 9999,
            name: "All Caught Up!",
            description: "You've seen all our recommendations for now.",
            match_reasons: [],
            highlights: [],
            isLastCard: true
        };
        return [...recommendations, lastCard];
    }, [recommendations]);

    const [cards, setCards] = useState<RecommendationResult[]>([]);
    const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
    const [swipeInProgress, setSwipeInProgress] = useState(false);
    const [removedCards, setRemovedCards] = useState<number[]>([]);
    const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // Initialize cards when recommendations change
    useEffect(() => {
        setCards(allRecommendations);
        setRemovedCards([]);
        
        // Reset flipped state for all cards
        const initialFlippedState = allRecommendations.reduce(
            (acc, recommendation) => {
                acc[recommendation.id] = false;
                return acc;
            },
            {} as { [key: number]: boolean }
        );
        setFlippedCards(initialFlippedState);
    }, [allRecommendations]);

    const handleCardFlip = (id: number, event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        // Prevent event bubbling to avoid triggering swipe
        event.stopPropagation();

        if (!swipeInProgress && !removedCards.includes(id)) {
            setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
        }
    };

    const handleTouchStart = (id: number, e: React.TouchEvent<HTMLDivElement>) => {
        const touchStartTime = new Date().getTime();
        e.currentTarget.dataset.touchStartTime = touchStartTime.toString();
    };

    const handleTouchEnd = (id: number, e: React.TouchEvent<HTMLDivElement>) => {
        const touchEndTime = new Date().getTime();
        const touchStartTime = parseInt(
            e.currentTarget.dataset.touchStartTime || "0",
            10
        );
        if (touchEndTime - touchStartTime < 250) {
            handleCardFlip(id, e);
        }
    };

    const onSwipe = (direction: string, id: number) => {
        // Don't process swipes for the last card
        const recommendation = allRecommendations.find(rec => rec.id === id);
        if (recommendation?.isLastCard) {
            return;
        }

        setSwipeInProgress(true);

        if (direction === "right") {
            onLike(id);
        } else if (direction === "left") {
            onDislike(id);
        }

        // Mark the card as removed after a delay to allow for the swipe animation
        setTimeout(() => {
            setRemovedCards(prev => [...prev, id]);
            setSwipeInProgress(false);
        }, 1000);
    };

    // Parse cuisine string into array
    const parseCuisine = (cuisineString?: string): string[] => {
        if (!cuisineString) return [];
        return cuisineString.split(',').map(item => item.trim()).filter(Boolean);
    };

    // Skeleton loader for the cards
    const CardSkeleton = () => (
        <div className="relative h-[520px] w-full my-6">
            <Card radius="lg" className="h-full w-full border-none shadow-xl">
                <Skeleton className="h-full w-full rounded-lg" />
                <CardBody className="absolute left-0 top-0 flex w-full flex-row items-start justify-between p-3 pt-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </CardBody>
                <CardFooter
                    className="absolute bottom-1 z-10 ml-1 flex w-[calc(100%_-_8px)] bg-black bg-opacity-35 flex-col items-start overflow-hidden rounded-large border-1 border-white/20 py-1.5 shadow-lg before:rounded-xl"
                >
                    <Skeleton className="h-7 w-3/4 rounded-lg mb-2" />
                    <Skeleton className="h-5 w-1/2 rounded-lg mb-1" />
                    <Skeleton className="h-5 w-2/3 rounded-lg" />
                </CardFooter>
            </Card>
        </div>
    );

    if (recommendations.length === 0) {
        return <CardSkeleton />;
    }

    if (externalLoading) {
        return <CardSkeleton />;
    }

    // Filter out cards that have been removed
    const visibleCards = cards.filter(card => !removedCards.includes(card.id));

    return (
        <div className={`relative h-[520px] w-full my-6 ${containerClassName}`}>
            {/* Card container with improved containment styles */}
            <div className="relative h-full w-full overflow-hidden">
                {visibleCards.reverse().map((recommendation, index) => (
                    <TinderCard
                        key={recommendation.id}
                        onSwipe={(direction) => onSwipe(direction, recommendation.id)}
                        preventSwipe={recommendation.isLastCard ? ["up", "down", "left", "right"] : ["up", "down"]}
                        swipeRequirementType="position"
                        className="absolute left-0 top-0 h-full w-full"
                        swipeThreshold={80}
                    >
                        <div
                            ref={(el) => {
                                cardRefs.current[recommendation.id] = el;
                            }}
                            onClick={(e) => handleCardFlip(recommendation.id, e)}
                            onTouchStart={(e) => handleTouchStart(recommendation.id, e)}
                            onTouchEnd={(e) => handleTouchEnd(recommendation.id, e)}
                            className="h-full w-full cursor-pointer"
                            style={{
                                zIndex: visibleCards.length - index, // Higher z-index for top cards
                                position: "relative", // Ensure z-index works properly
                                // Add a slight offset for cards to create a stack effect
                                transform: `translateY(${index * -1}px)`,
                                transitionProperty: "transform, opacity",
                                transitionDuration: "0.3s",
                                transitionTimingFunction: "ease-out"
                            }}
                        >
                            <ReactCardFlip
                                isFlipped={flippedCards[recommendation.id] || false}
                                containerClassName="h-full w-full"
                                flipSpeedBackToFront={0.3}
                                flipSpeedFrontToBack={0.3}
                            >
                                {/* Front of card */}
                                <Card
                                    isFooterBlurred
                                    radius="lg"
                                    className="h-full w-full border-none shadow-xl"
                                >
                                    {recommendation.isLastCard ? (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6">
                                            <h2 className="mb-4 text-2xl font-bold">All Caught Up!</h2>
                                            <div className="text-6xl mb-4">🎉</div>
                                            <p className="text-center text-gray-600 dark:text-gray-300">
                                                You&apos;ve seen all our recommendations for now.
                                            </p>
                                        </div>
                                    ) : recommendation.image_url ? (
                                        <>
                                            <Image
                                                alt={recommendation.name}
                                                className="h-full w-full object-cover"
                                                src={recommendation.image_url}
                                                priority={true}
                                                fill
                                                quality={100}
                                                loading="eager"
                                            />
                                            <CardBody className="absolute left-0 top-0 flex w-full flex-row items-start justify-between p-3 pt-4">
                                                {recommendation.price_range && (
                                                    <Chip
                                                        color="success"
                                                        variant="solid"
                                                        size="sm"
                                                        className="ml-auto"
                                                    >
                                                        {recommendation.price_range}
                                                    </Chip>
                                                )}
                                            </CardBody>
                                            <CardFooter
                                                className="absolute bottom-1 z-10 ml-1 flex w-[calc(100%_-_8px)] bg-black bg-opacity-35 flex-col items-start overflow-hidden rounded-large border-1 border-white/20 py-1.5 shadow-lg"
                                            >
                                                <div className="flex w-full items-center justify-between">
                                                    <h3 className="text-2xl text-white font-bold line-clamp-1">
                                                        {recommendation.name}
                                                    </h3>
                                                </div>

                                                {/* Modified location and atmosphere section */}
                                                <div className="flex flex-col text-white">
                                                    {recommendation.location && (
                                                        <p className="text-lg flex items-center">
                                                            {recommendation.location}
                                                        </p>
                                                    )}
                                                    {recommendation.atmosphere && (
                                                        <p className="text-sm text-gray-200 italic">
                                                            {recommendation.atmosphere} atmosphere
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {recommendation.isPartialMatch ? (
                                                        <Chip
                                                            variant="flat"
                                                            color="warning"
                                                            startContent={<Star size={14} />}
                                                            size="sm"
                                                        >
                                                            <p className="mt-[0.2rem]">Similar match</p>
                                                        </Chip>
                                                    ) : recommendation.match_reasons?.length > 0 && (
                                                        <Chip
                                                            variant="flat"
                                                            color="success"
                                                            startContent={<CircleCheck size={14} />}
                                                            size="sm"
                                                            className="flex items-center justify-center"
                                                        >
                                                            <p className="mt-[0.2rem]">Perfect match</p>
                                                        </Chip>
                                                    )}
                                                </div>
                                            </CardFooter>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6">
                                            <h3 className="text-2xl font-bold mb-3">{recommendation.name}</h3>
                                            {recommendation.location && (
                                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                                    <HomeIcon className="inline mr-2" size={18} />
                                                    {recommendation.location}
                                                </p>
                                            )}
                                            {recommendation.description && (
                                                <p className="text-gray-700 dark:text-gray-300 text-center">
                                                    {recommendation.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </Card>

                                {/* Back of card */}
                                <Card
                                    radius="lg"
                                    isBlurred
                                    className="h-full w-full border-none overflow-auto shadow-xl"
                                >
                                    <div className="absolute inset-0" />
                                    <CardBody className="relative z-10 p-4 overflow-auto bg-black bg-opacity-60">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex h-full w-full flex-col space-y-3"
                                        >
                                            <div className="flex justify-between items-center">
                                                <motion.h2
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="text-xl font-bold text-white"
                                                >
                                                    {recommendation.name}
                                                </motion.h2>
                                            </div>

                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className="flex flex-wrap gap-1.5"
                                            >
                                                {parseCuisine(recommendation.cuisine).map((cuisine, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        color="secondary"
                                                        variant="flat"
                                                        size="sm"
                                                    >
                                                        {cuisine}
                                                    </Chip>
                                                ))}

                                                {recommendation.price_range && (
                                                    <Chip
                                                        color="success"
                                                        variant="flat"
                                                        size="sm"
                                                    >
                                                        {recommendation.price_range}
                                                    </Chip>
                                                )}
                                            </motion.div>

                                            <motion.hr
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: "100%", opacity: 1 }}
                                                transition={{ delay: 0.4, duration: 0.5 }}
                                                className="border-t border-gray-600"
                                            />

                                            {recommendation.description && (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.5, duration: 0.5 }}
                                                    className="mb-2"
                                                >
                                                    <h3 className="text-white text-sm font-medium mb-1">About</h3>
                                                    <p className="text-gray-300 text-xs leading-relaxed">
                                                        {recommendation.description}
                                                    </p>
                                                </motion.div>
                                            )}

                                            {/* Highlights section - only show for perfect matches */}
                                            {!recommendation.isPartialMatch && recommendation.highlights?.length > 0 && (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.6, duration: 0.5 }}
                                                    className="space-y-1"
                                                >
                                                    <h3 className="text-white text-sm font-medium flex items-center">
                                                        <Sparkles size={14} className="mr-1.5 text-yellow-400" />
                                                        Highlights
                                                    </h3>
                                                    <ul className="list-disc space-y-1 pl-4 text-gray-300">
                                                        {recommendation.highlights.map((highlight, idx) => (
                                                            <li key={idx} className="text-xs">{highlight}</li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}

                                            {/* Match reasons section - only show for perfect matches */}
                                            {!recommendation.isPartialMatch && recommendation.match_reasons?.length > 0 && (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.7, duration: 0.5 }}
                                                    className="space-y-1"
                                                >
                                                    <h3 className="text-white text-sm font-medium flex items-center">
                                                        <CircleCheck size={14} className="mr-1.5 text-green-400" />
                                                        Perfect match because
                                                    </h3>
                                                    <ul className="list-disc space-y-1 pl-4 text-gray-300">
                                                        {recommendation.match_reasons.map((reason, idx) => (
                                                            <li key={idx} className="text-xs">{reason}</li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}

                                            {/* Similar match indicator - only for partial matches */}
                                            {recommendation.isPartialMatch && (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.6, duration: 0.5 }}
                                                    className="space-y-1"
                                                >
                                                    <h3 className="text-white text-sm font-medium flex items-center">
                                                        <Star size={14} className="mr-1.5 text-yellow-400" />
                                                        Similar to your search
                                                    </h3>
                                                    <p className="text-gray-300 text-xs">
                                                        This place might not be a perfect match, but could be worth checking out.
                                                    </p>
                                                </motion.div>
                                            )}

                                            {/* Location */}
                                            {recommendation.location && (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.8, duration: 0.5 }}
                                                    className="mt-auto pt-1"
                                                >
                                                    <p className="flex items-center text-gray-300 text-xs">
                                                        <HomeIcon size={14} className="mr-1.5 text-blue-400" />
                                                        <span className="font-medium">Location:</span>{' '}
                                                        <span className="ml-1">{recommendation.location}</span>
                                                    </p>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </CardBody>
                                </Card>
                            </ReactCardFlip>
                        </div>
                    </TinderCard>
                ))}
            </div>
        </div>
    );
};

export default SwipeCard;