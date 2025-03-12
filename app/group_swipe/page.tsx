"use client";
import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Spinner, Button } from "@heroui/react";
import Image from "next/image";
import { fetchGroupMatches } from "./clientHelpers";
import { Chip } from "@heroui/chip";
import {
  CircleCheck,
  PartyPopper,
  HomeIcon,
  IndianRupee,
  Heart,
  Star,
  Users,
} from "lucide-react";
import ReactCardFlip from "react-card-flip";
import { motion } from "framer-motion";
import FloatingActionButton from "@/components/FloatingActionButton";
import { UserSelectionDrawer } from "@/components/UserSelection";
import { PlaceDrawer } from "@/components/ui/Overlay";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export interface Card {
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

export interface GroupMatchesResponse {
  places: Card[];
  likedByGroup: string[]; // Array of place IDs that group members liked
}

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
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
  const [selectedCities, setSelectedCities] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedCities");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedLocalities");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [matchAnimation, setMatchAnimation] = useState(false);
  const [groupLikedPlaces, setGroupLikedPlaces] = useState<string[]>([]);
  const [currentPlace, setCurrentPlace] = useState<Card | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showMatchBackground, setShowMatchBackground] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    localStorage.setItem("selectedCities", JSON.stringify(selectedCities));
  }, [selectedCities]);

  useEffect(() => {
    localStorage.setItem(
      "selectedLocalities",
      JSON.stringify(selectedLocalities)
    );
  }, [selectedLocalities]);

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

  useEffect(() => {
    const root = document.documentElement;
    const topbar = document.getElementById("topbar");
    const bottomNav = document.getElementById("bottom-nav");
    const elements = [topbar, bottomNav];

    if (showMatchBackground) {
      // Add transition class to specific elements
      elements.forEach((el) => {
        if (el) el.classList.add("animate-theme");
      });

      // Match animation colors - Green theme
      root.style.setProperty("--color-background", "#22c55e");
      root.style.setProperty("--color-foreground", "#ffffff");
      root.style.setProperty("--color-text", "#ffffff");
      root.style.setProperty("--color-text-secondary", "#22c55e");
    } else {
      // Reset based on theme
      if (theme === "dark") {
        root.style.setProperty("--color-background", "#0a0a0a");
        root.style.setProperty("--color-foreground", "#ededed");
        root.style.setProperty("--color-text", "#ededed");
        root.style.setProperty("--color-text-secondary", "#0a0a0a");
      } else {
        root.style.setProperty("--color-background", "#ffffff");
        root.style.setProperty("--color-foreground", "#0a0a0a");
        root.style.setProperty("--color-text", "#171717");
        root.style.setProperty("--color-text-secondary", "#ffffff");
      }

      // Remove transition class after animation completes
      setTimeout(() => {
        elements.forEach((el) => {
          if (el) el.classList.remove("animate-theme");
        });
      }, 1500);
    }
  }, [showMatchBackground, theme]);

  const handleUsersSelected = async (users: User[]) => {
    setIsLoading(true);
    try {
      const { places, likedByGroup } = await fetchGroupMatches(
        users.map((u) => u.id)
      );

      // Call the localityMap API with the places
      const response = await fetch("/api/localityMap", {
        method: "POST",
        body: JSON.stringify({ places }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { data: newCityLocalityMap, error } = await response.json();

      if (error) {
        console.error("Error fetching locality map:", error);
        return;
      }

      // Add the "All Caught Up" card
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

      // Randomize the places array
      const randomizedPlaces = [...places].sort(() => Math.random() - 0.5);

      // Set the cards with randomized places
      setCards([...randomizedPlaces, lastCard]);
      setOriginalCards([...randomizedPlaces, lastCard]);
      setSelectedUsers(users);
      setGroupLikedPlaces(likedByGroup);
      setCityLocalityMap(newCityLocalityMap);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error in handleUsersSelected:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSwipe = async (direction: string, cardId: string, index: number) => {
    const swipedCard = cards.find((card) => card.id === cardId);

    if (direction === "right") {
      if (groupLikedPlaces.includes(cardId) && swipedCard) {
        setCurrentPlace(swipedCard);
        setShowMatchBackground(true);
        // Show modal after background animation
        setTimeout(() => {
          setMatchAnimation(true);
        }, 1500);
      }
    }

    // Remove the card from the deck
    const newCards = cards.filter((card) => card.id !== cardId);
    setCards(newCards);

    if (index === 1) {
      setCurrentIndex((prevIndex) => prevIndex + 5);
    }
  };

  const handleCardFlip = (cardId: string) => {
    if (!cards.find((card) => card.id === cardId)?.isLastCard) {
      setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
    }
  };

  const generateDiscountCode = (placeName: string, username: string) => {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    return `${placeName.substring(0, 3).toUpperCase()}_${username.substring(0, 3).toUpperCase()}_${randomString}`;
  };

  const handleWhatsAppRedirect = (place: Card, groupMembers: User[]) => {
    const discountCode = generateDiscountCode(
      place.name,
      groupMembers[0].username
    );
    const message = `🎉 Group Discount Unlocked!\n\n🏪 ${place.name}\n📍 ${place.locality}, ${place.city_name}\n\n🎫 Your discount code: ${discountCode}\n\n👥 Group members:\n${groupMembers.map((user) => `- ${user.first_name} ${user.last_name}`).join("\n")}`;

    const phoneNumber = "+919717095684"; // Replace with your business number
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="relative">
        {/* Background transition layer */}
        <div
          className={cn(
            "fixed inset-0 z-0 transition-all duration-[1500ms] ease-in-out",
            showMatchBackground ? "opacity-100" : "opacity-0",
            "bg-gradient-to-br from-green-500 to-emerald-500"
          )}
        />

        {/* Main content */}
        <div className="relative z-10">
          <div className="flex h-[calc(100vh_-_123px)] w-full items-center justify-center overflow-hidden px-5 py-4">
            {selectedUsers.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-md space-y-6 p-8"
                >
                  <Users size={64} className="mx-auto text-primary" />
                  <h2 className="text-2xl font-bold">No Group Selected</h2>
                  <p className="text-default-500">
                    Select friends to find places that everyone in your group would love.
                  </p>
                  <Button
                    color="primary"
                    size="lg"
                    variant="flat"
                    startContent={<Users />}
                    onPress={() => setIsModalOpen(true)}
                    className="mx-auto"
                  >
                    Select Group Members
                  </Button>
                </motion.div>
              </div>
            ) : (
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
                        onSwipe={(direction) =>
                          onSwipe(direction, card.id, index)
                        }
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
                                    {/* Swipe more :) !!!!!!!!!!!!!!!!!!!! */}
                                    Sit back and relax while we get you more
                                    experiences to swipe on.
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Image
                                    alt={card.name}
                                    className="h-full w-full object-cover md:h-[600px] md:w-[600px]"
                                    src={card.image.trim()}
                                    width={600}
                                    height={600}
                                    priority={true}
                                    loading="eager"
                                    quality={70}
                                    placeholder="empty"
                                  />
                                  <CardBody className="absolute left-0 top-0 flex w-full flex-row items-center justify-between p-1 pt-2">
                                    <Chip color="secondary" variant="solid">
                                      {card.tags}
                                    </Chip>

                                    {card.likes > 10 && (
                                      <Chip
                                        variant="solid"
                                        color="danger"
                                        startContent={
                                          <Heart size={18} fill="white" />
                                        }
                                      >
                                        {card.likes} people liked this
                                      </Chip>
                                    )}
                                  </CardBody>
                                  <CardFooter className="absolute bottom-1 z-10 ml-1 flex w-[calc(100%_-_8px)] flex-col items-start overflow-hidden rounded-large border-1 border-white/20 py-2 shadow-small before:rounded-xl before:bg-white/10">
                                    <div className="flex w-full items-center justify-between">
                                      <p className="m-0 text-3xl text-white">
                                        {card.name}
                                      </p>
                                      <p className="flex items-center gap-1 text-2xl text-white">
                                        <Star
                                          size={16}
                                          fill="#fbbf24"
                                          className="text-amber-400"
                                        />
                                        {card.rating}
                                      </p>
                                    </div>
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
                                      key={`container-${card.id}-${flippedCards[card.id]
                                        }`}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="flex h-full w-full flex-col justify-between rounded-lg p-6"
                                    >
                                      <div>
                                        <motion.h2
                                          key={`title-${card.id}-${flippedCards[card.id]
                                            }`}
                                          initial={{ x: -20, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ duration: 0.5 }}
                                          className="mb-2 text-3xl font-bold text-white"
                                        >
                                          {card.name}
                                        </motion.h2>
                                        <motion.div
                                          key={`tags-${card.id}-${flippedCards[card.id]
                                            }`}
                                          initial={{ x: -20, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{
                                            duration: 0.5,
                                            delay: 0.1,
                                          }}
                                          className="flex items-center space-x-2"
                                        >
                                          <Chip
                                            variant="flat"
                                            color="secondary"
                                            className="text-secondary-200 dark:text-secondary-600"
                                          >
                                            {card.tags}
                                          </Chip>

                                          {card.price > 10 && (
                                            <motion.div
                                              key={`price-${card.id}-${flippedCards[card.id]
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
                                          key={`divider-${card.id}-${flippedCards[card.id]
                                            }`}
                                          initial={{ width: 0, opacity: 0 }}
                                          animate={{ width: "100%", opacity: 1 }}
                                          transition={{
                                            delay: 0.4,
                                            duration: 0.5,
                                          }}
                                          className="my-4 border-t border-gray-300"
                                        />

                                        <motion.p
                                          key={`description-${card.id}-${flippedCards[card.id]
                                            }`}
                                          initial={{ y: 20, opacity: 0 }}
                                          animate={{ y: 0, opacity: 1 }}
                                          transition={{
                                            delay: 0.5,
                                            duration: 0.5,
                                          }}
                                          className="mb-4 text-sm text-white"
                                        >
                                          {card.description}
                                        </motion.p>

                                        {/* Description divider */}
                                        {card.description && (
                                          <motion.hr
                                            key={`divider2-${card.id}-${flippedCards[card.id]
                                              }`}
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{
                                              width: "100%",
                                              opacity: 1,
                                            }}
                                            transition={{
                                              delay: 0.4,
                                              duration: 0.5,
                                            }}
                                            className="my-4 border-t border-gray-300"
                                          />
                                        )}

                                        <motion.div
                                          key={`address-heading-${card.id}-${flippedCards[card.id]
                                            }`}
                                          initial={{ y: 20, opacity: 0 }}
                                          animate={{ y: 0, opacity: 1 }}
                                          transition={{
                                            delay: 0.6,
                                            duration: 0.5,
                                          }}
                                          className="space-y-2"
                                        >
                                          <p className="flex items-center text-wrap text-sm text-white">
                                            <HomeIcon
                                              size={18}
                                              className="mr-1"
                                            />
                                            <strong className="mr-1">
                                              Address:{" "}
                                            </strong>
                                            <br />
                                          </p>
                                        </motion.div>
                                        <motion.p
                                          key={`address-${card.id}-${flippedCards[card.id]
                                            }`}
                                          initial={{ y: 20, opacity: 0 }}
                                          animate={{ y: 0, opacity: 1 }}
                                          transition={{
                                            delay: 0.7,
                                            duration: 0.5,
                                          }}
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
            )}

            <FloatingActionButton
              cityLocalityMap={cityLocalityMap}
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
              selectedLocalities={selectedLocalities}
              setSelectedLocalities={setSelectedLocalities}
              numberOfFilters={
                selectedCities.length + selectedLocalities.length
              }
            />
          </div>
        </div>

        <div className="fixed bottom-14 left-3 z-50">
          <Button
            color="primary"
            variant="shadow"
            className="mr-4 h-12 w-12 rounded-full"
            onPress={() => setIsModalOpen(true)}
            startContent={<Users className="h-6 w-6" />}
            isIconOnly
          />
        </div>

        <PlaceDrawer
          isVisible={matchAnimation}
          onClose={() => {
            setMatchAnimation(false);
            setShowMatchBackground(false);
          }}
          place={currentPlace || undefined}
          groupMembers={selectedUsers}
          onRedeem={() => {
            if (currentPlace && selectedUsers.length > 0) {
              handleWhatsAppRedirect(currentPlace, selectedUsers);
            }
            setMatchAnimation(false);
            setShowMatchBackground(false);
          }}
        />

        <UserSelectionDrawer
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onUsersSelected={handleUsersSelected}
        />
      </div>
    </>
  );
}
