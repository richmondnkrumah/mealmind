import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import type { DAYMEALS, RECIPE } from "@/constants/types";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { PRIMARY } from "@/constants/colors";

const RecipeCard = ({
  recipe,
  mealType,
}: {
  recipe: RECIPE | null;
  mealType: keyof DAYMEALS;
}) => {
  console.log(recipe)
  return (
    <View style={styles.recipeContainer}>
      <Text style={styles.recipeCategory}>{mealType}</Text>
      {!recipe ? (
        <View style={[styles.recipeCard, styles.emptyCard]}>
          <Ionicons name="restaurant-outline" size={48} color={PRIMARY} />
          <Text style={styles.emptyCardText}>
            No meal planned for this slot.
          </Text>
        </View>
      ) : (
        <View style={styles.recipeCard}>
          <Image
            source={recipe.imageUrl}
            style={{
              height: 180,
              width: "100%",
            }}
            contentFit="cover"
          />
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              gap: 10,
            }}
          >
            <Text style={styles.title}>{recipe.recipeName}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.iconContainer}>
                <SimpleLineIcons name="fire" size={22} color={PRIMARY} />
                <Text style={styles.iconText}>{recipe.calories}</Text>
              </View>
              <View style={styles.iconContainer}>
                <SimpleLineIcons name="clock" size={20} color={PRIMARY} />
                <Text style={styles.iconText}>{recipe.cookTime}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  recipeContainer: {
    gap: 10,
  },
  recipeCategory: {
    fontWeight: "bold",
    color: "gray",
    textTransform: "capitalize",
  },
  recipeCard: {
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  emptyCard: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  emptyCardText: {
    marginTop: 10,
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconText: {
    fontWeight: "500",
  },
});
