import { persist, createJSONStorage } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";
import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  preference: object | null;
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
  isLoading: boolean;
}
export const useAuthStore = create<UserState>()(
  persist<UserState>(
    (set, get) => ({
      isLoggedIn: false,
      profile: null,
      user: null,
      isLoading: true,
      logIn: () => set(() => ({ isLoggedIn: true })),
      logOut: () => set(() => ({ isLoggedIn: false })),
      hasCompletedOnboarding: false,
      resetOnboarding: () => set(() => ({ hasCompletedOnboarding: false })),
      completeOnboarding: () => set(() => ({ hasCompletedOnboarding: true })),
      session: null,
      saveUserSession: (session: Session) =>
        set(() => ({ session: session, isLoggedIn: !!session })),
      removeUserSession: () =>
        set(() => ({ session: null, isLoggedIn: false })),
      fetchProfile: async () => {
        const user = get().user;
        if (!user) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const { data, error, status } = await supabase
            .from("profiles")
            .select(`id, preference, inventory`)
            .eq("id", user.id)
            .single();

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            set({ profile: data } );
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          set({ isLoading: false });
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
