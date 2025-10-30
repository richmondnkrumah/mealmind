import { StyleSheet, View, Text, Pressable } from "react-native";
import React from "react";
import { useAuthStore } from "@/utils/authStore";
import { Image } from "expo-image";
import { PRIMARY } from "@/constants/colors";
import Feather from "@expo/vector-icons/Feather";

const ProfileScreen = () => {
  const { profile } = useAuthStore();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image source={profile.avatar_url} />
          ) : (
            <Text
              style={{
                fontSize: 60,
                color: "white",
              }}
            >
              {profile?.username.at(0)}
            </Text>
          )}
          <Pressable
            style={{
              position: "absolute",
              bottom: 0,
              right: "10%",
              backgroundColor: "red",
              height: 30,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
            }}
          >
            <Feather name="edit-3" size={18} color="white" />
          </Pressable>
        </View>
        <Text>{profile?.email}</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  avatarContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
});
