import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/utils/authStore";
import { Image } from "expo-image";
import { ACCENT, PRIMARY } from "@/constants/colors";
import { Link, useFocusEffect } from "expo-router";
import { dummyMealPlanData } from "@/constants/dummy";
import RecipeCard from "@/components/RecipeCard";
import type { RECIPE, WEEKDAYS, DAYMEALS } from "@/constants/types";
import { StatusBar } from "react-native";

const plan = () => {
  const { profile } = useAuthStore();
  const days = Object.keys(
    dummyMealPlanData.plan_data.weekly_plan
  ) as WEEKDAYS[];
  const [selectedDay, setSelectedDay] = useState<WEEKDAYS>("monday");
  const [selectedRecipes, setSelectedRecipes] = useState<DAYMEALS | null>();

  const getRecipe = (day: WEEKDAYS) => {
    const foundRecipe = dummyMealPlanData.plan_data.weekly_plan[day];
    setSelectedRecipes(foundRecipe ?? null);
  };
  const handleDayAndRecipe = (day: WEEKDAYS) => {
    setSelectedDay(day);
    getRecipe(day);
  };
  useFocusEffect(
    React.useCallback(() => {
      // Set the default selected day to today
      const today = new Date()
        .toLocaleString("en-us", { weekday: "long" })
        .toLowerCase();
      // A small hack to map weekday names to our 3-letter keys

      setSelectedDay(today as WEEKDAYS);
      getRecipe(today as WEEKDAYS);
    }, [])
  );
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerSubtitle}>
              Hello, {profile?.username}
            </Text>
            <Text style={styles.headerTitle}>
              What would you like to cook today?
            </Text>
          </View>
          <Link href={"/profile"} style={styles.avatarContainer}>
            {profile?.avatar_url ? (
              <Image source={profile.avatar_url} />
            ) : (
              <Text
                style={{
                  fontSize: 30,
                  color: "white",
                }}
              >
                {profile?.username.at(0)}
              </Text>
            )}
          </Link>
        </View>
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorContainer}
          >
            {days.map((day) => (
              <Pressable
                key={day}
                style={[
                  styles.selectorChip,
                  selectedDay === day.toLowerCase() && styles.selectedChip,
                ]}
                onPress={() => handleDayAndRecipe(day)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    selectedDay === day.toLowerCase() && styles.selectedText,
                  ]}
                >
                  {day.slice(0, 3)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 30,
            paddingRight:25,
            paddingBottom: 25
          }}
        >
          {selectedRecipes &&
            Object.entries(selectedRecipes).map(([mealType, recipe], idx) => (
              <RecipeCard
                key={idx}
                recipe={recipe}
                mealType={mealType as keyof DAYMEALS}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default plan;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingLeft: 25,
    flex: 1,
    paddingTop: (StatusBar.currentHeight ?? 0) + 15, 
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 25
  },
  headerTextContainer: {
    width: "70%",
  },
  headerSubtitle: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  avatarContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY,
    textAlign: "center",
  },
  selectorContainer: {
    paddingBottom: 20,
  },
  selectorChip: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: ACCENT,
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: PRIMARY, // Soft Sage Green
  },

  selectorText: {
    color: "#5C493D",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  selectedText: {
    color: "#FFFFFF",
  },
});
