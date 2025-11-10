import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getAssetForNutrition } from "@/constants/nutritionAssets";
import { Image } from "expo-image";

const NutritionCard = ({
  quantity,
  label,
}: {
  quantity: string;
  label: string;
}) => {
  const assetSource = getAssetForNutrition(label);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.innerContainer}>
        <Image source={assetSource} style={{ width: 25, height: 25 }} />
        <Text style={styles.description}>{quantity}</Text>
      </View>
    </View>
  );
};

export default NutritionCard;

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 3,
  },
  description: {
    alignSelf: "flex-end",
  },
});
