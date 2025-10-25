import {persist, createJSONStorage} from "zustand/middleware";
import { getItem,setItem,deleteItemAsync } from "expo-secure-store";
import {create} from "zustand";
import { Session } from "@supabase/supabase-js";

type UserState ={
    isLoggedIn: boolean;
    hasCompletedOnboarding: boolean;
    logIn: () => void;
    logOut: () => void;
    resetOnboarding: () => void
    completeOnboarding: () => void,
    session: Session | null;
    saveUserSession: (session: Session) => void;
    removeUserSession: () => void;

}
export const useAuthStore = create<UserState>()(
    persist<UserState>(
        (set) => ({
            isLoggedIn: false,
            logIn: () => set(() => ({ isLoggedIn: true })),
            logOut: () => set(() => ({ isLoggedIn: false })),
            hasCompletedOnboarding: false,
            resetOnboarding: () => set(() => ({ hasCompletedOnboarding: false })),
            completeOnboarding: () => set(() => ({ hasCompletedOnboarding: true })),
            session: null,
            saveUserSession: (session: Session) => set(() => ({ session: session, isLoggedIn: !!session  })),
            removeUserSession: () => set(() => ({ session: null, isLoggedIn: false })),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => ({
                getItem,
                setItem,
                removeItem:deleteItemAsync,
            })),
        }
    )
);