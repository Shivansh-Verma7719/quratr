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
import { CircleCheck, PartyPopper } from "lucide-react";

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
}

export default function DiscoverPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(10);
  const [zIndex, setZIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      };
      const newCards = [...sortedPlaces, lastCard];
      setCards(newCards as Card[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const onSwipe = (direction: string, cardId: string, index: number) => {
    console.log("onSwipe", direction, " ", cardId, " ", index, " ", zIndex);
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
            cards.slice(0, currentIndex).reverse().map((card, index) => (
              <TinderCard
                key={card.id}
                onSwipe={(direction) => onSwipe(direction, card.id, index)}
                preventSwipe={
                  card.isLastCard
                    ? ["up", "down", "left", "right"]
                    : ["up", "down"]
                }
                className="absolute top-0 left-0 h-full w-full"
              >
                <Card
                  isFooterBlurred
                  radius="lg"
                  className="border-none h-full w-full pointer-events-none"
                  style={{ zIndex: cards.length - zIndex }}
                >
                  {card.isLastCard ? (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                      <h2 className="text-2xl font-bold mb-4">All Caught Up!</h2>
                      <PartyPopper size={100} />
                      <p className="text-center px-4">
                        Sit back and relax while we get you more experiences to
                        swipe on.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Image
                        alt={card.name}
                        className="object-cover w-full h-full md:w-[600px] md:h-[600px]"
                        src={card.image}
                        width={600}
                        height={600}
                      />
                      <CardBody className="absolute top-0 left-0 w-auto">
                        <Chip variant="faded">{card.tags}</Chip>
                      </CardBody>
                      <CardFooter className="flex flex-col items-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                        <p className="text-4xl text-white m-0">{card.name}</p>
                        <Rating
                          style={{ maxWidth: 250 }}
                          value={card.rating}
                          readOnly={true}
                        />
                        <p className="text-2xl text-white m-0">{card.location}</p>
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
              </TinderCard>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </Providers>
  );
}