"use client";
import React, { useState, useEffect } from "react";
import { fetchLikedPlaces, fetchUsername } from "./helpers";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Chip } from "@nextui-org/chip";
import { CircleCheck } from "lucide-react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface Place {
  id: string;
  name: string;
  image: string;
  tags: string;
  rating: number;
  location: string;
  group_experience: string;
  address: string;
}

export default function CuratedPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  // const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetUsername = async () => {
      const username = await fetchUsername();
      if (username) {
        setUsername(username);
      } else {
        setUsername("Guest"); // Fallback if username is null
      }
    };

    fetchAndSetUsername();
  }, []);
  useEffect(() => {
    // const checkIsMobile = () => setIsMobile(window.innerWidth < 748);
    // checkIsMobile();
    // window.addEventListener("resize", checkIsMobile);

    const loadLikedPlaces = async () => {
      const likedPlaces = await fetchLikedPlaces();
      if (likedPlaces) {
        setPlaces(likedPlaces);
      }
    };

    loadLikedPlaces();

    // return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const generateDiscountCode = (placeName: string) => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${placeName}_${username}_${randomString}`;
  };

  const handleRedeemClick = (place: Place) => {
    setCurrentPlace(place);
    setIsModalOpen(true);
  };

  const handleWhatsAppRedirect = (placeName: string) => {
    const discountCode = generateDiscountCode(placeName);
    const message = `Here is your discount code: ${discountCode}`;
    const phoneNumber = "+919717095684";
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="flex justify-center items-start py-2 px-5 min-h-screen w-full bg-background">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Your Curated Places
          </h2>
          {places.map((place) => (
            <Card key={place.id} className="mb-6">
              <Image
                alt={place.name}
                className="object-cover w-full h-64"
                src={place.image}
                width={600}
                height={400}
              />
              <CardBody>
                <h3 className="text-xl font-bold">{place.name}</h3>
                <p className="text-sm text-gray-500">{place.address}</p>
                <Chip variant="faded">{place.tags}</Chip>
                <Rating
                  style={{ maxWidth: 200 }}
                  value={place.rating}
                  readOnly={true}
                />
                <p className="text-sm">{place.location}</p>
                {place.group_experience === "1" && (
                  <Chip
                    variant="faded"
                    startContent={<CircleCheck size={18} />}
                    color="success"
                  >
                    Group Experience
                  </Chip>
                )}
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  variant="flat"
                  className="ml-auto"
                  onClick={() => handleRedeemClick(place)}
                >
                  Redeem Discount
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {currentPlace && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="bg-background"
        >
          <ModalContent>
            <ModalHeader>
              <h2 className="text-text">Redeem Discount</h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-text">{currentPlace.name}</p>
              <div className="bg-background p-2 rounded mt-2">
                <p className="text-text">
                  Click the button below to send your discount code via
                  WhatsApp:
                </p>
                <Button
                  color="secondary"
                  onClick={() => handleWhatsAppRedirect(currentPlace.name)}
                  className="mt-2 w-full"
                  variant="flat"
                >
                  Send via WhatsApp
                </Button>
              </div>
              <p className="text-text mt-4">WhatsApp it to +91 9717095684</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => setIsModalOpen(false)}
                variant="flat"
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
