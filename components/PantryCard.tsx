// components/PantryCard.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import type { PANTRYCARD } from "@/constants/types";
import { ACCENT } from "@/constants/colors";
import { Image } from "expo-image";
import { getAssetForIngredient } from "@/constants/ingredientAssets"; 

const PantryCard = ({ ingredient, deleteItemHandler }: PANTRYCARD) => {
  const assetSource = getAssetForIngredient(ingredient);

  return (
    <View style={styles.inventoryItem}>
      <Image
        source={assetSource}
        style={styles.ingredientImage}
        contentFit="cover"
      />
      <Pressable
        style={styles.deleteButton}
        onPress={() => deleteItemHandler(ingredient)}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
      </Pressable>

      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{ingredient}</Text>
      </View>
    </View>
  );
};

export default PantryCard;

const styles = StyleSheet.create({
  inventoryItem: {
    backgroundColor: ACCENT,
    width: "48%",
    height: 150,
    borderRadius: 16,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  ingredientImage: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: "#FFFFFF", // White text for better contrast on the overlay
    textTransform: "capitalize",
  },
});