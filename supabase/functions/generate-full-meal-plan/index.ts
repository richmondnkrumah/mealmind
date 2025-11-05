// supabase/functions/generate-full-meal-plan/index.ts

import { createClient } from "npm:@supabase/supabase-js@2";
import { GoogleGenAI } from "npm:@google/genai";
import { decode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

Deno.serve(async (req) => {
  try {
    // 1. Authenticate user and get profile
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("preferences, inventory")
      .eq("id", user.id)
      .single();
    if (!profile) throw new Error("Profile not found.");

    // --- STAGE 1: TEXT GENERATION ---
    console.log("Stage 1: Generating text plan...");
    const genAI = new GoogleGenAI(Deno.env.get("GEMINI_API_KEY")!);
    const textPrompt = getTextGenerationPrompt(profile);

    const textResult = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: textPrompt,
    });
    const aiResponseText = textResult.text;
    console.log("this is from AI",aiResponseText)
    const planData = parseAIResponse(aiResponseText);
    console.log("Stage 1: Text plan generated and parsed successfully.");

    // --- STAGE 2: PARALLEL IMAGE GENERATION ---
    console.log("Stage 2: Starting parallel image generation...");
    const imagePromises: Promise<{
      day: string;
      meal: string;
      imageUrl: string;
    }>[] = [];

    for (const day in planData.weekly_plan) {
      for (const meal in planData.weekly_plan[day]) {
        const recipe = planData.weekly_plan[day][meal];
        // --- FIX: Check for 'imagePrompt' which is what our prompt asks for ---
        if (recipe && recipe.imagePrompt) {
          imagePromises.push(
            generateAndUploadImage(
              genAI,
              user.id,
              day,
              meal,
              recipe.imagePrompt, // Pass the dedicated image prompt
              supabaseClient
            )
          );
        }
      }
    }

    const imageResults = await Promise.allSettled(imagePromises);
    console.log("Stage 2: All image generation tasks settled.");

    // --- STAGE 3: PROCESS IMAGE RESULTS & UPDATE PLAN ---
    console.log("Stage 3: Processing image results...");
    imageResults.forEach((result) => {
      if (result.status === "fulfilled") {
        const { day, meal, imageUrl } = result.value;
        planData.weekly_plan[day][meal].imageUrl = imageUrl;
      } else {
        console.error(`Image generation failed for a meal:`, result.reason);
      }
    });

    // --- STAGE 4: SAVE FINAL PLAN TO DB ---
    console.log("Stage 4: Saving final plan to database...");
    const { data: newPlan, error: insertError } = await supabaseClient
      .from("meal_plans")
      .insert({
        user_id: user.id,
        plan_data: planData,
        plan_type: "weekly",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log("Process complete. Returning final plan.");
    return new Response(JSON.stringify(newPlan), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Critical error in generate-full-meal-plan:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});

// --- HELPER FUNCTIONS ---

async function generateAndUploadImage(
  aiClient: GoogleGenAI,
  userId: string,
  day: string,
  meal: string,
  imagePrompt: string, 
  supabase: any
): Promise<{ day: string; meal: string; imageUrl: string }> {
  try {
    const fullPrompt = `professional food photography of ${imagePrompt}, vibrant, appetizing, high detail, studio lighting, photorealistic, on a clean white background`;
    const response = await aiClient.models.generateImages({
      model: "imagen-3.0-generate-002", // Using the correct, available Imagen model name
      prompt: fullPrompt,
      config: { numberOfImages: 1 },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("Imagen API returned no images.");
    }
    const imgBytesBase64 = response.generatedImages[0].image.imageBytes;
    const imageBuffer = decode(imgBytesBase64);

    const filePath = `meal_images/${userId}/${Date.now()}_${day}_${meal}.png`;
    const { error: uploadError } = await supabase.storage
      .from("meal_images")
      .upload(filePath, imageBuffer, { contentType: "image/png" });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("meal_images").getPublicUrl(filePath);
    return { day, meal, imageUrl: publicUrl };
  } catch (error) {
    // --- FIX: Use the correct variable name 'imagePrompt' in the error log ---
    console.error(`Error generating image for prompt "${imagePrompt}":`, error);
    const placeholderUrl = Deno.env.get("PLACEHOLDER_IMAGE_URL")!;
    return { day, meal, imageUrl: placeholderUrl };
  }
}

function getTextGenerationPrompt(profile: any) {
  // --- FIX: Ask for 'imagePrompt', not 'imageUrl' ---
  const prompt = `
      You are a world-class meal planning assistant. Your task is to create a full 7-day meal plan (breakfast, lunch, dinner for Monday to Sunday).
      You MUST respond ONLY with a string formatted according to these exact rules. Do not include any other text or explanations.

      ### FORMATTING RULES ###
      - Each day is enclosed in ###DAY_NAME### (e.g., ###MONDAY###, ###TUESDAY###, etc.).
      - Each meal slot (breakfast, lunch, dinner) is enclosed in @@MEAL_SLOT@@.
      - Each piece of information is a key-value pair separated by '::'.
      - Items in a list (ingredients, instructions) are separated by '~~'.

      ### KEY-VALUE PAIRS TO GENERATE ###
      - recipeName:: [Name of the recipe]
      - cookTime:: [e.g., 30 min]
      - calories:: [e.g., 450 kcal]
      - imagePrompt:: [A short, vivid phrase for an image AI]
      - ingredients:: [List separated by ~~]
      - instructions:: [List separated by ~~]

      ### USER DATA ###
      User Preferences: ${JSON.stringify(profile.preferences)}
      Ingredients User Already Has: ${JSON.stringify(profile.inventory)}

      Now, generate the full 7-day meal plan based on the user data.
    `;
  return prompt;
}

// Your parser function needs to be updated to look for `imagePrompt`
function parseAIResponse(text: string) {
  const plan: any = { weekly_plan: {}, shopping_list: [] };
  // A more robust regex to find day blocks, handling potential whitespace
  const dayRegex = /###\s*(\w+)\s*###([\s\S]*?)(?=###|$)/g;
  let dayMatch;

  while ((dayMatch = dayRegex.exec(text)) !== null) {
    const dayName = dayMatch[1].toLowerCase();
    const dayContent = dayMatch[2];
    
    const dayPlan: any = {};
    // A more robust regex to find meal blocks
    const mealRegex = /@@\s*(\w+)\s*@@([\s\S]*?)(?=@@|###|$)/g;
    let mealMatch;

    while ((mealMatch = mealRegex.exec(dayContent)) !== null) {
      const mealName = mealMatch[1].toLowerCase();
      const mealContent = mealMatch[2].trim();
      const recipe: any = {};
      const parts = mealContent.split('::');

      // 2. Iterate through the parts to reconstruct key-value pairs.
      for (let i = 0; i < parts.length - 1; i++) {
        const valueAndNextKey = parts[i + 1];
        
        // Find the last word of the current part, which is the key.
        const keyMatch = parts[i].match(/(\w+)$/);
        if (!keyMatch) continue;
        const key = keyMatch[0];

        // The value is everything in the next part until the start of the next key.
        const nextKeyMatch = valueAndNextKey.match(/\s(\w+)$/);
        const value = nextKeyMatch ? valueAndNextKey.substring(0, nextKeyMatch.index).trim() : valueAndNextKey.trim();

        // 3. Assign the cleaned key and value to the recipe object.
        if (key && value) {
          if (key === "ingredients" || key === "instructions") {
            recipe[key] = value.split("~~").map(item => item.trim()).filter(Boolean);
          } else {
            recipe[key] = value;
          }
        }
      }
      dayPlan[mealName] = recipe;
    }
    plan.weekly_plan[dayName] = dayPlan;
  }

  // Shopping list logic can be added here later
  return plan;
}