import { create } from "zustand";
import { createClient } from "@/utils/supabase/server";

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  locality: string;
  group_experience: string;
  rating: number;
  tags: string;
  city_name: string;
  matchScore: number;
  isLastCard?: boolean;
  address: string;
  likes: number;
  [key: string]: string | number | boolean | null | undefined;
}

interface PlacesStore {
  places: Place[] | null;
  lastFetched: number | null;
  fetchPlaces: () => Promise<Place[] | null>;
  clearCache: () => void;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const usePlacesStore = create<PlacesStore>((set, get) => ({
  places: null,
  lastFetched: null,
  
  fetchPlaces: async () => {
    const currentTime = Date.now();
    const lastFetched = get().lastFetched;
    
    // Return cached data if it's still valid
    if (lastFetched && get().places && currentTime - lastFetched < CACHE_DURATION) {
      return get().places;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("places").select("*");
      
      if (error) {
        console.error("Error fetching places:", error);
        return null;
      }

      set({ 
        places: data,
        lastFetched: currentTime
      });
      
      return data;
    } catch (error) {
      console.error("Error in fetchPlaces:", error);
      return null;
    }
  },

  clearCache: () => {
    set({ 
      places: null,
      lastFetched: null
    });
  },
}));