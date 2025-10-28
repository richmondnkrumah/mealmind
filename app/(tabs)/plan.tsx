import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../utils/authStore.ts';

const plan = () => {
  const {profile,completeOnboarding,isLoggedIn,session,user} = useAuthStore()
  console.log(isLoggedIn)
  return (
    <View>
      <Text>plan</Text>
    </View>
  )
}

export default plan

const styles = StyleSheet.create({})