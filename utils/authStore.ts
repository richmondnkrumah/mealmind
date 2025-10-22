import {persist, createJSONStorage} from "zustand/middleware";
import { getItem,setItem,deleteItemAsync } from "expo-secure-store";

type UserState ={
    isLoggedIn: boolean;
    hasCompletedOnboarding: boolean;
    logIn: () => void;
    logOut: () => void;
    resetOnboarding: () => void
    completeOnboarding: () => void

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