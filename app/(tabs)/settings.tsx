import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { supabase } from "@/lib/supabase.ts";
import { useAuthStore } from "@/utils/authStore.ts";
import { SafeAreaView } from "react-native-safe-area-context";

const settings = () => {
  const { removeUserSession } = useAuthStore();
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{ backgroundColor: "red", flex: 1 }}>
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
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({});
