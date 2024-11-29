"use client";
import React, { useState, useEffect, useCallback } from "react";
import TinderCard from "react-tinder-card";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import { likePlace, dislikePlace } from "./clientHelpers";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Chip } from "@nextui-org/chip";
import {
  CircleCheck,
  PartyPopper,
  HomeIcon,
  IndianRupee,
  Heart,
} from "lucide-react";
import ReactCardFlip from "react-card-flip";
import { motion } from "framer-motion";
import FloatingActionButton from "@/components/FloatingActionButton";

interface Card {
  id: string;
  name: string;
  image: string;
  matchScore: number;
  tags: string;
  rating: number;
  locality: string;
  group_experience: string;
  isLastCard?: boolean;
  description: string;
  address: string;
  city_name: string;
  price: number;
  reservation: string;
  likes: number;
}

interface CityLocalityMap {
  [key: string]: string[];
}

export default function DiscoverPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [cityLocalityMap, setCityLocalityMap] = useState<CityLocalityMap>({});
  const [selectedCities, setSelectedCities] = useState<string[]>(["Goa"]); // Add Delhi NCR to the list
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);

  const fetchCards = useCallback(async () => {
    setIsLoading(true);
    await fetch("/api/places")
      .then(async (result) => await result.json())
      .then((result) => {
        if (result) {
          const { data, cityLocalityMap } = result;
          const lastCard: Card = {
            id: "1228",
            name: "All Caught Up!",
            image: "",
            matchScore: 0,
            tags: "",
            rating: 0,
            likes: 0,
            locality: "",
            group_experience: "",
            isLastCard: true,
            description: "",
            address: "",
            city_name: "",
            price: 0,
            reservation: "",
          };
          const newCards = [...data, lastCard];

          setCards(newCards as Card[]);
          setOriginalCards(newCards as Card[]);
          setCityLocalityMap(cityLocalityMap);

          // Populate the flippedCards state with all card IDs
          const initialFlippedState = newCards.reduce(
            (acc, card) => {
              acc[card.id] = false;
              return acc;
            },
            {} as { [key: string]: boolean }
          );
          setFlippedCards(initialFlippedState);
        }
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (selectedCities.length === 0 && selectedLocalities.length === 0) {
      return;
    }

    // If no filters are selected, show all cards
    const filtered = originalCards.filter((card) => {
      // Skip the last card from filtering
      if (card.isLastCard) return true;

      // Check if both filters are active
      if (selectedCities.length > 0 && selectedLocalities.length > 0) {
        // Must match both city AND locality
        return (
          selectedCities.includes(card.city_name) &&
          selectedLocalities.includes(card.locality)
        );
      }

      // If only city filter is active
      if (selectedCities.length > 0) {
        return selectedCities.includes(card.city_name);
      }

      // If only locality filter is active
      if (selectedLocalities.length > 0) {
        return selectedLocalities.includes(card.locality);
      }

      return true;
    });

    setCards(filtered);
  }, [selectedCities, selectedLocalities, originalCards]);

  const onSwipe = async (direction: string, cardId: string, index: number) => {
    if (direction === "right") {
      await likePlace(cardId);
      const newOriginalCards = originalCards.filter(
        (card) => card.id !== cardId
      );
      setOriginalCards(newOriginalCards);
    } else if (direction === "left") {
      await dislikePlace(cardId);
      const newOriginalCards = originalCards.filter(
        (card) => card.id !== cardId
      );
      setOriginalCards(newOriginalCards);
    }

    if (index === 1) {
      setCurrentIndex((prevIndex) => prevIndex + 5);
    }
  };

  const handleCardFlip = (cardId: string) => {
    if (!cards.find((card) => card.id === cardId)?.isLastCard) {
      setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh_-_123px)] w-full items-center justify-center overflow-hidden px-5 py-4">
        <div className="relative h-[95%] w-[95%] md:h-[600px] md:w-[600px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner size="lg" />
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
                  className={`absolute left-0 top-0 h-full w-full`}
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
                      if (touchEndTime - touchStartTime < 250) {
                        handleCardFlip(card.id);
                      }
                    }}
                    className="h-full w-full"
                  >
                    <ReactCardFlip
                      isFlipped={flippedCards[card.id]}
                      containerClassName="h-full w-full"
                      flipSpeedBackToFront={0.3}
                      flipSpeedFrontToBack={0.3}
                    >
                      {/* Front of the card */}
                      <Card
                        isFooterBlurred
                        radius="lg"
                        className="h-full w-full border-none"
                      >
                        {card.isLastCard ? (
                          <div className="flex h-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <h2 className="mb-4 text-2xl font-bold">
                              All Caught Up!
                            </h2>
                            <PartyPopper size={100} />
                            <p className="px-4 text-center">
                              Sit back and relax while we get you more
                              experiences to swipe on.
                            </p>
                          </div>
                        ) : (
                          <>
                            <Image
                              alt={card.name}
                              className="h-full w-full object-cover md:h-[600px] md:w-[600px]"
                              src={card.image}
                              width={600}
                              height={600}
                              priority={true}
                              quality={70}
                              placeholder="empty"
                            />
                            <CardBody className="absolute left-0 top-0 flex w-full flex-row items-center justify-between p-1 pt-2">
                              <Chip color="secondary" variant="solid">
                                {card.tags}
                              </Chip>

                              {card.likes > 1 && (
                                <Chip
                                  variant="solid"
                                  color="danger"
                                  startContent={<Heart size={18} fill="white" />}
                                >
                                  {card.likes} people liked this
                                </Chip>
                              )}
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 flex w-[calc(100%_-_8px)] flex-col items-start overflow-hidden rounded-large border-1 border-white/20 py-2 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="m-0 text-3xl text-white">
                                {card.name}
                              </p>
                              <Rating
                                style={{ maxWidth: 200 }}
                                value={card.rating}
                                readOnly={true}
                              />
                              <p className="m-0 text-2xl text-white">
                                {card.locality}
                              </p>
                              {/* <p className="text-2xl text-white m-0">
                                {card.matchScore}
                              </p> */}
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
                        className="h-full w-full border-none"
                      >
                        {card.isLastCard ? (
                          <div className="flex h-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <h2 className="mb-4 text-2xl font-bold">
                              All Caught Up!
                            </h2>
                            <PartyPopper size={100} />
                          </div>
                        ) : (
                          <>
                            <CardBody className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-50">
                              <motion.div
                                key={`container-${card.id}-${
                                  flippedCards[card.id]
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex h-full w-full flex-col justify-between rounded-lg p-6"
                              >
                                <div>
                                  <motion.h2
                                    key={`title-${card.id}-${
                                      flippedCards[card.id]
                                    }`}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-2 text-3xl font-bold text-white"
                                  >
                                    {card.name}
                                  </motion.h2>
                                  <motion.div
                                    key={`tags-${card.id}-${
                                      flippedCards[card.id]
                                    }`}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="flex items-center space-x-2"
                                  >
                                    <Chip
                                      variant="flat"
                                      color="secondary"
                                      className="text-secondary-200 dark:text-secondary-600"
                                    >
                                      {card.tags}
                                    </Chip>

                                    {card.price > 0 && (
                                      <motion.div
                                        key={`price-${card.id}-${
                                          flippedCards[card.id]
                                        }`}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                          duration: 0.5,
                                          delay: 0.3,
                                        }}
                                      >
                                        <Chip
                                          variant="flat"
                                          color="success"
                                          className="text-success-300"
                                          startContent={
                                            <IndianRupee size={18} />
                                          }
                                        >
                                          {card.price} for 2
                                        </Chip>
                                      </motion.div>
                                    )}
                                  </motion.div>

                                  <motion.hr
                                    key={`divider-${card.id}-${
                                      flippedCards[card.id]
                                    }`}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "100%", opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="my-4 border-t border-gray-300"
                                  />

                                  <motion.p
                                    key={`description-${card.id}-${
                                      flippedCards[card.id]
                                    }`}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="mb-4 text-sm text-white"
                                  >
                                    {card.description}
                                  </motion.p>

                                  {/* Description divider */}
                                  {card.description && (
                                    <motion.hr
                                      key={`divider2-${card.id}-${
                                        flippedCards[card.id]
                                      }`}
                                      initial={{ width: 0, opacity: 0 }}
                                      animate={{ width: "100%", opacity: 1 }}
                                      transition={{ delay: 0.4, duration: 0.5 }}
                                      className="my-4 border-t border-gray-300"
                                    />
                                  )}

                                  <motion.div
                                    key={`address-heading-${card.id}-${
                                      flippedCards[card.id]
                                    }`}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="space-y-2"
                                  >
                                    <p className="flex items-center text-wrap text-sm text-white">
                                      <HomeIcon size={18} className="mr-1" />
                                      <strong className="mr-1">
                                        Address:{" "}
                                      </strong>
                                      <br />
                                    </p>
                                  </motion.div>
                                  <motion.p
                                    key={`address-${card.id}-${
                                      flippedCards[card.id]
                                    }`}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="text-sm text-white"
                                  >
                                    {card.address}
                                  </motion.p>
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
        <FloatingActionButton
          cityLocalityMap={cityLocalityMap}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
          selectedLocalities={selectedLocalities}
          setSelectedLocalities={setSelectedLocalities}
        />
      </div>
    </>
  );
}
