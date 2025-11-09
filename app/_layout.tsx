import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/utils/authStore";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoggedIn, hasCompletedOnboarding } = useAuthStore();
  const [hideSplash, setHideSplash] = useState(true);
  const { saveUserSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      saveUserSession(session!);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      saveUserSession(session!);
    });
  }, []);
  useEffect(() => {
    console.log(isLoggedIn, hasCompletedOnboarding);
    if (hideSplash) {
      SplashScreen.hide();
    }
  }, [hideSplash]);

  return (
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!hasCompletedOnboarding}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn && hasCompletedOnboarding}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="profile" options={{
          headerShown: false
        }}/>
      </Stack.Protected>
    </Stack>
  );
}
