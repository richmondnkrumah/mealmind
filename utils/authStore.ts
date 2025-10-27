import { persist, createJSONStorage } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";
import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.ts";

interface Profile {
  id: string;
  preferences: object | null;
  inventory: string[] | null;
}

interface UserState {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  logIn: () => void;
  logOut: () => void;
  resetOnboarding: () => void;
  completeOnboarding: () => void;
  session: Session | null;
  saveUserSession: (session: Session) => void;
  removeUserSession: () => void;
  profile: Profile | null;
  fetchProfile: () => Promise<void>;
  user: User | null;
  isInventoryLoading: boolean
}
export const useAuthStore = create<UserState>()(
  persist<UserState>(
    (set, get) => ({
      isLoggedIn: false,
      profile: null,
      isInventoryLoading: false,
      user: null,
      logIn: () => set(() => ({ isLoggedIn: true })),
      logOut: () => set(() => ({ isLoggedIn: false })),
      hasCompletedOnboarding: false,
      resetOnboarding: () => set(() => ({ hasCompletedOnboarding: false })),
      completeOnboarding: () => set(() => ({ hasCompletedOnboarding: true })),
      session: null,
      saveUserSession: (session: Session) =>
        set(() => ({ session: session, isLoggedIn: !!session, user: session?.user || null })),
      removeUserSession: () =>
        set(() => ({ session: null, isLoggedIn: false })),
      fetchProfile: async () => {
        const user = get().user;
        if (!user) {
          return;
        }
        set({ isInventoryLoading: true });
        try {
          const { data, error, status } = await supabase
            .from("profiles")
            .select(`id, preferences, inventory`)
            .eq("id", user.id)
            .single();
          console.log(data, "fetched profile data");
          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            set({ profile: data } );
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
        finally {
          set({ isInventoryLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem,
        setItem,
        removeItem: deleteItemAsync,
      })),
    }
  )
);
