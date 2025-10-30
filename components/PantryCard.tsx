import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import type { PANTRYCARD } from "@/constants/types";




const PantryCard = ({ingredient,deleteItemHandler} : PANTRYCARD) => {
  return (
    <View style={styles.inventoryItem}>
      <Text style={styles.itemText}>{ingredient}</Text>
      <Pressable onPress={() => deleteItemHandler(ingredient)}>
        <Ionicons name="trash-bin-outline" size={24} color="#C86235" />
      </Pressable>
    </View>
  );
};

export default PantryCard;

const styles = StyleSheet.create({
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
});
