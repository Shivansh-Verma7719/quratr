"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Spinner } from "@heroui/react";
import SwipeCard from "@/components/swipe/SwipeCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import {
  getUserVector,
  updateUserVector,
  fetchPlacesChunk,
  getPlaceEmbedding,
  updateVector,
  likePlace,
  dislikePlace
} from "./clientHelpers";
import { Place } from "@/types/place";

interface CityLocalityMap {
  [key: string]: string[];
}

const CHUNK_SIZE = 10;
const UPDATE_DEBOUNCE_MS = 1000;

export default function DiscoverPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [userVector, setUserVector] = useState<number[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cityLocalityMap, setCityLocalityMap] = useState<CityLocalityMap>({});

  // Filter states
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

  // Vector update debouncing
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<number[]>([]);

  useEffect(() => {
    localStorage.setItem("selectedCities", JSON.stringify(selectedCities));
  }, [selectedCities]);

  useEffect(() => {
    localStorage.setItem("selectedLocalities", JSON.stringify(selectedLocalities));
  }, [selectedLocalities]);

  // Initialize user vector and fetch initial places
  const initializeData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch user vector
      const vector = await getUserVector();
      if (vector) {
        setUserVector(vector);
      }

      // Fetch initial places chunk
      const placesData = await fetchPlacesChunk(CHUNK_SIZE, 0);
      if (placesData) {
        setPlaces(placesData);
        setOffset(CHUNK_SIZE);

        // Create city locality map (simplified version for now)
        const cityMap: CityLocalityMap = {};
        placesData.forEach(place => {
          if (place.city) {
            if (!cityMap[place.city]) {
              cityMap[place.city] = [];
            }
            // For now, we'll use the city as the locality
            if (!cityMap[place.city].includes(place.city)) {
              cityMap[place.city].push(place.city);
            }
          }
        });
        setCityLocalityMap(cityMap);
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Fetch more places when needed
  const fetchMorePlaces = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const morePlaces = await fetchPlacesChunk(CHUNK_SIZE, offset);
      if (morePlaces && morePlaces.length > 0) {

        setPlaces(prev => [...prev, ...morePlaces]);
        setOffset(prev => prev + CHUNK_SIZE);
      }
    } catch (error) {
      console.error("Error fetching more places:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [offset, isLoadingMore]);

  // Debounced vector update function
  const debouncedVectorUpdate = useCallback(async (newVector: number[]) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    pendingUpdatesRef.current = newVector;

    updateTimeoutRef.current = setTimeout(async () => {
      try {
        await updateUserVector(pendingUpdatesRef.current);
      } catch (error) {
        console.error("Error updating user vector:", error);
      }
    }, UPDATE_DEBOUNCE_MS);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Handle swipe actions
  const handleLike = useCallback(async (place: Place) => {
    try {
      // Record the like
      await likePlace(place.id.toString());

      // Get place embedding and update vector
      const embedding = await getPlaceEmbedding(place.id);
      if (embedding && userVector.length > 0) {
        const newVector = updateVector(userVector, embedding, 1);
        setUserVector(newVector);
        debouncedVectorUpdate(newVector);
      }

      // Remove place from current set
      setPlaces(prev => prev.filter(p => p.id !== place.id));

      // Fetch more places if running low
      if (places.length <= 3) {
        fetchMorePlaces();
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  }, [userVector, places.length, debouncedVectorUpdate, fetchMorePlaces]);

  const handleDislike = useCallback(async (place: Place) => {
    try {
      // Record the dislike
      await dislikePlace(place.id.toString());

      // Get place embedding and update vector
      const embedding = await getPlaceEmbedding(place.id);
      if (embedding && userVector.length > 0) {
        const newVector = updateVector(userVector, embedding, -1);
        setUserVector(newVector);
        debouncedVectorUpdate(newVector);
      }

      // Remove place from current set
      setPlaces(prev => prev.filter(p => p.id !== place.id));

      // Fetch more places if running low
      if (places.length <= 3) {
        fetchMorePlaces();
      }
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  }, [userVector, places.length, debouncedVectorUpdate, fetchMorePlaces]);

  // Apply filters to places
  const filteredPlaces = React.useMemo(() => {
    if (selectedCities.length === 0 && selectedLocalities.length === 0) {
      return places;
    }

    return places.filter((place) => {
      // Check if both filters are active
      if (selectedCities.length > 0 && selectedLocalities.length > 0) {
        // Must match both city AND locality
        return (
          selectedCities.includes(place.city || "") &&
          selectedLocalities.includes(place.city || "") // Using city as locality for now
        );
      }

      // If only city filter is active
      if (selectedCities.length > 0) {
        return selectedCities.includes(place.city || "");
      }

      // If only locality filter is active
      if (selectedLocalities.length > 0) {
        return selectedLocalities.includes(place.city || ""); // Using city as locality for now
      }

      return true;
    });
  }, [places, selectedCities, selectedLocalities]);

  return (
    <>
      <div className="flex h-[calc(100vh_-_143px)] w-full items-center justify-center overflow-hidden px-5 py-4">
        <div className="relative h-[95%] w-[95%] md:h-[600px] md:w-[600px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <SwipeCard
              places={filteredPlaces}
              onLike={handleLike}
              onDislike={handleDislike}
              isLoading={isLoadingMore}
            />
          )}
        </div>
        <FloatingActionButton
          cityLocalityMap={cityLocalityMap}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
          selectedLocalities={selectedLocalities}
          setSelectedLocalities={setSelectedLocalities}
          numberOfFilters={selectedCities.length + selectedLocalities.length}
        />
      </div>
    </>
  );
}