"use client";
import React, { useState, useEffect, useCallback } from "react";
import CustomNavbar from "@/components/navbar";
import BottomNav from "@/components/bottomnav";
import { Providers } from "@/app/providers";
import TinderCard from "react-tinder-card";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { sortPlacesByPreferences, likePlace, dislikePlace } from "./helpers";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Chip } from "@nextui-org/chip";
import { CircleCheck, PartyPopper, MapPin, HomeIcon } from "lucide-react";
import ReactCardFlip from "react-card-flip";
import { motion } from "framer-motion";

interface Card {
  id: string;
  name: string;
  image: string;
  matchScore: number;
  tags: string;
  rating: number;
  location: string;
  group_experience: string;
  isLastCard?: boolean;
  description: string;
  address: string;
}

export default function DiscoverPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(10);
  const [zIndex, setZIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 748);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const fetchCards = useCallback(async () => {
    setIsLoading(true);
    const sortedPlaces = await sortPlacesByPreferences();
    if (sortedPlaces) {
      const lastCard: Card = {
        id: "last-card",
        name: "All Caught Up!",
        image: "",
        matchScore: 0,
        tags: "",
        rating: 0,
        location: "",
        group_experience: "",
        isLastCard: true,
        description: "",
        address: "",
      };
      const newCards = [...sortedPlaces, lastCard];
      setCards(newCards as Card[]);
      // Populate the flippedCards state with all card IDs
      const initialFlippedState = newCards.reduce((acc, card) => {
        acc[card.id] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      setFlippedCards(initialFlippedState);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const onSwipe = (direction: string, cardId: string, index: number) => {
    // console.log("onSwipe", direction, " ", cardId, " ", index, " ", zIndex);
    if (direction === "right") {
      likePlace(cardId);
    } else if (direction === "left") {
      dislikePlace(cardId);
    }
    setZIndex((prevZIndex) => prevZIndex + 3);

    if (index === 1) {
      setCurrentIndex((prevIndex) => prevIndex + 10);
    }
  };

  const handleCardFlip = (cardId: string) => {
    console.log("handleCardFlip", cardId);
    if (!cards.find((card) => card.id === cardId)?.isLastCard) {
      setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
    }
  };

  return (
    <Providers>
      {!isMobile && <CustomNavbar />}
      <div className="flex justify-center items-start md:items-center py-9 px-5 h-[calc(100vh_-_84px)] w-full overflow-hidden">
        <div className="relative h-[95%] w-[95%] md:w-[600px] md:h-[600px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading...</p>
            </div>
          ) : (
            cards
              .slice(0, currentIndex)
              .reverse()
              .map((card, index) => (
                <TinderCard
                  key={card.id}
                  onSwipe={(direction) => onSwipe(direction, card.id, index)}
                  preventSwipe={
                    card.isLastCard
                      ? ["up", "down", "left", "right"]
                      : ["up", "down"]
                  }
                  swipeThreshold={100}
                  swipeRequirementType="position"
                  className={`absolute top-0 left-0 h-full w-full z-[${
                    cards.length - zIndex
                  }]`}
                >
                  <div
                    onClick={() => handleCardFlip(card.id)}
                    onTouchStart={(e) => {
                      const touchStartTime = new Date().getTime();
                      e.currentTarget.dataset.touchStartTime =
                        touchStartTime.toString();
                    }}
                    onTouchEnd={(e) => {
                      const touchEndTime = new Date().getTime();
                      const touchStartTime = parseInt(
                        e.currentTarget.dataset.touchStartTime || "0",
                        10
                      );
                      if (touchEndTime - touchStartTime < 200) {
                        // Adjust this threshold as needed
                        handleCardFlip(card.id);
                      }
                    }}
                    className="h-full w-full"
                  >
                    <ReactCardFlip
                      isFlipped={flippedCards[card.id]}
                      containerClassName="h-full w-full"
                    >
                      {/* Front of the card */}
                      <Card
                        isFooterBlurred
                        radius="lg"
                        className="border-none h-full w-full"
                      >
                        {card.isLastCard ? (
                          <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                            <h2 className="text-2xl font-bold mb-4">
                              All Caught Up!
                            </h2>
                            <PartyPopper size={100} />
                            <p className="text-center px-4">
                              Sit back and relax while we get you more
                              experiences to swipe on.
                            </p>
                          </div>
                        ) : (
                          <>
                            <Image
                              alt={card.name}
                              className="object-cover w-full h-full md:w-[600px] md:h-[600px] pointer-events-none"
                              src={card.image}
                              width={600}
                              height={600}
                            />
                            <CardBody className="absolute top-0 left-0 w-auto">
                              <Chip variant="faded">{card.tags}</Chip>
                            </CardBody>
                            <CardFooter className="flex flex-col items-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                              <p className="text-3xl text-white m-0">
                                {card.name}
                              </p>
                              <Rating
                                style={{ maxWidth: 200 }}
                                value={card.rating}
                                readOnly={true}
                              />
                              <p className="text-2xl text-white m-0">
                                {card.location}
                              </p>
                              {card.group_experience === "1" && (
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

                      {/* Back of the card */}
                      <Card
                        isBlurred
                        radius="lg"
                        className="border-none h-full w-full"
                      >
                        {card.isLastCard ? (
                          <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                            <h2 className="text-2xl font-bold mb-4">
                              All Caught Up!
                            </h2>
                            <PartyPopper size={100} />
                          </div>
                        ) : (
                          <>
                            <div
                              className="h-full w-full"
                              style={{
                                backgroundImage: `url(${card.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                filter: "blur(12px)",
                              }}
                            ></div>
                            <CardBody className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="h-full w-full rounded-lg p-6 flex flex-col justify-between"
                              >
                                <div>
                                  <motion.h2
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    className="text-3xl font-bold mb-4 text-white"
                                  >
                                    {card.name}
                                  </motion.h2>
                                  <Chip
                                    variant="faded"
                                    className="text-white bg-opacity-70"
                                  >
                                    {card.tags}
                                  </Chip>
                                  <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.6 }}
                                  >
                                    {card.group_experience === "1" && (
                                      <Chip
                                        variant="shadow"
                                        className="mt-4 text-white bg-opacity-70"
                                        startContent={<CircleCheck size={18} />}
                                        color="success"
                                      >
                                        Group Experience
                                      </Chip>
                                    )}
                                  </motion.div>

                                  <Rating
                                    style={{ maxWidth: 200 }}
                                    value={card.rating}
                                    readOnly={true}
                                  />

                                  <motion.hr
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    className="border-t border-gray-300 my-4"
                                  />
                                  {/* <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="text-sm mb-4 text-white"
                                >
                                  {card.description}
                                </motion.p> */}
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-2"
                                  >
                                    <p className="text-md text-white flex items-center">
                                      <HomeIcon size={18} className="mr-1" />
                                      <strong className="mr-1">Address: </strong>
                                      {card.address}
                                    </p>
                                    {/* <p className="text-md text-white">
                                      <strong>Rating:</strong> {card.rating}
                                    </p> */}
                                    <p className="text-md text-white flex items-center">
                                      <MapPin size={18} className="mr-1" />
                                      <strong className="mr-1">
                                        Location:
                                      </strong>
                                      {card.location}
                                    </p>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </CardBody>
                          </>
                        )}
                      </Card>
                    </ReactCardFlip>
                  </div>
                </TinderCard>
              ))
          )}
        </div>
      </div>
      <BottomNav />
    </Providers>
  );
}
