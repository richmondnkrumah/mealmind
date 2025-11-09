import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { INGREDIENTCARD } from "@/constants/types";
import { Image } from "expo-image";
import { getAssetForIngredient } from "@/constants/ingredientAssets";

const IngredientCard = ({ ingredient, quantity }: INGREDIENTCARD) => {
    const assetSource = getAssetForIngredient(ingredient);
    
  return (
    <View style={styles.container}>
      <Image style={styles.ingredientImage} source={assetSource} contentFit="cover" />
      <View>
        <Text>{ingredient}</Text>
        <Text>{quantity}</Text>
      </View>
    </View>
  );
};

export default IngredientCard;

const styles = StyleSheet.create({
    container: {
    width: '48%',
    height: 150,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
    ingredientImage: {
    width: '100%',
    height: '100%',
  },
});
