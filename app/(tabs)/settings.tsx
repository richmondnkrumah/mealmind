// app/(tabs)/settings/index.tsx

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import React from "react";
import { useAuthStore } from "@/utils/authStore";
import { FADED_WHITE, PRIMARY } from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";
import SettingsLink from "@/components/SettingsLink";

const SettingsHubScreen = () => {
  const { removeUserSession } = useAuthStore();
  const router = useRouter();

  const handleSignOut = () => {
    supabase.auth.signOut();
    removeUserSession();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView contentContainerStyle={{
        gap: 10
      }}>
        <SettingsLink href="/(setting)/theme" iconName="moon" text="Theme" />
        <View style={styles.sectionSeparator}></View>
        <SettingsLink
          href="/(setting)/language"
          iconName="globe"
          text="App Language"
        />
        <View style={styles.sectionSeparator}></View>
        <SettingsLink
          href="/(tabs)/settings/notifications"
          iconName="bell"
          text="Notifications & Sounds"
        />
        <View style={styles.sectionSeparator}></View>
        <SettingsLink
          href="https://your-website.com/terms"
          iconName="file-text"
          text="Terms of Use"
          isExternal
        />
        <View style={styles.sectionSeparator}></View>
        <SettingsLink
          href="https://your-website.com/privacy"
          iconName="shield"
          text="Privacy Policy"
          isExternal
        />
        <View style={styles.sectionSeparator}></View>
        <SettingsLink
          href="mailto:support@mealmind.app"
          iconName="help-circle"
          text="Help & Support"
          isExternal
        />
        <View style={styles.sectionSeparator}></View>
        <Pressable onPress={handleSignOut}>
          <SettingsLink
            href=""
            iconName="log-out"
            text="Sign Out"
            isDestructive
            displayArrow={false}
          />
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default SettingsHubScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: (StatusBar.currentHeight ?? 0) + 15,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5C493D",
    paddingTop: 20,
    paddingBottom: 30,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: FADED_WHITE,
    width: "100%",
  },
});
