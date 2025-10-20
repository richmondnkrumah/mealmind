import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from "react";

SplashScreen.setOptions({
  duration: 1000,
  fade: true
})

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [toHide,SetToHide] = useState(false)
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
