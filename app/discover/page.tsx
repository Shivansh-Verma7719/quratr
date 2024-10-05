"use client";
import React, { useState, useEffect } from "react";
import CustomNavbar from "@/components/navbar";
import BottomNav from "@/components/bottomnav";
import { Providers } from "../providers";
import TinderCard from "react-tinder-card";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { sortPlacesByPreferences } from "./helpers";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Chip } from "@nextui-org/chip";
import { CircleCheck } from "lucide-react";

interface Card {
  id: string;
  name: string;
  image: string;
  matchScore: number;
  tags: string;
  rating: number;
  location: string;
  group_experience: string;
}

export default function DiscoverPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 748);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      const sortedPlaces = await sortPlacesByPreferences();
      if (sortedPlaces) {
        console.log(sortedPlaces);
        setCards(sortedPlaces as Card[]);
      }
    };

    fetchCards();
  }, []);

  const onSwipe = (direction: string) => {
    if (direction === "right") {
      console.log("Match");
    } else if (direction === "left") {
      console.log("No match");
    }
  };

  return (
    <Providers>
      {!isMobile && <CustomNavbar />}
      <div className="flex justify-center items-start md:items-center p-7 h-[calc(100vh_-_84px)] w-full">
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
                  alt={card.name}
                  className="object-cover w-full h-full md:w-[600px] md:h-[600px]"
                  src={card.image}
                  width={600}
                  height={600}
                />
                <CardBody className="absolute top-0 left-0 w-auto">
                  <Chip variant="faded">
                    {card.tags}
                  </Chip> 
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
                    <Chip variant="faded" className="-ml-1" startContent={<CircleCheck size={18} />} color="success">
                      Group Experience
                    </Chip>
                  )}
                </CardFooter>
              </Card>
            </TinderCard>
          ))}
        </div>
      </div>
      {isMobile && <BottomNav />}
    </Providers>
  );
}
