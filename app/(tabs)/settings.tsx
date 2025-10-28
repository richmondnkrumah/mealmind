import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { supabase } from "@/lib/supabase.ts";
import { useAuthStore } from "@/utils/authStore.ts";

const settings = () => {
  const {removeUserSession} = useAuthStore();
  return (
    <View>
      <Text>settings</Text>
      <Text>settings</Text>
      <Text>settings</Text>
      <Text>settings</Text>
      <Text>settings</Text>
      <Text>settings</Text>
      <Text>settings</Text>
      <Text>settings</Text>
      <Text>settings</Text>
      <Pressable
        onPress={() => {
          supabase.auth.signOut();
          removeUserSession();
        }}
      >
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({});
