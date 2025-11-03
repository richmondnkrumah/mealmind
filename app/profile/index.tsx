// app/(tabs)/profile/index.tsx

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { useAuthStore } from "@/utils/authStore";
import { Image } from "expo-image";
import { FADED_WHITE, PRIMARY } from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import type { PROFILELINKS } from "@/constants/types";

const ProfileLink = ({ href, iconName, text }: PROFILELINKS) => (
  <Link href={href} asChild>
    <Pressable style={styles.linkContainer}>
      <Feather name={iconName} size={20} color={PRIMARY} />
      <Text style={styles.linkText}>{text}</Text>
      <Ionicons name="chevron-forward" size={22} color="#ccc" />
    </Pressable>
  </Link>
);

const ProfileHubScreen = () => {
  const { profile, removeUserSession, user, fetchProfile } = useAuthStore();

  const handleSignOut = () => {
    supabase.auth.signOut();
    removeUserSession();
  };

  const handleAvatarChange = async () => {
    // 1. Ask for media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your photos to update your avatar."
      );
      return;
    }

    // 2. Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled || !user) {
      return;
    }


    // 3. Upload the image to a different bucket (e.g., 'avatars')
    const imageUri = result.assets[0].uri;
    const fileExt = imageUri.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const base64 = result.assets[0].base64!;
    console.log(base64)
    try {
      const decoded = decode(base64)
    }
    catch {
      Alert.alert("the error is here")
    }

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), {
        upsert: true,
        contentType: `image/${fileExt}`,
      });

    if (uploadError) {
      Alert.alert("Error", "Failed to upload avatar.");
      console.error(uploadError);
      return;
    }

    // 4. Get the public URL and update the user's profile
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      Alert.alert(
        "Error",
        "Failed to update your profile with the new avatar."
      );
    } else {
      await fetchProfile(); // Refresh profile to show the new image
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <Text style={styles.avatarInitial}>
              {profile?.username?.charAt(0).toUpperCase()}
            </Text>
          )}
          <Pressable
            style={styles.editAvatarButton}
            onPress={handleAvatarChange}
          >
            <Feather name="edit-3" size={18} color="white" />
          </Pressable>
        </View>
        <Text style={styles.username}>{profile?.username || "User"}</Text>
        <Text style={styles.emailText}>{profile?.email}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          gap: 10,
        }}
      >
        <ProfileLink
          href="/(tabs)/profile/edit-profile"
          iconName="user"
          text="Edit Profile"
        />
        <View style={styles.sectionSeparator}></View>

        <ProfileLink
          href="/(tabs)/profile/change-password"
          iconName="lock"
          text="Change Password"
        />
        <View style={styles.sectionSeparator}></View>

        <ProfileLink
          href="/(tabs)/profile/meal-preferences"
          iconName="settings"
          text="Meal Preferences"
        />
        <View style={styles.sectionSeparator}></View>

        <ProfileLink
          href="/(tabs)/profile/allergies"
          iconName="alert-triangle"
          text="Allergies & Dislikes"
        />
        <View style={styles.sectionSeparator}></View>

        <Pressable onPress={handleSignOut} style={styles.linkContainer}>
          <Feather name="log-out" size={20} color="red" />
          <Text style={[styles.linkText, { color: "red" }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ProfileHubScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 25,
  },
  header: {
    backgroundColor: "white",
    paddingVertical: 30,
    alignItems: "center",
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: FADED_WHITE,
    width: "100%",
  },
  avatarContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: PRIMARY,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "white",
  },
  avatarImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  avatarInitial: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
  username: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  emailText: {
    marginTop: 4,
    fontSize: 16,
    color: "#666",
  },
  linkGroup: {
    marginTop: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  }})
