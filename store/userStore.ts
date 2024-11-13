import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/app/layoutWrapper";

interface UserState {
  user: User | null;
  userProfile: UserProfile | null;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  clearUser: () => void;
  lastUpdated: number | null;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userProfile: null,
  lastUpdated: null,
  setUser: (user) => set({ user, lastUpdated: Date.now() }),
  setUserProfile: (profile) =>
    set({ userProfile: profile, lastUpdated: Date.now() }),
  clearUser: () =>
    set({ user: null, userProfile: null, lastUpdated: Date.now() }),
}));
