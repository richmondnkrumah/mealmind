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
    if(!toHide){
      setTimeout(()=>{
        SplashScreen.hide()
        SetToHide(true)
      },2000)
    }
  },[toHide])
  return <Stack>
    <Stack.Screen name="onboarding" options={{ headerShown: false }}  />
    {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }}  /> */}
  </Stack>
}
