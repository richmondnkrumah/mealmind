// supabase/functions/process-inventory-image/index.ts

import { createClient } from "npm:@supabase/supabase-js@2";
// --- Configuration for Clarifai ---
const CLARIFAI_MODEL_ID = "food-item-recognition";
const CLARIFAI_MODEL_VERSION_ID = "1d5fd481e0cf4826aa72ec3ff049e044";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();

    if (payload.type !== "INSERT" || payload.table !== "objects") {
      console.log("Ignoring webhook event that is not a new object creation.");
      return new Response("ok"); 
    }

    const filePath = payload.record.name;

    console.log(`Processing file: ${filePath}`)

    if (!filePath || !filePath.startsWith("inventories/")) {
      throw new Error(`Invalid or missing file path from webhook: ${filePath}`);
    }

    const userId = filePath.split("/")[1];
    if (!userId) {
      throw new Error(`Could not extract user ID from path: ${filePath}`);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!,
      Deno.env.get("EXPO_PUBLIC_SERVICE_ROLE_KEY")!
    );

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from("inventories")
        .createSignedUrl(filePath, 60);

    if (signedUrlError) throw signedUrlError;
    const imageUrl = signedUrlData.signedUrl;

    const clarifaiApiKey = Deno.env.get("CLARIFAI_API_KEY");
    if (!clarifaiApiKey) throw new Error("CLARIFAI_API_KEY is not set.");

    const apiResponse = await fetch(
      `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/versions/${CLARIFAI_MODEL_VERSION_ID}/outputs`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Key ${clarifaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_app_id: {
            user_id: 'clarifai',
            app_id: 'main',
          },
          inputs: [{ data: { image: { url: imageUrl } } }],
        }),
      }
    );

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(
        `Clarifai API failed with status ${apiResponse.status}: ${errorBody}`
      );
    }

    const clarifaiData = await apiResponse.json();
    const concepts = clarifaiData.outputs[0].data.concepts;

    const ingredients = concepts
      .map((concept: any) => concept.name.toLowerCase())
    
    
    console.log(ingredients,"this is ingredients")
    const { error: dbError } = await supabaseAdmin
      .from("profiles")
      .update({ inventory: ingredients})
      .eq("id", userId);

    console.log(dbError,"this is db error")
    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ success: true, ingredients: ingredients }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in process-inventory-image function:", error);
    return new Response(JSON.stringify({ error: error }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
