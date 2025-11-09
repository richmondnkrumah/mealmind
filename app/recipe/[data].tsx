import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { RECIPE } from "@/constants/types";
import { dummyIngredientsData, dummyNutritionsData } from "@/constants/dummy";
import IngredientCard from "@/components/IngredientCard";
import NutritionCard from "@/components/NutritionCard";

const SingleRecipeScreen = () => {
  const recipeData = useLocalSearchParams().data as unknown as RECIPE;
  return (
    <View>
      <Text>SingleRecipeScreen</Text>
      <View>
        <View>
          <Text>{recipeData.recipeName}</Text>
          <Text>{recipeData.cookTime}</Text>
        </View>
        <View>
          <Text>Nutritions</Text>
          <ScrollView horizontal>
            {dummyNutritionsData.map((nutrition, index) => (
              <NutritionCard quantity={nutrition.quantity} label={nutrition.label} key={index} />
            ))}
          </ScrollView>
        </View>
        <View>
          <Text>Ingredients</Text>
          <ScrollView horizontal contentContainerStyle={{ gap: 15 }}>
            {dummyIngredientsData.map((ingredient, index) => (
              <IngredientCard quantity={ingredient.quantity} label={ingredient.label} key={index} />
            ))}
          </ScrollView>
        </View>
        <View>
          <Text>Recipe</Text>

        </View>
      </View>
    </View>
  );
};

export default SingleRecipeScreen;

const styles = StyleSheet.create({});
