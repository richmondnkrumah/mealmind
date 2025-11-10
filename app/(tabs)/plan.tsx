import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useAuthStore } from "@/utils/authStore";
import { ACCENT, PRIMARY } from "@/constants/colors";
import { Link, useFocusEffect } from "expo-router";
import RecipeCard from "@/components/RecipeCard";
import type { WEEKDAYS, DAYMEALS } from "@/constants/types";
import { supabase } from "@/lib/supabase";
import { Image } from "expo-image";

const plan = () => {
  const { profile, user } = useAuthStore();

  const allDaysOfWeek: WEEKDAYS[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const todayString = new Date()
    .toLocaleString("en-us", { weekday: "long" })
    .toLowerCase() as WEEKDAYS;

  const [mealPlan, setMealPlan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<WEEKDAYS>(todayString);
  const [selectedRecipes, setSelectedRecipes] = useState<DAYMEALS | null>(null);

  const fetchLatestPlan = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("meal_plans")
        .select("plan_data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setMealPlan(data);
        getRecipe(selectedDay, data);
      } else {
        setMealPlan(null);
        setSelectedRecipes(null); // Ensure recipes are cleared if no plan exists
      }
    } catch (error: any) {
      Alert.alert("Error", "Could not fetch your meal plan.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const { error } = await supabase.functions.invoke(
        "generate-full-meal-plan"
      );
      if (error) throw error;
      await fetchLatestPlan();
      Alert.alert("Success!", "Your new meal plan is ready.");
    } catch (error: any) {
      Alert.alert("Generation Failed", error.message);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRecipe = (day: WEEKDAYS, currentPlan: any) => {
    if (!currentPlan) {
      setSelectedRecipes(null);
      return;
    }
    const foundRecipe = currentPlan.plan_data?.weekly_plan?.[day];
    setSelectedRecipes(foundRecipe ?? null);
  };

  const handleDayAndRecipe = (day: WEEKDAYS) => {
    setSelectedDay(day);
    getRecipe(day, mealPlan);
  };

  useFocusEffect(
    React.useCallback(() => {
      setSelectedDay(todayString);
      fetchLatestPlan();
    }, [user])
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={{ marginTop: 10 }}>Loading Your Plan...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 40}} showsVerticalScrollIndicator={false}  style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Link href={"/profile"} asChild>
            <Pressable style={styles.avatarContainer}>
              {profile?.avatar_url ? (
                <Image
                  style={{ height: "100%", width: "100%", borderRadius: 25 }}
                  source={{ uri: profile.avatar_url }} // Use object for uri
                  contentFit="cover"
                />
              ) : (
                <Text style={{ fontSize: 30, color: "white" }}>
                  {profile?.username?.charAt(0)}
                </Text>
              )}
            </Pressable>
          </Link>
          <Text style={styles.headerSubtitle}>Hi, {profile?.username}!</Text>
        </View>
        <Text style={styles.headerTitle}>
          What would you like to cook today?
        </Text>
      </View>
      <Pressable
        style={styles.generateButton}
        onPress={handleGeneratePlan}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="#5C493D" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Weekly Plan</Text>
        )}
      </Pressable>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorContainer}
        >
          {allDaysOfWeek.map((day) => {
            // Determine what text to display for the day
            const displayText = day === todayString ? "Today" : day.slice(0, 3);

            return (
              <Pressable
                key={day}
                style={[
                  styles.selectorChip,
                  selectedDay === day && styles.selectedChip,
                ]}
                onPress={() => handleDayAndRecipe(day)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    selectedDay === day && styles.selectedText,
                  ]}
                >
                  {displayText}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {!mealPlan ? (
        <View style={styles.centeredEmpty}>
          <Text style={styles.emptyText}>No plan found.</Text>
          <Text style={styles.emptySubtext}>
            Press the button above to create one!
          </Text>
        </View>
      ) : (
        <View
          style={{
            gap: 30,
            paddingRight: 25,
            paddingBottom: 25,
          }}
        >
          {selectedRecipes ? (
            Object.entries(selectedRecipes).map(([mealType, recipe], idx) => (
              <RecipeCard
                key={`${selectedDay}-${mealType}-${idx}`} // More stable key
                recipe={recipe}
                mealType={mealType as keyof DAYMEALS}
              />
            ))
          ) : (
            // Display this message if a day is selected but has no meals
            <View style={styles.centeredEmpty}>
              <Text style={styles.emptyText}>
                No meals planned for {selectedDay}.
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default plan;

// Your existing styles (no changes needed)
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingLeft: 25,
    flex: 1,
    paddingTop: (StatusBar.currentHeight ?? 0) + 15,
  },
  headerContainer: {
    marginBottom: 20,
    paddingRight: 25,
    gap: 20
  },
  headerTextContainer: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
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
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: PRIMARY,
  },
  selectorText: {
    color: "#5C493D",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  generateButton: {
    backgroundColor: PRIMARY,
    padding: 15,
    borderRadius: 100,
    marginBottom: 20,
    marginRight: 25,
    alignItems: "center",
  },
  generateButtonText: {
    fontWeight: "bold",
    color: "#FFF",
  },
  centeredEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 25,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "gray",
    marginTop: 8,
  },
});
