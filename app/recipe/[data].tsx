import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { RECIPE } from "@/constants/types";
import { dummyIngredientsData, dummyNutritionsData } from "@/constants/dummy";

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
              <View key={index} style={{ marginRight: 15 }}>
                <Text>{nutrition.label}</Text>
                <Text>{nutrition.value}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View>
          <Text>Ingredients</Text>
          <ScrollView horizontal>
            {dummyIngredientsData.map((ingredient, index) => (
              <View key={index} style={{ marginRight: 15 }}>
                <Text>{ingredient}</Text>
              </View>
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
