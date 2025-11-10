import { ScrollView, StatusBar,Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RECIPE } from "@/constants/types";
import { dummyIngredientsData, dummyNutritionsData } from "@/constants/dummy";
import IngredientCard from "@/components/IngredientCard";
import NutritionCard from "@/components/NutritionCard";
import { ImageBackground } from "expo-image";
import { convertInstructions } from "@/utils";
import { VerticalStatusProgress } from "react-native-vertical-status-progress";
import { SECONDARY } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
const SingleRecipeScreen = () => {
  const recipeData = JSON.parse(
    useLocalSearchParams().data as string
  ) as RECIPE;
  const recipeSteps = convertInstructions(recipeData.instructions);
  const [currentStatus, setCurrentStatus] = useState<string>("registered");
  const router = useRouter()
  return (
    <View style={styles.container}>
      <ImageBackground
        source={recipeData.imageUrl}
        contentFit="cover"
        style={{ width: "100%", height: "36%" }}
      >
        <Pressable onPress={() => router.back()} style={styles.customBackButton}>
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </Pressable>
      </ImageBackground>
      <View style={styles.innerContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={[styles.titleContainer, styles.extraPadding]}>
            <Text style={styles.title}>{recipeData.recipeName}</Text>
            <Text style={styles.titleCookTime}>{recipeData.cookTime} MIN</Text>
          </View>
          <View>
            <Text style={styles.subHeader}>Nutritions</Text>
            <ScrollView
              horizontal
              contentContainerStyle={[
                styles.nutritionContainer,
                styles.extraPadding,
              ]}
            >
              {dummyNutritionsData.map((nutrition, index) => (
                <NutritionCard
                  quantity={nutrition.quantity}
                  label={nutrition.label}
                  key={index}
                />
              ))}
            </ScrollView>
          </View>
          <View>
            <Text style={styles.subHeader}>Ingredients</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 15 }}
            >
              {dummyIngredientsData.map((ingredient, index) => (
                <IngredientCard
                  quantity={ingredient.quantity}
                  label={ingredient.label}
                  key={index}
                />
              ))}
            </ScrollView>
          </View>
          <Text style={styles.subHeader}>Recipe</Text>
          <VerticalStatusProgress
            statuses={recipeSteps}
            showOrder
            currentStatus={currentStatus}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default SingleRecipeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    position: "relative",
  },
  innerContainer: {
    backgroundColor: "white",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    position: "absolute",
    bottom: 0,
    height: "70%",
    paddingLeft: 25,
    paddingTop: 40,
  },
  titleCookTime: {
    fontSize: 16,
    fontWeight: "600",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: SECONDARY,
    color: "white",
  },
  nutritionContainer: {
    justifyContent: "space-between",
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    width: "80%",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "500",
  },
  extraPadding: {
    paddingRight: 25,
  },

  customBackButton: {
    marginTop: (StatusBar.currentHeight ?? 0) + 10,
    marginLeft: 25,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
