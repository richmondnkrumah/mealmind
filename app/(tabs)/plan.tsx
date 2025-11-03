import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/utils/authStore";
import { Image } from "expo-image";
import { ACCENT, PRIMARY } from "@/constants/colors";
import { Link, useFocusEffect } from "expo-router";
import RecipeCard from "@/components/RecipeCard";
import type { RECIPE, WEEKDAYS, DAYMEALS } from "@/constants/types";
import { supabase } from "@/lib/supabase";

const plan = () => {
  const { profile, user } = useAuthStore();

  // --- State to hold the plan from the database ---
  const [mealPlan, setMealPlan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // --- State for UI interaction ---
  const [selectedDay, setSelectedDay] = useState<WEEKDAYS>("monday");
  const [selectedRecipes, setSelectedRecipes] = useState<DAYMEALS | null>(null);

  // --- This is the new fetchLatestPlan function ---
  const fetchLatestPlan = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('plan_data') // We only need the plan JSON
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // Get the newest one first
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means "no rows returned"
        throw error;
      }
      
      // Update our state with the fetched plan
      if (data) {
        setMealPlan(data);
        // Automatically set the recipes for the currently selected day
        getRecipe(selectedDay, data);
      } else {
        setMealPlan(null); // Explicitly set to null if no plan is found
      }

    } catch (error: any) {
      Alert.alert("Error", "Could not fetch your meal plan.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- This is the wired-up generate function ---
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const { error } = await supabase.functions.invoke('generate-meal-plan-gemini');
      
      if (error) {
        throw error;
      }

      // Success! Refetch the data to display the new plan.
      await fetchLatestPlan();
      Alert.alert("Success!", "Your new meal plan is ready.");

    } catch (error: any) {
      Alert.alert("Generation Failed", error.message);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // --- Updated getRecipe function to use the state variable ---
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
      // Set the default selected day to today
      const today = new Date().toLocaleString("en-us", { weekday: "long" }).toLowerCase() as WEEKDAYS;
      setSelectedDay(today);
      // Fetch the plan, which will then trigger getRecipe
      console.log("i rerrun")
      fetchLatestPlan();
    }, [user]) // Re-run if the user changes
  );

  // Derive the days from the mealPlan state, or an empty array
  const days = mealPlan ? Object.keys(mealPlan.plan_data.weekly_plan) as WEEKDAYS[] : [];

  // --- Render Logic ---

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={{ marginTop: 10 }}>Loading Your Plan...</Text>
      </View>
    );
  }
  console.log(mealPlan.plan_data.weekly_plan)
console.log(isLoading)
  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerSubtitle}>
              Hello, {profile?.username}
            </Text>
            <Text style={styles.headerTitle}>
              What would you like to cook today?
            </Text>
          </View>

          <Link href={"/profile"} asChild>
            <Pressable style={styles.avatarContainer}>
              {profile?.avatar_url ? (
                <Image
                  style={{ height: "100%", width: "100%", borderRadius: 25 }}
                  source={profile.avatar_url}
                  contentFit="cover"
                />
              ) : (
                <Text style={{ fontSize: 30, color: "white" }}>
                  {profile?.username.charAt(0)}
                </Text>
              )}
            </Pressable>
          </Link>
        </View>

        <Pressable 
          style={styles.generateButton}
          onPress={handleGeneratePlan}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#5C493D" />
          ) : (
            <Text style={styles.generateButtonText}>Generate Today's Meals</Text>
          )}
        </Pressable>
        
        {/* Only show the plan UI if a plan exists */}
        {!mealPlan && !isLoading ? (
            <View style={styles.centeredEmpty}>
                <Text style={styles.emptyText}>No plan found.</Text>
                <Text style={styles.emptySubtext}>Press the button above to create one!</Text>
            </View>
        ) : (
            <>
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
                  paddingRight: 25,
                  paddingBottom: 25,
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
            </>
        )}
    </View>
  );
};

export default plan;

// --- Your existing styles with minor additions ---
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
    paddingRight: 25,
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
    justifyContent: 'center', // Added for initial centering
    alignItems: 'center',   // Added for initial centering
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
    backgroundColor:'#E9F7B2',
    padding: 15,
    borderRadius: 100,
    marginBottom: 20,
    marginRight: 25, // To align with the right padding of other elements
    alignItems:'center',
  },
  generateButtonText: {
    fontWeight: 'bold',
    color: '#5C493D',
  },
  centeredEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 25, // To center it correctly within the padded view
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  }
});