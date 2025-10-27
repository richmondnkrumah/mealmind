// app/(tabs)/pantry.tsx

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useFocusEffect } from "expo-router";
import { useAuthStore } from "@/utils/authStore"; // Adjusted path
import { supabase } from "@/lib/supabase";       // Adjusted path
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PantryScreen = () => {
  const { profile, user, isInventoryLoading, fetchProfile } = useAuthStore();


  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );
 
  const handleDeleteItem = async (itemToDelete: string) => {
    if (!user || !profile || !profile.inventory) return;

    const originalInventory = profile.inventory;
    // Ensure we are working with an array before filtering
    const currentInventory = Array.isArray(originalInventory) ? originalInventory : [];
    const newInventory = currentInventory.filter(item => item !== itemToDelete);

    useAuthStore.setState({ profile: { ...profile, inventory: newInventory } });

    const { error } = await supabase
      .from("profiles")
      .update({ inventory: newInventory })
      .eq("id", user.id);

    if (error) {
      useAuthStore.setState({ profile: { ...profile, inventory: originalInventory } });
      Alert.alert("Error", "Failed to remove item. Please try again.");
      console.error("Delete error:", error);
    }
  };

  if (!profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading Your Pantry...</Text>
      </View>
    );
  }

  const inventoryData =
    profile?.inventory && Array.isArray(profile.inventory) ? profile.inventory : [];

  if (inventoryData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Your pantry is empty.</Text>
          <Text style={styles.emptySubtext}>
            Use the '+' tab to scan your fridge!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Pantry</Text>
      <FlatList
        data={inventoryData} // Use the validated array
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.inventoryItem}>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item)}>
              <Ionicons name="trash-bin-outline" size={24} color="#C86235" />
            </TouchableOpacity>
          </View>
        )}
        onRefresh={fetchProfile}
        refreshing={isInventoryLoading}
      />
    </SafeAreaView>
  );
};

export default PantryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0D8C8",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5C493D",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  inventoryItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: "#5C493D",
    textTransform: "capitalize",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5C493D",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#5C493D",
    marginTop: 8,
  },
});