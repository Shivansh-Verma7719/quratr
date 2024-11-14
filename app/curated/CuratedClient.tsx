"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchMoreLikedPlaces } from "./helpers";
import { Place } from "./server-helpers";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Rating } from "@smastrom/react-rating";
import { Chip } from "@nextui-org/chip";
import { CircleCheck } from "lucide-react";
import { Spinner } from "@nextui-org/react";
import "@smastrom/react-rating/style.css";
import { IconSwipe } from "@tabler/icons-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface CuratedClientProps {
  initialPlaces: Place[];
  username: string;
}

export default function CuratedClient({
  initialPlaces,
  username,
}: CuratedClientProps) {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (!isLoading && hasMore) {
          fetchMorePlaces();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  const fetchMorePlaces = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const newPlaces = await fetchMoreLikedPlaces(places.length, 10);
    if (newPlaces.length > 0) {
      setPlaces((prevPlaces) => [...prevPlaces, ...newPlaces]);
      setHasMore(newPlaces.length === 10);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  // Keep existing helper functions
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
 
//   console.log(places)
  return (
    <>
      <div className="flex justify-center items-start py-2 px-5 min-h-[calc(100vh_-_123px)] w-full bg-background">
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
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="mb-6">
                    {/* <p className="text-sm text-gray-500">{index}</p> */}
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
              {isLoading && (
                <div className="flex justify-center py-4">
                  <Spinner size="lg" />
                </div>
              )}
              {!hasMore && !isLoading && (
                <p className="text-center py-4 text-default-500">
                  <b>You&apos;ve seen all your liked places!</b>
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-[calc(100vh_-_123px)]">
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
            </div>
          )}
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
