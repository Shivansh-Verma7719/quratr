"use client";
import React from "react";
import CustomNavbar from "@/components/navbar";
import BottomNav from "@/components/bottomnav";
import { Providers } from "../providers";
import { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { Card, CardFooter } from "@nextui-org/card";
import Image from "next/image";
// import { getUser, getUserPreferences, getAllPlaces, sortPlacesByPreferences } from "./helpers";

interface Card {
  id: string;
  title: string;
  description: string;
  image: string;
  matchScore: number;
}

export default function DiscoverPage() {
  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 748);
      };

      checkIsMobile();
      window.addEventListener("resize", checkIsMobile);

      return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    return isMobile;
  }

  // const renderCards = async () => {
  //   const user = await getUser();
  //   const preferences = await getUserPreferences(user?.user.id as string);
  //   const places = await getAllPlaces();
  //   const sortedPlaces = places ? await sortPlacesByPreferences(places, preferences) : [];
  //   const cards = sortedPlaces.map((place) => ({
  //     id: place.id,
  //     title: place.name,
  //     description: place.description,
  //     image: place.image,
  //     matchScore: place.matchScore,
  //   }));
  //   return cards;
  // }

  const onSwipe = (direction: string) => {
    if (direction === "right") {
      console.log("Match");
    } else if (direction === "left") {
      console.log("No match");
    }
  };

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      // const fetchedCards = await renderCards();
      const cards = [
        {
          id: "1",
          title: "Card 1",
          description: "Description 1",
          image: "https://via.placeholder.com/150",
          matchScore: 1,
        },
      ];
      setCards(cards);
    };

    fetchCards();
  }, []);

  return (
    <Providers>
      {useIsMobile() ? <div /> : <CustomNavbar />}
      <div className="flex justify-center items-center p-5 h-[calc(100vh_-_64px)] w-full">
        <div className="relative h-full w-full md:w-[600px] md:h-[600px]">
          {cards.map((card, index) => (
            <TinderCard
              key={card.id}
              onSwipe={onSwipe}
              preventSwipe={["up", "down"]}
              className="absolute top-0 left-0 h-full w-full"
            >
              <Card
                isFooterBlurred
                radius="lg"
                className="border-none h-full w-full pointer-events-none"
                style={{ zIndex: cards.length - index }}
              >
                <Image
                  alt={card.title}
                  className="object-cover w-full h-full md:w-[600px] md:h-[600px]"
                  src={card.image}
                />
                <CardFooter className="flex flex-col items-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <p className="text-4xl text-white/80 mb-1">{card.title}</p>
                  <p className="text-2xl text-white/80">{card.description}</p>
                </CardFooter>
              </Card>
            </TinderCard>
          ))}
        </div>
      </div>
      {useIsMobile() ? <BottomNav /> : <div />}
    </Providers>
  );
}
