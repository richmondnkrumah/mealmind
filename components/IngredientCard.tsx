import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { INGREDIENTCARD } from "@/constants/types";
import { Image } from "expo-image";
import { getAssetForIngredient } from "@/constants/ingredientAssets";

const IngredientCard = ({ label, quantity }: INGREDIENTCARD) => {
  const assetSource = getAssetForIngredient(label);
  console.log("Asset source for", label);
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.ingredientImage}
          source={assetSource}
          contentFit="cover"
        />
      </View>
      <View>
        <Text style={styles.ingredientTitle}>{label}</Text>
        <Text>{quantity}</Text>
      </View>
    </View>
  );
};

export default IngredientCard;

const styles = StyleSheet.create({
  container: {},
  imageContainer: {
    width: 70,
    height: 70,
  },
  ingredientImage: {
    borderRadius: 15,
    width: "100%",
    height: "100%",
  },
  ingredientTitle: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 3,
  },
});
