import React, { useState, useEffect, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
import ReactCardFlip from "react-card-flip";
import { motion } from "motion/react";
import Image from "next/image";
import {
    Skeleton,
    Chip,
    Card,
    CardBody,
    CardFooter
} from "@heroui/react";
import {
    CircleCheck,
    PartyPopper,
    HomeIcon,
    IndianRupee,
    Heart,
    Star,
} from "lucide-react";
import { Place } from "@/types/place";

interface SwipeCardProps {
    places: Place[];
    onLike?: (place: Place) => void;
    onDislike?: (place: Place) => void;
    containerClassName?: string;
    isLoading?: boolean;
}

const MAX_VISIBLE_CARDS = 5; // Only render up to 5 cards at a time

const SwipeCard: React.FC<SwipeCardProps> = ({
    places,
    onLike = () => { },
    onDislike = () => { },
    isLoading: externalLoading = false,
}) => {
    // Add a last card to show "All Caught Up!" message
    const allPlaces = useMemo(() => {
        const lastCard: Place = {
            id: 9999,
            name: "All Caught Up!",
            description: "You've seen all our places for now.",
            isLastCard: true
        };
        return [...places, lastCard];
    }, [places]);

    const [cards, setCards] = useState<Place[]>([]);
    const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
    const [swipeInProgress, setSwipeInProgress] = useState(false);
    const [removedCards, setRemovedCards] = useState<number[]>([]);
    const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // Initialize cards when places change
    useEffect(() => {
        setCards(allPlaces);
        setRemovedCards([]);

        // Reset flipped state for all cards
        const initialFlippedState = allPlaces.reduce(
            (acc, place) => {
                acc[place.id] = false;
                return acc;
            },
            {} as { [key: number]: boolean }
        );
        setFlippedCards(initialFlippedState);
    }, [allPlaces]);

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

    const onSwipe = (direction: string, place: Place) => {
        // Don't process swipes for the last card
        if (place?.isLastCard) {
            return;
        }

        setSwipeInProgress(true);

        if (direction === "right") {
            onLike(place);
        } else if (direction === "left") {
            onDislike(place);
        }

        // Mark the card as removed after a delay to allow for the swipe animation
        setTimeout(() => {
            setRemovedCards(prev => [...prev, place.id]);
            setSwipeInProgress(false);
        }, 1000);
    };

    // Skeleton loader for the cards
    const CardSkeleton = () => (
        <div className="relative h-[530px] w-full my-6">
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

    if (externalLoading) {
        return <CardSkeleton />;
    }

    if (places.length === 0) {
        return <></>
    }

    // Filter out removed cards and limit the number rendered
    const filteredCards = cards
        .filter(card => !removedCards.includes(card.id));

    // Take only the first MAX_VISIBLE_CARDS cards or special "last card"
    const visibleCards = filteredCards
        .slice(0, MAX_VISIBLE_CARDS)
        .concat(
            filteredCards.length > MAX_VISIBLE_CARDS &&
                filteredCards.find(c => c.isLastCard) ?
                [filteredCards.find(c => c.isLastCard)!] : []
        );

    return (
        <div className="flex h-[calc(100vh_-_143px)] w-full items-center justify-center overflow-hidden py-4">
            <div className="relative h-[95%] w-[95%] md:h-[600px] md:w-[600px]">
                {visibleCards.slice().reverse().map((place, index) => (
                    <TinderCard
                        key={place.id}
                        onSwipe={(direction) => onSwipe(direction, place)}
                        preventSwipe={place.isLastCard ? ["up", "down", "left", "right"] : ["up", "down"]}
                        swipeRequirementType="position"
                        className="absolute left-0 top-0 h-full w-full"
                        swipeThreshold={100}
                    >
                        <div
                            ref={(el) => {
                                cardRefs.current[place.id] = el;
                            }}
                            onClick={(e) => handleCardFlip(place.id, e)}
                            onTouchStart={(e) => handleTouchStart(place.id, e)}
                            onTouchEnd={(e) => handleTouchEnd(place.id, e)}
                            className="h-full w-full cursor-pointer"
                            style={{
                                zIndex: visibleCards.length - index, // Higher z-index for top cards
                                position: "relative", // Ensure z-index works properly
                                transform: `translateY(${index * 4}px)`, // Add a slight offset for cards to create a stack effect
                                transitionProperty: "transform, opacity",
                                transitionDuration: "0.5s", // Faster transitions for smoother feel
                                transitionTimingFunction: "ease-out"
                            }}
                        >
                            <ReactCardFlip
                                isFlipped={flippedCards[place.id] || false}
                                containerClassName="h-full w-full"
                                flipSpeedBackToFront={0.3}
                                flipSpeedFrontToBack={0.3}
                            >
                                {/* Front of card */}
                                <Card
                                    isFooterBlurred
                                    radius="lg"
                                    className="h-full w-full border-none shadow-lg"
                                >
                                    {place.isLastCard ? (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6">
                                            <h2 className="mb-4 text-2xl font-bold">All Caught Up!</h2>
                                            <PartyPopper size={100} />
                                            <p className="px-4 text-center">
                                                Sit back and relax while we get you more experiences to swipe on.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <Image
                                                alt={place.name}
                                                className="h-full w-full object-cover md:h-[600px] md:w-[600px]"
                                                src={place.image || ""}
                                                width={600}
                                                height={600}
                                                priority={index < 3} // Only prioritize first 3 images
                                                loading={index < 3 ? "eager" : "lazy"}
                                                placeholder="empty"
                                            />
                                            <CardBody className="absolute left-0 top-0 flex w-full flex-row items-center justify-between p-1 pt-2">
                                                {place.tags && (
                                                    <Chip color="secondary" variant="solid">
                                                        {place.tags}
                                                    </Chip>
                                                )}

                                                {place.likes && place.likes > 10 && (
                                                    <Chip
                                                        variant="solid"
                                                        color="danger"
                                                        startContent={<Heart size={18} fill="white" />}
                                                    >
                                                        {place.likes} people liked this
                                                    </Chip>
                                                )}
                                            </CardBody>
                                            <CardFooter className="absolute bottom-1 z-10 ml-1 flex w-[calc(100%_-_8px)] flex-col items-start overflow-hidden rounded-large border-1 border-white/20 py-2 shadow-small before:rounded-xl before:bg-white/10">
                                                <div className="flex w-full items-center justify-between">
                                                    <p className="m-0 text-3xl text-white">
                                                        {place.name}
                                                    </p>
                                                    {place.rating && (
                                                        <p className="flex items-center gap-1 text-2xl text-white">
                                                            <Star
                                                                size={16}
                                                                fill="#fbbf24"
                                                                className="text-amber-400"
                                                            />
                                                            {place.rating}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="m-0 text-2xl text-white">
                                                    {place.address}, {place.city}
                                                </p>
                                                {place.group_experience === "1" && (
                                                    <Chip
                                                        variant="faded"
                                                        className="-ml-1"
                                                        startContent={<CircleCheck size={18} />}
                                                        color="success"
                                                    >
                                                        Group Experience
                                                    </Chip>
                                                )}
                                            </CardFooter>
                                        </>
                                    )}
                                </Card>

                                {/* Back of card */}
                                <Card
                                    isBlurred
                                    radius="lg"
                                    className="h-full w-full border-none shadow-lg"
                                >
                                    {place.isLastCard ? (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6">
                                            <h2 className="mb-4 text-2xl font-bold">All Caught Up!</h2>
                                            <PartyPopper size={100} />
                                        </div>
                                    ) : (
                                        <CardBody className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-60 overflow-auto">
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex h-full w-full flex-col justify-between rounded-lg p-6"
                                            >
                                                <div>
                                                    <motion.h2
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="mb-2 text-3xl font-bold text-white"
                                                    >
                                                        {place.name}
                                                    </motion.h2>
                                                    <motion.div
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ duration: 0.5, delay: 0.2 }}
                                                        className="flex flex-wrap gap-1.5"
                                                    >
                                                        {place.cuisine?.map((cuisine, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                color="secondary"
                                                                variant="flat"
                                                                size="sm"
                                                            >
                                                                {cuisine}
                                                            </Chip>
                                                        ))}

                                                        {place.price && (
                                                            <Chip
                                                                color="success"
                                                                variant="flat"
                                                                size="sm"
                                                            >
                                                                {place.price}
                                                            </Chip>
                                                        )}
                                                    </motion.div>

                                                    <motion.hr
                                                        initial={{ width: 0, opacity: 0 }}
                                                        animate={{ width: "100%", opacity: 1 }}
                                                        transition={{ delay: 0.4, duration: 0.5 }}
                                                        className="my-4 border-t border-gray-300"
                                                    />

                                                    {place.description && (
                                                        <motion.p
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.5, duration: 0.5 }}
                                                            className="mb-4 text-sm text-white"
                                                        >
                                                            {place.description}
                                                        </motion.p>
                                                    )}

                                                    {/* Description divider */}
                                                    {place.description && (
                                                        <motion.hr
                                                            initial={{ width: 0, opacity: 0 }}
                                                            animate={{ width: "100%", opacity: 1 }}
                                                            transition={{ delay: 0.4, duration: 0.5 }}
                                                            className="my-4 border-t border-gray-300"
                                                        />
                                                    )}

                                                    {place.address && (
                                                        <>
                                                            <motion.div
                                                                initial={{ y: 20, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.6, duration: 0.5 }}
                                                                className="space-y-2"
                                                            >
                                                                <p className="flex items-center text-wrap text-sm text-white">
                                                                    <HomeIcon size={18} className="mr-1" />
                                                                    <strong className="mr-1">Address: </strong>
                                                                    <br />
                                                                </p>
                                                            </motion.div>
                                                            <motion.p
                                                                initial={{ y: 20, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.7, duration: 0.5 }}
                                                                className="text-sm text-white"
                                                            >
                                                                {place.address}
                                                            </motion.p>
                                                        </>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </CardBody>
                                    )}
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
export type { Place };
