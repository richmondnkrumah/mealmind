// supabase/functions/generate-meal-plan-gemini/index.ts

import { createClient } from "npm:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

// The main handler
Deno.serve(async (req) => {
  try {
    // 1. Authenticate the user and get their profile data
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('preferences, inventory')
      .eq('id', user.id)
      .single();
    if (!profile || !profile.preferences) throw new Error("Profile not found or incomplete.");

    // 2. Construct the detailed, structured prompt for Gemini
    const prompt = `
      You are a world-class meal planning assistant. Your task is to create a 1-day meal plan (breakfast, lunch, dinner).
      You MUST respond ONLY with a string formatted according to these exact rules. Do not include any other text or explanations.

      ### FORMATTING RULES ###
      - Each day is enclosed in ###DAY_NAME###. For a 1-day plan, this will be ###TODAY###.
      - Each meal slot (breakfast, lunch, dinner) is enclosed in @@MEAL_SLOT@@.
      - Each piece of information is a key-value pair separated by '::'.
      - Items in a list (ingredients, instructions) are separated by '~~'.
      - Do not include any extra newlines except between key-value pairs.

      ### EXAMPLE OUTPUT ###
      ###TODAY###
      @@BREAKFAST@@
      recipeName::Scrambled Eggs & Toast
      cookTime::10 min
      calories::350 kcal
      imageUrl::https://images.unsplash.com/photo-1525351484163-7529414344d8
      ingredients::2 Eggs~~2 slices of Bread~~Butter~~Salt~~Pepper
      instructions::Melt butter in a pan~~Scramble eggs to desired consistency~~Toast bread~~Serve eggs on toast.
      @@LUNCH@@
      recipeName::...
      ... and so on for LUNCH and DINNER.

      ### USER DATA ###
      User Preferences: ${JSON.stringify(profile.preferences)}
      Ingredients User Already Has: ${JSON.stringify(profile.inventory)}

      Now, generate the 1-day meal plan based on the user data, prioritizing their existing ingredients.
    `;
    
    // 3. Call the Gemini API
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiResponseText = response.text();
    console.log(aiResponseText)
    // 4. Run the Custom Parser
    const parsedPlan = parseAIResponse(aiResponseText);
    
    // 5. Save the parsed JSON to the database
    const { data: newPlan, error: insertError } = await supabaseClient
      .from('meal_plans')
      .insert({
        user_id: user.id,
        plan_data: parsedPlan, // Save our structured JSON
        plan_type: 'daily', // Hardcode as daily for now
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify(newPlan), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in generate-meal-plan-gemini:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

// --- THE CUSTOM PARSER ---
function parseAIResponse(text: string) {
  const plan: any = { weekly_plan: {}, shopping_list: [] }; // We'll just populate one day
  const cleaned = text.replace("\n","")
  const daySections = cleaned.split(/###\w+###/).filter(Boolean);
  const todayData = daySections[0];
  if (!todayData) throw new Error("AI response did not contain a valid day section.");

  const mealSlots = todayData.split(/@@\w+@@/).filter(Boolean);
  
  const dayPlan: any = {};
  const mealNames = ['breakfast', 'lunch', 'dinner'];

  mealSlots.forEach((slotText, index) => {
    const mealName = mealNames[index];
    if (!mealName) return;

    const recipe: any = {};
    const lines = slotText.trim().split('\n').filter(Boolean);
    
    lines.forEach(line => {
      const parts = line.split('::');
      if (parts.length !== 2) return;
      
      const key = parts[0].trim();
      const value = parts[1].trim();
      
      if (key === 'ingredients' || key === 'instructions') {
        recipe[key] = value.split('~~').map(item => item.trim());
      } else {
        recipe[key] = value;
      }
    });
    dayPlan[mealName] = recipe;
  });

  // For this simple 1-day plan, we map "TODAY" to the current day of the week.
  const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
  plan.weekly_plan[today] = dayPlan;
  
  // Note: The shopping list logic would need to be built out here as well
  // by comparing the generated ingredients with the user's pantry. For now, we leave it empty.

  return plan;
}