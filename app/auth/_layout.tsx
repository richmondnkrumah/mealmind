import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack >
      <Stack.Screen name="index" options={{
        headerShown: false
}} />
      <Stack.Screen name="forgot" options={{
        title: "",
        headerShadowVisible: false
        
      }} />
    </Stack>

  )
}

export default AuthLayout
