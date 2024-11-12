"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchLikedPlaces, fetchUsername } from "./helpers";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Chip } from "@nextui-org/chip";
import { CircleCheck } from "lucide-react";
import { Spinner } from "@nextui-org/react";
import { IconSwipe } from "@tabler/icons-react";

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
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both data in parallel
        const [usernameData, likedPlaces] = await Promise.all([
          fetchUsername(),
          fetchLikedPlaces(),
        ]);

        if (usernameData) {
          setUsername(usernameData);
        } else {
          setUsername("Guest");
        }

        if (likedPlaces) {
          setPlaces(likedPlaces);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
      <div className="flex justify-center items-start py-2 px-5 min-h-[calc(100vh_-_123px)] w-full bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh_-_123px)]">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {places.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Your Curated Places
                </h2>
                {places.map((place, index) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                  >
                    <Card className="mb-6">
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
                  </motion.div>
                ))}
              </>
            ) : (
              <p className="flex flex-col justify-center items-center h-[calc(100vh_-_123px)]">
                <b>Swipe to find places you like!</b>
                <Button
                  color="primary"
                  className="mt-2"
                  variant="flat"
                  startContent={<IconSwipe />}
                  onClick={() => router.push("/discover")}
                >
                  Start Swiping
                </Button>
              </p>
            )}
          </div>
        )}
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
