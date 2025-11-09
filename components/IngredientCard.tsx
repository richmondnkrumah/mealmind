import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { INGREDIENTCARD } from "@/constants/types";
import { Image } from "expo-image";
import { getAssetForIngredient } from "@/constants/ingredientAssets";

const IngredientCard = ({ label, quantity }: INGREDIENTCARD) => {
    const assetSource = getAssetForIngredient(label);
    console.log('Asset source for', label);
  return (
    <View style={styles.container}>
      <Image style={styles.ingredientImage} source={assetSource} contentFit="cover" />
      <View >
        <Text>{label}</Text>
        <Text>{quantity}</Text>
      </View>
    </View>
  );
};

export default IngredientCard;

const styles = StyleSheet.create({
    container: {
    width: 80,
    height: 80,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
    ingredientImage: {
    width: '100%',
    height: '100%',
  },
});
